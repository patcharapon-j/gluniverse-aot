/**
 * Self-hosted fonts for canvas text, the rich-text editor, and detached windows (ADR-0027: Playfair
 * Display, Special Elite, Noto Serif). Latin faces only: CONFIG.fontDefinitions loads every face
 * eagerly, and canvas text is English. The DOM gets latin and latin-ext through styles/fonts.css.
 * Generated with the foundry-google-fonts skill; URLs are route-relative.
 */
export const FONT_DEFINITIONS = {
    "Noto Serif": {
      "editor": true,
      "fonts": [
        {
          "urls": [
            "systems/wings-of-freedom/assets/fonts/noto-serif/noto-serif-italic-400-latin.woff2"
          ],
          "weight": "400",
          "style": "italic",
          "display": "swap",
          "stretch": "100%",
          "unicodeRange": "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"
        },
        {
          "urls": [
            "systems/wings-of-freedom/assets/fonts/noto-serif/noto-serif-normal-400-600-latin.woff2"
          ],
          "weight": "400 600",
          "style": "normal",
          "display": "swap",
          "stretch": "100%",
          "unicodeRange": "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"
        }
      ]
    },
    "Playfair Display": {
      "editor": true,
      "fonts": [
        {
          "urls": [
            "systems/wings-of-freedom/assets/fonts/playfair-display/playfair-display-normal-600-900-latin.woff2"
          ],
          "weight": "600 900",
          "style": "normal",
          "display": "swap",
          "unicodeRange": "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"
        }
      ]
    },
    "Special Elite": {
      "editor": true,
      "fonts": [
        {
          "urls": [
            "systems/wings-of-freedom/assets/fonts/special-elite/special-elite-normal-400-latin.woff2"
          ],
          "weight": "400",
          "style": "normal",
          "display": "swap",
          "unicodeRange": "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"
        }
      ]
    }
  };

export const FONT_FAMILIES = { display: "Playfair Display", label: "Special Elite", prose: "Noto Serif" } as const;

/** Call in the init hook. */
export function registerFonts(): void {
  Object.assign(CONFIG.fontDefinitions, FONT_DEFINITIONS);
  CONFIG.canvasTextStyle.fontFamily = FONT_FAMILIES.label;
  CONFIG.defaultFontFamily = FONT_FAMILIES.prose;
}
