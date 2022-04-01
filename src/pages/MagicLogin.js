import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Magic } from 'magic-sdk';
import GoogleLogin from 'react-google-login';

import logo from '../assets/images/logo.svg';
import spinner from '../assets/images/spinner.svg';
import { useAuthContext } from "../context/AuthContext";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const MagicLogin = () => {
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
    try {
      const newRes = await googleSignin(data)
      swal(newRes.message, "", "success");
      localStorage.setItem("showReferFriend", true)
      navigate("/")
    } catch (err) {
      console.log(err.response)
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
  </div>;
};

export default MagicLogin;







// import { useEffect, useState } from 'react';
// import { FaEyeSlash, FaEye } from "react-icons/fa";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import GoogleLogin from 'react-google-login';
// import swal from 'sweetalert';
// import { useTranslation } from 'react-i18next';

// import { useAuthContext } from "../context/AuthContext";
// import logo from '../assets/images/logo.png';

// const Signin = () => {
//   const { t } = useTranslation()
//   const [showPassword, setShowPassword] = useState(false)
//   const { signin, googleSignin } = useAuthContext()
//   const navigate = useNavigate();

//   const { register, handleSubmit } = useForm();

//   const onSubmit = async (data) => {
//     const res = await signin(data)
//     if (res.success) {
//       localStorage.setItem("showReferFriend", true)
//       navigate("/")
//     } else {
//       swal(res.message, "", "error");
//     }
//   };
//   const handlePassword = (e) => {
//     setShowPassword(!showPassword)
//   }
//   const handleSucess = async (res) => {
//     const data = {
//       email: res.profileObj.email,
//       name: res.profileObj.name,
//       google_id: res.profileObj.googleId
//     }

//     const newRes = await googleSignin(data)
//     if (newRes.success) {
//       swal(newRes.message, "", "success");
//       navigate("/")
//     } else {
//       swal(newRes.message, "", "error");
//     }
//   }
//   const handleFailure = (res) => {
//     console.log(res)
//   }
//   useEffect(() => {
//     if (showPassword) {
//       document.getElementById('password').type = "text";
//     } else {
//       document.getElementById('password').type = "password";
//     }
//   }, [showPassword])
//   return (
//     <div className="signin-area">
//       <div className="sign-in-box">
//         <div className="sign-in-top text-center">
//           <img className='logo' src={logo} alt="logo" />
//           <p className='sub-title'>{t("welcome_to")}</p>
//         </div>
//         <div className="form-area">
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="mb-3">
//               <label htmlFor="email" className="form-label">{t("email_address")}</label>
//               <input type="email" className="form-control" id="email" required {...register("email")} />
//             </div>
//             <div className="mb-3">
//               <label htmlFor="password" className="form-label">{t("password")}</label>
//               <div className="position-relative">
//                 <input type="password" className="form-control" id="password" required {...register("password")} />
//                 <span onClick={handlePassword}>
//                   {showPassword ? <FaEye className="icon" /> : <FaEyeSlash className="icon" />}
//                 </span>
//               </div>
//             </div>
//             <div className="mb-4 form-check d-flex justify-content-between">
//               <div>
//                 <input type="checkbox" className="form-check-input" id="exampleCheck1" />
//                 <label className="form-check-label" htmlFor="exampleCheck1">{t("remember_me")}</label>
//               </div>
//               <p className='forgot-password' onClick={() => navigate("/forgot-password")}>{t("forgot_password")}</p>
//               <p className='forgot-password' onClick={() => navigate("/magic-login")}>magic login</p>
//             </div>
//             <button type="submit" className="login-btn">{t("sign_in")}</button>
//           </form>
//           <p className='text-center my-3'>{t("or")}</p>

//           <p className='text-center mt-3 account'>{t("dont_you_have_account")}
//             <span onClick={() => navigate('/signup')}> {t("signup")}</span> </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Signin

