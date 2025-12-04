import { z } from 'zod';

const loginValidationSchema = z.object({
 
    email: z.string({ error: "Email is required" }).email("Invalid email address"),
  password: z.string({ error: "Password is required" }).min(8, "Password must be at least 8 characters"),
 
});



const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      error: 'Refresh token is required!',
    }),
  }),
});



export const AuthValidation = {
  loginValidationSchema,
  refreshTokenValidationSchema,

};