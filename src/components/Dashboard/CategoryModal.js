import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../context/AuthContext";
import ModalLoader from "../Common/ModalLoader";

const CategoryModal = ({ show, handleClose, slug, setSlug, categoreName }) => {
  const { API } = useAuthContext()
  const [scripts, setScripts] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${API}/find-script-by-category/${slug}`)
      .then(res => {
        setScripts(res.data.data)
      })
  }, [slug])
  return (
    <Modal className="category-modal" show={show} onHide={() => {
      handleClose()
      setSlug("")
    }} centered>
      <Modal.Body>
        <h3 className="text-center mt-3 mb-4">{categoreName}</h3>
        {scripts ? scripts.map(({ id, title, category, created_at, slug }) => {
          const date = moment.unix(created_at);
          return <div onClick={() => {
            handleClose()
            setSlug("")
            navigate(`/view-script/${slug}`)
          }} key={id} className="modal-single-cate">
            <div className="top">
              <span className="sub">{category}</span>
              <h3 className="title">{title}</h3>
            </div>
            <div className="dates">
              <span className="date">{moment(date).format("D MMM, Y")}</span>
            </div>
          </div>
        }) : <ModalLoader />}
      </Modal.Body>
      <div className="cross-icon" onClick={() => {
        handleClose()
        setSlug("")
      }}>
        <FaTimes />
      </div>
    </Modal>
  )
}

export default CategoryModal;
