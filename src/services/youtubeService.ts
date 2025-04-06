import { VideoTranscript, SearchResult } from "@/types";

// Function to get the real video ID from the current tab
export const getCurrentVideoId = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Check if we're in a Chrome extension environment
      if (chrome && chrome.tabs) {
        // Query the active tab in the current window
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const currentTab = tabs[0];
          
          // Send message to content script to get video ID
          chrome.tabs.sendMessage(
            currentTab.id!,
            { action: "getVideoId" },
            (response) => {
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
  // In a real extension, this would fetch actual transcripts from YouTube API
  // For this demo, we'll still use mock data, but in a real implementation,
  // you would use YouTube's caption API or a third-party service
  
  // For demo purposes: use different mock transcripts for different videos
  if (videoId === "dQw4w9WgXcQ") {
    return mockTranscript;
  } else {
    // Generate a simple placeholder transcript for other videos
    return generatePlaceholderTranscript();
  }
};

export const searchInTranscript = (
  transcript: VideoTranscript[],
  searchTerm: string
): SearchResult[] => {
  if (!searchTerm || searchTerm.trim() === "") return [];
  
  const results: SearchResult[] = [];
  const term = searchTerm.toLowerCase();
  
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

// Generate a placeholder transcript for videos we don't have actual data for
const generatePlaceholderTranscript = (): VideoTranscript[] => {
  const transcript: VideoTranscript[] = [];
  // Create 20 placeholder transcript entries
  for (let i = 0; i < 20; i++) {
    transcript.push({
      text: `This is a placeholder transcript segment ${i+1}. In a real extension, this would contain actual video content.`,
      start: i * 30,
      duration: 30
    });
  }
  return transcript;
};

// For demo purposes - this would be replaced with actual YouTube API calls
const mockTranscript: VideoTranscript[] = [
  { text: "Hey everyone! Welcome to this tutorial on React Hooks.", start: 0, duration: 4 },
  { text: "Today we're going to learn about useState, useEffect, and other important hooks.", start: 4, duration: 5 },
  { text: "First, let's talk about what hooks are in React.", start: 9, duration: 3 },
  { text: "Hooks are functions that let you use state and other React features without writing a class.", start: 12, duration: 5 },
  { text: "The useState hook is the most basic one you'll use.", start: 17, duration: 4 },
  { text: "It allows you to add state to your functional components.", start: 21, duration: 4 },
  { text: "Let me show you an example of the useState hook.", start: 25, duration: 3 },
  { text: "First, you import useState from React.", start: 28, duration: 3 },
  { text: "Then you call it inside your component to declare a state variable.", start: 31, duration: 4 },
  { text: "useState returns a pair: the current state value and a function to update it.", start: 35, duration: 5 },
  { text: "The next important hook is useEffect.", start: 40, duration: 3 },
  { text: "useEffect lets you perform side effects in function components.", start: 43, duration: 4 },
  { text: "It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes.", start: 47, duration: 6 },
  { text: "By default, useEffect runs after every render, but you can optimize it to run only when certain values change.", start: 53, duration: 7 },
  { text: "Another useful hook is useContext, which lets you subscribe to React context without introducing nesting.", start: 60, duration: 6 },
  { text: "useReducer is another alternative to useState, which is helpful for complex state logic.", start: 66, duration: 5 },
  { text: "useCallback and useMemo are performance optimization hooks.", start: 71, duration: 4 },
  { text: "useRef lets you persist values between renders without causing re-renders.", start: 75, duration: 5 },
  { text: "You can also create your own custom hooks to reuse stateful logic between components.", start: 80, duration: 5 },
  { text: "That concludes our quick overview of React Hooks. Thanks for watching!", start: 85, duration: 5 }
];
