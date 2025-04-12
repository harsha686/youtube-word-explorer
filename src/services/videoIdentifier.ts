
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
          if (!tabs || tabs.length === 0) {
            console.error("No active tabs found");
            // Fallback to demo video if no active tabs
            resolve("dQw4w9WgXcQ");
            return;
          }
          
          const currentTab = tabs[0];
          
          // Send message to content script to get video ID
          chrome.tabs.sendMessage(
            currentTab.id!,
            { action: "getVideoId" },
            (response: { videoId?: string; captionsAvailable?: boolean }) => {
              if (chrome.runtime.lastError) {
                console.error("Content script error:", chrome.runtime.lastError);
                // Fallback to demo video if there's an error
                resolve("dQw4w9WgXcQ");
              } else if (response && response.videoId) {
                console.log("Received videoId from content script:", response.videoId);
                console.log("Captions available:", response.captionsAvailable);
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

// Function to check if captions are available for the current video
export const checkCaptionsAvailability = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
          if (!tabs || tabs.length === 0) {
            resolve(false);
            return;
          }
          
          const currentTab = tabs[0];
          
          chrome.tabs.sendMessage(
            currentTab.id!,
            { action: "getCaptions" },
            (response: { hasCaptions?: boolean }) => {
              if (chrome.runtime.lastError || !response) {
                console.error("Error checking captions:", chrome.runtime.lastError);
                resolve(false);
              } else {
                resolve(!!response.hasCaptions);
              }
            }
          );
        });
      } else {
        // Not in extension environment
        resolve(false);
      }
    } catch (error) {
      console.error("Error checking captions availability:", error);
      resolve(false);
    }
  });
};
