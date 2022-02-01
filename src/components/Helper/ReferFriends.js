import axios from "axios";
import { t } from "i18next";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import swal from "sweetalert";
import { useAuthContext } from "../../context/AuthContext";

const ReferFriends = ({ inviteModal, closeInviteModal }) => {
  // const { register, handleSubmit, reset } = useForm();
  const [emails, setEmails] = useState({});
  const [count, setCount] = useState(1);
  const { API } = useAuthContext()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const propertyValues = Object.values(emails);

    const formData = new FormData()
    for (let i = 0; i < propertyValues.length; i++) {
      formData.append("email[]", propertyValues[i])
    }
    try {
      const res = await axios.post(`${API}/refer-friend`, formData)
      closeInviteModal()
      setCount(1)
      setEmails({})
      swal(res.data.message, "", "success");
    } catch (err) {
      closeInviteModal()
      setCount(1)
      setEmails({})
      swal(err.response.data.errors.email[0], "", "error");
    }
  }
  function handleChange(evt) {
    const value = evt.target.value;
    setEmails({
      ...emails,
      [evt.target.name]: value
    });
  }
  const handleClick = () => {
    setCount(count + 1)
  }
  const handleDecrease = () => {
    delete emails[count - 1]
    setCount(count - 1)
  }
  const handleModal = () => {
    localStorage.removeItem("showReferFriend")
    closeInviteModal()
  }
  return <Modal className="password-modal" centered show={inviteModal} onHide={handleModal}>
    <Modal.Body>
      <h4>{t("invite_your_friends")}</h4>
      <p>{t("invite_text")}</p>
      <form onSubmit={handleSubmit}>
        <label className="account-label">{t("email_address")}</label>
        {[...Array(count).keys()].map((item) => <div key={item} className="mb-3">
          <input className="acount-input" type="email" onChange={handleChange} value={emails.item} required name={item} />
        </div>)}
        <div className="d-flex">
          <span className="plus-btn me-2" onClick={handleClick}><FaPlus /></span>
          {count > 1 && <span className="plus-btn" onClick={handleDecrease}><FaMinus /></span>}
        </div>
        <div className="mt-4 mb-2">
          <button className="change-password">{t("invite")}</button>
        </div>
      </form>
    </Modal.Body>
    <div className="cross-icon" onClick={handleModal}>
      <FaTimes />
    </div>
  </Modal>;
};

export default ReferFriends;
