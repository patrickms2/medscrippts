import React from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

import { useAuthContext } from '../../context/AuthContext';

const ChangePassword = ({ showPassword, passwordClose }) => {
  const { t } = useTranslation()
  const navigate = useNavigate();
  const { changePassword } = useAuthContext()
  const { register, handleSubmit } = useForm();
  const handlePassword = async (data) => {
    console.log(data)
    const res = await changePassword(data);
    if (res.success) {
      swal(`${res.message} Please Login`, "", "success")
      navigate("/signin")
    } else {
      swal(res.message, "", "error")
    }
  }
  return (
    <Modal className="password-modal" centered show={showPassword} onHide={passwordClose}>
      <Modal.Body>
        <h4>{t("change_password")}</h4>
        <form onSubmit={handleSubmit(handlePassword)}>
          <div className="mb-3">
            <label className="account-label" htmlFor="old_password">{t("current_password")}</label>
            <input className="acount-input" type="password" id="old_password" {...register("old_password")} required />
          </div>
          <div className="mb-3">
            <label className="account-label" htmlFor="new_password">{t("new_password")}</label>
            <input className="acount-input" type="password" id="new_password" {...register("new_password")} required />
          </div>
          <div className="mb-3">
            <label className="account-label" htmlFor="password_confirm">{t("confirm_password")}</label>
            <input className="acount-input" type="password" id="password_confirm" {...register("password_confirm")} required />
          </div>
          <div className="mt-4 mb-2">
            <button className="change-password">{t("change_password")}</button>
          </div>
        </form>
      </Modal.Body>
      <div className="cross-icon" onClick={passwordClose}>
        <FaTimes />
      </div>
    </Modal>
  )
}

export default ChangePassword
