import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import type {Post, Comment} from "../../common/types";
import CommentComponent from "./Comment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbsUp} from "@fortawesome/free-regular-svg-icons";
import {faThumbsUp as thumbusUpSolid} from "@fortawesome/free-solid-svg-icons";
import {faComments} from "@fortawesome/free-regular-svg-icons";
import {DateTime} from "luxon";
import Fetching from "components/Fetching";

interface FuncProps {
    apiurl: string;
}

const SinglePost: React.FC<FuncProps> = function (props) {
    const facebookID = localStorage.getItem("facebookid");
    const token = localStorage.getItem("token");
    const [postInfo, setPostInfo] = useState<Post>();
    const {postID} = useParams();
    const [commentsToDisplay, setCommentsToDisplay] = useState<JSX.Element[]>();
    const [commentBox, setCommentBox] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const [imgSrc, setImgSrc] = useState("");
    const [prettydate, setprettydate] = useState("");
    const profilePic = localStorage.getItem("profilepic");
    const apiUrl = props.apiurl;
    const [likeButton, setLikeButton] = useState<JSX.Element>(
        <FontAwesomeIcon icon={faThumbsUp} />
    );
    const [likeText, setLikeText] = useState("Like");
    const [liked, setLiked] = useState(false);

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

                if (responseData.post.likes.length > 0) {
                    const likesArray = responseData.post.likes;
                    for (let i = 0; i < likesArray.length; i++) {
                        if (likesArray[i]["facebook_id"] === facebookID) {
                            setLikeButton(<FontAwesomeIcon icon={thumbusUpSolid} />);
                            setLikeText("Liked");
                            setLiked(true);
                            break;
                        }
                    }
                }
            } catch (err) {
                console.log(err);
            }
        };
        if (facebookID !== "" && token !== "") {
            fetchPost();
        }
    }, [facebookID, token]);

    const handleClickLike = async function (event: React.MouseEvent) {
        if (liked) {
            return;
        }
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
                setLikeButton(<FontAwesomeIcon icon={thumbusUpSolid} />);
                setLikeText("Liked");
                setLiked(true);
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
        if (postInfo !== undefined) {
            const currentDate = DateTime.now();
            const currentYear = currentDate.year;
            const postdate = DateTime.fromFormat(postInfo.post_date, "dd/MM/yyyy, HH:mm");
            if (postdate.year === currentYear) {
                setprettydate(
                    postdate.setLocale("en-gb").toLocaleString({
                        day: "2-digit",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                );
            } else {
                setprettydate(
                    postdate
                        .setLocale("en-gb")
                        .toLocaleString({month: "long", day: "2-digit", year: "numeric"})
                );
            }
        }

        if (postInfo !== undefined && postInfo.post_image !== undefined) {
            if (postInfo.post_image.includes("images") && postInfo.post_image !== "") {
                setImgSrc(apiUrl + postInfo.post_image);
            } else if (postInfo.post_image !== "") {
                setImgSrc(postInfo.post_image);
            }
        }
    }, [postInfo]);

    if (!postInfo) {
        return <Fetching />;
    } else {
        return (
            <div className="flex flex-col gap-1 my-8 bg-white shadow rounded-lg py-8 lg:w-2/3 sm:px-4 lg:px-0 mx-auto mt-8">
                <div className="flex flex-row gap-4 content-center px-5">
                    <div className="flex flex-row content-center justify-center">
                        <Link
                            to={
                                postInfo.author.facebook_id === facebookID
                                    ? "/profile"
                                    : `../user/${postInfo.author.facebook_id}`
                            }
                        >
                            <img
                                src={props.apiurl + postInfo.author.profile_pic}
                                alt="profilepic"
                                className="w-10 h-10 rounded-full m-auto object-cover aspect-square"
                            />
                        </Link>
                    </div>
                    <div>
                        <p>
                            <Link
                                to={
                                    postInfo.author.facebook_id === facebookID
                                        ? "/profile"
                                        : `../user/${postInfo.author.facebook_id}`
                                }
                                className="no-underline text-gray-700 text-lg font-semibold"
                            >
                                {postInfo.author.display_name}
                            </Link>
                        </p>
                        <p>
                            <Link
                                to={`../user/${postInfo.author.facebook_id}/post/${postInfo.id}`}
                                className="no-underline text-gray-500"
                            >
                                {prettydate}
                            </Link>
                        </p>
                    </div>
                </div>
                <p className="my-2 mx-4 px-1">{postInfo.post_content}</p>
                {imgSrc !== "" ? (
                    <div className="w-full bg-stone-200 my-2">
                        <img src={imgSrc} alt="postimage" className="w-max mx-auto " />
                    </div>
                ) : null}
                <div className="flex flex-row space-between px-5">
                    {postInfo.like_counter >= 1 ? (
                        <p className="w-1/2">
                            <span className="mr-2">
                                <FontAwesomeIcon icon={faThumbsUp} />
                            </span>
                            {postInfo.like_counter}{" "}
                        </p>
                    ) : (
                        <p className="w-1/2"></p>
                    )}
                    {postInfo.comments.length > 1 ? (
                        <p className="w-1/2 text-right">{postInfo.comments.length} comments</p>
                    ) : null}
                    {postInfo.comments.length === 1 ? (
                        <p className="w-1/2 text-right">{postInfo.comments.length} comment</p>
                    ) : null}
                </div>
                <div className="flex flex-row justify-around my-2 py-2 border-t border-b px-5">
                    <button onClick={handleClickLike}>
                        <span className="mr-2">{likeButton}</span>
                        {likeText}
                    </button>
                    <button onClick={handleClickComment}>
                        <span className="mr-2">
                            <FontAwesomeIcon icon={faComments} />
                        </span>
                        Comment
                    </button>
                </div>
                {commentBox ? (
                    <div className="my-4 px-5">
                        <div className="flex flex-row w-full gap-2 my-2">
                            <img
                                src={apiUrl + profilePic}
                                alt="profilepic"
                                className="w-10 h-10 rounded-full pt-0.5 object-cover aspect-square"
                            />
                            <form
                                action=""
                                method=""
                                onSubmit={handleSubmit}
                                className="w-full flex flex-column gap-2 content-center"
                            >
                                <input
                                    type="text"
                                    name="commentcontent"
                                    id="commentcontent"
                                    placeholder="Comment"
                                    onChange={handleChange}
                                    className="rounded-full w-full"
                                    autoFocus={true}
                                />
                                <input
                                    type="submit"
                                    value="Send"
                                    className="underline cursor-pointer"
                                />
                            </form>
                        </div>
                    </div>
                ) : null}
                {postInfo.comments.length > 0 ? (
                    <ul className="px-5">{commentsToDisplay}</ul>
                ) : null}
            </div>
        );
    }
};

export default SinglePost;
