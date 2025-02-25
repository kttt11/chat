module.exports = function (api) {
    api.cache(true); // Esto es importante para optimizar el caché en Expo
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        ['module:react-native-dotenv', {
          moduleName: '@env',
          path: '.env',
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
        }]
      ],
    };
  };
  