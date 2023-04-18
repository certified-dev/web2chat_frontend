import {useContext} from "react";
import {AuthContext} from "../components/contexts/AuthContext";

export default function Feeds() {
    const {user} = useContext(AuthContext)
    return (
        <h1 className="text-xl">{user?.username} profile page</h1>
    )
}