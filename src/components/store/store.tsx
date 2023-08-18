import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../userprofile/profileSlice";

export const store = configureStore({
    reducer: {
        userprofile: userReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
