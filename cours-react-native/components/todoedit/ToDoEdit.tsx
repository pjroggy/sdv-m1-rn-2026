import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { TodoContext, Todo } from "../../context/TodoContext";
import * as ImagePicker from "expo-image-picker";

export default function ToDoEdit() {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Todo["priority"]>("low");
  const [dueDate, setDueDate] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { addTodo } = useContext(TodoContext);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (taskName.trim().length === 0) {
      Alert.alert("Erreur", "Veuillez entrer un nom de tâche.");
      return;
    }

    setIsSaving(true);
    const success = await addTodo(
      taskName,
      image,
      priority,
      dueDate,
      description,
    );

    if (success) {
      Alert.alert("Succès", "Tâche ajoutée !");
      router.back();
    } else {
      Alert.alert("Erreur", "Impossible d'ajouter la tâche.");
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nom de la tâche *</Text>
      <TextInput
        style={styles.input}
        value={taskName}
        onChangeText={setTaskName}
        placeholder="Nom de la tâche..."
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 60 }]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Ajouter une description..."
      />

      <Text style={styles.label}>Priorité</Text>
      <View style={styles.priorityContainer}>
        {(["low", "medium", "high", "critical"] as Todo["priority"][]).map(
          (p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.priorityButton,
                priority === p && styles.priorityActive,
              ]}
              onPress={() => setPriority(p)}
            >
              <Text
                style={[
                  styles.priorityText,
                  priority === p && { color: "#fff" },
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      <Text style={styles.label}>Date d échéance (AAAA-MM-JJ)</Text>
      <TextInput
        style={styles.input}
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="Ex: 2026-12-31"
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {image ? "📷 Image sélectionnée" : "📷 Ajouter une image"}
        </Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.previewImage} />}

      <TouchableOpacity
        style={[styles.button, isSaving && { opacity: 0.5 }]}
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Créer la tâche</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 5, marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  priorityButton: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 1,
    marginHorizontal: 2,
    alignItems: "center",
  },
  priorityActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  priorityText: { fontSize: 10, fontWeight: "bold", color: "#555" },
  imageButton: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  imageButtonText: { fontWeight: "bold" },
  previewImage: { width: "100%", height: 150, borderRadius: 8, marginTop: 10 },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 50,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
