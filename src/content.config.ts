// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";

// 2. Import loader(s)
import { glob } from "astro/loaders";

// 3. Create collections
const feedbacks = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/assets/feedbacks" }),
    schema: z.object({
        fromName: z.string(),
        stars: z.number(),
        fullFeedbackLink: z.string().nullable(),

        // type: z.enum(["Space Probe", "Mars Rover", "Comet Lander"]),
        // launch_date: z.date(),
        // status: z.enum(["Active", "Inactive", "Decommissioned"]),
        // destination: z.string(),
        // operator: z.string(),
        // notable_discoveries: z.array(z.string()),
    }),
});

// 4. export collections
export const collections = { feedbacks };
