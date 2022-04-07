import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import swal from 'sweetalert';
import { useTranslation } from "react-i18next";

import logo from '../assets/images/logo.png';
import { useAuthContext } from "../context/AuthContext";
const ResetPassword = () => {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConPassword, setShowConPassword] = useState(false)
  const { resetPassword } = useAuthContext()
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    const res = await resetPassword(data)
    if (res.success) {
      swal(`${res.message}. Please Login`, "", "success");
      navigate("/signin")
    } else {
      swal(res.message, "", "error");
    }
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
    <div className="signin-area">
      <div className="sign-in-box">
        <div className="sign-in-top text-center">
          <img className='logo' src={logo} alt="logo" />
          <p className='sub-title'>{t("reset_password")}</p>
        </div>
        <div className="form-area">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="reset_token" className="form-label">{t("reset_token")}</label>
              <input type="text" className="form-control" id="reset_token" {...register("reset_token")} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">{t("password")}</label>
              <div className="position-relative">
                <input type="password" className="form-control" id="password" {...register("password")} required />
                <span onClick={handlePassword}>
                  {showPassword ? <FaEye className="icon" /> : <FaEyeSlash className="icon" />}
                </span>
              </div>

            </div>
            <div className="mb-5">
              <label htmlFor="password_confirm" className="form-label">{t("confirm_password")}</label>
              <div className="position-relative">
                <input type="password" className="form-control" id="password_confirm" {...register("password_confirm")} required />
                <span onClick={handleConPassword}>
                  {showConPassword ? <FaEye className="icon" /> : <FaEyeSlash className="icon" />}
                </span>
              </div>
            </div>
            <button type="submit" className="login-btn">{t("submit")}</button>
          </form>
          <p className='text-center mt-3 account'>{t("have_an_account")} <span onClick={() => navigate('/signin')}> {t("sign_in")}</span> </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword;
