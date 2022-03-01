import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import ModalVideo from 'react-modal-video'

import logo from '../assets/images/logo.png';
import spinner from '../assets/images/spinner.svg';
import { useAuthContext } from "../context/AuthContext";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation()
  const { API } = useAuthContext()
  const { signup } = useAuthContext()
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [isOpen, setOpen] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    const res = await signup(data)
    if (res.success) {
      axios.get(`${API}/sync-data/${res.data.id}`)
      setLoading(false)
      navigate("/signin")
    } else {
      setLoading(false)
      swal(res.errors[Object.keys(res.errors)[0]][0], "", "error");
    }
  };
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
              <div className="mb-5">
                <label htmlFor="email" className="form-label">{t("email_address")}</label>
                <input type="email" className="form-control" id="email" required {...register("email")} />
              </div>
              <button type="submit" className="login-btn">{t("signup")}
                {loading && <img src={spinner} alt="spinner" />}
              </button>
            </form>
            <p className='text-center mt-3 account'>{t("have_an_account?")} <span onClick={() => navigate('/signin')}> {t("sign_in")}</span> </p>
            <p className='text-center how-to' onClick={() => setOpen(true)}> {t("how_to")}</p>
          </div>
        </div>
      </div>
      <ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId="L61p2uyiMSo" onClose={() => setOpen(false)} />
    </>
  )
}

export default Signup;
