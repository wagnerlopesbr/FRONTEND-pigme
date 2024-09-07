import 'dotenv/config';

export default {
  expo: {
    name: "frontend",
    slug: "frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      BACKEND_CRUD_URL: process.env.BACKEND_CRUD_URL,
      API_PRODUCTS_URL: process.env.API_PRODUCTS_URL,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
    }
  }
};
