import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ANILIST_API_URL = "https://graphql.anilist.co";
const OUTPUT_PATH = resolve("src/data/anime.generated.json");
const DEFAULT_ANILIST_USER_NAME = "miuol";
const COMPLETED_STATUS = "COMPLETED";
const REQUIRED_CUSTOM_LIST = "normal";

const query = `
  query AnimeCollection($userName: String, $userId: Int) {
    MediaListCollection(
      userName: $userName
      userId: $userId
      type: ANIME
      status: COMPLETED
      sort: UPDATED_TIME_DESC
      forceSingleCompletedList: true
    ) {
      user {
        name
      }
      lists {
        entries {
          status
          customLists(asArray: true)
          startedAt {
            year
          }
          completedAt {
            year
          }
          media {
            siteUrl
            seasonYear
            startDate {
              year
            }
            title {
              native
              userPreferred
              romaji
            }
            coverImage {
              extraLarge
              large
            }
          }
        }
      }
    }
  }
`;

function readCachedOutput() {
  if (!existsSync(OUTPUT_PATH)) return null;

  try {
    return JSON.parse(readFileSync(OUTPUT_PATH, "utf8"));
  } catch {
    return null;
  }
}

function parseCustomLists(rawCustomLists) {
  if (!Array.isArray(rawCustomLists)) return [];

  return rawCustomLists
    .map(list => {
      if (typeof list === "string") return list;

      if (list && typeof list === "object" && "name" in list) {
        const enabled = "enabled" in list ? Boolean(list.enabled) : true;
        return enabled ? String(list.name) : "";
      }

      return "";
    })
    .map(name => name.trim().toLowerCase())
    .filter(Boolean);
}

function isNormalCompletedEntry(entry) {
  if (entry?.status !== COMPLETED_STATUS) return false;

  const customLists = parseCustomLists(entry?.customLists);
  return customLists.includes(REQUIRED_CUSTOM_LIST);
}

function normalizeEntry(entry) {
  const media = entry?.media;
  const title =
    media?.title?.native ?? media?.title?.userPreferred ?? media?.title?.romaji;
  const cover = media?.coverImage?.extraLarge ?? media?.coverImage?.large;
  const year =
    media?.seasonYear ??
    media?.startDate?.year ??
    entry?.completedAt?.year ??
    entry?.startedAt?.year ??
    null;
  const url = media?.siteUrl;

  if (!title || !cover || !url) return null;

  return {
    title,
    cover,
    year,
    url,
  };
}

function getEntryKey(item) {
  return item.url || [item.title.trim(), item.cover, item.year ?? ""].join("::");
}

async function fetchAnimeCollection() {
  const userName =
    process.env.ANILIST_USER_NAME?.trim() || DEFAULT_ANILIST_USER_NAME;
  const rawUserId = process.env.ANILIST_USER_ID?.trim() || null;
  const userId = rawUserId ? Number(rawUserId) : null;

  if (userId !== null && Number.isNaN(userId)) {
    throw new Error("ANILIST_USER_ID must be a valid integer.");
  }

  const response = await fetch(ANILIST_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        userName,
        userId,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`AniList request failed with ${response.status}.`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    const message = payload.errors.map(error => error.message).join("; ");
    throw new Error(`AniList returned an error: ${message}`);
  }

  return payload.data?.MediaListCollection;
}

async function main() {
  let collection;

  try {
    collection = await fetchAnimeCollection();
  } catch (error) {
    const cached = readCachedOutput();

    if (cached) {
      console.warn("AniList sync failed, keeping cached anime data.");
      console.warn(error instanceof Error ? error.message : error);
      return;
    }

    throw error;
  }

  const items = (collection?.lists ?? [])
    .flatMap(list => list.entries ?? [])
    .filter(entry => isNormalCompletedEntry(entry))
    .map(normalizeEntry)
    .filter(Boolean);

  const dedupedItems = [];
  const seen = new Set();

  for (const item of items) {
    const key = getEntryKey(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    dedupedItems.push(item);
  }

  dedupedItems.sort((a, b) => {
    const yearA = a.year ?? -1;
    const yearB = b.year ?? -1;
    if (yearA !== yearB) return yearB - yearA;
    return a.title.localeCompare(b.title, "ja");
  });

  const output = {
    username: collection?.user?.name ?? DEFAULT_ANILIST_USER_NAME,
    updatedAt: new Date().toISOString(),
    items: dedupedItems,
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log(
    `Synced ${output.items.length} unique completed anime entries to ${OUTPUT_PATH}`
  );
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
