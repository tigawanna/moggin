
import { observable } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";


export type SnackbarAction = {
  label: string;
  onPress?: () => void;
};

type SnackbarState = {
  visible: boolean;
  message: string;
  duration?: number;
  action?: SnackbarAction;
  onDismiss?: () => void;
};

// Initial snackbar state
const initialState: SnackbarState = {
  visible: false,
  message: "",
  duration: 3000,
  action: undefined,
  onDismiss: undefined,

};

// Create an observable for snackbar state
export const snackbar$ = observable<SnackbarState>(initialState);

// Hook to show snackbars from anywhere
export function useSnackbar() {
  // Get current snackbar state
  const state = use$(() => snackbar$.get());

  // Show a snackbar with the provided options
  const showSnackbar = (
    message: string,
    options?: {
      duration?: number;
      action?: SnackbarAction;
      onDismiss?: () => void;
    }
  ) => {
    snackbar$.set({
      visible: true,
      message,
      duration: options?.duration ?? 3000,
      action: options?.action,
      onDismiss: options?.onDismiss,
    });
  };


// Add proper type casting for the onDismiss callback
const hideSnackbar = () => {
    snackbar$.visible.set(false);

    // Get the onDismiss callback and cast it to the correct type
    const onDismiss = snackbar$.onDismiss.get() as (() => void) | undefined;
    if (onDismiss) {
        onDismiss();
    }
};return {
    ...state,
    showSnackbar,
    hideSnackbar,
  };
}
