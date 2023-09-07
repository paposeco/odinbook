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
    const [post, setPost] = useState<Post>();
    const {postID} = useParams();
    const [commentsToDisplay, setCommentsToDisplay] = useState<JSX.Element[]>();

    // get post id from location
    // fetch info from db

    //  "/:facebookid/posts/:postid",

    useEffect(() => {
        const fetchPost = async function () {
            try {
                const response = await fetch(props.apiurl + facebookID + "/posts/" + postID, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                const responseData = await response.json();
                setPost(responseData.post);
                setCommentsToDisplay(
                    responseData.post.comments.map((acomment: Comment) => (
                        <CommentComponent commentinfo={acomment} key={acomment.id} />
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

    //image isnt loading

    if (!post) {
        return <div>Fetching</div>;
    } else {
        return (
            <div>
                <Link to={`user/${post.author.facebook_id}`}>{post.author.display_name}</Link>
                <Link to={`user/${post.author.facebook_id}/post/${post.id}`}>{post.post_date}</Link>
                <p>{post.post_content}</p>
                {post.post_image !== "" ? <img src={post.post_image} alt="postimage" /> : null}
                <p>{post.like_counter} likes</p>
                {post.comments.length > 0 ? <ul>{commentsToDisplay}</ul> : null}
            </div>
        );
    }
};

export default SinglePost;
