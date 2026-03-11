import React, { useContext } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import ToDoCard from "../ToDoCard";
import { TodoContext, Todo } from "../../context/TodoContext";

export default function TodoList() {
  const { todos, isLoading } = useContext(TodoContext);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Chargement de vos tâches...</Text>
      </View>
    );
  }

  if (todos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Aucune tâche pour le moment.</Text>
        <Text style={styles.emptyText}>Cliquez sur Créer pour commencer !</Text>
      </View>
    );
  }

  const sortedTodos = [...todos].sort((a: Todo, b: Todo) => {
    // tâches non terminées en haut, puis par date d'échéance
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;
    if (a.due_date && b.due_date) {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    return 0;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {sortedTodos.map((todo) => (
        <ToDoCard
          key={todo.id}
          id={todo.id}
          title={todo.name}
          status={todo.status}
          priority={todo.priority}
          dueDate={todo.due_date}
          image_url={todo.image_url}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  scrollContent: { padding: 16 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
  },
  emptyText: { fontSize: 16, color: "#666", marginBottom: 5 },
});
