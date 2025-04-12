
import { VideoTranscript, SearchResult } from "@/types";

export const searchInTranscript = (
  transcript: VideoTranscript[],
  searchTerm: string
): SearchResult[] => {
  if (!searchTerm || searchTerm.trim() === "") return [];
  
  const results: SearchResult[] = [];
  const term = searchTerm.toLowerCase();
  
  console.log(`Searching for "${term}" in transcript with ${transcript.length} entries`);
  
  transcript.forEach((item) => {
    const text = item.text.toLowerCase();
    if (text.includes(term)) {
      const index = text.indexOf(term);
      const beforeContext = text.substring(0, index);
      const afterContext = text.substring(index + term.length);
      
      results.push({
        text: item.text,
        timestamp: item.start,
        matchedText: item.text.substring(index, index + term.length),
        contextBefore: beforeContext,
        contextAfter: afterContext
      });
    }
  });
  
  console.log(`Found ${results.length} matches for "${term}"`);
  return results;
};
