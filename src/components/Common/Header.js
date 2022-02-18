import { useEffect, useState } from "react";
import { Accordion, Col, Container, Modal, Row } from "react-bootstrap";
import { FaChevronDown, FaChevronRight, FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import axios from "axios";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

import user from '../../assets/images/user.png';
import settingIcon from '../../assets/images/icons/setting.png';
import userIcon from '../../assets/images/icons/user.png';
import helpIcon from '../../assets/images/icons/help.png';
import lanIcon from '../../assets/images/icons/lan.png';
import memberIcon from '../../assets/images/icons/member.png';
import termsIcon from '../../assets/images/icons/terms.png';
import menuIcon from '../../assets/images/icons/humburger.svg';
import ChangeAccount from "../Helper/ChangeAccount";
import { useAuthContext } from "../../context/AuthContext";
import Membership from "../Helper/Membership";
import Notifications from "../Helper/Notifications";
import HeaderSearch from "../Helper/HeaderSearch";
import inviteIcon from '../../assets/images/icons/invite.png';
import ReferFriends from "../Helper/ReferFriends";
import bookIcon from '../../assets/images/icons/book.png';

const Header = ({ showLeftSidebar, toggleSidebar }) => {
  const { t } = useTranslation()
  const { API } = useAuthContext()
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const [remainingDays, setRemainingDays] = useState('')
  const [languages, setLanguages] = useState([])
  const [showSetting, setShowSetting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showHelps, setShowHelps] = useState(false);
  const [showMembership, setShowMembership] = useState(false)
  const [showChangeImage, setShowChangeImage] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([])
  const [inviteModal, setInviteModal] = useState(false);

  const showInviteModal = () => setInviteModal(true)
  const closeInviteModal = () => setInviteModal(false)
  const handleCloseChangeImage = () => setShowChangeImage(false)
  const handleShowChangeImage = () => setShowChangeImage(true)
  const helpsClose = () => setShowHelps(false)
  const helpsShow = () => setShowHelps(true)
  const termsClose = () => setShowTerms(false)
  const termsShow = () => setShowTerms(true)
  const membershipClose = () => setShowMembership(false)
  const membershipShow = () => setShowMembership(true)

  const accountClose = () => setShowAccount(false);
  const settingsClose = () => setShowSettings(false);
  const passwordClose = () => {
    setShowPassword(false);
    setShowAccount(true);
  };
  const accountShow = () => setShowAccount(true);
  const settingsShow = () => setShowSettings(true);
  const passwordShow = () => {
    setShowAccount(false);
    setShowPassword(true);
  };
  const handleClick = async () => {
    const res = await logout()
    if (res.success) {
      swal(res.message, "", "success");
      navigate("/signin")
    } else {
      navigate("/signin")
    }
  }

  useEffect(() => {
    axios.get(`${API}/all-languages`)
      .then(res => setLanguages(res.data.data))
  }, [])
  const handleLanguage = (e) => {
    i18n.changeLanguage(e.target.value)
    localStorage.setItem("API", `https://medscrippts-app.zainiklab.com/api/${e.target.value}/v1`)
    localStorage.setItem("lan", e.target.value)
    settingsClose()
    window.location.reload(false);
  }
  const syncPreScripts = () => {
    axios.get(`${API}/sync-data/${authUser.id}`)
      .then(res => {
        if (res.data.success) {
          settingsClose()
          window.location.reload(false);
        }
      })
  }
  const getRemainingDays = async () => {
    const res = await axios.get(`${API}/remaining-days`)
    const days = res.data.data.remain_days
    if (days === 0) {
      setShowMembership(true)
    } else {
      if (localStorage.getItem("showReferFriend")) {
        setInviteModal(true)
      }
    }
  }

  const handleImageChange = (e) => {
    setSelectedFiles([])
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(file => URL.createObjectURL(file))
      setSelectedFiles(prevImages => prevImages.concat(filesArray))
      Array.from(e.target.files).map(
        (file) => URL.revokeObjectURL(file)
      )
    }
  }
  const renderPhotos = (source) => {
    return source.map((photo, i) => (
      <div key={i} className="one-img">
        <img src={photo} alt="upload-image" />
      </div>
    ))
  }
  const handleProfilePicUPload = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("profile_pic", e.target[0].files[0])
    const res = await axios.post(`${API}/profile-pic-upload`, formData)
    localStorage.setItem('authUser', JSON.stringify(res.data.data))
    handleCloseChangeImage()
    setSelectedFiles([])
    swal(res.data.message, "", "success");
  }



  useEffect(() => {
    axios.get(`${API}/remaining-days`)
      .then(res => {
        setRemainingDays(res.data.data.remain_days)
      })
    getRemainingDays()
  }, [])
  return (
    <>
      <div className={`header-area ${showLeftSidebar ? "left-margin" : ""}`}>
        <Container fluid>
          <Row className="align-items-center">
            <Col xs={2} sm={3} md={4}>
              <div className="left">
                <img onClick={toggleSidebar} className="menu-icon" src={menuIcon} alt="icon" />
                <HeaderSearch />
              </div>
            </Col>
            <Col xs={10} sm={9} md={8}>
              <div className="header-right">
                <button onClick={() => navigate("/script")} className="new-btn">{t("new_script")}</button>
                <div onClick={() => {
                  setShowSetting(false)
                  setShowNotification(!showNotification)
                }} className="notification-box position-relative">
                  <Notifications showNotification={showNotification} />
                </div>
                <div className="user-box position-relative">
                  <img className="user-img" src={authUser?.profile_pic ? authUser.profile_pic : user} alt="user" />
                  <div className="user-info">
                    <h4 className="mb-0">{authUser?.name}</h4>
                    <p className="mb-0">{t("user")}</p>
                  </div>
                  <FaChevronDown onClick={() => {
                    setShowNotification(false)
                    setShowSetting(!showSetting)
                  }} />
                  <div className={`user-settings  ${showSetting ? "" : "toggled"}`}>
                    <div className="top">
                      <div onClick={accountShow} className="setting">
                        <div className="left">
                          <div className="img-box">
                            <img src={userIcon} alt="user" />
                          </div>
                          <span>{t("account")}</span>
                        </div>
                        <FaChevronRight className="icon" />
                      </div>
                      <div onClick={membershipShow} className="setting">
                        <div className="left">
                          <div className="img-box">
                            <img src={memberIcon} alt="user" />
                          </div>
                          <span>{t("membership")}</span>
                        </div>
                        <FaChevronRight className="icon" />
                      </div>
                      <div onClick={showInviteModal} className="setting">
                        <div className="left">
                          <div className="img-box">
                            <img src={inviteIcon} alt="user" />
                          </div>
                          <span>{t("invite_friends")}</span>
                        </div>
                        <FaChevronRight className="icon" />
                      </div>
                      <div onClick={helpsShow} className="setting">
                        <div className="left">
                          <div className="img-box">
                            <img src={helpIcon} alt="user" />
                          </div>
                          <span>{t("help_support")}</span>
                        </div>
                        <FaChevronRight className="icon" />
                      </div>
                      <div className="setting" onClick={termsShow}>
                        <div className="left">
                          <div className="img-box">
                            <img src={termsIcon} alt="user" />
                          </div>
                          <span>{t("terms_condition")}</span>
                        </div>
                        <FaChevronRight className="icon" />
                      </div>
                      <div onClick={settingsShow} className="setting">
                        <div className="left">
                          <div className="img-box">
                            <img src={settingIcon} alt="user" />
                          </div>
                          <span>{t("settings")}</span>
                        </div>
                        <FaChevronRight className="icon" />
                      </div>
                    </div>
                    <div className="bottom">
                      <button onClick={handleClick}>{t("logout")}</button>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div >
      <ChangeAccount showAccount={showAccount} accountClose={accountClose} passwordShow={passwordShow} remainingDays={remainingDays} handleShowChangeImage={handleShowChangeImage} />
      <Modal className="settings-modal" centered show={showSettings} onHide={settingsClose}>
        <Modal.Body>
          <h2>{t("settings")}</h2>
          <div className="setting">
            <div className="left">
              <img src={lanIcon} alt="langauge" />
              <span>{t("language")}</span>
            </div>
            <select className="language-select" defaultValue={localStorage.getItem("lan") ? localStorage.getItem("lan") : "en"} onChange={handleLanguage}>
              {languages.map(({ name, prefix }, i) => <option key={i} value={prefix}>{name}</option>)}
            </select>
          </div>
          <div className="setting">
            <div className="left">
              <img src={bookIcon} alt="langauge" />
              <span>{t("sync_premade_scripts!")}</span>
            </div>
            <span className="icon" onClick={syncPreScripts}>
              <FaPlus />
            </span>
          </div>
        </Modal.Body>
        <div className="cross-icon" onClick={settingsClose}>
          <FaTimes />
        </div>
      </Modal>
      <Modal show={showTerms} onHide={termsClose} centered className="terms-modal">
        <Modal.Body>
          <h5>{t("about_us")}</h5>
          <p>{t("about_text")} </p>
          <h5>{t("use_license")}</h5>
          <p>{t("license_text1")}</p>
          <p>{t("license_text2")} </p>
        </Modal.Body>
        <div className="cross-icon" onClick={termsClose}>
          <FaTimes />
        </div>
      </Modal>
      <Modal show={showHelps} onHide={helpsClose} centered className="helps-modal">
        <Modal.Body>
          <div>
            <h5 className="title">{t("about_us")}</h5>
            <p className="text">{t("about_text2")}  </p>
            <h5 className="title ">{t("faq_title")}</h5>
          </div>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>{t("question1")}</Accordion.Header>
              <Accordion.Body>
                <p>{t("answer1")}</p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>{t("question1")}</Accordion.Header>
              <Accordion.Body>
                <p>{t("answer1")}</p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>{t("question1")}</Accordion.Header>
              <Accordion.Body>
                <p>{t("answer1")}</p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>{t("question1")}</Accordion.Header>
              <Accordion.Body>
                <p>{t("answer1")}</p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

        </Modal.Body>
        <div className="cross-icon" onClick={helpsClose}>
          <FaTimes />
        </div>
      </Modal>
      <Membership showMembership={showMembership} membershipClose={membershipClose} remainingDays={remainingDays} />
      <Modal show={showChangeImage} onHide={() => {
        handleCloseChangeImage()
        accountShow()
      }} centered className="profile-pic-modal">
        <Modal.Body>
          <h3 className="title">{t("updat_profile_picture")}</h3>
          <form onSubmit={handleProfilePicUPload}>
            <div>
              <label htmlFor="upload-profile-picture" className="upload-image">
                <span>{t("upload_image")}</span>
              </label>
              <input onChange={handleImageChange} type="file" id="upload-profile-picture" className="file-input" required />
              {renderPhotos(selectedFiles)}
            </div>
            <button className="submit">{t("submit")}</button>
          </form>
        </Modal.Body>
        <div className="cross-icon" onClick={() => {
          handleCloseChangeImage()
          accountShow()
        }}>
          <FaTimes />
        </div>
      </Modal>

      <ReferFriends inviteModal={inviteModal} closeInviteModal={closeInviteModal} membershipShow={membershipShow} />

      {/* <ChangePassword showPassword={showPassword} passwordClose={passwordClose} /> */}
    </>
  )
}

export default Header;
