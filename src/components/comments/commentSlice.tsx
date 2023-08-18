import {createSlice} from "@reduxjs/toolkit";
import type {Comment} from "../common/types";

const initialState: Comment = {
    author: "",
    content: "",
    date: ""
};
export const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        comment(state, action) {
            const {author, content, date} = action.payload;
            state.author = author;
            state.content = content;
            state.date = date;
        }
    }
});

export const {comment} = commentSlice.actions;

export default commentSlice.reducer;
