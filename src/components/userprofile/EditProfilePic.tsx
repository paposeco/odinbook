import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {faPencil} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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

    const navigate = useNavigate();

    const onSubmitImage = async function (data) {
        if (data.newprofilepic.length === 0) {
            return;
        }
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
            if (response.status === 201) {
                const responseData = await response.json();
                localStorage.setItem("profilepic", responseData.filepath);
                setProfilePicLocation(props.apiurl + responseData.filepath);
                setShowImageForm(false);
                props.updateProfileImg(responseData.filepath);
                navigate("/");
            }
        } catch (err) {
            console.log(err);
        }
    };
    const showImgForm = function (event: React.MouseEvent) {
        setShowImageForm(true);
    };

    const handleCancel = function (event: React.MouseEvent) {
        setShowImageForm(false);
    };

    return (
        <div className="my-2">
            <img src={profilepiclocation} alt="profilepic" className="w-96" />
            {!showImageForm ? (
                <button
                    onClick={showImgForm}
                    className="bg-facebookblue shadow py-2 px-6 my-2 text-white rounded-lg hover:font-bold"
                >
                    <FontAwesomeIcon icon={faPencil} className="w-5 pr-1" />
                    Edit image
                </button>
            ) : null}
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
                    <div className="flex flex-row gap-2">
                        <input
                            type="submit"
                            value="Upload"
                            className=" max-w-fit bg-facebookblue shadow py-2 px-6 my-2 text-white rounded-lg cursor-pointer hover:font-bold "
                        />
                        <button
                            onClick={handleCancel}
                            className=" max-w-fit bg-facebookblue shadow py-2 px-6 my-2 text-white rounded-lg cursor-pointer hover:font-bold "
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : null}
        </div>
    );
};

export default EditProfilePic;
