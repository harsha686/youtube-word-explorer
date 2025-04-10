
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
        } else {
          console.error("Video element not found");
        }
        
        // Fallback for YouTube's API (in case direct manipulation doesn't work)
        if (window.location.hostname.includes('youtube.com')) {
          // YouTube's player might be accessible through the DOM
          const script = document.createElement('script');
          script.textContent = `
            try {
              // Try to access YouTube's player instance
              const player = document.querySelector('video');
              if (player) {
                player.currentTime = ${timestamp};
                player.play();
              }
            } catch (e) {
              console.error("Error in injected script:", e);
            }
          `;
          document.documentElement.appendChild(script);
          script.remove();
        }
        
        sendResponse({ success: true });
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
