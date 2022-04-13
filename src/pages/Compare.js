import axios from "axios";
import moment from "moment";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useEffect } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import { Virtual } from 'swiper';

import spinner from '../assets/images/spinner-color.svg';
import Loader from "../components/Common/Loader";
import ScriptImages from "../components/Dashboard/ScriptImages";
import { useAuthContext } from "../context/AuthContext";
import NoDataFound from "./NoDataFound";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { FaShareAlt } from "react-icons/fa";
import ShareScript from "../components/Helper/ShareScript";
import Highlighter from "react-highlight-words";

const Compare = () => {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const swiperRef = useRef(null);
  const { t } = useTranslation()
  const navigationPrevRef = useRef(null)
  const navigationNextRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true);
  const { API } = useAuthContext()
  const [scripts, setScripts] = useState([])
  const params = useParams();
  const [deleteSlug, setDeleteSlug] = useState("")
  const navigate = useNavigate()
  const [shareSlug, setShareSlug] = useState("");
  const [shareModal, setShareModal] = useState(false);

  const showShareModal = () => setShareModal(true)
  const closeShareModal = () => setShareModal(false)
  const [deletShow, setDeletShow] = useState(false)
  const handleDeletClose = () => setDeletShow(false);
  const handleDeletShow = () => setDeletShow(true);

  const handleClick = (e, id) => {
    if (localStorage.getItem(id)) {
      e.currentTarget.classList.toggle("blur")
    }
  }

  const handleDeleteScript = async (slug) => {
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
  const getScript = async () => {
    try {
      const res = await axios.get(`${API}/compare/page/${params.keyword}?cat_slug=${params.slug}&limit=5&page=1`)
      setScripts(res.data.data.data)
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
    }
  }
  const getIndex = async () => {
    if (scripts.length - 1 == swiperRef.current.swiper.realIndex) {
      setLoading(true)
      setPage(page + 1)
      await axios.get(`${API}/compare/page/${params.keyword}?cat_slug=${params.slug}&limit=5&page=${page + 1}`)
        .then(res => {
          setLoading(false)
          setScripts([...scripts, ...res.data.data.data])
        })
    }
  }
  useEffect(() => {
    getScript()
  }, [params.slug, params.keyword])

  if (isLoading) {
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
            }} modules={[Navigation, Virtual]} className="banner-slider">
              {scripts.map(({ id, title, images, pathophysiology, epidemiology, symptoms, diagnostics, treatments, slug, updated_at, useful_links, views }) => (<SwiperSlide key={id}>
                <div className="scripts-details">
                  <Row className="align-items-center">
                    <Col md={8}>
                      <div className="details-left">
                        <h2 className="title">
                          <Highlighter
                            highlightClassName="highlight-text"
                            searchWords={[params.keyword]}
                            autoEscape={false}
                            textToHighlight={title}
                          />
                        </h2>
                        <div className="details">
                          <div>
                            <p className="text">
                              <span className="strong">{t("path")}</span>
                              <span onClick={(e) => handleClick(e, "patho")} className={`patho normal ${localStorage.getItem("patho") ? "blur" : ""}`}>
                                <Highlighter
                                  highlightClassName="highlight-text"
                                  searchWords={[params.keyword]}
                                  autoEscape={false}
                                  textToHighlight={pathophysiology}
                                />
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text">
                              <span className="strong">{t("epi")}</span >
                              <span onClick={(e) => handleClick(e, "epide")} className={`epide normal ${localStorage.getItem("epide") ? "blur" : ""}`}>
                                <Highlighter
                                  highlightClassName="highlight-text"
                                  searchWords={[params.keyword]}
                                  autoEscape={false}
                                  textToHighlight={epidemiology}
                                />
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text">
                              <span className="strong">{t("ss")}</span>
                              <span onClick={(e) => handleClick(e, "symp")} className={`symp normal ${localStorage.getItem("symp") ? "blur" : ""}`}>
                                <Highlighter
                                  highlightClassName="highlight-text"
                                  searchWords={[params.keyword]}
                                  autoEscape={false}
                                  textToHighlight={symptoms}
                                />
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text">
                              <span className="strong">{t("dx")}</span>
                              <span onClick={(e) => handleClick(e, "diagn")} className={`diagn normal ${localStorage.getItem("diagn") ? "blur" : ""}`}>
                                <Highlighter
                                  highlightClassName="highlight-text"
                                  searchWords={[params.keyword]}
                                  autoEscape={false}
                                  textToHighlight={diagnostics}
                                />
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text">
                              <span className="strong">{t("tx")}</span>
                              <span onClick={(e) => handleClick(e, "treat")} className={`treat normal ${localStorage.getItem("treat") ? "blur" : ""}`}>
                                <Highlighter
                                  highlightClassName="highlight-text"
                                  searchWords={[params.keyword]}
                                  autoEscape={false}
                                  textToHighlight={treatments}
                                />
                              </span>
                            </p>
                          </div>
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
              </SwiperSlide>))}
            </Swiper>
            <button onClick={getIndex} className="slick-arrow slick-next" ref={navigationNextRef}>
              {loading ? <img src={spinner} alt="spinner" /> : <BsArrowRight />}
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

export default Compare;
