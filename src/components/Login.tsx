import React from "react";
import { Link } from "react-router-dom";

export default function Login({ apiurl }) {
    return (
        <div>
            <Link to={apiurl + "api/auth/facebook"}>Login</Link>
        </div>
    );
}
