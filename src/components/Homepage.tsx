import React from "react";
import { Link } from "react-router-dom";

export default function Homepage({ loggedin, apiurl }) {
    return (
        <div>
            <h1>Homepage</h1>
            <Link to="/login">Login with Facebook</Link>
        </div>
    );
}
