import { useEffect, useState } from 'react';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import GoogleLogin from 'react-google-login';
import swal from 'sweetalert';
import { useTranslation } from 'react-i18next';

import { useAuthContext } from "../context/AuthContext";
import logo from '../assets/images/logo.png';

const Signin = () => {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const { signin, googleSignin } = useAuthContext()
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const res = await signin(data)
    if (res.success) {
      localStorage.setItem("showReferFriend", true)
      navigate("/")
    } else {
      swal(res.message, "", "error");
    }
  };
  const handlePassword = (e) => {
    setShowPassword(!showPassword)
  }
  const handleSucess = async (res) => {
    const data = {
      email: res.profileObj.email,
      name: res.profileObj.name,
      google_id: res.profileObj.googleId
    }

    const newRes = await googleSignin(data)
    if (newRes.success) {
      swal(newRes.message, "", "success");
      navigate("/")
    } else {
      swal(newRes.message, "", "error");
    }
  }
  const handleFailure = (res) => {
    console.log(res)
  }
  useEffect(() => {
    if (showPassword) {
      document.getElementById('password').type = "text";
    } else {
      document.getElementById('password').type = "password";
    }
  }, [showPassword])
  return (
    <div className="signin-area">
      <div className="sign-in-box">
        <div className="sign-in-top text-center">
          <img className='logo' src={logo} alt="logo" />
          <p className='sub-title'>{t("welcome_to")}</p>
        </div>
        <div className="form-area">
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <div className="mb-4 form-check d-flex justify-content-between">
              <div>
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" htmlFor="exampleCheck1">{t("remember_me")}</label>
              </div>
              <p className='forgot-password' onClick={() => navigate("/forgot-password")}>{t("forgot_password")}</p>
            </div>
            <button type="submit" className="login-btn">{t("sign_in")}</button>
          </form>
          <p className='text-center my-3'>{t("or")}</p>
          <GoogleLogin buttonText={t("continue_with_google")} onSuccess={handleSucess}
            onFailure={handleFailure} clientId='58215232229-oaafjpa99pb6n23n7t7v7cdbom7enh0s.apps.googleusercontent.com' className='continue-google' />
          <p className='text-center mt-3 account'>{t("dont_you_have_account")}
            <span onClick={() => navigate('/signup')}> {t("signup")}</span> </p>
        </div>
      </div>
    </div>
  )
}

export default Signin
