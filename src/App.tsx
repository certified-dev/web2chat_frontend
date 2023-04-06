import {BrowserRouter, Route, Routes} from "react-router-dom";

import Chats from "./pages/Chats";
import {Login} from "./components/Login";
import {Navbar} from "./components/Navbar";

import {AuthContextProvider} from "./components/contexts/AuthContext";
import {NotificationContextProvider} from "./components/contexts/NotificationContext";
import {ProtectedRoute} from "./components/ProtectedRoute";
import Feeds from "./pages/Feeds";
import {SignUp} from "./components/SignUp";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <AuthContextProvider>
                            <NotificationContextProvider>
                                <Navbar/>
                            </NotificationContextProvider>
                        </AuthContextProvider>
                    }
                >

                    <Route path="chats" element={
                        <ProtectedRoute>
                            <Chats />
                        </ProtectedRoute>
                    }/>

                    <Route path="" element={
                        <ProtectedRoute>
                            <Feeds />
                        </ProtectedRoute>
                    }/>

                    <Route path="login" element={<Login />}/>
                    <Route path="signup" element={<SignUp />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}