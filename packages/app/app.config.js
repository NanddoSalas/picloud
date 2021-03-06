import 'dotenv/config';

export default {
  expo: {
    name: 'Picloud',
    slug: 'picloud',
    version: '0.1.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      GRAPHQL_URI: process.env.GRAPHQL_URI,
      expoClientId: process.env.EXPO_CLIENT_ID,
    },
    scheme: 'picloud',
  },
};
