(function() {
  console.log("YouTube Word Explorer content script loaded");
  
  const YOUTUBE_SELECTORS = {
    VIDEO_PLAYER: 'video.html5-main-video',
    CAPTION_BUTTON: '.ytp-subtitles-button',
    CAPTION_MENU: '.ytp-caption-menu-container'
  };

  let captionsAvailable = false;
  
  function isYouTubeVideoPage() {
    return window.location.hostname.includes('youtube.com') && 
           (window.location.pathname.includes('/watch') || 
            window.location.pathname.includes('/embed/'));
  }
  
  function checkCaptionAvailability() {
    const captionButton = document.querySelector(YOUTUBE_SELECTORS.CAPTION_BUTTON);
    const captionMenu = document.querySelector(YOUTUBE_SELECTORS.CAPTION_MENU);
    
    captionsAvailable = captionButton && 
                        captionButton.getAttribute('aria-disabled') !== 'true' &&
                        captionMenu !== null;
    
    console.log("Captions available:", captionsAvailable);
    return captionsAvailable;
  }
  
  function extractVideoIdFromUrl(url) {
    try {
      const urlObj = new URL(url);
      
      const videoIdExtractors = [
        () => urlObj.searchParams.get('v'),
        () => urlObj.pathname.split('/').pop(),
        () => urlObj.pathname.split('/embed/')[1]?.split('?')[0]
      ];
      
      for (const extractor of videoIdExtractors) {
        const videoId = extractor();
        if (videoId && videoId.length === 11) return videoId;
      }
    } catch (error) {
      console.error("Video ID extraction error:", error);
    }
    
    return null;
  }
  
  function initialize() {
    if (isYouTubeVideoPage()) {
      console.log("YouTube Word Explorer active on video page");
      checkCaptionAvailability();
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in content script:", request);
    
    if (request.action === "getVideoId") {
      const videoId = extractVideoIdFromUrl(window.location.href);
      sendResponse({ 
        videoId, 
        captionsAvailable: checkCaptionAvailability() 
      });
      return true;
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
