import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "uz" | "qq" | "ru";

interface SettingsState {
  language: Language;
  darkMode: boolean;
  cashbackBalance: number;
  savedAddresses: { label: string; address: string }[];
  setLanguage: (lang: Language) => void;
  toggleDarkMode: () => void;
  setCashback: (amount: number) => void;
  addSavedAddress: (addr: { label: string; address: string }) => void;
  removeSavedAddress: (label: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: "uz",
      darkMode: true,
      cashbackBalance: 0,
      savedAddresses: [],
      setLanguage: (lang) => set({ language: lang }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setCashback: (amount) => set({ cashbackBalance: amount }),
      addSavedAddress: (addr) =>
        set((s) => ({ savedAddresses: [...s.savedAddresses.filter((a) => a.label !== addr.label), addr] })),
      removeSavedAddress: (label) =>
        set((s) => ({ savedAddresses: s.savedAddresses.filter((a) => a.label !== label) })),
    }),
    { name: "oshfast-settings" }
  )
);
