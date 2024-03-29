import {BrowserRouter, Route, Routes} from "react-router-dom";

import Chats from "./pages/Chats";
import {Login} from "./components/Login";
import {Navbar} from "./components/Navbar";

import {AuthContextProvider} from "./components/contexts/AuthContext";
import {NotificationContextProvider} from "./components/contexts/NotificationContext";
import {ProtectedRoute} from "./components/ProtectedRoute";
import {SignUp} from "./components/SignUp";

import Feeds from "./pages/Feeds";
import Notifications from "./pages/Notifications";
import Discovery from "./pages/Discovery";
import UserProfile from "./pages/UserProfile";

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
                    <Route path="" element={
                        <ProtectedRoute>
                            <Feeds />
                        </ProtectedRoute>
                    }/>

                    <Route path="chats" element={
                        <ProtectedRoute>
                            <Chats />
                        </ProtectedRoute>
                    }/>


                    <Route path="notifications" element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }/>

                    <Route path="profile" element={
                        <ProtectedRoute>
                            <UserProfile />
                        </ProtectedRoute>
                    }/>

                    <Route path="discover" element={
                        <ProtectedRoute>
                            <Discovery />
                        </ProtectedRoute>
                    }/>

                </Route>

                <Route path="login" element={
                    <AuthContextProvider>
                       <Login />
                    </ AuthContextProvider>
                }/>

                <Route path="signup" element={
                    <AuthContextProvider>
                        <SignUp />
                    </ AuthContextProvider>
                }/>
            </Routes>
        </BrowserRouter>
    );
}