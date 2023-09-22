import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import type {Post, Comment} from "../../common/types";
import CommentComponent from "./Comment";

interface FuncProps {
    postinfo: Post;
    apiurl: string;
    facebookid: string;
    userprofileimg: string;
}

const PostComponent: React.FC<FuncProps> = function (props) {
    const [postInfo, setPostInfo] = useState<Post>(props.postinfo);
    const [commentBox, setCommentBox] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const [imgSrc, setImgSrc] = useState("");
    const apiUrl = props.apiurl;
    const facebookID = props.facebookid;
    const token = localStorage.getItem("token");
    const [commentsToDisplay, setCommentsToDisplay] = useState<JSX.Element[]>(
        props.postinfo.comments.map((acomment: Comment) => (
            <CommentComponent commentinfo={acomment} key={acomment.id} apiurl={apiUrl} />
        ))
    );

    const handleClickLike = async function (event: React.MouseEvent) {
        try {
            const response = await fetch(apiUrl + facebookID + "/posts/" + postInfo.id + "/like", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                const prevPostInfo = structuredClone(postInfo);
                ++prevPostInfo.like_counter;
                setPostInfo(prevPostInfo);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleClickComment = function (event: React.MouseEvent) {
        // display box
        setCommentBox(true);
    };

    const handleChange = function (event: React.FormEvent<HTMLInputElement>) {
        setCommentContent(event.currentTarget.value);
    };
    const handleSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCommentBox(false);
        try {
            const response = await fetch(
                apiUrl + facebookID + "/posts/" + postInfo.id + "/comment",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({content: commentContent})
                }
            );
            const responseData = await response.json();
            if (response.status === 200) {
                const prevPostInfo = structuredClone(postInfo);
                const commentinfo = responseData.newcommentpopulated;
                prevPostInfo.comments.push(commentinfo);
                setPostInfo(prevPostInfo);

                const newcommentcomponent: JSX.Element = (
                    <CommentComponent
                        commentinfo={commentinfo}
                        key={commentinfo._id}
                        apiurl={apiUrl}
                    />
                );

                setCommentsToDisplay((prevState) => [...prevState, newcommentcomponent]);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (postInfo !== undefined && postInfo.post_image !== undefined) {
            if (postInfo.post_image.includes("images") && postInfo.post_image !== "") {
                setImgSrc(apiUrl + postInfo.post_image);
            } else if (postInfo.post_image !== "") {
                setImgSrc(postInfo.post_image);
            }
        }
    }, [postInfo]);
    return (
        <li key={postInfo.id} className="flex flex-col gap-1 my-8 bg-stone-100 rounded-lg p-8">
            <Link to={`user/${postInfo.author.facebook_id}`}>{postInfo.author.display_name}</Link>
            <Link to={`user/${postInfo.author.facebook_id}/post/${postInfo.id}`}>
                {postInfo.post_date}
            </Link>

            {imgSrc !== "" ? <img src={imgSrc} alt="postimage" className="w-max mx-auto" /> : null}
            <p>{postInfo.post_content}</p>
            <p>
                {postInfo.like_counter}{" "}
                {postInfo.like_counter === 0 || postInfo.like_counter > 1 ? "likes" : "like"}
            </p>
            <div className="flex flex-row justify-around my-2">
                <button onClick={handleClickLike}>Like</button>
                <button onClick={handleClickComment}>Comment</button>
            </div>
            {commentBox ? (
                <div className="my-4">
                    <div className="flex flex-row">
                        <img src={props.userprofileimg} alt="profilepic" className="w-1/6" />
                        <form action="" method="" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="commentcontent"
                                id="commentcontent"
                                placeholder="Comment"
                                onChange={handleChange}
                            />
                            <input type="submit" value="Comment" />
                        </form>
                    </div>
                </div>
            ) : null}
            {postInfo.comments.length > 0 ? <ul>{commentsToDisplay}</ul> : null}
        </li>
    );
};

export default PostComponent;
