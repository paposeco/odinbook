import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import type {Comment} from "../../common/types";

interface FuncProps {
    commentinfo: Comment;
    apiurl: string;
}

const CommentComponent: React.FC<FuncProps> = function (props) {
    const [commentInfo, setCommentInfo] = useState<Comment>(props.commentinfo);

    useEffect(() => {
        console.log(commentInfo);
    }, [commentInfo]);
    return (
        <li key={commentInfo.id} className="flex flex-row gap-2">
            <div className="w-1/6">
                <img src={props.apiurl + commentInfo.author.profile_pic} alt="profilepic" />
            </div>
            <div>
                <Link to={`user/${commentInfo.author.facebook_id}`}>
                    {commentInfo.author.display_name}
                </Link>
                <p>{commentInfo.comment_content}</p>
                <p>{commentInfo.comment_date}</p>
            </div>
        </li>
    );
};

export default CommentComponent;
