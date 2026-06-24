/**
 * Centralized color mapping for product variants.
 * Maps human-readable color names and keywords to CSS-friendly hex codes.
 */

export const colorMap: Record<string, string> = {
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

export const colorOptions = Object.keys(colorMap).map(name => ({
  name,
  hex: colorMap[name]
}));

/**
 * Parses a composite color string (e.g. "Midnight Blue||#1e3a8a") into name and value.
 * Falls back to treating the input as both name and value if the delimiter is not found.
 */
export function parseColor(colorStr: string): { name: string; value: string } {
  if (!colorStr) return { name: "", value: "" };
  const parts = colorStr.split("||");
  if (parts.length > 1) {
    return { name: parts[0].trim(), value: parts[1].trim() };
  }
  return { name: colorStr.trim(), value: colorStr.trim() };
}

/**
 * Creates a composite color string from a separate name and value.
 */
export function createColorString(name: string, value: string): string {
  const cleanName = (name || "").trim();
  const cleanValue = (value || "").trim();
  if (!cleanName && !cleanValue) return "";
  if (!cleanValue) return cleanName;
  if (!cleanName) return cleanValue;
  return `${cleanName}||${cleanValue}`;
}

/**
 * Normalizes a color name/composite string and returns a corresponding CSS-friendly color code.
 * Uses a heuristic approach:
 * 1. Checks if a custom hex/rgb value is provided in the composite format.
 * 2. Checks for an exact keyword match in our color mapping.
 * 3. Checks if any keyword is contained in the color name.
 * 4. Normalizes valid hex codes without a '#' prefix.
 * 5. Returns a default light gray code if no matches are found.
 */
export function getColorFromName(name: string): string {
  if (!name) return "#f3f3f3"; // Default if no name provided

  // Parse composite color string
  const parsed = parseColor(name);
  const normalized = parsed.value.toLowerCase().trim();

  // Try exact match first
  if (colorMap[normalized]) return colorMap[normalized];

  // Try substring match for common keywords
  const keywords = Object.keys(colorMap).sort((a, b) => b.length - a.length); // Try longer names first (e.g., "olive green" before "green")
  for (const keyword of keywords) {
    if (normalized.includes(keyword)) {
      return colorMap[keyword];
    }
  }

  // Check if it is a valid hex code without a hash prefix (e.g. "ff00ff" or "f00")
  if (/^[0-9a-fA-F]{3}$/.test(normalized) || /^[0-9a-fA-F]{6}$/.test(normalized)) {
    return `#${normalized}`;
  }

  // If no match found, fallback to the parsed value itself (could be hex or standard CSS color name)
  return parsed.value;
}
