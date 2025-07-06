const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('cjs');

module.exports = {
    ...config,
    resolver: {
        ...config.resolver,
        extraNodeModules: {
            ...config.resolver.extraNodeModules,
            buffer: require.resolve('buffer/'),
        },
    },
};