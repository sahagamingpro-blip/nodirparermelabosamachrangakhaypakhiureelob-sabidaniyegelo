// Authentication hook using Express backend with MySQL
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser & { captchaSessionId: string; captchaCode: string }>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<SelectUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return response.json();
    },
    onSuccess: (userData) => {
      setUser(userData);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      setLocation('/order');
    },
      onError: (error: Error) => {
        let errorMessage = "Login failed";
        if (error.message.includes("Username not found")) {
          errorMessage = "Username not found. Please check your username or register a new account.";
        } else if (error.message.includes("Invalid password")) {
          errorMessage = "Invalid password. Please check your password and try again.";
        } else if (error.message.includes("401")) {
          errorMessage = "Invalid username or password. Please try again.";
        }
        
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser & { captchaSessionId: string; captchaCode: string }) => {
      // First verify captcha
      const captchaResponse = await fetch('/api/verify-captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          sessionId: credentials.captchaSessionId,
          code: credentials.captchaCode,
        }),
      });

      const captchaResult = await captchaResponse.json();
      if (!captchaResult.valid) {
        throw new Error('Invalid captcha code');
      }

      // Then register user
      const { captchaSessionId, captchaCode, ...userCredentials } = credentials;
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userCredentials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }

      return response.json();
    },
    onSuccess: (userData) => {
      setUser(userData);
      toast({
        title: "Registration successful",
        description: "Welcome to A2Z Game Developer!",
      });
      setLocation('/order');
    },
      onError: (error: Error) => {
        let errorMessage = "Registration failed";
        if (error.message.includes("Username already exists")) {
          errorMessage = "Username already exists. Please choose a different username.";
        } else if (error.message.includes("Email already exists")) {
          errorMessage = "Email already exists. Please use a different email address.";
        } else if (error.message.includes("Phone number already exists")) {
          errorMessage = "Phone number already exists. Please use a different phone number.";
        } else if (error.message.includes("Invalid captcha")) {
          errorMessage = "Invalid captcha code. Please try again.";
        }
        
        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });
      },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    },
    onSuccess: () => {
      setUser(null);
      toast({
        title: "Logged out",
        description: "See you next time!",
      });
      setLocation('/');
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}