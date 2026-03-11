import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginApi } from "../services/authService";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router, Link } from "expo-router";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    setIsLoading(true);

    try {
      const { response, data } = await loginApi(email, password);

      if (response.ok) {
        await login(data.token);
        setEmail("");
        setPassword("");
        Alert.alert("Succès", "Vous êtes connecté !");
        router.replace("/(tasks)");
      } else {
        Alert.alert(
          "Erreur de connexion",
          data.message || "Identifiants incorrects.",
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de joindre le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue !</Text>
      <Text style={styles.subtitle}>Connectez-vous pour voir vos tâches.</Text>

      <TextInput
        style={styles.input}
        placeholder="Adresse Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Text>
      </TouchableOpacity>

      <Link
        href="/register"
        style={{
          color: "#007AFF",
          textAlign: "center",
          marginTop: 20,
          fontSize: 16,
        }}
      >
        Pas encore de compte ? S’inscrire
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ecf0f1",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#99c2ff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
