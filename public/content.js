
// Content script that runs on YouTube pages
(function() {
  console.log("YouTube Word Explorer content script loaded");
  
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
        
        // If we couldn't get the time from the HTML5 player, try to get it from YouTube's API
        if ((!currentTime || currentTime === 0) && window.location.hostname.includes('youtube.com')) {
          // Try to access YouTube's player API if available
          if (document.querySelector('.html5-video-player')) {
            const youtubePlayer = document.querySelector('.html5-video-player');
            // YouTube stores the current time as a data attribute on the player element
            if (youtubePlayer && youtubePlayer.getAttribute('data-current-time')) {
              currentTime = parseFloat(youtubePlayer.getAttribute('data-current-time'));
            }
          }
        }
        
        console.log("Current player time:", currentTime);
        sendResponse({ currentTime });
      } catch (error) {
        console.error("Error getting current time:", error);
        sendResponse({ currentTime: 0 });
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
