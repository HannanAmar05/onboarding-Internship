import dayjs, { Dayjs } from "dayjs";
import { z } from "zod";

export const ContactSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }),
  phone_number: z.string().min(1, { message: "Phone number is requiredss" }),
});

export const FAQSchema = z.object({
  category: z
    .string({ message: "Category is required" })
    .min(1, { message: "Category is required" }),
  question: z
    .string({ message: "Post name is required" })
    .min(1, { message: "Post name is required" }),
  answer: z
    .string({ message: "Post description is required" })
    .min(1, { message: "Post description is required" }),
  status: z.boolean().optional().default(true),
  valid_date: z.instanceof(dayjs as unknown as typeof Dayjs, {
    message: "Valid Until is required",
  }),

  contacts: z.array(ContactSchema).default([]),
});

export type TFAQFormData = z.infer<typeof FAQSchema>;
