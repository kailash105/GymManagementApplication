export type UserRole = 'OWNER' | 'TRAINER' | 'MEMBER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  gym_id: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Gym {
  id: string;
  name: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  duration: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  price: number;
}

export interface WorkoutPlan {
  id: string;
  member_id: string;
  exercises: string[]; // Simplification for now
  created_at: string;
}

export interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  date: string;
  member_id: string;
}
