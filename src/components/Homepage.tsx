import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface FuncProps {
    updateToken(arg: string): void;
}

const Homepage: React.FC<FuncProps> = (props) => {
    const [token, setToken] = useState("");
    const [tokenFetched, setTokenFetched] = useState(false);

    useEffect(() => {
        const fetchInfo = async function(bearertoken: string) {
            try {
                const response = await fetch("http://localhost:3000/jwttest", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${bearertoken}`
                    }
                });
                const responseData = await response.json();
                console.log(responseData);
            } catch (err) {
                console.log(err);
            }
        };
        if (document.cookie !== "" && !tokenFetched) {
            setTokenFetched(true);
            const fullCookie = document.cookie;
            const cleanCookie = fullCookie.slice(6, fullCookie.length);
            setToken(cleanCookie);
            props.updateToken(cleanCookie);
            localStorage.setItem("token", cleanCookie);
            fetchInfo(cleanCookie);
        }
    }, []);

    // once token is fetched, query api for content
    if (token === "") {
        return (
            <div>
                <h1>Homepage</h1>
                <Link to="/login">Login with Facebook</Link>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Homepage</h1>
                <p>Logged in</p>
            </div>
        );
    }
};

export default Homepage;
