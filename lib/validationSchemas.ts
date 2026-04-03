import { z } from "zod";

export const enrollmentFormSchema = z.object({
  idNumber: z.string().min(1, "National ID is required").regex(/^\d{1,8}$/, "Invalid ID format"),
  phone: z.string().min(1, "Phone number is required").regex(/^0\d{9}$/, "Phone must start with 0 and have 10 digits"),
});

export const profileFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  avatarType: z.enum(["bigfive", "custom"]),
  avatarUrl: z.string().optional(),
});

export const eventFilterSchema = z.object({
  category: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minPoints: z.number().optional(),
  maxPoints: z.number().optional(),
  searchTerm: z.string().optional(),
});

export type EnrollmentFormData = z.infer<typeof enrollmentFormSchema>;
export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type EventFilterData = z.infer<typeof eventFilterSchema>;
