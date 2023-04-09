import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";

// @ts-ignore
import { AuthContext } from "./contexts/AuthContext";

export function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const { user, login } = useContext(AuthContext);

    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            const { username, password } = values;
            const res = await login(username, password);

            if (res.error || res.data) {
                if (res.data && res.data.detail) {
                    setError(res.data.detail);
                }
            } else {
                navigate("/");
            }
            setSubmitting(false);
        }
    });

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
            <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
                <div className="p-2 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-green-600">
                        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z"/>
                        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z"/>
                    </svg>
                </div>
                <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
                    <form onSubmit={formik.handleSubmit}>
                        {error && <div>{JSON.stringify(error)}</div>}
                        <div className="px-5 py-7">
                            {/*<label className="font-semibold text-sm text-gray-600 pb-1 block">Username</label>*/}
                            <input
                                type="text"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                name="username"
                                placeholder="Username"
                                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                            />
                            {/*<label className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>*/}
                            <input
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                            />
                            <button type="submit"
                                    className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">

                                <span className="inline-block mr-2">{formik.isSubmitting ? "Signing in..." : "Login"}</span>
                                {formik.isSubmitting ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline-block">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ):(
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-3 gap-1">
                                <button type="button"
                                        className="transition duration-200 border border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-normal text-center inline-block">Facebook
                                </button>
                                <button type="button"
                                        className="transition duration-200 border border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-normal text-center inline-block">Google
                                </button>
                                <button type="button"
                                        className="transition duration-200 border border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-normal text-center inline-block">Twitter
                                </button>
                            </div>
                        </div>
                        <div className="py-5">
                            <div className="grid grid-cols-2 gap-1">
                                <div className="text-center sm:text-left whitespace-nowrap">
                                    <button type="button"
                                            className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor" className="w-4 h-4 inline-block align-text-top">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                                        </svg>
                                        <span className="inline-block ml-1">Forgot Password</span>
                                    </button>
                                </div>
                                <div className="text-center sm:text-right whitespace-nowrap">
                                    <Link to="/signup">
                                        <button type="button"
                                            className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 stroke="currentColor" className="w-4 h-4 inline-block align-text-bottom	">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                                            </svg>
                                            <span className="inline-block ml-1">
                                                Create Account
                                            </span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}