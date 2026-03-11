import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { AuthProvider } from '../context/AuthContext';
import { TodoProvider } from '../context/TodoContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <TodoProvider>
      <Tabs>
        <Tabs.Screen 
          name="(tasks)" 
          options={{ 
            title: "Tâches",
            headerShown: false, 
            tabBarIcon: ({ color }) => <FontAwesome name="list" size={24} color={color} />
          }} 
        />
        
        <Tabs.Screen 
          name="profil" 
          options={{ 
            title: "Profil",
            tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />
          }} 
        />

        <Tabs.Screen 
          name="login" 
          options={{ 
            href: null, 
            headerShown: false, 
            tabBarStyle: { display: 'none' }, 
          }} 
        />
        <Tabs.Screen 
          name="register" 
          options={{ 
            href: null, 
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }} 
        />
      </Tabs>
      </TodoProvider>
    </AuthProvider>
  );
}