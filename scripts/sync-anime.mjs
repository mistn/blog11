import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ANILIST_API_URL = "https://graphql.anilist.co";
const OUTPUT_PATH = resolve("src/data/anime.generated.json");
const DEFAULT_ANILIST_USER_NAME = "uoooouuur";
const COMPLETED_STATUS = "COMPLETED";
const REQUIRED_CUSTOM_LIST = "normal";
const SEASON_ORDER = {
  WINTER: 0,
  SPRING: 1,
  SUMMER: 2,
  FALL: 3,
};

const query = `
  query AnimeCollection(
    $userName: String
    $userId: Int
    $sort: [MediaListSort]
  ) {
    MediaListCollection(
      userName: $userName
      userId: $userId
      type: ANIME
      status: COMPLETED
      sort: $sort
      forceSingleCompletedList: true
    ) {
      user {
        id
        name
        siteUrl
      }
      lists {
        status
        entries {
          id
          status
          customLists(asArray: true)
          progress
          score(format: POINT_10)
          updatedAt
          startedAt {
            year
          }
          completedAt {
            year
          }
          media {
            id
            siteUrl
            episodes
            format
            season
            seasonYear
            title {
              romaji
              english
              native
              userPreferred
            }
            coverImage {
              extraLarge
              large
              color
            }
            bannerImage
            studios(isMain: true) {
              nodes {
                name
              }
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

function toEntryKey(entry) {
  return Number(entry?.media?.id ?? 0) || entry?.media?.siteUrl || entry?.id;
}

function getGroupYear(entry) {
  return (
    entry.media?.seasonYear ??
    entry.completedAt?.year ??
    entry.startedAt?.year ??
    null
  );
}

function compareEntries(a, b) {
  const yearA = getGroupYear(a) ?? -1;
  const yearB = getGroupYear(b) ?? -1;
  if (yearA !== yearB) return yearB - yearA;

  const seasonA = SEASON_ORDER[a.media?.season ?? ""] ?? -1;
  const seasonB = SEASON_ORDER[b.media?.season ?? ""] ?? -1;
  if (seasonA !== seasonB) return seasonB - seasonA;

  const updatedA = Number(a.updatedAt ?? 0);
  const updatedB = Number(b.updatedAt ?? 0);
  if (updatedA !== updatedB) return updatedB - updatedA;

  return Number(b.media?.id ?? 0) - Number(a.media?.id ?? 0);
}

function toIsoString(timestampSeconds) {
  if (!timestampSeconds) return null;
  return new Date(timestampSeconds * 1000).toISOString();
}

function formatYearLabel(year) {
  return year ? String(year) : "未标年份";
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
        sort: ["UPDATED_TIME_DESC", "MEDIA_ID_DESC"],
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

  const entries = (collection?.lists ?? [])
    .flatMap(list => list.entries ?? [])
    .filter(entry => isNormalCompletedEntry(entry))
    .filter(entry => entry?.media?.id && entry?.media?.coverImage?.large)
    .sort(compareEntries);

  const dedupedEntries = [];
  const seen = new Set();
  for (const entry of entries) {
    const key = toEntryKey(entry);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    dedupedEntries.push(entry);
  }

  const groupsMap = new Map();
  for (const entry of dedupedEntries) {
    const year = getGroupYear(entry);
    const key = formatYearLabel(year);

    if (!groupsMap.has(key)) {
      groupsMap.set(key, {
        year,
        yearLabel: key,
        entries: [],
      });
    }

    groupsMap.get(key).entries.push({
      id: entry.media.id,
      listId: entry.id,
      title:
        entry.media.title?.userPreferred ??
        entry.media.title?.native ??
        entry.media.title?.romaji ??
        "Untitled",
      titleNative: entry.media.title?.native ?? null,
      titleEnglish: entry.media.title?.english ?? null,
      coverImage:
        entry.media.coverImage?.extraLarge ?? entry.media.coverImage?.large ?? null,
      coverColor: entry.media.coverImage?.color ?? null,
      bannerImage: entry.media.bannerImage ?? null,
      siteUrl: entry.media.siteUrl ?? `https://anilist.co/anime/${entry.media.id}`,
      status: entry.status ?? null,
      progress: entry.progress ?? 0,
      episodes: entry.media.episodes ?? null,
      score: entry.score ?? null,
      year,
      season: entry.media.season ?? null,
      format: entry.media.format ?? null,
      studios:
        entry.media.studios?.nodes?.map(node => node.name).filter(Boolean) ?? [],
      updatedAt: toIsoString(entry.updatedAt),
    });
  }

  const groups = Array.from(groupsMap.values()).sort((a, b) => {
    const yearA = a.year ?? -1;
    const yearB = b.year ?? -1;
    return yearB - yearA;
  });

  const output = {
    generatedAt: new Date().toISOString(),
    source: {
      name: "AniList",
      url: "https://anilist.co",
      userName: collection?.user?.name ?? DEFAULT_ANILIST_USER_NAME,
      userId:
        collection?.user?.id ??
        (process.env.ANILIST_USER_ID
          ? Number(process.env.ANILIST_USER_ID)
          : null),
      userUrl: collection?.user?.siteUrl ?? null,
      statuses: [COMPLETED_STATUS],
      customListName: REQUIRED_CUSTOM_LIST,
    },
    total: dedupedEntries.length,
    groups,
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log(
    `Synced ${output.total} unique completed anime entries from custom list "${REQUIRED_CUSTOM_LIST}" to ${OUTPUT_PATH}`
  );
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
