import { VideoTranscript, SearchResult } from "@/types";

// Declare chrome for TypeScript if it doesn't exist in the environment
declare const chrome: any;

// Function to get the real video ID from the current tab
export const getCurrentVideoId = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Check if we're in a Chrome extension environment
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        // Query the active tab in the current window
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
          const currentTab = tabs[0];
          
          // Send message to content script to get video ID
          chrome.tabs.sendMessage(
            currentTab.id!,
            { action: "getVideoId" },
            (response: { videoId?: string }) => {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                // Fallback to demo video if there's an error
                resolve("dQw4w9WgXcQ");
              } else if (response && response.videoId) {
                resolve(response.videoId);
              } else {
                // Fallback to demo video if no ID found
                resolve("dQw4w9WgXcQ");
              }
            }
          );
        });
      } else {
        // Not in extension environment, use demo video
        resolve("dQw4w9WgXcQ");
      }
    } catch (error) {
      console.error("Error getting current video ID:", error);
      // Fallback to demo video
      resolve("dQw4w9WgXcQ");
    }
  });
};

// Function to get transcript for a YouTube video
export const getVideoTranscript = async (videoId: string): Promise<VideoTranscript[]> => {
  console.log("Getting transcript for video ID:", videoId);
  
  // For now, we'll use mock transcripts for all videos to demonstrate functionality
  // In a production extension, you would use YouTube's API to fetch actual transcripts
  
  // For demo video "dQw4w9WgXcQ" (Rick Astley)
  if (videoId === "dQw4w9WgXcQ") {
    console.log("Using Rick Astley transcript");
    return rickAstleyTranscript;
  }
  
  // For any other video, we'll use a more generic transcript that includes common words
  // This ensures the search functionality can be demonstrated regardless of the actual video
  console.log("Using generic transcript for video:", videoId);
  return genericVideoTranscript;
};

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

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// A more comprehensive generic transcript that includes common words for testing
const genericVideoTranscript: VideoTranscript[] = [
  { text: "Hello everyone and welcome to this video.", start: 0, duration: 3 },
  { text: "Today we're going to be talking about some interesting topics.", start: 3, duration: 4 },
  { text: "I'm really feeling excited about sharing this with you all.", start: 7, duration: 3 },
  { text: "Let's dive right into the content of this video.", start: 10, duration: 3 },
  { text: "First, we're going to explore the main concepts.", start: 13, duration: 3 },
  { text: "Then we'll look at some practical examples.", start: 16, duration: 3 },
  { text: "It's important to understand the basics before moving forward.", start: 19, duration: 4 },
  { text: "Many people find this topic challenging at first.", start: 23, duration: 3 },
  { text: "But don't worry, I'll explain everything step by step.", start: 26, duration: 4 },
  { text: "You'll be feeling confident about this by the end of the video.", start: 30, duration: 4 },
  { text: "Let me know in the comments if you have any questions.", start: 34, duration: 3 },
  { text: "And don't forget to like and subscribe if you find this helpful.", start: 37, duration: 4 },
  { text: "This helps the channel grow and allows me to make more content.", start: 41, duration: 4 },
  { text: "Now, let's continue with the next section of our discussion.", start: 45, duration: 4 },
  { text: "This part is particularly interesting and useful.", start: 49, duration: 3 },
  { text: "I'm feeling that this information will really help you in your projects.", start: 52, duration: 4 },
  { text: "Remember to take notes if something seems especially relevant to you.", start: 56, duration: 4 },
  { text: "We're almost at the end of this video now.", start: 60, duration: 3 },
  { text: "Thank you for watching all the way through.", start: 63, duration: 3 },
  { text: "I hope you're feeling more knowledgeable about this topic now.", start: 66, duration: 4 },
  { text: "See you in the next video!", start: 70, duration: 2 }
];

// For demo purposes - this would be replaced with actual YouTube API calls
const rickAstleyTranscript: VideoTranscript[] = [
  { text: "We're no strangers to love", start: 0, duration: 4 },
  { text: "You know the rules and so do I", start: 4, duration: 4 },
  { text: "A full commitment's what I'm thinking of", start: 8, duration: 4 },
  { text: "You wouldn't get this from any other guy", start: 12, duration: 4 },
  { text: "I just wanna tell you how I'm feeling", start: 16, duration: 4 },
  { text: "Gotta make you understand", start: 20, duration: 4 },
  { text: "Never gonna give you up, never gonna let you down", start: 24, duration: 5 },
  { text: "Never gonna run around and desert you", start: 29, duration: 4 },
  { text: "Never gonna make you cry, never gonna say goodbye", start: 33, duration: 5 },
  { text: "Never gonna tell a lie and hurt you", start: 38, duration: 4 },
  { text: "We've known each other for so long", start: 42, duration: 4 },
  { text: "Your heart's been aching but you're too shy to say it", start: 46, duration: 5 },
  { text: "Inside we both know what's been going on", start: 51, duration: 4 },
  { text: "We know the game and we're gonna play it", start: 55, duration: 4 },
  { text: "And if you ask me how I'm feeling", start: 59, duration: 4 },
  { text: "Don't tell me you're too blind to see", start: 63, duration: 4 },
  { text: "Never gonna give you up, never gonna let you down", start: 67, duration: 5 },
  { text: "Never gonna run around and desert you", start: 72, duration: 4 },
  { text: "Never gonna make you cry, never gonna say goodbye", start: 76, duration: 5 },
  { text: "Never gonna tell a lie and hurt you", start: 81, duration: 4 }
];
