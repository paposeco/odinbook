import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookF} from "@fortawesome/free-brands-svg-icons";
import {faUserSecret} from "@fortawesome/free-solid-svg-icons";

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
            const response = await fetch(props.apiurl + "guestlogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username: "guest", password: pwd})
            });

            const responseData = await response.json();
            if (response.status === 200) {
                localStorage.setItem("token", responseData.token);
                localStorage.setItem("facebookid", responseData.facebookid);
                props.authbearertoken(responseData.token, responseData.facebookid);
                navigate("/");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = function (event) {
        setpwd(event.currentTarget.value);
    };

    return (
        <div className="px-8">
            <h1 className="text-2xl mb-4">Login</h1>
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-row gap-2 items-center">
                    <FontAwesomeIcon icon={faFacebookF} className="w-5" />
                    <h2 className="text-lg">
                        Login or create an account with your Facebook Account
                    </h2>
                </div>

                <Link
                    to={props.apiurl + "api/auth/facebook"}
                    className="bg-facebookblue shadow py-2 px-6 text-white rounded-lg cursor-pointer hover:font-bold no-underline w-fit"
                >
                    Login with Facebook
                </Link>
            </div>
            <div>
                <div className="flex flex-row gap-2 items-center mb-4">
                    <FontAwesomeIcon icon={faUserSecret} className="w-5" />
                    <h2 className="text-lg">Login as guest</h2>
                </div>

                <form action="" method="" onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                        <label htmlFor="guestusername" className="w-14">
                            Username:{" "}
                        </label>
                        <input
                            disabled
                            name="guestusername"
                            type="text"
                            value="Guest"
                            className="ml-2"
                        />

                        <label htmlFor="password" className="w-14">
                            Password:{" "}
                        </label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            value={pwd}
                            className="ml-2"
                        />
                    </div>
                    <input
                        type="submit"
                        value="Login as guest"
                        className="bg-facebookblue shadow py-2 px-6 my-2 text-white rounded-lg cursor-pointer hover:font-bold w-min"
                    />
                </form>
            </div>
        </div>
    );
};

export default Login;
