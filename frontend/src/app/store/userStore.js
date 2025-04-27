"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Create a Zustand store to manage the user ID
export const useUserStore = create(
  persist(
    (set) => ({
      userId: null,
      setUserId: (id) => set({ userId: id }),
      clearUserId: () => set({ userId: null }),
    }),
    {
      name: "user-storage", // This is the key in localStorage
    }
  )
);
