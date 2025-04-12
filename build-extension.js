
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

// Copy icon files
console.log('Copying icon files to dist folder...');
['icon16.png', 'icon48.png', 'icon128.png'].forEach(iconFile => {
  fs.copyFileSync(
    path.join(__dirname, 'public', iconFile),
    path.join(distDir, iconFile)
  );
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
