import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

interface FuncProps {
    updateToken(arg1: string, arg2: string): void;
}

const Loggedin: React.FC<FuncProps> = (props) => {
    const [tokenFetched, setTokenFetched] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (document.cookie !== "" && !tokenFetched) {
            setTokenFetched(true);
            const fullCookie = document.cookie;
            const semiColon = document.cookie.indexOf(";");
            const cleanTokenCookie = fullCookie.slice(6, semiColon);
            const cleanFacebookIdCookie = fullCookie.slice(semiColon + 13, fullCookie.length);
            props.updateToken(cleanTokenCookie, cleanFacebookIdCookie);
            localStorage.setItem("token", cleanTokenCookie);
            localStorage.setItem("facebookid", cleanFacebookIdCookie);
            navigate("/");
        }
    }, []);
    return <div>logging in</div>;
};

export default Loggedin;
