
# YouTube Word Explorer Extension

This is a Chrome extension that allows you to search for words in YouTube videos and jump to the moments they appear.

## Building the Extension

To build the extension:

1. Download all the project files
2. Run `npm install` to install dependencies
3. Run `node build-extension.js` to build the extension

This will create a `dist` folder with all the necessary files for your Chrome extension.

## Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top-right corner
3. Click "Load unpacked" and select the `dist` folder

## Customizing the Extension

- Replace the placeholder icons in the `dist` folder with your own icons named `icon16.png`, `icon48.png`, and `icon128.png`
- Modify the `public/manifest.json` file to customize extension details
- Edit the source code and run the build process again to update your extension

## Usage

1. Open a YouTube video
2. Click on the extension icon in your browser toolbar
3. Enter a word or phrase in the search box
4. The extension will show all instances of that word or phrase in the video
5. Click on any result to jump to that timestamp in the video
