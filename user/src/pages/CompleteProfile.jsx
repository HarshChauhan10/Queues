import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompleteUserProfile = () => {
    const navigate = useNavigate();
    const { getNameAndEmail, completeProfile, updateProfile, user } = useContext(UserContext);

    const [isEditable, setIsEditable] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        gender: "",
        zipcode: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = await getNameAndEmail();
                setFormData((prev) => ({
                    ...prev,
                    name: userInfo.name || "",
                    email: userInfo.email || "",
                    gender: user?.gender || "",
                    zipcode: user?.zipcode || "",
                }));
            } catch (error) {
                console.error("Error loading user data:", error);
            }
        };

        fetchData();
    }, [user]);

    const handleSave = async () => {
        if (!formData.gender || !formData.zipcode) {
            toast.error("Please select gender and enter zipcode.");
            return;
        }

        try {
            if (!user?.gender && !user?.zipcode) {
                await completeProfile(formData);
                toast.success("Profile completed successfully!");
            } else {
                await updateProfile({
                    gender: formData.gender,
                    zipcode: formData.zipcode,
                });
                toast.success("Profile updated successfully!");
            }

            setIsEditable(false);
        } catch (error) {
            toast.error("Failed to save profile.");
        }
    };

    const handleContinue = () => {
        navigate("/find");
    };

    return (
        <div className="max-w-6xl mx-auto ">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-end mb-4">
                    {isEditable ? (
                        <button
                            onClick={handleSave}
                            className="bg-[#23242A] hover:bg-[#2e2f37] text-white py-2 px-4 rounded-lg"
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditable(true)}
                            className="bg-[#23242A] hover:bg-[#2e2f37] text-white py-2 px-4 rounded-lg"
                        >
                            Edit
                        </button>
                    )}
                </div>

                <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                                    value={formData.name}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                                    value={formData.email}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-4">Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gender</label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-md"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    disabled={!isEditable}
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Zipcode</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-md"
                                    value={formData.zipcode}
                                    onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                                    disabled={!isEditable}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleContinue}
                        className="bg-[#23242A] hover:bg-[#2e2f37] text-white py-2 px-6 rounded-lg"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompleteUserProfile;
