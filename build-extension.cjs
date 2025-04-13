
// CommonJS module format
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the current directory
const __dirname = process.cwd();

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.log(`Creating distribution directory at: ${distDir}`);
  fs.mkdirSync(distDir, { recursive: true });
}

// Run the build command
console.log('Building the React application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed with the following error:');
  console.error(error.message);
  process.exit(1);
}

// Copy manifest.json to dist folder
const manifestSrc = path.join(__dirname, 'public', 'manifest.json');
const manifestDest = path.join(distDir, 'manifest.json');
console.log(`Copying manifest.json from ${manifestSrc} to ${manifestDest}`);
try {
  fs.copyFileSync(manifestSrc, manifestDest);
  console.log('Manifest copied successfully');
} catch (error) {
  console.error(`Failed to copy manifest.json: ${error.message}`);
  process.exit(1);
}

// Copy content.js to dist folder
const contentSrc = path.join(__dirname, 'public', 'content.js');
const contentDest = path.join(distDir, 'content.js');
console.log(`Copying content.js from ${contentSrc} to ${contentDest}`);
try {
  fs.copyFileSync(contentSrc, contentDest);
  console.log('Content script copied successfully');
} catch (error) {
  console.error(`Failed to copy content.js: ${error.message}`);
  process.exit(1);
}

// Copy icon files
console.log('Copying icon files to dist folder...');
['icon16.png', 'icon48.png', 'icon128.png'].forEach(iconFile => {
  const iconSrc = path.join(__dirname, 'public', iconFile);
  const iconDest = path.join(distDir, iconFile);
  try {
    fs.copyFileSync(iconSrc, iconDest);
    console.log(`Copied ${iconFile} successfully`);
  } catch (error) {
    console.error(`Failed to copy ${iconFile}: ${error.message}`);
    // Continue with other files even if one fails
  }
});

// Verify build output
const buildFiles = fs.readdirSync(distDir);
console.log('\nBuild files in dist folder:', buildFiles);

console.log('\nExtension build complete! Your extension is ready in the "dist" folder.');
console.log('\nTo load the extension in Chrome:');
console.log('1. Open Chrome and navigate to chrome://extensions/');
console.log('2. Enable "Developer mode" using the toggle in the top-right corner');
console.log('3. Click "Load unpacked" and select the "dist" folder');
console.log('4. If updating an existing extension, click the refresh icon for the extension');
