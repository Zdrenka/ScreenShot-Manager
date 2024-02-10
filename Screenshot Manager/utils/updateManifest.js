import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

//Forgive me for what I am about to do......DON'T LOOK AT ME!!!

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function updateManifest() {
    const distPath = path.join(__dirname, '../dist');
    const manifestPath = path.join(distPath, 'manifest.json');
    const assetsDir = path.join(distPath, 'assets');
    let manifest;
    try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (error) {
        console.error('Error reading manifest file:', error);
        return;
    }
    const backgroundScript = fs.readdirSync(assetsDir).find(file => file.startsWith('background'));
    if (backgroundScript) {
        manifest.background.service_worker = `assets/${backgroundScript}`;
    } else {
        console.error('Background script not found in assets directory.');
        return;
    }
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('Manifest updated with the correct background script path.');
}

updateManifest();

