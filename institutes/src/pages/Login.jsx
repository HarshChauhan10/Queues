import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets.js';
import { InstituteContext } from '../context/IsntituteContext';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const { loginInstituteUser, registerInstitute, navigate } = useContext(InstituteContext);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [currentState, setCurrentState] = useState("LOGIN"); // "LOGIN" or "SIGNUP"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    // Toggle between Sign In and Sign Up
    const toggleSignInSignUp = () => {
        setCurrentState((prev) => (prev === "LOGIN" ? "SIGNUP" : "LOGIN"));
    };

    // Handle login
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentState === "LOGIN") {
            try {
                await loginInstituteUser(email, password);
                toast.success("Login successful!");
                navigate('/complete-profile'); // Navigate after login
            } catch (error) {
                toast.error(error.error || "Login failed");
            }
        } else {
            try {
                await registerInstitute(name, email, password);
                toast.success("Registration successful!");
                navigate('/complete-profile'); // Navigate after registration
            } catch (error) {
                toast.error(error.error || "Registration failed");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center w-full bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-[1400px] flex flex-col lg:flex-row">
                {/* Left Side Image */}
                <div className="flex-1">
                    <img
                        src={assets.loginImage}
                        alt="Login"
                        className="w-full max-w-[900px] h-150 object-cover rounded-t-lg lg:rounded-l-lg"
                    />
                </div>

                {/* Right Side Form */}
                <div className="flex-1 flex justify-center items-center p-6">
                    <div className="w-full max-w-[700px] bg-white shadow-xl rounded-lg p-8 space-y-6">
                        <h1 className="text-4xl font-semibold text-gray-800 mb-4">
                            QUEUES
                        </h1>
                        <p>{currentState === "LOGIN" ? 'Welcome back! to Queues' : 'Welcome to Queues'}</p>

                        {/* Form */}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Name Input - Only show when Sign Up */}
                            {currentState === "SIGNUP" && (
                                <div>
                                    <label htmlFor="fullName" className="block text-gray-700 mb-1">Full Name</label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full p-2.5 bg-[#F3F4F6] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-black transition duration-300 ease-in-out transform hover:scale-105"
                                    />
                                </div>
                            )}

                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-2.5 bg-[#F3F4F6] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-black transition duration-300 ease-in-out transform hover:scale-105"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
                                <input
                                    id="password"
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-2.5 bg-[#F3F4F6] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-black transition duration-300 ease-in-out transform hover:scale-105"
                                />
                                <i
                                    className={`fa-solid ${isPasswordVisible ? "fa-eye" : "fa-eye-slash"} absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 mt-3`}
                                    onClick={togglePasswordVisibility}
                                ></i>
                            </div>

                            {/* Login/Register Button */}
                            <button
                                type="submit"
                                className="w-full p-2.5 bg-gray-700 text-white rounded-xl shadow-md hover:bg-[#333333] focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                {currentState === "LOGIN" ? 'Login' : 'Sign Up'}
                            </button>

                            {/* Or Divider with text */}
                            <div className="flex items-center justify-center space-x-2">
                                <hr className="flex-1 border-t-2 border-gray-300" />
                                <span className="text-gray-600">OR</span>
                                <hr className="flex-1 border-t-2 border-gray-300" />
                            </div>

                            {/* Login with Google Button */}
                            <button
                                type="button"
                                className="w-full p-2.5 rounded-xl shadow-md hover:bg-[#F3F4F6] focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
                            >
                                <img src={assets.googlelogo} alt="Google Logo" className="w-6 h-6" />
                                <span>Login with Google</span>
                            </button>

                            {/* Already a user? Sign in text */}
                            <div className="text-center text-sm mt-4">
                                <span className="text-black cursor-pointer" onClick={toggleSignInSignUp}>
                                    {currentState === "LOGIN" ? 'New to Queues?' : 'Already a user?'}
                                </span>
                                <span className="text-gray-600 cursor-pointer ml-1">
                                    {currentState === "LOGIN" ? 'Sign up' : 'Sign in'}
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
