import React, { useContext } from "react";
import { Todo, TodoContext } from "../context/TodoContext";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

interface ToDoCardProps {
  id: number;
  title: string;
  status: Todo["status"];
  priority: Todo["priority"];
  dueDate?: string | null;
  image_url?: string | null;
}
export default function ToDoCard({
  id,
  title,
  status,
  priority,
  dueDate,
  image_url,
}: ToDoCardProps) {
  const { updateTodoStatus } = useContext(TodoContext);
  const isCompleted = status === "completed";

  const toggleStatus = () => {
    const newStatus = isCompleted ? "to_do" : "completed";
    updateTodoStatus(id, title, newStatus);
  };

  const getPriorityStyle = (p: Todo["priority"]) => {
    switch (p) {
      case "critical":
        return {
          borderColor: "#ff4444",
          borderWidth: 2,
          shadowColor: "#ff0000",
          elevation: 5,
        };
      case "high":
        return { borderColor: "#ff8800", borderWidth: 1.5 };
      default:
        return {};
    }
  };

  return (
    <View style={getPriorityStyle(priority)}>
      <LinearGradient
        colors={[
          "#FF0000cc",
          "#FFA500cc",
          "#FFFF00cc",
          "#008000cc",
          "#0000FFcc",
          "#4B0082cc",
          "#EE82EEcc",
        ]}
        start={[0, 0]}
        end={[1, 1]}
        style={[styles.card, isCompleted && styles.cardCompleted]}
      >
        {/* sparkle GIF overlay */}
        <Image
          source={require("../assets/images/sparkles.gif")}
          style={styles.sparkleGif}
          resizeMode="cover"
        />
        {image_url ? (
          <Image
            source={{ uri: image_url }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.cardImage, { backgroundColor: "#eee" }]} />
        )}

        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => router.push(`/(tasks)/${id}` as any)}
        >
          <Text
            style={[styles.paragraph, isCompleted && styles.paragraphCompleted]}
          >
            {title}
          </Text>
          <Text style={styles.subInfo}>
            {priority}{" "}
            {dueDate ? `• ${new Date(dueDate).toLocaleDateString()}` : ""}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statusButton,
            isCompleted ? styles.buttonCompleted : styles.buttonTodo,
          ]}
          onPress={toggleStatus}
        >
          <Text style={isCompleted ? styles.textCompleted : styles.textTodo}>
            {isCompleted ? "✔" : "◯"}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // gradient background handled by LinearGradient
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden", // keep shimmer contained
  },
  cardCompleted: { opacity: 0.6 },
  textContainer: { flex: 1 },
  paragraph: { fontSize: 16, fontWeight: "bold" },
  paragraphCompleted: { textDecorationLine: "line-through" },
  subInfo: { fontSize: 12, color: "#666" },
  statusButton: {
    padding: 10,
    borderRadius: 20,
    width: 40,
    alignItems: "center",
  },
  buttonTodo: { backgroundColor: "#e6f2ff" },
  buttonCompleted: { backgroundColor: "#e6ffed" },
  textTodo: { color: "#007AFF" },
  textCompleted: { color: "#28a745" },
  sparkleGif: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
    pointerEvents: "none",
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 10,
  },
});
