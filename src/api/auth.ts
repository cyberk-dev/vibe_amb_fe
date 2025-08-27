import { AuthTokens, User } from "../stores/auth-store";

// Mock user database
const mockUsers = [
  {
    id: "1",
    email: "demo@example.com",
    name: "Demo User",
    password: "password123",
  },
  {
    id: "2",
    email: "admin@example.com",
    name: "Admin User",
    password: "admin123",
  },
];

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Mock login function
export const mockLogin = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = mockUsers.find(
    (u) => u.email === credentials.email && u.password === credentials.password,
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const tokens: AuthTokens = {
    accessToken: `access-token-${user.id}-${Date.now()}`,
    refreshToken: `refresh-token-${user.id}-${Date.now()}`,
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour from now
  };

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    tokens,
  };
};

// Mock register function
export const mockRegister = async (
  data: RegisterData,
): Promise<AuthResponse> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Check if user already exists
  const existingUser = mockUsers.find((u) => u.email === data.email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const newUser = {
    id: `${mockUsers.length + 1}`,
    email: data.email,
    name: data.name,
    password: data.password,
  };

  mockUsers.push(newUser);

  const tokens: AuthTokens = {
    accessToken: `access-token-${newUser.id}-${Date.now()}`,
    refreshToken: `refresh-token-${newUser.id}-${Date.now()}`,
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour from now
  };

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    },
    tokens,
  };
};

// Mock logout function
export const mockLogout = async (): Promise<void> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In a real app, this would invalidate the refresh token on the server
};
