// form for new post can upload file or url for image
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
    content: string;
    imageurl: string;
    postimage: FileList;
};
export default function NewPost({ apiurl }) {
    const { register, handleSubmit } = useForm<FormValues>();
    const [facebookID, setfacebookID] = useState("");
    const [token, setToken] = useState("");
    const [urlImage, setUrlImage] = useState(false);
    const [fileImage, setFileImage] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState("");

    const onSubmit = async function(data) {
        console.log(facebookID);
        console.log(token);
        const formData = new FormData();
        formData.append("postimage", data.postimage[0]);
        formData.append("content", data.content);
        formData.append("imageurl", data.imageurl);

        try {
            const response = await fetch("http://localhost:3000/" + facebookID + "/posts/newpost", {
                method: "POST",
                headers: {
                    // "Content-Type": "multipart/form-data;",
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            const responseData = await response.json();
            console.log(responseData);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = function(event: React.FormEvent<HTMLInputElement>): void {
        if (event.currentTarget.name === "postimage") {
            setUrlImage(true);
        } else {
            if (event.currentTarget.value === "") {
                setCurrentImageUrl("");
                setFileImage(false);
            } else {
                setCurrentImageUrl(event.currentTarget.value);
                setFileImage(true);
            }
        }
    };

    useEffect(() => {
        setfacebookID(localStorage.getItem("facebookid"));
        setToken(localStorage.getItem("token"));
    }, []);
    return (
        <div>
            <h2>New post</h2>
            <form
                action=""
                encType="multipart/form-data"
                method="post"
                onSubmit={handleSubmit(onSubmit)}
            >
                <textarea name="content" required {...register("content")}></textarea>
                <input
                    type="file"
                    className="form-control-file"
                    name="postimage"
                    {...register("postimage")}
                    disabled={fileImage}
                    onChange={handleChange}
                />
                <input
                    type="url"
                    className="form-control-text"
                    name="imageurl"
                    {...register("imageurl")}
                    disabled={urlImage}
                    onChange={handleChange}
                    value={currentImageUrl}
                />
                <input type="submit" value="Submit!" />
            </form>
            {/* this is how the image will be displayed after submitting the post */}
            {currentImageUrl !== "" ? <img src={currentImageUrl} alt="image" /> : null}
        </div>
    );
}
