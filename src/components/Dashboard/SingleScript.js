import { Button, Col, Modal, Row } from "react-bootstrap"
import moment from "moment";
import { FaShareAlt } from "react-icons/fa";
import ScriptImages from "./ScriptImages"
import { useTranslation } from "react-i18next";
import { useCategoryContext } from "../../context/CategoryContext";
import { useEffect, useState } from "react";
import ShareScript from "../Helper/ShareScript";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";

const SingleScript = ({ id, title, images, pathophysiology, epidemiology, symptoms, diagnostics, treatments, slug, updated_at, useful_links, views }) => {
  const { API } = useAuthContext()
  const [deleteSlug, setDeleteSlug] = useState("")
  const { t } = useTranslation()
  let navigate = useNavigate();
  const [deletShow, setDeletShow] = useState(false)
  const [shareSlug, setShareSlug] = useState("");
  const [shareModal, setShareModal] = useState(false);
  const { deleteScript } = useCategoryContext()

  const handleDeletClose = () => setDeletShow(false);
  const handleDeletShow = () => setDeletShow(true);
  const showShareModal = () => setShareModal(true)
  const closeShareModal = () => setShareModal(false)
  const handleDeleteScript = (slug) => {
    deleteScript(slug)
  }
  const handleClick = (e, id) => {
    if (localStorage.getItem(id)) {
      e.target.classList.toggle("blur")
    }
  }
  useEffect(() => {
    axios.get(`${API}/view-script/${slug}`)
  }, [slug])

  return (<>
    <div className="scripts-details">
      <Row className="align-items-center">
        <Col md={8}>
          <div className="details-left">
            <h2 className="title">{title}</h2>
            <div className="details">
              <div>
                <p className="text"><span className="strong">{t("path")}</span><span onClick={(e) => handleClick(e, "patho")} className={`patho normal ${localStorage.getItem("patho") ? "blur" : ""}`}>{pathophysiology}</span> </p>
              </div>
              <div>
                <p className="text"><span className="strong">{t("epi")}</span ><span onClick={(e) => handleClick(e, "epide")} className={`epide normal ${localStorage.getItem("epide") ? "blur" : ""}`}>{epidemiology}</span> </p>
              </div>
              <div>
                <p className="text">
                  <span className="strong">{t("ss")}</span>
                  <span onClick={(e) => handleClick(e, "symp")} className={`symp normal ${localStorage.getItem("symp") ? "blur" : ""}`}>{symptoms}</span>
                </p>
              </div>
              <div>
                <p className="text">
                  <span className="strong">{t("dx")}</span>
                  <span onClick={(e) => handleClick(e, "diagn")} className={`diagn normal ${localStorage.getItem("diagn") ? "blur" : ""}`}>{diagnostics}</span>
                </p>
              </div>
              <div>
                <p className="text">
                  <span className="strong">{t("tx")}</span>
                  <span onClick={(e) => handleClick(e, "treat")} className={`treat normal ${localStorage.getItem("treat") ? "blur" : ""}`}>{treatments}</span> </p>
              </div>
            </div>
            <div className="details-links">
              <h3 className="title">{t("links")}</h3>
              <div className="link">
                <a href={`${useful_links[0]?.link}`} target="_blank" rel="noopener noreferrer">{useful_links[0]?.link}</a>
              </div>
            </div>
            <div className="share">
              <FaShareAlt onClick={() => {
                showShareModal()
                setShareSlug(slug)
              }} />
            </div>
          </div>
        </Col>
        <Col md={4}>
          <ScriptImages images={images} />
        </Col>
      </Row>
    </div>
    <div className="btns-area">
      <Row>
        <Col md={7} className="mb-4 mb-md-0">
          <button className="single-btn view">{views} <span>{t("view")}</span></button>
          <button className="single-btn date">{moment.unix(updated_at).format("DD-MM-Y")} <span>{t("last_updated")}</span></button>
        </Col>
        <Col md={5}>
          <div className="text-end">
            <button onClick={() => navigate(`/edit-script/${slug}`)} className="color-btn edit">{t("edit")}</button>
            <button onClick={() => {
              handleDeletShow()
              setDeleteSlug(slug)
            }} className="color-btn delete">{t("delete")}</button>
          </div>
        </Col>
      </Row>
    </div>

    <Modal show={deletShow} onHide={handleDeletClose} centered>
      <Modal.Body className="text-center">
        <p>{t("delete_text")}</p>
        <Button onClick={handleDeletClose} className="me-3">NO</Button>
        <Button variant="danger" onClick={() => {
          handleDeleteScript(deleteSlug)
          handleDeletClose()
        }}>{t("yes")}</Button>
      </Modal.Body>
    </Modal>
    <ShareScript shareModal={shareModal} closeShareModal={closeShareModal} shareSlug={shareSlug} />
  </>
  )
}

export default SingleScript;