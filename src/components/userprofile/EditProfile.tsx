import React, {useEffect} from "react";
import {useNavigate} from "react-router";
import {useForm} from "react-hook-form";
import EditProfilePic from "./EditProfilePic";
import type {EditableProfile} from "src/common/types";
import {Country, getCountryName} from "./CountrySelector";

interface FuncProps {
    apiurl: string;
    updateProfileImg(arg1: string): void;
    currentprofile: EditableProfile;
    updateCountry(arg1: string): void;
}

const EditProfile: React.FC<FuncProps> = function (props) {
    const facebookID = localStorage.getItem("facebookid");
    const token = localStorage.getItem("token");
    const apiUrl = props.apiurl;
    const currDate = new Date(Date.now());
    const currYear: number = currDate.getFullYear() - 12;
    const minAge: string = currYear + "-01-01";
    const {register, handleSubmit} = useForm<EditableProfile>({
        defaultValues: {
            displayname: props.currentprofile.displayname,
            birthday: props.currentprofile.birthday,
            gender: props.currentprofile.gender,
            country: props.currentprofile.country
        }
    });

    const navigate = useNavigate();
    const onSubmit = async function (data) {
        try {
            const response = await fetch(apiUrl + facebookID + "/editprofile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    display_name: data.displayname,
                    birthday: data.birthday,
                    gender: data.gender,
                    country: data.country
                })
            });
            const responseData = await response.json();
            if (response.status === 201) {
                props.updateCountry(data.country);
                navigate("/profile");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h3>Edit profile</h3>
            <EditProfilePic apiurl={apiUrl} updateProfileImg={props.updateProfileImg} />
            <div>
                <form
                    action=""
                    encType="application/x-www-form-urlencoded"
                    method="post"
                    onSubmit={handleSubmit(onSubmit)}
                    className="editprofileform"
                >
                    <div>
                        <label htmlFor="displayname" className="">
                            Display name:
                        </label>
                        <input
                            type="text"
                            name="displayname"
                            {...register("displayname", {required: true})}
                        />
                    </div>
                    <div>
                        <label htmlFor="birthday">Birthday:</label>
                        <input
                            type="date"
                            min="1910-01-01"
                            max={minAge}
                            name="birthday"
                            {...register("birthday")}
                        />
                    </div>
                    <div>
                        <label htmlFor="gender">Gender:</label>
                        <select name="gender" {...register("gender")}>
                            <option value="">Select one</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="country">Country:</label>
                        <select name="country" {...register("country")}>
                            {Country.map((acountry) => (
                                <option value={acountry.value} key={acountry.value}>
                                    {acountry.text}
                                </option>
                            ))}
                        </select>
                    </div>
                    <input type="submit" value="Save" />
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
