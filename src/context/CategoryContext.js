import axios from "axios";
import React, { useState, useContext } from "react";

import { useAuthContext } from "./AuthContext";

const CategoryContext = React.createContext();

const CategoryProvider = ({ children }) => {
  const { API } = useAuthContext()
  const [categories, setCategories] = useState([])
  const [scripts, setScripts] = useState("")
  const [filterdScripts, setFilterdScripts] = useState([]);

  const addScript = async (data) => {
    try {
      const res = await axios.post(`${API}/insert-script`, data)
      return res.data
    } catch (err) {
      return err.response.data
    }
  }
  const editScript = async (data, slug) => {
    try {
      const res = await axios.post(`${API}/update-script/${slug}`, data)
      return res.data
    } catch (err) {
      return err.response.data
    }
  }
  const deleteScript = async (slug) => {
    try {
      const res = await axios.get(`${API}/delete-script/${slug}`)
      return res.data
    } catch (err) {
      return err.response.data
    }
  }
  const getAllScripts = () => {
    axios.get(`${API}/user-scripts`)
      .then(res => setScripts(res.data.data))
  }
  const getAllCategories = async () => {
    const res = await axios.get(`${API}/all-categories`)
    setCategories(res.data.data)
  }

  const value = {
    categories,
    addScript,
    editScript,
    deleteScript,
    scripts,
    getAllScripts,
    getAllCategories,
    filterdScripts,
    setFilterdScripts
  };
  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
// make sure use
export const useCategoryContext = () => {
  return useContext(CategoryContext);
};

export { CategoryProvider };