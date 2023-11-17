import React, {useState, useEffect, useRef} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBowlingBall} from "@fortawesome/free-solid-svg-icons";

const Fetching: React.FC = function () {
    const [ballAngle, setBallAngle] = useState(0);
    const [ballClass, setBallClass] = useState("w-min rotate-0");
    const classwidth = "w-min ";

    const currAngle = useRef(0);
    useEffect(() => {
        const changeAngle = function () {
            if (currAngle.current === 315) {
                setBallAngle(0);
                setBallClass(classwidth + "rotate-0");
                currAngle.current = 0;
                return;
            }
            const newAngle = currAngle.current + 45;
            setBallAngle(newAngle);
            setBallClass(classwidth + "rotate-" + newAngle);
            currAngle.current = newAngle;
        };
        const interval = setInterval(changeAngle, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="my-8 w-min mx-auto">
            <div className={ballClass}>
                <FontAwesomeIcon icon={faBowlingBall} className="text-5xl" />
            </div>
        </div>
    );
};

export default Fetching;
