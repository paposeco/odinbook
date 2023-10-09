import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

interface FuncProps {
    authbearertoken(arg1: string, arg2: string): void;
    apiurl: string;
}

const Login: React.FC<FuncProps> = function (props) {
    const [pwd, setpwd] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async function (event) {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/guestlogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username: "guest", password: pwd})
            });

            const responseData = await response.json();
            localStorage.setItem("token", responseData.token);
            localStorage.setItem("facebookid", responseData.facebookid);
            console.log("navigate");
            props.authbearertoken(responseData.token, responseData.facebookid);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = function (event) {
        setpwd(event.currentTarget.value);
    };
    return (
        <div>
            <Link to={props.apiurl + "api/auth/facebook"}>Login with Facebook</Link>
            <p>Guest Login</p>
            <form action="" method="" onSubmit={handleSubmit}>
                <input disabled type="text" value="Guest" />
                <input type="password" name="password" onChange={handleChange} value={pwd} />
                <input type="submit" value="Login as guest" />
            </form>
        </div>
    );
};

export default Login;
