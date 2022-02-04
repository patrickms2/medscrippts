import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Magic } from 'magic-sdk';
import GoogleLogin from 'react-google-login';

import logo from '../assets/images/logo.png';
import { useAuthContext } from "../context/AuthContext";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";

const MagicLogin = () => {
  const { t } = useTranslation()
  const { googleSignin, API } = useAuthContext()
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {

    try {
      const did = await new Magic(process.env.REACT_APP_MAGIC_KEY)
        .auth.loginWithMagicLink(data)

      const res = await axios.post(`${API}/auth/magic-link`, { bearerToken: did, email: data.email })

      localStorage.setItem('authToken', res.data.data.token);
      localStorage.setItem('authUser', JSON.stringify(res.data.data))
      localStorage.setItem("showReferFriend", true)
      navigate("/")
    } catch (err) {
      console.log(err.response.data)
      swal(err.response.data.message, "", "error");
    }
  };

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
  return <div className="signin-area">
    <div className="sign-in-box">
      <div className="sign-in-top text-center">
        <img className='logo' src={logo} alt="logo" />
        <p className='sub-title'>{t("welcome_to")}</p>
      </div>
      <div className="form-area">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label htmlFor="email" className="form-label">{t("email_address")}</label>
            <input type="email" className="form-control" id="email" {...register("email")} required />
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
  </div>;
};

export default MagicLogin;
