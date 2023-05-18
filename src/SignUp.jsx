import React from 'react'
import { signInWithPopup, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, linkWithCredential, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";

import { auth } from './FirebaseConfig';

function Auth() {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [displayName, setUsername] = React.useState("");

    const handleLogin = () => {
        if (!email || !password || !displayName) {
            alert("Please enter all data")
            setError("Please enter all data");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            alert("Please enter a valid email address");
            setError("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            alert("Please enter a password with at least 6 characters");
            setError("Please enter a password with at least 6 characters");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password).then(async (res) => {
            try {
               const newTodoObj = {

               }
                const docRef = await addDoc(collection(db, 'TODOLISTUsers'), newTodoObj);
            } catch (error) {
                setError(error)
            }

        }).catch((err) => console.log(err))

    };

    return (
        <div style={{ width: "98vw" }} class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div
                class="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1"
            >
                <div class="flex-1 bg-indigo-100 text-center hidden lg:flex">
                    <div
                        class="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')" }}
                    ></div>
                </div>
                <div class="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">

                    <div class="mt-12 flex flex-col items-center">

                        <div class="w-full flex-1 mt-8">

                            <div class="mx-auto max-w-xs">
                                <input
                                    class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="email"
                                    placeholder="Email"
                                />
                                <input
                                    class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    type="password"
                                    placeholder="Password"
                                />
                                <button
                                    class="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                >
                                    <svg
                                        class="w-6 h-6 -ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <path d="M20 8v6M23 11h-6" />
                                    </svg>
                                    <span class="ml-3">
                                        Sign Up
                                    </span>
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Auth