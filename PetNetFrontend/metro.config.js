const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Add `cjs` extension
config.resolver.assetExts.push("cjs");

// Add buffer polyfill
config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    buffer: require.resolve("buffer/"),
};

// Apply NativeWind wrapper and export
module.exports = withNativeWind(config, {
    input: "./app/globals.css", // Optional: only if you’re using custom styles
});