import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { FaShareAlt } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { Virtual } from 'swiper';

import spinner from '../assets/images/spinner-color.svg';
import { useCategoryContext } from "../context/CategoryContext";
import ScriptImages from "../components/Dashboard/ScriptImages";
import Loader from "../components/Common/Loader";
import NoDataFound from "./NoDataFound";
import ShareScript from "../components/Helper/ShareScript";
import SingleScript from "../components/Dashboard/SingleScript";

const Dashboard = () => {
  const swiperRef = useRef(null);
  const navigationPrevRef = useRef(null)
  const navigationNextRef = useRef(null)
  const { t } = useTranslation()
  let navigate = useNavigate();
  const [deleteSlug, setDeleteSlug] = useState("")
  const [deletShow, setDeletShow] = useState(false)
  const [shareSlug, setShareSlug] = useState("");
  const { deleteScript, scripts, getAllScripts, filterdScripts, appendScripts, appendFilterScripts, scriptLoader, pagiLoader } = useCategoryContext()
  const [shareModal, setShareModal] = useState(false);

  const showShareModal = () => setShareModal(true)
  const closeShareModal = () => setShareModal(false)
  const handleDeletClose = () => setDeletShow(false);
  const handleDeletShow = () => setDeletShow(true);

  const handleDeleteScript = (slug) => {
    deleteScript(slug)
  }

  useEffect(() => {
    getAllScripts()
  }, [])
  const getIndex = () => {
    appendScripts(swiperRef.current.swiper.realIndex)
  }
  const getFilterIndex = () => {
    appendFilterScripts(swiperRef.current.swiper.realIndex)
  }

  if (scriptLoader) {
    return <Loader />
  }
  if (scripts.length == 0) {
    return <NoDataFound />
  }
  return (
    <>
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={9} className="position-relative">
            <Swiper ref={swiperRef} virtual navigation={{
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
            }} modules={[Navigation, Virtual]} className="banner-slider" >
              {filterdScripts.length == 0 ? scripts.map((script, i) => (
                <SwiperSlide key={i}>
                  <SingleScript {...script} />
                </SwiperSlide>
              )) : filterdScripts.map((script, i) => (
                <SwiperSlide key={i}>
                  <SingleScript {...script} />
                </SwiperSlide>
              ))}
            </Swiper>
            <button onClick={filterdScripts.length == 0 ? getIndex : getFilterIndex} className="slick-arrow slick-next" ref={navigationNextRef}  >
              {pagiLoader ? <img src={spinner} alt="spinner" /> : <BsArrowRight />}
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
