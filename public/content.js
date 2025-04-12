// Content script that runs on YouTube pages
(function() {
  console.log("YouTube Word Explorer content script loaded");
  
  // Keep track of availability of captions
  let captionsAvailable = false;
  
  // Function to check if we're on a YouTube video page
  function isYouTubeVideoPage() {
    return window.location.hostname.includes('youtube.com') && 
           (window.location.pathname.includes('/watch') || 
            window.location.pathname.includes('/embed/'));
  }
  
  // Function to observe YouTube caption button to detect caption availability
  function observeCaptionButton() {
    const observer = new MutationObserver((mutations) => {
      const captionButton = document.querySelector('.ytp-subtitles-button');
      if (captionButton) {
        // Check if aria-pressed="true" is set (captions are available)
        captionsAvailable = captionButton.getAttribute('aria-disabled') !== 'true';
        console.log("Caption availability detected:", captionsAvailable);
        observer.disconnect();
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    // Also check immediately
    const captionButton = document.querySelector('.ytp-subtitles-button');
    if (captionButton) {
      captionsAvailable = captionButton.getAttribute('aria-disabled') !== 'true';
      console.log("Caption availability detected immediately:", captionsAvailable);
    }
  }
  
  // Initialize on page load
  function initialize() {
    if (isYouTubeVideoPage()) {
      console.log("YouTube Word Explorer active on video page");
      observeCaptionButton();
      
      // Re-check caption availability when navigating between videos
      // YouTube is a SPA, so we need to observe URL changes
      const urlObserver = new MutationObserver(() => {
        if (window.location.href !== lastUrl && isYouTubeVideoPage()) {
          lastUrl = window.location.href;
          console.log("URL changed, re-checking caption availability");
          observeCaptionButton();
        }
      });
      
      let lastUrl = window.location.href;
      urlObserver.observe(document.body, { childList: true, subtree: true });
    } else {
      console.log("Not a YouTube video page");
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
      
      // Also check for caption availability
      sendResponse({ 
        videoId,
        captionsAvailable
      });
      return true; // Keep message channel open for async responses
    }
    
    if (request.action === "getCurrentTime") {
      try {
        // Get current time from YouTube player
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
          // Set the time on the video element
          videoElement.currentTime = timestamp;
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
    
    if (request.action === "getCaptions") {
      try {
        // Check if closed captions are available
        const captionButton = document.querySelector('.ytp-subtitles-button');
        const hasCaptions = captionButton ? captionButton.getAttribute('aria-disabled') !== 'true' : false;
        
        console.log("Caption availability:", hasCaptions);
        sendResponse({ hasCaptions });
      } catch (error) {
        console.error("Error checking captions:", error);
        sendResponse({ hasCaptions: false, error: error.message });
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
