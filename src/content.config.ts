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
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/assets/projects" }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            image: image(),
            github: z.string().nullable(),
            website: z.string().nullable(),
            video: z.string().nullable(),
            order: z.number().default(0), // Optional: for custom sorting
        }),
});

// 4. export collections
export const collections = { feedbacks, projects };
