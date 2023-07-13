import React from "react";
import HelloWorld from "components/HelloWorld";
import { Routes, Route } from "react-router-dom";
import Login from "components/Login";
import Homepage from "components/Homepage";

export default function App() {
    const apiURL = "http://localhost:3000/";
    return (
        <div id="content">
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login apiurl={apiURL} />} />
            </Routes>
        </div>
    );
}
