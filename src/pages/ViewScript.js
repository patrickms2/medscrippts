import axios from "axios";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaShareAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import Loader from "../components/Common/Loader";

import ScriptImages from "../components/Dashboard/ScriptImages";
import ShareScript from "../components/Helper/ShareScript";
import { useAuthContext } from "../context/AuthContext";
import { useCategoryContext } from "../context/CategoryContext";
import Error from "./Error";

const ViewScript = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { t } = useTranslation()
  const { deleteScript, getAllScripts } = useCategoryContext()
  const { API } = useAuthContext()
  const [script, setScript] = useState([])
  const navigate = useNavigate();
  const params = useParams();
  const [deletShow, setDeletShow] = useState(false)
  const handleDeletClose = () => setDeletShow(false);
  const handleDeletShow = () => setDeletShow(true);
  const [shareSlug, setShareSlug] = useState("");
  const [shareModal, setShareModal] = useState(false);

  const showShareModal = () => setShareModal(true)
  const closeShareModal = () => setShareModal(false)

  const handleDeleteScript = () => {
    deleteScript(params.slug)
    navigate("/")
  }
  const handleClick = (e, id) => {
    if (localStorage.getItem(id)) {
      e.target.classList.toggle("blur")
    }
  }
  const getScript = async () => {
    try {
      const res = await axios.get(`${API}/view-script/${params.slug}`)
      setScript(res.data.data)
      setIsLoading(false)
      setIsError(false)
    } catch (err) {
      setIsError(true)
      setIsLoading(false)
    }
  }
  useEffect(() => {
    getScript()
  }, [params.slug])

  if (isLoading) {
    return <Loader />
  }
  if (isError) {
    return <Error height={true} />
  }
  const { title, images, pathophysiology, symptoms, diagnostics, epidemiology, treatments, useful_links, views, updated_at, slug } = script
  return (
    <>
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={9}>
            <div className="scripts-details">
              <Row className="align-items-center">
                <Col md={8}>
                  <div className="details-left">
                    <h2 className="title">{title}</h2>
                    <div>
                      <p className="text"><span>{t("path")}</span> <span onClick={(e) => handleClick(e, "patho")} className={`patho normal ${localStorage.getItem("patho") ? "blur" : ""}`}>{pathophysiology}</span> </p>
                    </div>
                    <div>
                      <p className="text"><span>{t("epi")}</span> <span onClick={(e) => handleClick(e, "epide")} className={`epide normal ${localStorage.getItem("epide") ? "blur" : ""}`}>{epidemiology}</span> </p>
                    </div>
                    <div>
                      <p className="text"><span>{t("ss")}</span> <span onClick={(e) => handleClick(e, "symp")} className={`symp normal ${localStorage.getItem("symp") ? "blur" : ""}`}>{symptoms}</span> </p>
                    </div>
                    <div>
                      <p className="text"><span>{t("dx")}</span> <span onClick={(e) => handleClick(e, "diagn")} className={`diagn normal ${localStorage.getItem("diagn") ? "blur" : ""}`}>{diagnostics}</span></p>
                    </div>
                    <div>
                      <p className="text"><span>{t("tx")}</span> <span onClick={(e) => handleClick(e, "treat")} className={`treat normal ${localStorage.getItem("treat") ? "blur" : ""}`}> {treatments}</span></p>
                    </div>

                    <div className="details-links">
                      <h3 className="title">{t("links")}</h3>
                      <div className="link">
                        <a href={`http://${useful_links[0]?.link}`} target="_blank" rel="noopener noreferrer">{useful_links[0]?.link}</a>
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
                <Col md={6}>
                  <button className="single-btn view">{views} <span>{t("view")}</span></button>
                  <button className="single-btn date">{moment(updated_at).format("DD-MM-Y")} <span>{t("last_updated")}</span></button>
                </Col>
                <Col md={6}>
                  <div className="text-end">
                    <button onClick={() => navigate(`/edit-script/${slug}`)} className="color-btn edit">{t("edit")}</button>
                    <button onClick={handleDeletShow} className="color-btn delete">{t("delete")}</button>
                  </div>

                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={deletShow} onHide={handleDeletClose} centered>
        <Modal.Body className="text-center">
          <p>{t("delete_text")}</p>
          <Button onClick={handleDeletClose} className="me-3">NO</Button>
          <Button variant="danger" onClick={() => {
            handleDeleteScript()
            handleDeletClose()
          }}>{t("yes")}</Button>
        </Modal.Body>
      </Modal>
      <ShareScript shareModal={shareModal} closeShareModal={closeShareModal} shareSlug={shareSlug} />
    </>
  )
}

export default ViewScript
