
export interface VideoTranscript {
  text: string;
  start: number;
  duration: number;
}

export interface SearchResult {
  text: string;
  timestamp: number;
  matchedText: string;
  contextBefore: string;
  contextAfter: string;
}

export interface YouTubeVideoInfo {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: number;
}
