import {useContext} from "react";
import {AuthContext} from "../components/contexts/AuthContext";

export default function Discovery() {
    const {user} = useContext(AuthContext)
    return (
        <h1 className="text-xl">{user?.username} discovery page</h1>
    )
}