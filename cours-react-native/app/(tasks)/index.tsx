import React from 'react';
import { Button, StyleSheet, View, ImageBackground } from 'react-native';
import { Stack, router } from 'expo-router'; 
import TodoList from '../../components/todolist/ToDoList';

export default function Home() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen 
        options={{
          title: "Mes Tâches",
          headerRight: () => (
            <Button 
              onPress={() => router.navigate("/create")} 
              title="Créer" 
            />
          ),
        }} 
      />
      
      {/* On enveloppe la TodoList avec le fond animé */}
      <ImageBackground 
        source={require('../../assets/images/cat-space.gif')} // Assure-toi que le fichier est là
        style={styles.background}
        resizeMode="cover"
      >
        {/* L'overlay permet de garder les cartes lisibles */}
        <View style={styles.overlay}>
          <TodoList />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Ajuste l'opacité selon ton GIF
  }
});