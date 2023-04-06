import {useFormik} from "formik";
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

// @ts-ignore
import {AuthContext} from "./contexts/AuthContext";

export function SignUp() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const {user, signup} = useContext(AuthContext);

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: ""
        },
        onSubmit: async (values, {setSubmitting}) => {
            setSubmitting(true);
            const {firstName, lastName, email, username, password} = values;
            const res = await signup(firstName, lastName, email, username, password);
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
        <div>
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Sign Up for an account</h1>
                </div>

                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    {error && <div>{JSON.stringify(error)}</div>}

                    <div className="-space-y-px rounded-md">
                        <input
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            type="text"
                            name="firstName"
                            className="border-gray-300 text-gray-900 placeholder-gray-300 focus:ring-gray-500 focus:border-gray-500 block w-full pr-10 focus:outline-none sm:text-sm rounded-md"
                            placeholder="First Name"
                        />

                        <input
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            type="text"
                            name="lastName"
                            className="border-gray-300 text-gray-900 placeholder-gray-300 focus:ring-gray-500 focus:border-gray-500 block w-full pr-10 focus:outline-none sm:text-sm rounded-md"
                            placeholder="Last Name"
                        />

                        <input
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            type="email"
                            name="email"
                            className="border-gray-300 text-gray-900 placeholder-gray-300 focus:ring-gray-500 focus:border-gray-500 block w-full pr-10 focus:outline-none sm:text-sm rounded-md"
                            placeholder="Email"
                        />


                        <input
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="border-gray-300 text-gray-900 placeholder-gray-300 focus:ring-gray-500 focus:border-gray-500 block w-full pr-10 focus:outline-none sm:text-sm rounded-md"
                        />

                        <input
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            type="password"
                            name="password"
                            className="border-gray-300 text-gray-900 placeholder-gray-300 focus:ring-gray-500 focus:border-gray-500 block w-full pr-10 focus:outline-none sm:text-sm rounded-md"
                            placeholder="Password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    >
                        {formik.isSubmitting ? "Signing up..." : "Create"}
                    </button>
                </form>
            </div>
        </div>
    );
}
