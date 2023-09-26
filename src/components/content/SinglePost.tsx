import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import type {Post, Comment} from "../../common/types";
import CommentComponent from "./Comment";

interface FuncProps {
    apiurl: string;
}

const SinglePost: React.FC<FuncProps> = function (props) {
    const [facebookID, setFacebookID] = useState(localStorage.getItem("facebookid"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [postInfo, setPostInfo] = useState<Post>();
    const {postID} = useParams();
    const [commentsToDisplay, setCommentsToDisplay] = useState<JSX.Element[]>();
    const [commentBox, setCommentBox] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const [imgSrc, setImgSrc] = useState("");
    const profilePic = localStorage.getItem("profilepic");
    const apiUrl = props.apiurl;

    // get post id from location
    // fetch info from db

    //  "/:facebookid/posts/:postid",

    useEffect(() => {
        const fetchPost = async function () {
            try {
                const response = await fetch(apiUrl + facebookID + "/posts/" + postID, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                const responseData = await response.json();
                setPostInfo(responseData.post);
                setCommentsToDisplay(
                    responseData.post.comments.map((acomment: Comment) => (
                        <CommentComponent
                            commentinfo={acomment}
                            key={acomment.id}
                            apiurl={props.apiurl}
                        />
                    ))
                );
            } catch (err) {
                console.log(err);
            }
        };
        if (facebookID !== "" && token !== "") {
            fetchPost();
        }
    }, [facebookID, token]);

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

    if (!postInfo) {
        return <div>loading</div>;
    } else {
        return (
            <div className="flex flex-col gap-1 my-8 bg-stone-100 rounded-lg p-8 w-2/3 mx-auto">
                <div className="flex flex-row gap-4 content-center">
                    <div className="flex flex-row content-center justify-center">
                        <img
                            src={props.apiurl + postInfo.author.profile_pic}
                            alt="profilepic"
                            className="w-10 h-10 rounded-full m-auto"
                        />
                    </div>
                    <div>
                        <p>
                            <Link to={`user/${postInfo.author.facebook_id}`}>
                                {postInfo.author.display_name}
                            </Link>
                        </p>
                        <p>
                            <Link to={`user/${postInfo.author.facebook_id}/post/${postInfo.id}`}>
                                {postInfo.post_date}
                            </Link>
                        </p>
                    </div>
                </div>
                {imgSrc !== "" ? (
                    <img src={imgSrc} alt="postimage" className="w-max mx-auto" />
                ) : null}
                <p>{postInfo.post_content}</p>
                <p>
                    {postInfo.like_counter}{" "}
                    {postInfo.like_counter === 0 || postInfo.like_counter > 1 ? "likes" : "like"}
                </p>
                <div className="flex flex-row justify-around">
                    <button onClick={handleClickLike}>Like</button>
                    <button onClick={handleClickComment}>Comment</button>
                </div>
                {commentBox ? (
                    <div>
                        <div className="flex flex-row">
                            <img src={profilePic} alt="profilepic" className="w-1/6" />
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
            </div>
        );
    }
};

export default SinglePost;
