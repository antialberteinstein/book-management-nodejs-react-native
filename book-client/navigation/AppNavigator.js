import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoadingScreen from '../screens/auth/LoadingScreen';

// Book Screens
import IndexScreen from '../screens/books/IndexScreen';
import CreateBook from '../screens/books/CreateBook';
import EditBook from '../screens/books/EditBook';

const Stack = createStackNavigator();

// Auth Stack
const AuthStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
);

// Book Stack
const BookStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}
    >
        <Stack.Screen 
            name="Books" 
            component={IndexScreen}
            options={{
                title: 'Quản lý sách'
            }}
        />
        <Stack.Screen 
            name="CreateBook" 
            component={CreateBook}
            options={{
                title: 'Thêm sách mới'
            }}
        />
        <Stack.Screen 
            name="EditBook" 
            component={EditBook}
            options={{
                title: 'Chỉnh sửa sách'
            }}
        />
    </Stack.Navigator>
);

// Root Navigator
export default function AppNavigator() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <BookStack /> : <AuthStack />}
        </NavigationContainer>
    );
} 