import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { AuthContext } from "./AuthContext";
import { createAudioPlayer, AudioStatus } from "expo-audio";
import {
  fetchTodosApi,
  createTodoApi,
  updateTodoApi,
  deleteTodoApi,
} from "../services/todoService";

export interface Todo {
  id: number;
  name: string;
  status: "to_do" | "in_progress" | "completed";
  priority: "low" | "medium" | "high" | "critical";
  due_date?: string | null;
  description?: string | null;
  image_url?: string | null;
}

interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  fetchTodos: () => Promise<void>;
  addTodo: (
    name: string,
    imageUri: string | null,
    priority?: Todo["priority"],
    due_date?: string,
    description?: string,
  ) => Promise<boolean>;
  updateTodoStatus: (
    id: number,
    name: string,
    newStatus: Todo["status"],
  ) => Promise<void>;
  deleteTodo: (id: number) => Promise<boolean>;
  updateTodoDetails: (
    id: number,
    name: string,
    status: Todo["status"],
    description?: string,
    priority?: Todo["priority"],
    due_date?: string,
  ) => Promise<boolean>;
}

export const TodoContext = createContext<TodoContextType>({
  todos: [],
  isLoading: false,
  fetchTodos: async () => {},
  addTodo: async () => false,
  updateTodoStatus: async () => {},
  deleteTodo: async () => false,
  updateTodoDetails: async () => false,
});

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const { token, logout } = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // audio : utilise expo-audio hook to load and unload on demand
  const playSound = async (type: "wow" | "meow" | "explosion") => {
    const asset =
      type === "wow"
        ? require("../assets/sound/wow.mp3")
        : type === "meow"
          ? require("../assets/sound/meowrgh.mp3")
          : require("../assets/sound/explosion.mp3");

    try {
      const player = createAudioPlayer(asset);
      // cleanup once playback finishes
      // listen for the built-in playback status update event
      player.addListener("playbackStatusUpdate", (status: AudioStatus) => {
        if (status.didJustFinish) {
          player.remove();
        }
      });
      // the newer expo-audio API uses play() rather than playAsync()
      player.play();
    } catch (e) {
      console.error("Audio play error", e);
    }
  };

  const fetchTodos = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const { response, data } = await fetchTodosApi(token);
      if (response.status === 401) {
        await logout();
        return;
      }
      if (response.ok) {
        setTodos(data.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (
    name: string,
    imageUri: string | null,
    priority?: Todo["priority"],
    due_date?: string,
    description?: string,
  ): Promise<boolean> => {
    if (!token) return false;
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("status", "to_do");
      if (priority) formData.append("priority", priority);
      if (due_date) formData.append("due_date", due_date);
      if (description) formData.append("description", description);

      if (imageUri) {
        formData.append("image", {
          uri: imageUri,
          name: "todo_image.jpg",
          type: "image/jpeg",
        } as any);
      }

      const { response } = await createTodoApi(token, formData);
      if (response.status === 401) {
        await logout();
        return false;
      }
      if (response.ok) {
        await fetchTodos();
        await playSound("wow");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in addTodo", error);
      return false;
    }
  };

  const updateTodoStatus = async (
    id: number,
    name: string,
    newStatus: Todo["status"],
  ): Promise<void> => {
    if (!token) return;
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("status", newStatus);
      formData.append("_method", "PATCH");

      const { response } = await updateTodoApi(token, id, formData);
      if (response.status === 401) {
        await logout();
        return;
      }
      if (response.ok) {
        await fetchTodos();
        await playSound("meow");
      }
    } catch (error) {
      console.error("Error in updateTodoStatus", error);
    }
  };

  const updateTodoDetails = async (
    id: number,
    name: string,
    status: Todo["status"],
    description?: string,
    priority?: Todo["priority"],
    due_date?: string,
  ): Promise<boolean> => {
    if (!token) return false;
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("status", status);
      if (description) formData.append("description", description);
      if (priority) formData.append("priority", priority);
      if (due_date) formData.append("due_date", due_date);
      formData.append("_method", "PATCH");

      const { response } = await updateTodoApi(token, id, formData);
      if (response.status === 401) {
        await logout();
        return false;
      }
      if (response.ok) {
        await fetchTodos();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in updateTodoDetails", error);
      return false;
    }
  };

  const deleteTodo = async (id: number): Promise<boolean> => {
    if (!token) return false;
    try {
      const { response } = await deleteTodoApi(token, id);
      if (response.status === 401) {
        await logout();
        return false;
      }
      if (response.ok) {
        await fetchTodos();
        await playSound("explosion");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in deleteTodo", error);
      return false;
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        isLoading,
        fetchTodos,
        addTodo,
        updateTodoStatus,
        deleteTodo,
        updateTodoDetails,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
