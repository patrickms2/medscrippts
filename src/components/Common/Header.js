import { useEffect, useState } from "react";
import { Accordion, Col, Container, Dropdown, Modal, Row } from "react-bootstrap";
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
import ModalLoader from "./ModalLoader";
import { useCategoryContext } from "../../context/CategoryContext";

const Header = ({ showLeftSidebar, toggleSidebar }) => {
  const { getAllScripts } = useCategoryContext()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const { API } = useAuthContext()
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const [remainingDays, setRemainingDays] = useState('')
  const [languages, setLanguages] = useState([])
  const [showAccount, setShowAccount] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showHelps, setShowHelps] = useState(false);
  const [showMembership, setShowMembership] = useState(false)
  const [showChangeImage, setShowChangeImage] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([])
  const [inviteModal, setInviteModal] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState({})
  const [isButtonShow, setIsButtonShow] = useState(false)
  const [isMember, setIsMember] = useState(false)
  const [viewMember, setViewMember] = useState({})

  const showInviteModal = () => setInviteModal(true)
  const closeInviteModal = () => setInviteModal(false)
  const handleCloseChangeImage = () => setShowChangeImage(false)
  const handleShowChangeImage = () => setShowChangeImage(true)
  const helpsClose = () => setShowHelps(false)
  const termsClose = () => setShowTerms(false)
  const membershipClose = () => setShowMembership(false)
  const membershipShow = () => setShowMembership(true)
  const accountClose = () => setShowAccount(false);
  const settingsClose = () => setShowSettings(false);
  const accountShow = () => setShowAccount(true);
  const settingsShow = () => setShowSettings(true);

  const handleClick = async () => {
    const res = await logout()
    if (res.success) {
      navigate("/signin")
    } else {
      localStorage.removeItem('authToken')
      localStorage.removeItem("authUser")
      navigate("/signin")
    }
  }

  const handleLanguage = (e) => {
    i18n.changeLanguage(e.target.value)
    localStorage.setItem("API", `https://medscrippts-app.zainiklab.com/api/${e.target.value}/v1`)
    localStorage.setItem("lan", e.target.value)
    settingsClose()
    window.location.reload(false);
  }
  const syncPreScripts = async () => {
    setLoading(true)
    try {
      await axios.get(`${API}/sync-data/${authUser.id}`)
      getAllScripts()
      settingsClose()
    } catch (err) {
      setLoading(false)
      swal(err.data.message, "", "error");
    }
  }
  const getRemainingDays = async () => {
    const res = await axios.get(`${API}/remaining-days`)
    const days = res.data.data.remain_days
    setRemainingDays(days)
    if (days <= 0) {
      setShowMembership(true)
    }
    if (localStorage.getItem("showReferFriend") && days > 0) {
      setInviteModal(true)
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

  const getPackages = async () => {
    const res = await axios.get(`${API}/all-packages`)
    const refer = await axios.get(`${API}/refer-list`)
    const allPackage = res.data.data
    const referList = refer.data.data
    if (referList.length >= 3) {
      const newAllPackage = allPackage.map((item) => {
        item.price = item.discount_price
        item.plan_id = item.discount_plan_id

        return item
      })
      setPackages(newAllPackage)
      setSelectedPackage(newAllPackage[0])
    } else {
      setPackages(allPackage)
      setSelectedPackage(allPackage[0])
    }
  }
  const handleSlectedPackages = async (packag) => {
    setSelectedPackage(packag)
  }
  const checkMembership = async () => {
    const res = await axios.get(`${API}/membership-check`)
    if (res.data.data.is_member) {
      const view = await axios.get(`${API}/view-membership`)
      if (view.data.data.store == 'stripe' && !view.data.data.is_recurring) {
        setIsButtonShow(false)
      } else {
        setIsButtonShow(true)
        setViewMember(view.data.data)
      }
    }
    setIsMember(res.data.data.is_member)
  }
  const cancleMemberShip = async () => {
    try {
      const res = await axios.post(`${API}/membership-cancel`, { payment_intent: viewMember.payment_intent, payment_platform: 1 })
      setIsButtonShow(false)
      swal(res.data.message, "", "success");
    } catch (err) {
      swal(err.response.data.message, "", "error");
    }
  }
  useEffect(() => {
    checkMembership()
  }, [])
  useEffect(() => {
    getPackages()
  }, [])

  useEffect(() => {
    axios.get(`${API}/all-languages`)
      .then(res => setLanguages(res.data.data))
  }, [])
  useEffect(() => {
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
                <Notifications />
                <Dropdown drop="down">
                  <Dropdown.Toggle as='div' className="user-box">
                    <img className="user-img" src={authUser?.profile_pic ? authUser.profile_pic : user} alt="user" />
                    <div className="user-info">
                      <h4 className="mb-0">{authUser?.name}</h4>
                      <p className="mb-0">{t("user")}</p>
                    </div>
                    <FaChevronDown className="caret" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="user-dropdown">
                    <div className={`user-settings`}>
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
                        <a href="https://docs.medscrippts.com/" target="_blank" className="setting">
                          <div className="left">
                            <div className="img-box">
                              <img src={helpIcon} alt="user" />
                            </div>
                            <span>{t("help_support")}</span>
                          </div>
                          <FaChevronRight className="icon" />
                        </a>
                        <a href="https://docs.medscrippts.com/terms" target="_blank" className="setting">
                          <div className="left">
                            <div className="img-box">
                              <img src={termsIcon} alt="user" />
                            </div>
                            <span>{t("terms_condition")}</span>
                          </div>
                          <FaChevronRight className="icon" />
                        </a>
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
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Container>
      </div >
      <ChangeAccount showAccount={showAccount} accountClose={accountClose} remainingDays={remainingDays} handleShowChangeImage={handleShowChangeImage} cancleMemberShip={cancleMemberShip} isButtonShow={isButtonShow} isMember={isMember} />
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
          {loading && <>
            <ModalLoader />
            <p className="text-center">{t("please_wait")}</p>
          </>}
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
      <Membership packages={packages} selectedPackage={selectedPackage} handleSlectedPackages={handleSlectedPackages} showMembership={showMembership} membershipClose={membershipClose} remainingDays={remainingDays} getRemainingDays={getRemainingDays} checkMembership={checkMembership} />
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

      <ReferFriends inviteModal={inviteModal} getPackages={getPackages} closeInviteModal={closeInviteModal} membershipShow={membershipShow} />
    </>
  )
}

export default Header;
