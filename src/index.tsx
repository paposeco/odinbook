import React, {useEffect} from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, useLocation} from "react-router-dom";
import App from "./App";
import "./styles/stylesheet.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

export default function ScrollToTop() {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

root.render(
    <React.StrictMode>
        <BrowserRouter basename="https://paposeco.github.io/odinbook">
            <ScrollToTop />
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
