/**
 * Centralized color mapping for product variants.
 * Maps human-readable color names and keywords to CSS-friendly hex codes.
 */

const colorMap: Record<string, string> = {
  // Common Colors
  black: "#111111",
  white: "#f9f9f9",
  red: "#dc2626",
  navy: "#1e3a5f",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  purple: "#a855f7",
  pink: "#ec4899",
  brown: "#92400e",
  gray: "#9ca3af",
  grey: "#9ca3af",

  // Fashion Colors
  beige: "#d4b896",
  camel: "#c19a6b",
  olive: "#6b7a2a",
  ivory: "#fffff0",
  cream: "#fffdd0",
  gold: "#d4af37",
  silver: "#c0c0c0",
  maroon: "#800000",
  teal: "#008080",
  burgundy: "#800020",
  charcoal: "#36454f",
  khaki: "#c3b091",
  lavender: "#e6e6fa",
  turquoise: "#40e0d0",
  coral: "#ff7f50",
  magenta: "#ff00ff",
  cyan: "#00ffff",
  emerald: "#50c878",
  indigo: "#4b0082",
  violet: "#8f00ff",
  peach: "#ffdab9",
  mint: "#f5fffa",
  rose: "#ff007f",
  tan: "#d2b48c",
  plum: "#8e4585",
  ruby: "#e0115f",
  amber: "#ffbf00",
  skin: "#f3cfb3",
  nude: "#e3bc9a",
  copper: "#b87333",
  bronze: "#cd7f32",
  rust: "#b7410e",
  mustard: "#e1ad01",
  salmon: "#fa8072",
  lilac: "#c8a2c8",
  mauve: "#e0b0ff",
  champagne: "#f7e7ce",
  oatmeal: "#dfd7ca",
  forest: "#228b22",
  lime: "#32cd32",
  sky: "#87ceeb",
  steel: "#4682b4",
  terracotta: "#e2725b",
  sand: "#c2b280",
  mocha: "#967969",
  periwinkle: "#ccccff",
  denim: "#1560bd",
  pewter: "#8e9294",
};

/**
 * Normalizes a color name and returns a corresponding hex code.
 * Uses a heuristic approach:
 * 1. Checks for an exact keyword match (e.g., "Ivory").
 * 2. Checks if any keyword is contained in the name (e.g., "Ivory White" contains "Ivory").
 * 3. Returns a slightly off-white default for unknown names instead of pure white.
 */
export function getColorFromName(name: string): string {
  if (!name) return "#f3f3f3"; // Default if no name provided

  const normalized = name.toLowerCase().trim();

  // Try exact match first
  if (colorMap[normalized]) return colorMap[normalized];

  // Try substring match for common keywords
  const keywords = Object.keys(colorMap).sort((a, b) => b.length - a.length); // Try longer names first (e.g., "olive green" before "green")
  for (const keyword of keywords) {
    if (normalized.includes(keyword)) {
      return colorMap[keyword];
    }
  }

  // If no match found, fallback to the name itself (maybe it's already a hex or a standard CSS color)
  return normalized;
}
