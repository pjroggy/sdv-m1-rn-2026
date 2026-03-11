import React, { useContext } from 'react';
import { Stack, Redirect } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function TasksLayout() {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!token) {

    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="create" 
        options={{ presentation: 'modal', title: "Nouvelle Tâche" }} 
      />
    </Stack>
  );
}