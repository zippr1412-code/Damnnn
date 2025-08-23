import React, { createContext, useState } from "react";
import { EMAILJS } from "../config";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [otpStore, setOtpStore] = useState({});
  const [profileComplete, setProfileComplete] = useState(false);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = async (email) => {
  try {
    const otp = generateOTP();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    setOtpStore(prev => ({
      ...prev,
      [email]: { otp, expiry }
    }));

    const response = await emailjs.send(
      EMAILJS.SERVICE_ID,
      EMAILJS.TEMPLATE_ID,
      {
        to_email: email,
        passcode: otp,
        time: new Date().toLocaleString(),
      },
      EMAILJS.PUBLIC_KEY
    );

    console.log("EmailJS Response:", response); // Add this for debugging
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error.message); // Changed to error.message for better debugging
    return false;
  }
};

  const createUserDocument = async (email) => {
    const userRef = doc(db, "users", email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new user document if it doesn't exist
      await setDoc(userRef, {
        id: email,
        email: email,
        createdAt: new Date(),
        isAnonymous: false,
        seenBy: [],
        lightningAvailable: true,
        preferences: {
          redFlags: [],
          greenFlags: [],
          humorType: ""
        }
      });
    }

    const userData = userSnap.exists() ? userSnap.data() : { email };
    return userData;
  };

  const verifyOTP = async (email, otpInput) => {
    const data = otpStore[email];
    if (!data) return false;

    const { otp, expiry } = data;
    if (Date.now() > expiry) return false;

    if (parseInt(otpInput) === otp) {
      try {
        const userData = await createUserDocument(email);
        setUser(userData);
        setProfileComplete(!!userData.profileCompleted);
        return true;
      } catch (error) {
        console.error("Error creating user document:", error);
        return false;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setOtpStore({});
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      sendOTP, 
      verifyOTP, 
      logout,
      profileComplete,
      loading: false 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Remove useAuth from this file and move it to a new file named useAuth.js