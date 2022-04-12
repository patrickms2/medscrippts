import axios from "axios";
import React, { useState, useContext } from "react";
import swal from "sweetalert";

import { useAuthContext } from "./AuthContext";

const CategoryContext = React.createContext();

const CategoryProvider = ({ children }) => {
  const [scriptLoader, setScriptLoader] = useState(false)
  const { API } = useAuthContext()
  const [page, setPage] = useState(1)
  const [categories, setCategories] = useState([])
  const [scripts, setScripts] = useState([])
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
      if (res.data.success) {
        const newScripts = scripts.filter(script => script.slug != slug)
        setScripts(newScripts)
        swal(res.message, "", "success");
      }
    } catch (err) {
      swal(err.response.data.message, "", "error");
    }
  }
  const getAllScripts = async () => {
    setScriptLoader(true)
    try {
      const res = await axios.get(`${API}/user-scripts?limit=5&page=1`)
      setScripts(res.data.data.data)
      setScriptLoader(false)
    } catch (error) {
      setScriptLoader(false)
    }

  }
  const appendScripts = async (num) => {
    if (scripts.length - 1 == num) {
      setPage(page + 1)
      await axios.get(`${API}/user-scripts?limit=5&page=${page + 1}`)
        .then(res => {
          setScripts([...scripts, ...res.data.data.data])
        })
    }
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
    setFilterdScripts,
    appendScripts,
    scriptLoader
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