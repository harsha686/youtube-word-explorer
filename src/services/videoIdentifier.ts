
// Functions for identifying YouTube videos and retrieving their IDs

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
                console.error("Content script error:", chrome.runtime.lastError);
                // Fallback to demo video if there's an error
                resolve("dQw4w9WgXcQ");
              } else if (response && response.videoId) {
                resolve(response.videoId);
              } else {
                console.log("No video ID found, using demo video");
                // Fallback to demo video if no ID found
                resolve("dQw4w9WgXcQ");
              }
            }
          );
        });
      } else {
        // Not in extension environment, use demo video
        console.log("Not in extension environment, using demo video");
        resolve("dQw4w9WgXcQ");
      }
    } catch (error) {
      console.error("Error getting current video ID:", error);
      // Fallback to demo video
      resolve("dQw4w9WgXcQ");
    }
  });
};
