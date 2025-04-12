
// Functions for controlling YouTube video playback

// Declare chrome for TypeScript if it doesn't exist in the environment
declare const chrome: any;

// Function to get current time of the video
export const getCurrentVideoTime = async (): Promise<number> => {
  return new Promise((resolve) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
          const currentTab = tabs[0];
          
          chrome.tabs.sendMessage(
            currentTab.id!,
            { action: "getCurrentTime" },
            (response: { currentTime?: number }) => {
              if (chrome.runtime.lastError) {
                console.error("Content script error:", chrome.runtime.lastError);
                resolve(0);
              } else if (response && typeof response.currentTime === 'number') {
                resolve(response.currentTime);
              } else {
                resolve(0);
              }
            }
          );
        });
      } else {
        resolve(0);
      }
    } catch (error) {
      console.error("Error getting current video time:", error);
      resolve(0);
    }
  });
};

// Function to seek to a specific time in the YouTube video
export const seekToTime = async (timestamp: number): Promise<void> => {
  return new Promise((resolve) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
          const currentTab = tabs[0];
          
          chrome.tabs.sendMessage(
            currentTab.id!,
            { action: "seekToTime", timestamp },
            () => {
              if (chrome.runtime.lastError) {
                console.error("Content script error:", chrome.runtime.lastError);
              }
              resolve();
            }
          );
        });
      } else {
        resolve();
      }
    } catch (error) {
      console.error("Error seeking to time:", error);
      resolve();
    }
  });
};
