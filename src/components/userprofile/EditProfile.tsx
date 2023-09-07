import React, {useState} from "react";
import {useForm} from "react-hook-form";

type FormValues = {
    newprofilepic: string;
};

const EditProfile = function () {
    const {register, handleSubmit} = useForm<FormValues>();
    const [facebookID, setFacebookID] = useState(localStorage.getItem("facebookid"));
    const [token, setToken] = useState(localStorage.getItem("token"));

    const onSubmit = async function (data) {
        const formData = new FormData();
        formData.append("newprofilepic", data.newprofilepic[0]);
        try {
            const response = await fetch("http://localhost:3000/" + facebookID + "/uploadit", {
                method: "POST",
                headers: {
                    // "Content-Type": "multipart/form-data;",
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            const responseData = await response.json();

            // do something with the response
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div>
            <p>Change profile pic</p>
            <form
                action=""
                encType="multipart/form-data"
                method="post"
                onSubmit={handleSubmit(onSubmit)}
            >
                <input
                    type="file"
                    className="form-control-file"
                    name="newprofilepic"
                    {...register("newprofilepic")}
                />
                <input type="submit" value="Submit!" className="btn btn-default" />
            </form>
        </div>
    );
};

export default EditProfile;
