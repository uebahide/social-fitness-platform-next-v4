import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "./features/message/messageSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      message: messageReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
