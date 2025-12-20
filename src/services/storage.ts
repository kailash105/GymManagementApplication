import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, WorkoutPlan, UserRole } from '../types';

const STORAGE_KEYS = {
    USERS: '@gym_app_users',
    WORKOUTS: '@gym_app_workouts',
};

// Initial Mock Data
const INITIAL_USERS: User[] = [
    { id: '1', name: 'John Owner', email: 'owner@gym.com', role: 'OWNER', gym_id: 'gym1' },
    { id: '2', name: 'Mike Trainer', email: 'trainer@gym.com', role: 'TRAINER', gym_id: 'gym1' },
    { id: '3', name: 'Alice Member', email: 'member@gym.com', role: 'MEMBER', gym_id: 'gym1' },
    { id: '4', name: 'Bob Member', email: 'bob@gym.com', role: 'MEMBER', gym_id: 'gym1' },
];

class MockDatabaseService {
    async init() {
        const users = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
        if (!users) {
            await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
        }
    }

    async getUsers(): Promise<User[]> {
        const json = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
        return json ? JSON.parse(json) : [];
    }

    async getUsersByRole(role: UserRole): Promise<User[]> {
        const users = await this.getUsers();
        return users.filter(u => u.role === role);
    }

    async addUser(user: User): Promise<void> {
        const users = await this.getUsers();
        users.push(user);
        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    async deleteUser(userId: string): Promise<void> {
        const users = await this.getUsers();
        const filtered = users.filter(u => u.id !== userId);
        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
    }

    async getWorkouts(memberId?: string): Promise<WorkoutPlan[]> {
        const json = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS);
        const workouts: WorkoutPlan[] = json ? JSON.parse(json) : [];
        if (memberId) {
            return workouts.filter(w => w.member_id === memberId);
        }
        return workouts;
    }

    async addWorkout(workout: WorkoutPlan): Promise<void> {
        const workouts = await this.getWorkouts();
        workouts.push(workout);
        await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
    }
}

export const MockDatabase = new MockDatabaseService();
