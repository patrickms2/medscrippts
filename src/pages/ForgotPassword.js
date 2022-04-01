import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

import logo from '../assets/images/logo.svg';
import { useAuthContext } from "../context/AuthContext";

const ForgotPassword = () => {
  const { t } = useTranslation()
  const { forgotPassword } = useAuthContext()
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {

    const res = await forgotPassword(data)
    if (res.success) {
      swal(`${res.message} check your Email`, "", "success");
      console.log(res)
      navigate("/reset-password")
    } else {
      swal(res.message, "", "error");
    }
  };
  return (
    <div className="signin-area">
      <div className="sign-in-box">
        <div className="sign-in-top text-center">
          <img className='logo' src={logo} alt="logo" />
          <p className='sub-title'>{t("forgot_password")}</p>
        </div>
        <div className="form-area">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-5">
              <label htmlFor="email" className="form-label">{t("email_address")}</label>
              <input type="email" className="form-control" id="email" {...register("email")} required />
            </div>
            <button type="submit" className="login-btn">{t("submit")}</button>
          </form>
          <p className='text-center mt-3 account'>{t("have_an_account")} <span onClick={() => navigate('/signin')}> {t("sign_in")}</span> </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword;
