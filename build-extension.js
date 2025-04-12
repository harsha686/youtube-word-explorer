
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Run the build command
console.log('Building the React application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Copy manifest.json to dist folder
console.log('Copying manifest.json to dist folder...');
fs.copyFileSync(
  path.join(__dirname, 'public', 'manifest.json'),
  path.join(distDir, 'manifest.json')
);

// Copy content.js to dist folder
console.log('Copying content.js to dist folder...');
fs.copyFileSync(
  path.join(__dirname, 'public', 'content.js'),
  path.join(distDir, 'content.js')
);

// Verify index.html exists in the dist folder
if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.log('index.html not found in dist folder, copying from root...');
  // If not found, copy from the root directory
  if (fs.existsSync(path.join(__dirname, 'index.html'))) {
    fs.copyFileSync(
      path.join(__dirname, 'index.html'),
      path.join(distDir, 'index.html')
    );
  } else {
    console.error('Error: index.html not found in project root!');
  }
}

// Create placeholder icons if they don't exist
const iconSizes = [16, 48, 128];
console.log('Creating placeholder icons...');
iconSizes.forEach(size => {
  const iconPath = path.join(distDir, `icon${size}.png`);
  if (!fs.existsSync(iconPath)) {
    // Create a simple placeholder icon file
    // In a real scenario, you'd want to replace these with proper icons
    console.log(`Creating placeholder for icon${size}.png`);
    
    // This just copies the favicon as a placeholder - replace with real icons
    try {
      fs.copyFileSync(
        path.join(__dirname, 'public', 'favicon.ico'),
        iconPath
      );
    } catch (error) {
      console.warn(`Warning: Could not create placeholder icon: ${error.message}`);
    }
  }
});

console.log('\nExtension build complete! Your extension is ready in the "dist" folder.');
console.log('\nTo load the extension in Chrome:');
console.log('1. Open Chrome and navigate to chrome://extensions/');
console.log('2. Enable "Developer mode" using the toggle in the top-right corner');
console.log('3. Click "Load unpacked" and select the "dist" folder');
console.log('\nNote: Make sure to replace the placeholder icons with real ones for your extension.');
