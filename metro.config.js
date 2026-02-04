const { getDefaultConfig } = require('expo/metro-config');

// Start from Expo's default Metro configuration and extend asset/source extensions.
const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('glb', 'gltf', 'png', 'jpg');
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'cjs', 'mjs');

module.exports = config;
