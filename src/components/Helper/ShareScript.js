import axios from "axios";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";
import swal from "sweetalert";

import { useAuthContext } from "../../context/AuthContext";

const ShareScript = ({ shareModal, closeShareModal, shareSlug }) => {
  const { t } = useTranslation()
  const { register, handleSubmit } = useForm();
  const { API } = useAuthContext()
  const onSubmit = async (data) => {
    console.log(data)
    try {
      const res = await axios.post(`${API}/share-script/${shareSlug}`, data)
      closeShareModal()
      swal(res.data.message, "", "success");
    } catch (err) {
      closeShareModal()
      swal(err.response.data.message, "", "error");
    }

  }
  return <Modal className="password-modal" centered show={shareModal} onHide={closeShareModal}>
    <Modal.Body>
      <h4>{t("share_script_dialog_text")}</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="account-label" htmlFor="email">{t("email_address")}</label>
          <input className="acount-input" type="email" id="email" required {...register("email")} />
        </div>
        <div className="mt-4 mb-2">
          <button className="change-password">{t("continue")}</button>
        </div>
      </form>
    </Modal.Body>
    <div className="cross-icon" onClick={closeShareModal}>
      <FaTimes />
    </div>
  </Modal>;
};

export default ShareScript;
