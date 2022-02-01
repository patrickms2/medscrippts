import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Outlet } from 'react-router-dom';
import { Button, Modal } from "react-bootstrap";
import swal from "sweetalert";
import axios from "axios";

import { useCategoryContext } from "../../context/CategoryContext";
import CategoryModal from "../Dashboard/CategoryModal";
import Header from "./Header"
import Sidebar from "./Sidebar"
import editIcon from '../../assets/images/icons/edit2.png';
import deleteIcon from '../../assets/images/icons/delete.png';
import { useAuthContext } from "../../context/AuthContext";
import AddCategory from "../Helper/AddCategory";
import EditCategory from "../Helper/EditCategory";

const Layout = () => {
  const [slug, setSlug] = useState("")
  const { API } = useAuthContext()
  const [categoreName, setcategoreName] = useState('');
  const { categories, getAllCategories } = useCategoryContext()
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [show, setShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false)
  const [addShow, setAddShow] = useState(false)
  const [updateShow, setUpdateShow] = useState(false)

  const handleUpdateShow = () => setUpdateShow(true)
  const handleUpdateClose = () => setUpdateShow(false)
  const handleAddShow = () => setAddShow(true)
  const handleAddClose = () => setAddShow(false)
  const handleDeleteClose = () => setDeleteShow(false)
  const handleDeleteShow = () => setDeleteShow(true)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const toggleSidebar = () => {
    setShowLeftSidebar(!showLeftSidebar)
  }

  const dleteCategory = async () => {
    try {
      await axios.get(`${API}/delete-category/${slug}`)
      getAllCategories()
      handleDeleteClose()
    } catch (err) {
      handleDeleteClose()
      swal(err.response.data.message, "", "error");
    }
  }

  useEffect(() => {
    getAllCategories()
  }, [])

  return (
    <>
      <Sidebar showLeftSidebar={showLeftSidebar} setShowLeftSidebar={setShowLeftSidebar} />
      <Header showLeftSidebar={showLeftSidebar} setShowLeftSidebar={setShowLeftSidebar} toggleSidebar={toggleSidebar} />
      <main className={`main-content ${showLeftSidebar ? "left-margin" : ""}`}>
        <Outlet />
      </main>

      {/* <div className="sidebar-btn">
        <button onClick={() => setShowSidebar(true)}><FaChevronLeft /></button>
      </div>
      <div className={`category-sidebar ${showSidebar ? "show-sidebar" : ""}`}>
        <div className="category-sidebar-top">
          <h3 onClick={() => setShowSidebar(false)}> <FaChevronLeft className="icon" /> {t("category_title")}</h3>

          <div className="categories-title">
            {categories.map(({ id, name, icon, slug }) => (
              <div key={id} className="categorie">
                <div onClick={() => {
                  setSlug(slug)
                  handleShow()
                  setcategoreName(name)
                }} className="left">
                  <div className="img">
                    <img src={icon} alt="icon" />
                  </div>
                  <span>{name}</span>
                </div>
                <div className="right">
                  <img onClick={() => {
                    setSlug(slug)
                    handleUpdateShow()
                  }} src={editIcon} alt="edit" />
                  <img onClick={() => {
                    setSlug(slug)
                    handleDeleteShow()
                  }} src={deleteIcon} alt="delete" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <button onClick={handleAddShow} className="add-category">{t("add_category")}</button>
        </div>
      </div>

      <Modal show={deleteShow} onHide={() => {
        handleDeleteClose()
        setSlug("")
      }} centered>
        <Modal.Body className="text-center">
          <p>{t("delete_text")}</p>
          <Button onClick={() => {
            handleDeleteClose()
            setSlug("")
          }} className="me-3">NO</Button>
          <Button onClick={() => {
            dleteCategory()
            setSlug("")
          }} variant="danger">{t("yes")}</Button>
        </Modal.Body>
      </Modal>
      <AddCategory addShow={addShow} handleAddClose={handleAddClose} />
      {slug && <CategoryModal show={show} handleClose={handleClose} slug={slug} setSlug={setSlug} categoreName={categoreName} />}

      {slug && <EditCategory slug={slug} setSlug={setSlug} updateShow={updateShow} handleUpdateClose={handleUpdateClose} />} */}
    </>
  )
}

export default Layout
