import React from "react";
import {Link, useNavigate} from "react-router-dom";

interface FuncProps {
    userloggedout(): void;
}

const Logout: React.FC<FuncProps> = function (props) {
    const navigate = useNavigate();
    const handleClick = function (event: React.MouseEvent) {
        localStorage.clear();
        navigate("/");
        props.userloggedout();
    };

    return (
        <div>
            Are you sure you want to logout?
            <button onClick={handleClick}>Yes</button>
            <Link to="/">Cancel</Link>
        </div>
    );
};

export default Logout;
