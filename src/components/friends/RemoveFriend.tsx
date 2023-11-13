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
        <div>
            <p>Do you want to remove {props.friendname} from your list of friends?</p>
            <button onClick={handleClick}>Yes</button>
            <button onClick={props.cancelremovefriend}>Cancel</button>
        </div>
    );
};

export default RemoveFriend;
