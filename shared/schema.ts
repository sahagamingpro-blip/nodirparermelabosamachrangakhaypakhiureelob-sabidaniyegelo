import { z } from "zod";

// User type for MySQL with auto-increment ID
export interface User {
  id: number;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Phone number validation function
const normalizePhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 91 and has 12 digits total, it's already formatted
  if (digits.startsWith('91') && digits.length === 12) {
    return `+${digits}`;
  }
  
  // If it has 10 digits, add +91
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  
  // Return as is if it doesn't match expected patterns
  return phone;
};

export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must be less than 50 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(100, "Email must be less than 100 characters"),
  phone: z.string().transform(normalizePhoneNumber).refine((val) => {
    // Validate normalized phone number
    const phoneRegex = /^\+91\d{10}$/;
    return phoneRegex.test(val);
  }, {
    message: "Phone number must be a valid Indian mobile number (10 digits)"
  }),
  dateOfBirth: z.string().refine((val) => {
    // Validate DD-MM-YYYY format
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    return dateRegex.test(val);
  }, {
    message: "Date must be in DD-MM-YYYY format"
  }),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
