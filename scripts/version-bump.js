#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packagePath = path.join(__dirname, '..', 'package.json');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Parse version
const versionParts = packageJson.version.split('.');
const patchVersion = parseInt(versionParts[2], 10);

// Increment patch version
versionParts[2] = (patchVersion + 1).toString();
packageJson.version = versionParts.join('.');

// Write back to package.json
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`Version bumped to ${packageJson.version}`); 