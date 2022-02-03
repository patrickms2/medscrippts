import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import swal from "sweetalert";
import { useCategoryContext } from "../context/CategoryContext";
import ScriptImages from "../components/Dashboard/ScriptImages";
import { useTranslation } from "react-i18next";
import Loader from "../components/Common/Loader";
import { FaShareAlt, FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../context/AuthContext";
import NoDataFound from "./NoDataFound";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import ShareScript from "../components/Helper/ShareScript";
function SampleNextArrow(props) {
  const { className, onClick } = props;
  return (
    <button className={className} onClick={onClick}>
      <BsArrowRight />
    </button>
  );
}
function SamplePrevArrow(props) {
  const { className, onClick } = props;
  return (
    <button className={className} onClick={onClick} >
      <BsArrowLeft />
    </button>
  );
}
const Dashboard = () => {
  const navigationPrevRef = useRef(null)
  const navigationNextRef = useRef(null)
  const { t } = useTranslation()
  let navigate = useNavigate();
  const [deleteSlug, setDeleteSlug] = useState("")
  const [shareSlug, setShareSlug] = useState("");
  const { deleteScript, scripts, getAllScripts, filterdScripts } = useCategoryContext()
  const [shareModal, setShareModal] = useState(false);

  const showShareModal = () => setShareModal(true)
  const closeShareModal = () => setShareModal(false)
  const [deletShow, setDeletShow] = useState(false)
  const handleDeletClose = () => setDeletShow(false);
  const handleDeletShow = () => setDeletShow(true);

  const settingsTwo = {
    dots: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
  };
  const handleDeleteScript = async (slug) => {

    const res = await deleteScript(slug)
    if (res.success) {
      swal(res.message, "", "success");
      getAllScripts()
    } else {
      swal(res.message, "", "error");
    }
  }

  const handleClick = (e, id) => {
    if (localStorage.getItem(id)) {
      e.target.classList.toggle("blur")
    }
  }

  if (!scripts) {
    return <Loader />
  }
  if (scripts.length == 0) {
    return <NoDataFound />
  }
  console.log(filterdScripts.length)

  return (
    <>
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={9} className="position-relative">
            <Swiper navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }} onBeforeInit={swiper => {
              // Delay execution for the refs to be defined
              setTimeout(() => {
                // Override prevEl & nextEl now that refs are defined
                swiper.params.navigation.prevEl = navigationPrevRef.current
                swiper.params.navigation.nextEl = navigationNextRef.current

                // Re-init navigation
                swiper.navigation.destroy()
                swiper.navigation.init()
                swiper.navigation.update()
              })
            }} modules={[Navigation]} loop={true} className="banner-slider" >
              {filterdScripts.length == 0 ? scripts.slice(0, 15).map(({ id, title, images, pathophysiology, epidemiology, symptoms, diagnostics, treatments, slug, created_at, useful_links, views }) => (<SwiperSlide key={id}>
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
                          <input type="text" defaultValue={useful_links[0].link} />
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
                      <button className="single-btn date">{moment.unix(created_at).format("DD-MM-Y")} <span>{t("last_updated")}</span></button>
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
              </SwiperSlide>)) : filterdScripts.slice(0, 15).map(({ id, title, images, pathophysiology, epidemiology, symptoms, diagnostics, treatments, slug, created_at, useful_links, views }) => (<SwiperSlide key={id}>
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
                          <input type="text" defaultValue={useful_links[0].link} />
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
                      <button className="single-btn date">{moment.unix(created_at).format("DD-MM-Y")} <span>{t("last_updated")}</span></button>
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
              </SwiperSlide>))}

            </Swiper>
            <button className="slick-arrow slick-next" ref={navigationNextRef}  >
              <BsArrowRight />
            </button>
            <button className="slick-arrow slick-prev" ref={navigationPrevRef} >
              <BsArrowLeft />
            </button>
          </Col>
        </Row>
      </Container>

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

export default Dashboard
