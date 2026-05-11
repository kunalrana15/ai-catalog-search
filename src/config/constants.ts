export const GEMINI_MODEL = "gemini-3-flash-preview";

export const SEARCH_DEFAULTS = {
  LIMIT: 10,
  MAX_LIMIT: 50,
} as const;

export const SUPPORTED_GENRES = [
  "action",
  "thriller",
  "drama",
  "comedy",
  "sci-fi",
  "horror",
  "romance",
  "documentary",
  "fantasy",
  "crime",
] as const;

export const SUPPORTED_LANGUAGES = [
  "Hindi",
  "English",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Bengali",
  "Kannada",
] as const;

export const SUPPORTED_TYPES = ["movie", "series"] as const;