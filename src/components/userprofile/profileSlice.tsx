import {createSlice} from "@reduxjs/toolkit";
import type {UserProfile} from "../common/types";

const initialState: UserProfile = {
    facebook_id: "",
    display_name: "",
    profile_pic: "",
    birthday: "",
    gender: "",
    country: "",
    date_joined: "",
    friends: [],
    requests_sent: [],
    requests_received: [],
    guest: false
};
export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        userLoggedIn(state, action) {
            const {
                facebook_id,
                display_name,
                profile_pic,
                birthday,
                gender,
                country,
                date_joined,
                posts,
                friends,
                requests_sent,
                requests_received,
                guest
            } = action.payload;
            state.facebook_id = facebook_id;
            state.display_name = display_name;
            state.profile_pic = profile_pic;
            state.birthday = birthday;
            state.gender = gender;
            state.country = country;
            state.date_joined = date_joined;
            state.friends = friends;
            state.requests_sent = requests_sent;
            state.requests_received = requests_received;
            state.guest = guest;
        }
    }
});

export const {userLoggedIn} = profileSlice.actions;

export default profileSlice.reducer;
