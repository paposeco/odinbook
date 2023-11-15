import React from "react";
import {useNavigate} from "react-router";

interface FuncProps {
    apiurl: string;
    facebookid: string;
    friendfacebookid: string;
    friendname: string;
    cancelremovefriend(arg1: React.MouseEvent): void;
    friendremoved(): void;
}

const RemoveFriend: React.FC<FuncProps> = function (props) {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const handleClick = async function (event: React.MouseEvent) {
        try {
            const response = await fetch(
                props.apiurl + "removefriend/" + props.facebookid + "/" + props.friendfacebookid,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const responseData = await response.json();
            if (response.status === 201) {
                props.friendremoved();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex flex-row gap-2 items-center">
            <p>Remove {props.friendname} from your list of friends?</p>
            <div className="flex flex-row gap-2">
                <button
                    onClick={handleClick}
                    className="bg-facebookblue shadow py-2 px-6 text-white rounded-lg cursor-pointer hover:font-bold "
                >
                    Yes
                </button>
                <button
                    onClick={props.cancelremovefriend}
                    className="bg-facebookblue shadow py-2 px-6 text-white rounded-lg cursor-pointer hover:font-bold "
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default RemoveFriend;
