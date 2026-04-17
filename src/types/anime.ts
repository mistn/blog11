export interface AnimeItem {
  title: string;
  cover: string;
  year: number | null;
  url: string;
}

export interface AnimeDataPayload {
  username: string;
  updatedAt: string | null;
  items: AnimeItem[];
}
