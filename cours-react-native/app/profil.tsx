import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as Device from "expo-device";
import { AuthContext } from "../context/AuthContext";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { logout } = useContext(AuthContext);

  const [deviceInfo, setDeviceInfo] = useState({
    osName: "",
    osVersion: "",
    brand: "",
    model: "",
  });

  useEffect(() => {
    setDeviceInfo({
      osName: Device.osName || "unknown",
      osVersion: Device.osVersion || "unknown",
      brand: Device.brand || "unknown",
      model: Device.modelName || "unknown",
    });
  }, []);

  const handleLogout = async () => {
    await logout(); // Vide le token du téléphone
    router.replace("/login"); // Redirige instantanément vers le login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>
      <Text style={styles.subtitle}>Vous êtes connecté.</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>

      <View style={styles.deviceContainer}>
        <Text style={styles.deviceTitle}>Informations du périphérique</Text>
        <Text>
          OS: {deviceInfo.osName} {deviceInfo.osVersion}
        </Text>
        <Text>Fabricant: {deviceInfo.brand}</Text>
        <Text>Modèle: {deviceInfo.model}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deviceContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  deviceTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
});
