import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        try {
            await login(email, password);
        } catch (e) {
            Alert.alert('Login Failed', 'Invalid credentials');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title} variant="headlineMedium">Gym Manager</Text>
                <Text style={styles.subtitle} variant="bodyLarge">Sign in to continue</Text>

                <View style={styles.form}>
                    <TextInput
                        label="Email Address"
                        mode="outlined"
                        style={styles.input}
                        placeholder="owner@gym.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TextInput
                        label="Password"
                        mode="outlined"
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Button
                        mode="contained"
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        onPress={handleLogin}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Login
                    </Button>

                    <View style={styles.helper}>
                        <Text style={styles.helperText} variant="bodySmall">Try: owner@gym.com / trainer@gym.com</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        color: '#666',
        textAlign: 'center',
        marginBottom: 48,
    },
    form: {
        width: '100%',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        borderRadius: 8,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    helper: {
        marginTop: 24,
        alignItems: 'center',
    },
    helperText: {
        color: '#999',
    },
});

export default LoginScreen;
