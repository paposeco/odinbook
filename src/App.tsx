import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "components/Login";
import Homepage from "components/Homepage";
import What from "components/What";
import Loggedin from "components/Loggedin";

const App: React.FC = () => {
    const [token, setToken] = useState("");

    const authBearerToken = function(childtoken: string): void {
        // not necessary. to be removed later
        if (token === "") {
            setToken(childtoken);
        }
    };
    const apiURL = "http://localhost:3000/";
    return (
        <div id="content">
            <Routes>
                <Route path="/another" element={<What />} />
                <Route path="/" element={<Homepage updateToken={authBearerToken} />} />
                <Route path="/loggedin" element={<Loggedin />} />
                <Route path="/login" element={<Login apiurl={apiURL} />} />
            </Routes>
        </div>
    );
};

export default App;
