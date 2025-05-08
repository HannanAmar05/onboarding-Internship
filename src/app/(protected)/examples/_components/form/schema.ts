import { z } from "zod";

export const FAQSchema = z.object({
  category: z
    .string({ message: "Categoy is required" })
    .min(1, { message: "Category is required" }),
  question: z
    .string({ message: "Question is required" })
    .min(1, { message: "Question is required" }),
  answer: z.string({ message: "Answer is required" }).min(1, { message: "Answer is required" }),
  status: z.boolean().optional().default(true),
});

export type TFAQFormData = z.infer<typeof FAQSchema>;
