import React, {useState} from "react";
import {Link} from "react-router-dom";
import type {Comment} from "../../common/types";

interface FuncProps {
    commentinfo: Comment;
}

const CommentComponent: React.FC<FuncProps> = function (props) {
    const [commentInfo, setCommentInfo] = useState<Comment>(props.commentinfo);

    return (
        <li key={commentInfo.id}>
            <Link to={`user/${commentInfo.author.facebook_id}`}>
                {commentInfo.author.display_name}
            </Link>
            <p>{commentInfo.comment_content}</p>
            <p>{commentInfo.comment_date}</p>
        </li>
    );
};

export default CommentComponent;
