import React, { useState } from "react";
import "./Profile.css";
import axios from 'axios';

const Profile = ({ userDetails, setUserDetails }) => {
  
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({ ...userDetails });

  // Handle input changes
  const handleChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Update user details to API
  // Update user details to API
const updateUser = async () => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/update-profile/${userDetails.id}`,
      updatedDetails
    );

    // Check if the response status is 200 or 201 (successful)
    if (response.status === 200 || response.status === 201) {
       // ✅ Use response data to update state
      localStorage.setItem("userDetails", JSON.stringify(response.data)); // ✅ Persist updated data
      setIsEditing(false); // Exit editing mode
      alert("Profile updated successfully!");
    } else {
      alert("Failed to update profile.");
    }
  } catch (error) {
    alert("An error occurred while updating the profile.");
  }
  setUserDetails(updatedDetails);
};
  

  return (
    <div className="profile-container">
      <h2 className="heading">Profile:</h2>
      {isEditing ? (
        <div className="edit">
          <label htmlFor="username">
            Username:
            <input
              type="text"
              name="username"
              value={updatedDetails.username}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="bio">
            Bio:
            <textarea
              name="bio"
              value={updatedDetails.bio}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="dob">
            Date of Birth:
            <input
              type="date"
              name="dob"
              value={updatedDetails.dob}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="gender">
            Gender:
            <select
              name="gender"
              value={updatedDetails.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <button className="saveButton" onClick={updateUser}>Save Changes</button>
<button className="cancelButton" onClick={() => setIsEditing(false)}>Cancel</button>

        </div>
      ) : (
        <div className="profile-card">
          <div className="profile-header">
            <h4>Username:</h4>
            <h2>{userDetails.username}</h2>
          </div>
          <h4>Bio:</h4>
          <p className="bio">{userDetails.bio || "No bio available."}</p>
          <h4>Date of Birth:</h4>
          <p className="dob">{userDetails.dob || "Not provided"}</p>
          <h4 >Gender:</h4>
          <p className="gender">{userDetails.gender || "Not specified"}</p>
          <div className="profile-actions">
            <button className="editButton" onClick={() => setIsEditing(true)}>Edit Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
