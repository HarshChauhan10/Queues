import { useContext, useEffect, useState } from "react";
import { InstituteContext } from "../context/IsntituteContext"; // Import the InstituteContext
import { useNavigate } from "react-router-dom";

const CompleteProfilePage = () => {
    const { user, completeProfile, getEmailAndName, getProfileDataWithoutEmailAndName } = useContext(InstituteContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        zipcode: "",
        phonenumber: "",
        type: "",
        streetAddress: "",
        city: "",
        state: "",
        approxTimePerPerson: "",
        startTime: "",
        endTime: "",
    });

    useEffect(() => {
        if (!user) {
            navigate("/"); // Redirect to login if user is not logged in
        }

        const formatDateForInput = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() - offset * 60 * 1000);
            return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
        };

        // Fetch email, name, and other profile data
        const fetchUserData = async () => {
            try {
                const nameEmail = await getEmailAndName();
                const profileData = await getProfileDataWithoutEmailAndName();
                setFormData({
                    ...profileData,
                    zipcode: profileData.zipcode,
                    phonenumber: profileData.phonenumber,
                    type: profileData.type,
                    streetAddress: profileData.streetAddress,
                    city: profileData.city,
                    state: profileData.state,
                    approxTimePerPerson: profileData.approxTimePerPerson,
                    startTime: formatDateForInput(profileData.startTime),
                    endTime: formatDateForInput(profileData.endTime),
                });
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchUserData();
    }, [user, getEmailAndName, getProfileDataWithoutEmailAndName, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData,
                approxTimePerPerson: Number(formData.approxTimePerPerson), // convert to number
            };

            await completeProfile(payload);
            alert("Profile completed successfully!");
            navigate("/dashboard"); // Redirect after completion
        } catch (error) {
            console.error("Error completing profile:", error);
            alert("Error completing profile. Please try again.");
        }
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-6">Complete Your Profile</h1>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg space-y-4">
                {/* Name and Email - Display only */}
                <div className="flex justify-between">
                    <div className="w-full mr-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            value={user?.name || ""}
                            disabled
                            className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>
                </div>

                {/* Address and Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <label className="block text-gray-700">Street Address</label>
                        <input
                            type="text"
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700">State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700">Zipcode</label>
                        <input
                            type="text"
                            name="zipcode"
                            value={formData.zipcode}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            name="phonenumber"
                            value={formData.phonenumber}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700">Type</label>
                        <input
                            type="text"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>
                </div>

                {/* Time-related Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <label className="block text-gray-700">Approx. Time per Person (mins)</label>
                        <input
                            type="number"
                            name="approxTimePerPerson"
                            value={formData.approxTimePerPerson}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700">Start Time</label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-gray-700">End Time</label>
                        <input
                            type="datetime-local"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Complete Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompleteProfilePage;
