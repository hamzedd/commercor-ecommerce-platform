import { createStore } from "zustand/vanilla";

export type ModalState = {
  loginModal: boolean;
};

export type ModalActions = {
  toggleLogin: () => void;
};

export type ModalStore = ModalState & ModalActions;

export const defaultInitState: ModalState = {
  loginModal: false,
};

export const createModalStore = (initState: ModalState = defaultInitState) => {
  return createStore<ModalStore>()((set) => ({
    ...initState,
    toggleLogin: () => set((state) => ({ loginModal: !state.loginModal })),
  }));
};
