import { z } from "zod/mini";

export const blockFeedback = z.object({
    /** full URL of page where fired */
    url: z.string(),
    blockId: z.string(),
    message: z.string(),

    /** the referenced text of block */
    blockBody: z.string(),
});

export const pageFeedback = z.object({
    opinion: z.enum(["good", "bad"]),
    /** full URL of page where fired */
    url: z.string(),
    solved: z.boolean(),
    learned: z.boolean(),
    improved: z.boolean(),
    teamNumber: z.union([z.number(), z.null()]),
    message: z.string(),
});

export const pageActionResponse = z.object({
    success: z.boolean(),
    feedbackId: z.union([z.number(), z.string(), z.null()]),
    error: z.union([z.string(), z.null()]),
});

export const actionResponse = z.object({
    success: z.boolean(),
});

export type BlockFeedback = z.infer<typeof blockFeedback>;
export type PageFeedback = z.infer<typeof pageFeedback>;
export type PageActionResponse = z.infer<typeof pageActionResponse>;
export type ActionResponse = z.infer<typeof actionResponse>;
