export const THEME_STORAGE_KEY = "theme";

/** Runs in the document head before first paint, so a stored choice never flashes. */
export const themeScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.classList.add("theme-"+t)}catch(e){}`;
