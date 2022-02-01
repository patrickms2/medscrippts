import axios from "axios";
import React, { useState, useContext } from "react";

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [API, setAPI] = useState(localStorage.getItem("API") ? localStorage.getItem("API") : "https://medscrippts-app.zainiklab.com/api/en/v1")

  const signup = async (data) => {
    try {
      const res = await axios.post(`${API}/signup`, data)
      return res.data
    } catch (err) {
      return err.response.data
    }
  };
  const signin = async (data) => {
    try {
      const res = await axios.post(`${API}/signin`, data)
      localStorage.setItem('authToken', res.data.data.token);
      localStorage.setItem('authUser', JSON.stringify(res.data.data))
      return res.data
    } catch (err) {
      return err.response.data
    }
  };
  const googleSignin = async (data) => {
    try {
      const res = await axios.post(`${API}/auth/google/callback`, data)
      localStorage.setItem('authToken', res.data.data.token);
      localStorage.setItem('authUser', JSON.stringify(res.data.data))
      return res.data
    } catch (err) {
      return err.response.data
    }
  };
  const logout = async () => {
    try {
      const res = await axios.get(`${API}/logout`)
      localStorage.removeItem('authToken')
      localStorage.removeItem("authUser")
      return res.data
    } catch (err) {
      return err.response.data
    }
  };
  const forgotPassword = async (data) => {
    try {
      const res = await axios.post(`${API}/forget-password`, data)
      return res.data
    } catch (err) {
      return err.response.data
    }
  }
  const resetPassword = async (data) => {
    try {
      const res = await axios.post(`${API}/reset-password`, data)
      return res.data
    } catch (err) {
      return err.response.data
    }
  };
  const changePassword = async (data) => {
    try {
      const res = await axios.post(`${API}/change-password`, data)
      return res.data
    } catch (err) {
      return err.response.data
    }
  };
  const updateUser = async (data) => {
    try {
      const res = await axios.post(`${API}/account-settings`, data)
      localStorage.setItem('authUser', JSON.stringify(res.data.data))
      return res.data
    } catch (err) {
      return err.response.data
    }
  };

  const value = {
    signup,
    signin,
    googleSignin,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser,
    API,
    setAPI
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
// make sure use
export const useAuthContext = () => {
  return useContext(AuthContext);
};

export { AuthProvider };