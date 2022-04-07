import axios from "axios";
import { useState } from "react";
import { Modal } from "react-bootstrap"
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";

import spinner from '../../assets/images/spinner.svg';
import { useAuthContext } from "../../context/AuthContext";
import { useCategoryContext } from "../../context/CategoryContext";

const AddCategory = ({ addShow, handleAddClose }) => {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const { API } = useAuthContext()
  const { register, handleSubmit, reset } = useForm();
  const { getAllCategories } = useCategoryContext();
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isSelected, setIsSelected] = useState("")

  const handleImageChange = (e) => {
    setSelectedFiles([])
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(file => URL.createObjectURL(file))
      setSelectedFiles(prevImages => prevImages.concat(filesArray))
      Array.from(e.target.files).map(
        (file) => URL.revokeObjectURL(file)
      )
    }
    setIsSelected(e.target.files[0])
  }
  const renderPhotos = (source) => {
    return source.map((photo, i) => (
      <div key={i} className="one-img">
        <img src={photo} alt="upload-image" />
      </div>
    ))
  }
  const addCategory = (data) => {
    setLoading(true)
    const formData = new FormData()

    formData.append("name", data.name)
    formData.append("icon", isSelected)

    axios.post(`${API}/insert-category`, formData)
      .then(res => {
        if (res.data.success) {
          setLoading(false)
          getAllCategories()
          handleAddClose()
          setSelectedFiles([])
          reset()
        }
      })
      .catch(err => {
        setLoading(false)
      })
  }
  return (
    <Modal show={addShow} onHide={handleAddClose} centered className="add-category-modal">
      <Modal.Body>
        <h5 className="title">{t("update_category_dialog")}</h5>
        <form onSubmit={handleSubmit(addCategory)}>
          <div className="mb-3">
            <label htmlFor="name" className="label">{t("category")} {t("name")}</label>
            <input className="category-input" type="text" id="name" placeholder="Cardiology" {...register("name")} />
          </div>
          <div>
            <span className="label">{t("icon")}</span>
            <label htmlFor="icon" className="file-upload">
              <span>{t("upload_icon")}</span>
            </label>
            <input onChange={handleImageChange} type="file" id="icon" className="file-input" />
            {renderPhotos(selectedFiles)}
          </div>
          <button className="add">{t("add")} {loading && <img src={spinner} alt="spinner" />}</button>
        </form>
      </Modal.Body>
      <div className="cross-icon" onClick={handleAddClose}>
        <FaTimes />
      </div>
    </Modal>
  )
}

export default AddCategory
