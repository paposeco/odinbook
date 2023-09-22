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
        <li key={commentInfo.id} className="flex flex-row gap-2">
            <div className="flex flex-column items-center">
                <img
                    src={props.apiurl + commentInfo.author.profile_pic}
                    alt="profilepic"
                    className="w-10 h-10 rounded-full"
                />
            </div>
            <div>
                <Link
                    to={`user/${commentInfo.author.facebook_id}`}
                    className="text-sm no-underline text-gray-700 font-bold"
                >
                    {commentInfo.author.display_name}
                </Link>
                <p className="text-slate-800">{commentInfo.comment_content}</p>
                <p className="text-gray-700">{commentInfo.comment_date}</p>
            </div>
        </li>
    );
};

export default CommentComponent;
