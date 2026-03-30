const rootConfig = require("../env");
const unifiedConfig = rootConfig.unified || {};

module.exports = {
  PORT: Number(unifiedConfig.port || 3000),
  BASE_URL: unifiedConfig.baseUrl || "http://localhost:3000",

  LIMITS: {
    IMAGE: 10 * 1024 * 1024,
    VIDEO: 50 * 1024 * 1024,
    AUDIO: 10 * 1024 * 1024,
    FILE: 25 * 1024 * 1024
  },

  ALLOWED_IMAGES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  ALLOWED_VIDEOS: ["video/mp4", "video/webm", "video/quicktime"],
  ALLOWED_AUDIOS: [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
    "audio/aac",
    "audio/m4a",
    "audio/mp4"
  ],
  ALLOWED_FILES: ["*"]
};
