import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import ModalVideo from 'react-modal-video'

import logo from '../assets/images/logo.png';
import { useAuthContext } from "../context/AuthContext";

const Signup = () => {
  const { t } = useTranslation()
  const { API } = useAuthContext()
  const [userId, setUserId] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConPassword, setShowConPassword] = useState(false)
  const { signup } = useAuthContext()
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [isOpen, setOpen] = useState(false)

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const onSubmit = async (data) => {

    const res = await signup(data)
    if (res.success) {
      setUserId(res.data.id)
      handleShow()
    } else {
      swal(res.message, "", "error");
    }
  };
  const syncPreScripts = () => {
    axios.get(`${API}/sync-data/${userId}`)
    navigate("/signin")
  }
  const handlePassword = (e) => {
    setShowPassword(!showPassword)
  }
  const handleConPassword = (e) => {
    setShowConPassword(!showConPassword)
  }
  useEffect(() => {
    if (showPassword) {
      document.getElementById('password').type = "text";
    } else {
      document.getElementById('password').type = "password";
    }
  }, [showPassword])
  useEffect(() => {
    if (showConPassword) {
      document.getElementById('password_confirm').type = "text";
    } else {
      document.getElementById('password_confirm').type = "password";
    }
  }, [showConPassword])
  return (
    <>
      <div className="signin-area">
        <div className="sign-in-box">
          <div className="sign-in-top text-center">
            <img className='logo' src={logo} alt="logo" />
            <p className='sub-title'>{t("create_new_account")}</p>
          </div>
          <div className="form-area">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">{t("name")}</label>
                <input type="text" className="form-control" id="name" {...register("name")} required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">{t("email_address")}</label>
                <input type="email" className="form-control" id="email" required {...register("email")} />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">{t("password")}</label>
                <div className="position-relative">
                  <input type="password" className="form-control" id="password" required {...register("password")} />
                  <span onClick={handlePassword}>
                    {showPassword ? <FaEye className="icon" /> : <FaEyeSlash className="icon" />}
                  </span>
                </div>
              </div>
              <div className="mb-5">
                <label htmlFor="password_confirm" className="form-label">{t("confirm_password")}</label>
                <div className="position-relative">
                  <input type="password" className="form-control" id="password_confirm" required {...register("password_confirm")} />
                  <span onClick={handleConPassword}>
                    {showConPassword ? <FaEye className="icon" /> : <FaEyeSlash className="icon" />}
                  </span>
                </div>
              </div>
              <button type="submit" className="login-btn">{t("signup")}</button>
            </form>
            <p className='text-center mt-3 account'>{t("have_an_account?")} <span onClick={() => navigate('/signin')}> {t("sign_in")}</span> </p>
            <p className='text-center how-to' onClick={() => setOpen(true)}> {t("how_to")}</p>
          </div>
        </div>
      </div>
      <ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId="L61p2uyiMSo" onClose={() => setOpen(false)} />
      <Modal show={show} centered>
        <Modal.Body className="text-center">
          <p>{t("sync_premade_scripts!")}</p>
          <Button onClick={syncPreScripts}>OK</Button>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Signup;
