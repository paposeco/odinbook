import {createSlice} from "@reduxjs/toolkit";
import type {Friend} from "../common/types";

const initialState: Friend = {
    facebook_id: "",
    display_name: "",
    profile_pic: "",
    birthday: ""
};
export const profileNetworkSlice = createSlice({
    name: "profilenetwork",
    initialState,
    reducers: {
        profilenetwork(state, action) {
            const {facebook_id, display_name, profile_pic, birthday} = action.payload;
            state.facebook_id = facebook_id;
            state.display_name = display_name;
            state.profile_pic = profile_pic;
            state.birthday = birthday;
        }
    }
});

export const {profilenetwork} = profileNetworkSlice.actions;

export default profileNetworkSlice.reducer;

// i will have to add reducers functions for fetching from DB and then updating state
