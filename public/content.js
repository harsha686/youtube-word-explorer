
// Content script that runs on YouTube pages
(function() {
  // Listen for messages from the extension popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getVideoId") {
      // Extract video ID from URL
      const videoId = extractVideoIdFromUrl(window.location.href);
      sendResponse({ videoId });
      return true; // This is important to keep the message channel open for async responses
    }
  });

  // Function to extract YouTube video ID from URL
  function extractVideoIdFromUrl(url) {
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
    
    return null;
  }
})();
