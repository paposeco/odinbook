import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";

type FormValues = {
    newprofilepic: string;
};

interface FuncProps {
    apiurl: string;
    updateProfileImg(arg1: string): void;
}

const EditProfilePic: React.FC<FuncProps> = function (props) {
    const {register, handleSubmit} = useForm<FormValues>();
    const facebookID = localStorage.getItem("facebookid");
    const token = localStorage.getItem("token");
    const [profilepiclocation, setProfilePicLocation] = useState(
        props.apiurl + localStorage.getItem("profilepic")
    );
    const [showImageForm, setShowImageForm] = useState(false);
    const [imgchanged, setimgchanged] = useState(false);
    const onSubmitImage = async function (data) {
        const formData = new FormData();
        formData.append("newprofilepic", data.newprofilepic[0]);
        try {
            const response = await fetch(props.apiurl + facebookID + "/uploadit", {
                method: "POST",
                headers: {
                    // "Content-Type": "multipart/form-data;",
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            const responseData = await response.json();
            localStorage.setItem("profilepic", responseData.filepath);
            setProfilePicLocation(props.apiurl + responseData.filepath);
            setShowImageForm(false);
            props.updateProfileImg(responseData.filepath);
        } catch (err) {
            console.log(err);
        }
    };
    const showImgForm = function (event: React.MouseEvent) {
        setShowImageForm(true);
    };

    useEffect(() => {
        if (imgchanged) {
            setProfilePicLocation(props.apiurl + localStorage.getItem("profilepic"));
        }
    }, [imgchanged]);

    return (
        <div>
            <img src={profilepiclocation} alt="profilepic" className="w-96" />
            <button onClick={showImgForm}>Change profile image</button>
            {showImageForm ? (
                <form
                    action=""
                    encType="multipart/form-data"
                    method="post"
                    onSubmit={handleSubmit(onSubmitImage)}
                    className="flex flex-col gap-2 my-4 content-start"
                >
                    <input
                        type="file"
                        className="form-control-file"
                        name="newprofilepic"
                        {...register("newprofilepic")}
                    />
                    <input type="submit" value="Upload" className="w-fit" />
                </form>
            ) : null}
        </div>
    );
};

export default EditProfilePic;
