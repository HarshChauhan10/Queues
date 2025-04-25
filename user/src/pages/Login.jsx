import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets'; // adjust path if needed
import { UserContext } from '../context/UserContext';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { login, register } = useContext(UserContext);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [currentState, setCurrentState] = useState("LOGIN");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const toggleSignInSignUp = () => {
        setCurrentState((prev) => (prev === "LOGIN" ? "SIGNUP" : "LOGIN"));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentState === "LOGIN") {
            try {
                await login({ email, password });
                toast.success("Login successful!");
                navigate('/complete-profile'); // change to your actual homepage route
            } catch (error) {
                toast.error(error?.response?.data?.error || "Login failed");
            }
        } else {
            try {
                await register({ name, email, password });
                toast.success("Registration successful!");
                navigate('/complete-profile'); // change to your actual homepage route
            } catch (error) {
                toast.error(error?.response?.data?.error || "Registration failed");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center w-full bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-[1400px] flex flex-col lg:flex-row">
                <div className="flex-1">
                    <img
                        src={assets.loginImage}
                        alt="Login"
                        className="w-full max-w-[900px] h-150 object-cover rounded-t-lg lg:rounded-l-lg"
                    />
                </div>

                <div className="flex-1 flex justify-center items-center p-6">
                    <div className="w-full max-w-[700px] bg-white shadow-xl rounded-lg p-8 space-y-6">
                        <h1 className="text-4xl font-semibold text-gray-800 mb-4">QUEUES</h1>
                        <p>{currentState === "LOGIN" ? 'Welcome back to Queues!' : 'Create your Queues account'}</p>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {currentState === "SIGNUP" && (
                                <div>
                                    <label htmlFor="fullName" className="block text-gray-700 mb-1">Full Name</label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full p-2.5 bg-[#F3F4F6] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                                    />
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-2.5 bg-[#F3F4F6] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div className="relative">
                                <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
                                <input
                                    id="password"
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-2.5 bg-[#F3F4F6] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                                />
                                <i
                                    className={`fa-solid ${isPasswordVisible ? "fa-eye" : "fa-eye-slash"} absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 mt-3`}
                                    onClick={togglePasswordVisibility}
                                ></i>
                            </div>

                            <button
                                type="submit"
                                className="w-full p-2.5 bg-gray-700 text-white rounded-xl shadow-md hover:bg-[#333333] transition duration-300"
                            >
                                {currentState === "LOGIN" ? 'Login' : 'Sign Up'}
                            </button>

                            <div className="flex items-center justify-center space-x-2">
                                <hr className="flex-1 border-t-2 border-gray-300" />
                                <span className="text-gray-600">OR</span>
                                <hr className="flex-1 border-t-2 border-gray-300" />
                            </div>

                            <button
                                type="button"
                                className="w-full p-2.5 rounded-xl shadow-md bg-white border hover:bg-gray-100 transition flex items-center justify-center space-x-2"
                            >
                                <img src={assets.googlelogo} alt="Google Logo" className="w-6 h-6" />
                                <span>Login with Google</span>
                            </button>

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
