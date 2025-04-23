import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { InstituteContext } from "../context/IsntituteContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const {
    showdataEmailName,
    completeProfile,
    showDataExceptEmailName,
    updateProfileExceptEmailName
  } = useContext(InstituteContext);

  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    streetAddress: "",
    city: "",
    state: "",
    zipcode: "",
    type: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await showdataEmailName();
        if (userData?.user) {
          setFormData((prevData) => ({
            ...prevData,
            name: userData.user.name || "",
            email: userData.user.email || "",
          }));
        }

        const userDetails = await showDataExceptEmailName();
        if (userDetails) {
          setFormData((prevData) => ({
            ...prevData,
            phonenumber: userDetails.phonenumber || "",
            streetAddress: userDetails.streetAddress || "",
            city: userDetails.city || "",
            state: userDetails.state || "",
            zipcode: userDetails.zipcode || "",
            type: userDetails.type || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authentication failed. Please log in again.");
        return;
      }

      if (!formData.phonenumber || !formData.streetAddress || !formData.city || !formData.state || !formData.zipcode || !formData.type) {
        toast.error("Please fill out all fields.");
        return;
      }

      if (!formData.name || !formData.email) {
        await completeProfile(
          formData.streetAddress,
          formData.zipcode,
          formData.phonenumber,
          formData.type,
          formData.city,
          formData.state,
          token
        );
        toast.success("Profile completed successfully!");
      } else {
        await updateProfileExceptEmailName({
          phonenumber: formData.phonenumber,
          streetAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
          type: formData.type,
        });
        toast.success("Profile updated successfully!");
      }

      setIsEditable(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleContinue = () => {
    navigate("/queue"); // Change this route to match your actual next page route
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-end mb-4">
          {isEditable ? (
            <button onClick={handleSave} className="bg-[#23242A] hover:bg-[#2e2f37] text-white py-2 px-4 rounded-lg">
              Save
            </button>
          ) : (
            <button onClick={() => setIsEditable(true)} className="bg-[#23242A] hover:bg-[#2e2f37] text-white py-2 px-4 rounded-lg">
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
                <input type="text" className="w-full p-3 border border-gray-300 rounded-md bg-gray-100" value={formData.name} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="w-full p-3 border border-gray-300 rounded-md bg-gray-100" value={formData.email} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={formData.phonenumber}
                  onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
                  disabled={!isEditable}
                />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4">Address Information</h2>
            <div className="space-y-4">
              {['streetAddress', 'city', 'state', 'zipcode'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    disabled={!isEditable}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Type</h2>
          <hr className="border-gray-300 mb-4" />
          <input
            className="w-full p-3 border border-gray-300 rounded-md"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            disabled={!isEditable}
          />
        </div>

        {/* New Continue Button */}
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

export default CompleteProfile;
