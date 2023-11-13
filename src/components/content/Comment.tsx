import React, {useState} from "react";
import {Link} from "react-router-dom";
import type {Comment} from "../../common/types";

interface FuncProps {
    commentinfo: Comment;
    apiurl: string;
}

const CommentComponent: React.FC<FuncProps> = function (props) {
    const commentInfo: Comment = props.commentinfo;

    return (
        <li key={commentInfo.id} className="flex flex-row gap-2 my-2">
            <div className="flex flex-column">
                <img
                    src={props.apiurl + commentInfo.author.profile_pic}
                    alt="profilepic"
                    className="w-10 h-10 rounded-full pt-0.5"
                />
            </div>
            <div className="w-full">
                <div className="rounded-xl bg-gray-50 w-full p-2">
                    <Link
                        to={`user/${commentInfo.author.facebook_id}`}
                        className="text-sm no-underline text-gray-700 font-bold px-2"
                    >
                        {commentInfo.author.display_name}
                    </Link>
                    <p className="text-slate-800 px-2">{commentInfo.comment_content}</p>
                </div>
                <p className="text-gray-700 px-4 pt-0.5 text-gray-500 text-sm">
                    {commentInfo.comment_date}
                </p>
            </div>
        </li>
    );
};

export default CommentComponent;
