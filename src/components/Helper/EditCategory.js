import axios from "axios";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";

import { useAuthContext } from "../../context/AuthContext";
import { useCategoryContext } from "../../context/CategoryContext";
import ModalLoader from "../Common/ModalLoader";

const EditCategory = ({ slug, updateShow, handleUpdateClose, setSlug }) => {
  const { t } = useTranslation()
  const { API } = useAuthContext()
  const { register, handleSubmit } = useForm();
  const { getAllCategories } = useCategoryContext();
  const [category, setCategory] = useState("")
  const [isSelected, setIsSelected] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  useEffect(() => {
    axios.get(`${API}/view-category/${slug}`)
      .then(res => {
        setCategory(res.data.data)
        setSelectedFiles(res.data.data.icon)
      })
  }, [slug])

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
    if (isSelected) {
      return source.map((photo, i) => (
        <div key={i} className="one-img">
          <img src={photo.path ? photo.path : photo} alt="upload-image" />
        </div>))
    } else {
      return <div className="one-img">
        <img src={source} alt="upload-image" />
      </div>
    }

  }
  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append("name", data.name)
    if (isSelected) {
      formData.append("icon", isSelected)
    }

    axios.post(`${API}/update-category/${slug}`, formData)
      .then(res => {
        if (res.data.success) {
          getAllCategories()
          handleUpdateClose()
        }
      })
      .catch(err => console.log(err.response.data))
  }
  return (
    <Modal show={updateShow} onHide={() => {
      handleUpdateClose()
      setSlug("")
    }} centered className="add-category-modal">
      <Modal.Body>
        <h5 className="title"> {t("update_category_dialog")} </h5>
        {category ? <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="name" className="label">{t("category")} {t("name")}</label>
            <input className="category-input" type="text" id="name" {...register("name")} defaultValue={category.category_name} />
          </div>
          <div>
            <span className="label">{t("icon")}</span>
            <label htmlFor="icon" className="file-upload">
              <span>{t("upload_icon")}</span>
            </label>
            <input onChange={handleImageChange} type="file" id="icon" className="file-input" />
            {renderPhotos(selectedFiles)}
          </div>
          <button className="add">{t("update")}</button>
        </form> : <ModalLoader />}
      </Modal.Body>
      <div className="cross-icon" onClick={() => {
        handleUpdateClose()
        setSlug("")
      }}>
        <FaTimes />
      </div>
    </Modal>
  )
}

export default EditCategory
