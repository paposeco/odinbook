import React, {useState} from "react";
import {Link} from "react-router-dom";
import type {Post, Comment} from "../../common/types";
import CommentComponent from "./Comment";

interface FuncProps {
    postinfo: Post;
}

const PostComponent: React.FC<FuncProps> = function (props) {
    const [postInfo, setPostInfo] = useState<Post>(props.postinfo);
    const [commentsToDisplay, setCommentsToDisplay] = useState<JSX.Element[]>(
        props.postinfo.comments.map((acomment: Comment) => (
            <CommentComponent commentinfo={acomment} key={acomment.id} />
        ))
    );

    return (
        <li key={postInfo.id} className="my-4 flex flex-col gap-1">
            <Link to={`user/${postInfo.author.facebook_id}`}>{postInfo.author.display_name}</Link>
            <Link to={`user/${postInfo.author.facebook_id}/post/${postInfo.id}`}>
                {postInfo.post_date}
            </Link>
            <p>{postInfo.post_content}</p>
            {postInfo.post_image !== "" ? <img src={postInfo.post_image} alt="postimage" /> : null}
            <p>{postInfo.like_counter} likes</p>
            {postInfo.comments.length > 0 ? <ul>{commentsToDisplay}</ul> : null}
        </li>
    );
};

export default PostComponent;
