import type { HexColor } from "./colors";

export interface ImageMetadata {
    default: {
        src: string;
    };
}

export interface SkillsType {
    name: string;
    src: any;
    color: HexColor;
}
