// Buffer Line
const GOOGLE_API_KEY = "AIzaSyDkl6HfJvmSSKDGWH0L0Y183PbBuY9fjdo";
const query = {
  key: GOOGLE_API_KEY,
  language: ["en", "zh-CN", "zh-TW", "ja"],
  types: [
    "establishment",
    "tourist_attraction",
    "landmark",
    "natural_feature",
    "point_of_interest",
  ],
};

export default query;
