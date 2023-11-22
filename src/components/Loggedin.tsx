import React, {useState, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import Fetching from "./Fetching";

interface FuncProps {
    updateToken(arg1: string, arg2: string): void;
}

const Loggedin: React.FC<FuncProps> = (props) => {
    const [tokenFetched, setTokenFetched] = useState(false);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const logintoken = searchParams.get("token");
        const facebookid = searchParams.get("facebookid");
        if (!tokenFetched) {
            setTokenFetched(true);
            localStorage.setItem("token", logintoken);
            localStorage.setItem("facebookid", facebookid);
            props.updateToken(logintoken, facebookid);
            navigate("/");
        }
    }, []);
    return <Fetching />;
};

export default Loggedin;
