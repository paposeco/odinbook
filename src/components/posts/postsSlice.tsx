import {createSlice} from "@reduxjs/toolkit";
import type {Post, Comment, Friend} from "../common/types";

const initialState: Post = {
    post_id: "",
    post_content: "",
    comments: [],
    likes: [],
    date: "",
    post_image: ""
};
export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        post(state, action) {
            const {post_id, post_content, comments, likes, date, post_image} = action.payload;
            state.post_id = post_id;
            state.post_content = post_content;
            state.comments = comments;
            state.likes = likes;
            state.date = date;
            state.post_image = post_image;
        }
    }
});

export const {post} = postSlice.actions;

export default postSlice.reducer;
