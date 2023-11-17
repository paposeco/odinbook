import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fetching from "./Fetching";

interface FuncProps {
    updateToken(arg1: string, arg2: string): void;
}

const Loggedin: React.FC<FuncProps> = (props) => {
    const [tokenFetched, setTokenFetched] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(document.cookie);
        if (document.cookie !== "" && !tokenFetched) {
            setTokenFetched(true);

            const fullCookie = document.cookie;
            const indexToken = fullCookie.indexOf("token");
            console.log(indexToken);
            const indexFacebook = fullCookie.indexOf("facebook");
            const token = fullCookie.slice(indexToken + 6, indexFacebook - 2);
            const facebookid = fullCookie.slice(indexFacebook + 11);
            props.updateToken(token, facebookid);
            localStorage.setItem("token", token);
            localStorage.setItem("facebookid", facebookid);
            navigate("/");
        }
    }, []);
    return <Fetching />;
};

export default Loggedin;
