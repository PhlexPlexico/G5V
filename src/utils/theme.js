import Vue from "vue";
import vuetify from "@/plugins/vuetify";

export const THEMES = ["system", "light", "dark"];
const STORAGE_KEY = "theme";

const media =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

/** Reactive theme preference shared by the footer toggle and the profile page. */
export const themeState = Vue.observable({ preference: readStored() });

function readStored() {
  const stored = localStorage.getItem(STORAGE_KEY);
  // Older versions stored the dark flag as "true"/"false".
  if (stored === "true") return "dark";
  if (stored === "false") return "light";
  return THEMES.includes(stored) ? stored : "system";
}

function apply() {
  const pref = themeState.preference;
  vuetify.framework.theme.dark =
    pref === "dark" || (pref === "system" && Boolean(media && media.matches));
}

/** Sets the preference locally (without saving it to the profile). */
export function setThemePreference(pref) {
  if (!THEMES.includes(pref)) pref = "system";
  themeState.preference = pref;
  localStorage.setItem(STORAGE_KEY, pref);
  apply();
}

if (media) {
  const onChange = () => themeState.preference === "system" && apply();
  if (media.addEventListener) media.addEventListener("change", onChange);
  else if (media.addListener) media.addListener(onChange);
}

apply();
