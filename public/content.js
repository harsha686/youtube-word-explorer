
// Content script that runs on YouTube pages
(function() {
  console.log("YouTube Word Explorer content script loaded");
  
  // Function to check if we're on a YouTube video page
  function isYouTubeVideoPage() {
    return window.location.hostname.includes('youtube.com') && 
           (window.location.pathname.includes('/watch') || 
            window.location.pathname.includes('/embed/'));
  }
  
  // Add a visible debug element to the page during development
  function addDebugInfo(message) {
    console.log("Debug:", message);
    
    // Only for development, comment this out for production
    // const debugElement = document.createElement('div');
    // debugElement.style.position = 'fixed';
    // debugElement.style.top = '10px';
    // debugElement.style.right = '10px';
    // debugElement.style.zIndex = '9999';
    // debugElement.style.background = 'rgba(0,0,0,0.7)';
    // debugElement.style.color = 'white';
    // debugElement.style.padding = '10px';
    // debugElement.style.borderRadius = '5px';
    // debugElement.textContent = message;
    // document.body.appendChild(debugElement);
  }
  
  // Initialize on page load
  function initialize() {
    if (isYouTubeVideoPage()) {
      addDebugInfo("YouTube Word Explorer active on video page");
    } else {
      addDebugInfo("Not a YouTube video page");
    }
  }
  
  // Run initialization after DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // Listen for messages from the extension popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in content script:", request);
    
    if (request.action === "getVideoId") {
      // Extract video ID from URL
      const videoId = extractVideoIdFromUrl(window.location.href);
      console.log("Extracted video ID:", videoId);
      sendResponse({ videoId });
      return true; // This is important to keep the message channel open for async responses
    }
    
    if (request.action === "getCurrentTime") {
      // Get current time from YouTube player if it exists
      try {
        // Try to get the player from multiple possible elements
        // First try the HTML5 video element
        let player = document.querySelector('video');
        let currentTime = player ? player.currentTime : 0;
        
        console.log("Current player time:", currentTime);
        sendResponse({ currentTime });
      } catch (error) {
        console.error("Error getting current time:", error);
        sendResponse({ currentTime: 0, error: error.message });
      }
      return true;
    }
    
    if (request.action === "seekToTime") {
      try {
        const timestamp = request.timestamp;
        console.log("Seeking to timestamp:", timestamp);
        
        // Get the video element
        const videoElement = document.querySelector('video');
        
        if (videoElement) {
          // Directly set the time on the HTML5 video element
          videoElement.currentTime = timestamp;
          
          // Also try to play the video
          videoElement.play().catch(e => console.error("Could not play video:", e));
          
          sendResponse({ success: true });
        } else {
          console.error("Video element not found");
          sendResponse({ success: false, error: "Video element not found" });
        }
      } catch (error) {
        console.error("Error seeking to time:", error);
        sendResponse({ success: false, error: error.message });
      }
      return true;
    }
  });

  // Function to extract YouTube video ID from URL
  function extractVideoIdFromUrl(url) {
    console.log("Extracting video ID from URL:", url);
    
    try {
      const urlObj = new URL(url);
      
      // Regular YouTube video URL format: youtube.com/watch?v=VIDEO_ID
      if (urlObj.searchParams.has('v')) {
        return urlObj.searchParams.get('v');
      }
      
      // YouTube short URL format: youtu.be/VIDEO_ID
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.substring(1);
      }
      
      // YouTube embedded player format: youtube.com/embed/VIDEO_ID
      if (urlObj.pathname.includes('/embed/')) {
        const parts = urlObj.pathname.split('/');
        return parts[parts.indexOf('embed') + 1];
      }
      
      console.log("Could not extract video ID from URL");
      return null;
    } catch (error) {
      console.error("Error extracting video ID:", error);
      return null;
    }
  }
})();
