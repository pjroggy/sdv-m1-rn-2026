import React, { useContext, useState, useEffect } from "react";
import { Todo, TodoContext } from "../../context/TodoContext";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function TodoDetailScreen() {
  const { id } = useLocalSearchParams();
  const { todos, deleteTodo, updateTodoDetails } = useContext(TodoContext);

  const todo = todos.find((t) => t.id === Number(id));

  // if the list hasn't loaded or item gone, redirect or show placeholder
  useEffect(() => {
    if (id && todos.length && !todo) {
      // item not found, go back to list
      router.replace("/");
    }
  }, [id, todos, todo]);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<Todo["priority"]>("low");
  const [editDueDate, setEditDueDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (todo) {
      setEditName(todo.name);
      setEditDescription(todo.description || "");
      setEditPriority(todo.priority || "low");
      setEditDueDate(todo.due_date || "");
    }
  }, [todo]);

  if (!todo) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Tâche introuvable" }} />
        <Text style={styles.errorText}>La tâche demandée est introuvable.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert("Attention", "Voulez-vous vraiment supprimer cette tâche ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true);
          const success = await deleteTodo(todo.id);
          if (success) {
            router.back();
          } else {
            Alert.alert("Erreur", "Impossible de supprimer la tâche.");
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      Alert.alert("Erreur", "Le nom ne peut pas être vide.");
      return;
    }
    setIsLoading(true);

    // Note : Assurez-vous d'avoir mis à jour l'interface dans TodoContext.tsx pour accepter ces 6 arguments
    const success = await updateTodoDetails(
      todo.id,
      editName,
      todo.status,
      editDescription,
      editPriority,
      editDueDate,
    );

    setIsLoading(false);

    if (success) {
      setIsEditing(false);
    } else {
      Alert.alert("Erreur", "Impossible de modifier la tâche.");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Détail de la tâche" }} />

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
        style={styles.card}
      >
        <Image
          source={require("../../assets/images/sparkles.gif")}
          style={styles.sparkleGif}
          resizeMode="cover"
        />
        {isEditing ? (
          <>
            <Text style={styles.label}>Nom de la tâche</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={styles.label}>Description (optionnelle)</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={editDescription}
              onChangeText={setEditDescription}
              multiline
            />

            <Text style={styles.label}>
              Priorité (low, medium, high, critical)
            </Text>
            <View style={styles.prioritySelector}>
              {(
                ["low", "medium", "high", "critical"] as Todo["priority"][]
              ).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityBadge,
                    editPriority === p
                      ? styles.priorityActive
                      : styles.priorityInactive,
                  ]}
                  onPress={() => setEditPriority(p)}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      editPriority === p && styles.textWhite,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Date d échéance (AAAA-MM-JJ)</Text>
            <TextInput
              style={styles.input}
              value={editDueDate}
              placeholder="2026-12-31"
              onChangeText={setEditDueDate}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Enregistrer</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>{todo.name}</Text>

            <View style={styles.infoBadgeRow}>
              <View
                style={[
                  styles.badge,
                  (styles as any)[`priority_${todo.priority}`],
                ]}
              >
                <Text style={styles.badgeText}>Priorité : {todo.priority}</Text>
              </View>

              {todo.due_date && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    📅 {new Date(todo.due_date).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.status}>
              Statut :{" "}
              {todo.status === "completed"
                ? "✅ Terminée"
                : todo.status === "in_progress"
                  ? "⏳ En cours"
                  : "📝 À faire"}
            </Text>

            {todo.description ? (
              <Text style={styles.description}>{todo.description}</Text>
            ) : null}

            {todo.image_url && (
              <Image
                source={{ uri: todo.image_url }}
                style={styles.detailImage}
              />
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.buttonText}>Modifier</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Text style={styles.buttonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#ecf0f1" },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  sparkleGif: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
    pointerEvents: "none",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  status: { fontSize: 16, color: "#666", marginBottom: 10 },
  description: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    fontStyle: "italic",
    marginBottom: 20,
  },
  errorText: { fontSize: 18, color: "red", textAlign: "center", marginTop: 50 },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  editButton: { backgroundColor: "#007AFF" },
  deleteButton: { backgroundColor: "#ff3b30" },
  cancelButton: { backgroundColor: "#888" },
  saveButton: { backgroundColor: "#28a745" },
  infoBadgeRow: { flexDirection: "row", marginBottom: 15, gap: 10 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: "#ddd",
  },
  badgeText: { fontSize: 12, fontWeight: "bold", color: "#333" },
  priority_high: { backgroundColor: "#ffcccc" },
  priority_medium: { backgroundColor: "#fff3cd" },
  priority_low: { backgroundColor: "#d4edda" },
  priority_critical: { backgroundColor: "#ff4444" },
  detailImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 15,
  },
  prioritySelector: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  priorityActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  priorityInactive: { backgroundColor: "#eee" },
  priorityText: { fontSize: 11, fontWeight: "600" },
  textWhite: { color: "#fff" },
});
