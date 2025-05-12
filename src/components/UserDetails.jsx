import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserDetails.css";

const UserDetails = ({ setUserDetails }) => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    username: "",
    password: "",
    dob: "",
    gender: "",
    bio: "",
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("OTP Verified State Changed:", otpVerified);
  }, [otpVerified]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear error when user starts typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const sendOtp = async () => {
  try {
    // Check if email already exists
    const checkResponse = await axios.get(
      `http://localhost:8080/api/check-email/${formData.email}`
    );

    if (checkResponse.data.exists) {
      alert("Email already registered. Please log in.");
      return; // Stop further execution
    }

    // Send OTP if email does not exist
    const response = await axios.post(
      `http://localhost:8080/api/send-otp/${formData.email}`
    );
    alert(response.data);
    setOtpSent(true);
  } catch (error) {
    console.error("Error sending OTP:", error);
    alert("Failed to send OTP. Please try again.");
  }
};


  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/verify-otp/${formData.email}/${formData.otp}`
      );
      alert(response.data);

      if (response.data === "OTP verified successfully") {
        setOtpVerified(true);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.otp.trim()) newErrors.otp = "OTP is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:8080/api/save", formData);
      alert("Profile saved successfully!");

      // Save to local storage
      localStorage.setItem("userDetails", JSON.stringify(response.data));

      // Update state
      setUserDetails(response.data);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user. Please try again.");
    }
  };

  return (
    <div className="user-details-container">
      {!otpVerified ? (
        <div className="user-details-box">
          <h2>Verification</h2>
          <form>
            <div className="user-details-group">
              <label>Email:</label>
              <input
                placeholder="Enter your email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            {otpSent && (
              <div className="user-details-group">
                <label>Enter OTP:</label>
                <input
                placeholder="Enter OTP"
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
                {errors.otp && <p className="error">{errors.otp}</p>}
              </div>
            )}

            <div className="user-details-button-group">
              {!otpSent ? (
                <button
                  type="button"
                  className="user-details-btn user-details-send-btn"
                  onClick={sendOtp}
                >
                  Send OTP
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="user-details-btn user-details-verify-btn"
                    onClick={verifyOtp}
                  >
                    Verify OTP
                  </button>
                  <button
                    type="button"
                    className="user-details-btn user-details-send-btn"
                    onClick={sendOtp}
                  >
                    Resend OTP
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="user-details-box">
          <h2>Complete Your Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && <p className="error">{errors.username}</p>}
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <div className="input-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>

            <button className="save" type="submit">Save</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
