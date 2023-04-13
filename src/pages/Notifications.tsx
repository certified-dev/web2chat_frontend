import {useContext} from "react";
import {AuthContext} from "../components/contexts/AuthContext";

export default function Notifications() {
    const {user} = useContext(AuthContext)
    return (
        <h1 className="text-xl">{user?.username} notification page</h1>
    )
}