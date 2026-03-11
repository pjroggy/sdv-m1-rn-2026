import React, { createContext, useState, useEffect, ReactNode } from "react";
// On importe le coffre-fort d'Expo
import * as SecureStore from "expo-secure-store";

// 1. On définit ce que notre contexte va contenir
interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  login: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

// 2. On crée le contexte (vide par défaut)
export const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

// 3. On crée le composant "Provider" qui va englober notre application
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect se lance tout seul au démarrage de l'application
  useEffect(() => {
    const loadToken = async () => {
      try {
        // On va chercher dans le coffre-fort si un token y est caché
        const storedToken = await SecureStore.getItemAsync("userToken");
        if (storedToken) {
          setToken(storedToken); // On le met dans la mémoire de l'appli
        }
      } catch (e) {
        console.error("Erreur lors de la lecture du token", e);
      } finally {
        setIsLoading(false); // Fini de charger !
      }
    };

    loadToken();
  }, []);

  // Fonction pour se connecter : sauvegarde le token dans l'app ET dans le coffre-fort
  const login = async (newToken: string) => {
    await SecureStore.setItemAsync("userToken", newToken);
    setToken(newToken);
  };

  // Fonction pour se déconnecter : vide le token de l'app ET du coffre-fort
  const logout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// helper hook
export const useAuth = () => React.useContext(AuthContext);
