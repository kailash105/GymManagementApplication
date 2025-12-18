import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import { getToken, getUser, saveToken, saveUser, deleteToken, deleteUser } from '../utils/storage';
import client from '../api/client';

interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, []);

    const loadStorageData = async () => {
        try {
            const storedUser = await getUser();
            const token = await getToken();

            if (storedUser && token) {
                setUser(storedUser);
            }
        } catch (error) {
            console.error('Failed to load auth data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // Mock API call simulation
            // In production: const response = await client.post('/login', { email, password });

            // MOCK LOGIC for development since no backend exists
            await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay

            let mockRole = 'MEMBER';
            if (email.includes('owner')) mockRole = 'OWNER';
            if (email.includes('trainer')) mockRole = 'TRAINER';

            const mockResponse: AuthResponse = {
                token: 'mock-jwt-token-' + Date.now(),
                user: {
                    id: 'u-' + Date.now(),
                    name: email.split('@')[0],
                    email,
                    role: mockRole as any,
                    gym_id: 'gym-001'
                }
            };

            await saveToken(mockResponse.token);
            await saveUser(mockResponse.user);
            setUser(mockResponse.user);

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await deleteToken();
            await deleteUser();
            setUser(null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
