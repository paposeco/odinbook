import React, {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";

interface FuncProps {
    updateToken(arg: string): void;
}

type FormValues = {
    newprofilepic: string;
}

const Homepage: React.FC<FuncProps> = (props) => {
    const [token, setToken] = useState("");
    const [tokenFetched, setTokenFetched] = useState(false);
    const [facebookID, setFacebookID] = useState("");
    const [userName, setUserName] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const {register, handleSubmit} = useForm<FormValues>();

    // const picInputRef = useRef(null);

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
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchInfo = async function (bearertoken: string, userFacebookID: string) {
            try {
                const response = await fetch(
                    "http://localhost:3000/" + userFacebookID + "/homepage",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${bearertoken}`
                        }
                    }
                );
                const responseData = await response.json();

                setUserName(responseData.userInfo.display_name);
                // api request for file
            } catch (err) {
                console.log(err);
            }
        };
        if (document.cookie !== "" && !tokenFetched) {
            setTokenFetched(true);
            const fullCookie = document.cookie;
            const semiColon = document.cookie.indexOf(";");
            const cleanTokenCookie = fullCookie.slice(6, semiColon);
            const cleanFacebookIdCookie = fullCookie.slice(semiColon + 13, fullCookie.length);
            setToken(cleanTokenCookie);
            setFacebookID(cleanFacebookIdCookie);
            props.updateToken(cleanTokenCookie);
            localStorage.setItem("token", cleanTokenCookie);
            localStorage.setItem("facebookid", cleanFacebookIdCookie);
            fetchInfo(cleanTokenCookie, cleanFacebookIdCookie);
        }
    }, []);

    useEffect(() => {
        const fetchPic = async function (bearertoken: string, userFacebookID: string) {
            try {
                const response = await fetch(
                    "http://localhost:3000/" + userFacebookID + "/profilepic",
                    {
                        method: "GET",
                        headers: {
                            //"Content-Type": "application/json",
                            Authorization: `Bearer ${bearertoken}`
                        }
                    }
                );

                const blob = await response.blob();

                setProfilePic(URL.createObjectURL(blob));
            } catch (err) {
                console.log(err);
            }
        };
        if (token !== "" && facebookID !== "") {
            fetchPic(token, facebookID);
        }
    }, [facebookID, token]);

    // once token is fetched, query api for content
    if (token === "") {
        return (
            <div>
                <h1>Homepage</h1>
                <Link to="/login">Login</Link>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Homepage</h1>
                <p>Hello {userName}</p>
                <img src={profilePic} alt="profile pic" />
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
    }
};

export default Homepage;
