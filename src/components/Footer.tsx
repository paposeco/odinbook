import React from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons";

const Footer: React.FC = function () {
    return (
        <div className="flex justify-center text-lg">
            <Link to="https://github.com/paposeco" className="no-underline text-red-600 mb-8">
                <FontAwesomeIcon icon={faGithub} className="mr-2" />
                Fabi
            </Link>
        </div>
    );
};

export default Footer;
