import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Magic } from 'magic-sdk';
import GoogleLogin from 'react-google-login';

import logo from '../assets/images/logo.png';
import spinner from '../assets/images/spinner.svg';
import { useAuthContext } from "../context/AuthContext";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import ModalLoader from "../components/Common/ModalLoader";

const MagicLogin = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation()
  const { googleSignin, API } = useAuthContext()
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const did = await new Magic(process.env.REACT_APP_MAGIC_KEY)
        .auth.loginWithMagicLink(data)

      const res = await axios.post(`${API}/auth/magic-link`, { bearerToken: did, email: data.email })

      localStorage.setItem('authToken', res.data.data.token);
      localStorage.setItem('authUser', JSON.stringify(res.data.data))
      localStorage.setItem("showReferFriend", true)
      setLoading(false)
      navigate("/")
    } catch (err) {
      setLoading(false)
      swal(err.response.data.message, "", "error");
    }
  };

  const handleSucess = async (res) => {
    const data = {
      email: res.profileObj.email,
      name: res.profileObj.name,
      google_id: res.profileObj.googleId
    }
    try {
      setShow(true)
      const newRes = await googleSignin(data)
      await axios.get(`${API}/sync-data/${newRes.data.id}`)
      setShow(false)
      localStorage.setItem("showReferFriend", true)
      navigate("/")
    } catch (err) {
      swal(err.response.data.message, "", "error");
      setShow(false)
    }
  }
  const handleFailure = (res) => {
    console.log(res)
  }
  return (
    <>
      <div className="signin-area">
        <div className="sign-in-box">
          <div className="sign-in-top text-center">
            <img className='logo' src={logo} alt="logo" />
            <p className='sub-title'>{t("welcome_to")}</p>
          </div>
          <div className="form-area">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label">{t("email_address")}</label>
                <input type="email" placeholder={t("your_email")} className="form-control" id="email" {...register("email")} required />
              </div>
              <button type="submit" className="login-btn">
                {t("sign_in")}
                {loading && <img src={spinner} alt="spinner" />}
              </button>
            </form>

            <p className='text-center my-3'>{t("or")}</p>
            <GoogleLogin buttonText={t("continue_with_google")} onSuccess={handleSucess}
              onFailure={handleFailure} clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID} className='continue-google' />
            <p className='text-center mt-3 account'>{t("dont_you_have_account")}
              <span onClick={() => navigate('/signup')}> {t("signup")}</span> </p>
          </div>
        </div>
      </div>
      <Modal show={show} centered>
        <Modal.Body>
          <ModalLoader />
          <p className="text-center">{t("please_wait")}</p>
        </Modal.Body>
      </Modal>
    </>)
};

export default MagicLogin;