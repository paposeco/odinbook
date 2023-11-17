import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router";

interface FuncProps {
    apiurl: string;
    newpost?(): void;
    userprofile: boolean;
}

type FormValues = {
    content: string;
    imageurl: string;
    postimage: FileList;
};

const WhatsOnYourMind: React.FC<FuncProps> = (props) => {
    const profile_pic = localStorage.getItem("profilepic");
    const displayname = localStorage.getItem("displayname").split(" ");
    const facebookID = localStorage.getItem("facebookid");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [formVisible, setFormVisible] = useState(false);
    const {register, handleSubmit} = useForm<FormValues>();
    const [urlImage, setUrlImage] = useState(false);
    const [fileImage, setFileImage] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState("");

    const showForm = function (event: React.MouseEvent) {
        setFormVisible(true);
    };

    const onSubmit = async function (data) {
        const formData = new FormData();
        formData.append("postimage", data.postimage[0]);
        formData.append("content", data.content);
        formData.append("imageurl", data.imageurl);

        try {
            const response = await fetch(props.apiurl + facebookID + "/posts/newpost", {
                method: "POST",
                headers: {
                    // "Content-Type": "multipart/form-data;",
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            const responseData = await response.json();
            //do something here
            if (response.status === 201) {
                setFormVisible(false);
                if (!props.userprofile) {
                    props.newpost();
                }

                navigate("/");
            } else {
                setFormVisible(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = function (event: React.FormEvent<HTMLInputElement>): void {
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

    const cancelNewPost = function (event: React.MouseEvent) {
        setFormVisible(false);
        setFileImage(false);
        setCurrentImageUrl("");
        setUrlImage(false);
    };

    return (
        <div className="bg-white rounded-lg shadow">
            {!formVisible ? (
                <div className="flex flex-row justify-start content-center p-4 sm:p-8 my-4 sm:gap-8 gap-4">
                    <div>
                        <img
                            className="sm:w-10 sm:h-10 w-8 h-8 rounded-full object-cover aspect-square"
                            src={props.apiurl + profile_pic}
                            alt="profilepic"
                        />
                    </div>
                    <div onClick={showForm}>
                        <p className="text-gray-400 align-middle inline">
                            What's on your mind, {displayname[0]}?
                        </p>
                    </div>
                </div>
            ) : null}

            {formVisible ? (
                <div className="bg-white rounded-lg p-4 sm:p-8 my-4">
                    <div className="flex flex-row gap-4 items-center">
                        <img
                            className="sm:w-10 sm:h-10 w-8 h-8 rounded-full object-cover aspect-square"
                            src={props.apiurl + profile_pic}
                            alt="profilepic"
                        />
                        <p className="inline align-middle">{localStorage.getItem("displayname")}</p>
                    </div>
                    <p className="text-lg font-semibold my-4">Create post</p>
                    <form
                        action=""
                        encType="multipart/form-data"
                        method="post"
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <textarea
                            name="content"
                            required
                            {...register("content")}
                            className="form-textarea rounded"
                            placeholder={`What's on your mind, ${displayname[0]}?`}
                            rows={10}
                            autoFocus={true}
                        ></textarea>
                        <p>
                            Add an image to your post by uploading a file or by adding a url on the
                            box below.
                        </p>
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
                            className="form-input rounded"
                            name="imageurl"
                            {...register("imageurl")}
                            disabled={urlImage}
                            onChange={handleChange}
                            value={currentImageUrl}
                            placeholder="Image URL"
                        />
                        <div className="flex flex-row gap-2">
                            <input
                                type="submit"
                                value="Post"
                                className="bg-facebookblue shadow py-2 px-6 my-2 w-min text-white rounded-lg cursor-pointer hover:font-bold"
                            />
                            <button
                                onClick={cancelNewPost}
                                className="bg-facebookblue shadow py-2 px-6 my-2 w-min text-white rounded-lg cursor-pointer hover:font-bold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
        </div>
    );
};

export default WhatsOnYourMind;
