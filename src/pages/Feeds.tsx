import {useContext} from "react";
import {AuthContext} from "../components/contexts/AuthContext";

export default function Feeds() {
    const {user} = useContext(AuthContext)
    return (
        <h1 className="header">{user?.username} feeds page</h1>
    )
}