import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ apiurl }) {
    const [pwd, setpwd] = useState("");
    const navigate = useNavigate();
    /* const [token, setToken] = useState("");
     *  const [tokenFetched, setTokenFetched] = useState(false);
     *  const [facebookID, setFacebookID] = useState(""); */
    const handleSubmit = async function(event) {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/guestlogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: "guest", password: pwd })
            });

            const responseData = await response.json();
            localStorage.setItem("token", responseData.token);
            localStorage.setItem("facebookid", responseData.facebookid);
            document.cookie = "token=" + responseData.token;
            document.cookie = "facebookid=" + responseData.facebookid;
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = function(event) {
        setpwd(event.currentTarget.value);
    };
    return (
        <div>
            <Link to={apiurl + "api/auth/facebook"}>Login with Facebook</Link>
            <p>Guest Login</p>
            <form action="" method="" onSubmit={handleSubmit}>
                <input disabled type="text" value="Guest" />
                <input type="password" name="password" onChange={handleChange} value={pwd} />
                <input type="submit" value="Login as guest" />
            </form>
        </div>
    );
}
