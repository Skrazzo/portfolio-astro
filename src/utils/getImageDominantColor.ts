import { Vibrant } from "node-vibrant/node";
import type { HexColor } from "~types/colors";
import { shadeColor } from "~utils/shadeColor";

export async function getImageDominantColor(filePath: string): Promise<HexColor> {
    const pallete = await Vibrant.from(filePath).getPalette();
    if (!pallete.Vibrant) return "#000";

    return shadeColor(pallete.Vibrant.hex, -20);
}

import { readFileSync } from "fs";

export function getProminentColorFromSVG(filePath: string): string {
    const svgContent = readFileSync(filePath, "utf-8");

    // Extract all color values using regex
    const colorMatches =
        svgContent.match(/(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgb\([^)]+\)|fill="[^"]+"|stroke="[^"]+")/g) || [];

    // Count color occurrences
    const colorCounts = new Map<string, number>();

    colorMatches.forEach((match) => {
        const color = match.replace(/fill="|stroke="|"/g, "");
        if (color !== "none") {
            colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
        }
    });

    // Find most frequent color
    let maxCount = 0;
    let prominentColor = "#000000";

    colorCounts.forEach((count, color) => {
        if (count > maxCount) {
            maxCount = count;
            prominentColor = color;
        }
    });

    return shadeColor(prominentColor, -10);
}
