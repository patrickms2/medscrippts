import { Col, Modal, Row } from "react-bootstrap"
import { useForm } from "react-hook-form";
import { CgArrowRight } from "react-icons/cg";
import swal from "sweetalert";
import { CSVLink } from "react-csv";
import { FaTimes } from "react-icons/fa";
import { t } from "i18next";

import user1 from '../../assets/images/user-1.png';
import editIcon from '../../assets/images/icons/edit.png';
import editColor from '../../assets/images/icons/edit-color.svg';
import { useAuthContext } from "../../context/AuthContext";
import { useCategoryContext } from "../../context/CategoryContext";
import axios from "axios";
import { useEffect, useState } from "react";

const ChangeAccount = ({ showAccount, accountClose, passwordShow, remainingDays, handleShowChangeImage }) => {
  const [dataInCSV, setDataInCSV] = useState("");
  const { API } = useAuthContext()
  const { scripts } = useCategoryContext()
  const { updateUser } = useAuthContext()
  const { register, handleSubmit } = useForm();
  const authUser = JSON.parse(localStorage.getItem("authUser"))
  const changeUser = async (data) => {
    const res = await updateUser(data);
    if (res.success) {
      swal(`${res.message}`, "", "success")
      accountClose()
    } else {
      swal(res.message, "", "error")
    }
  }
  useEffect(() => {
    axios.get(`${API}/export-script`, {
      responseType: 'blob',
    })
      .then(res => {
        setDataInCSV(URL.createObjectURL(res.data))
      })
  }, []);


  return (
    <Modal className="account-modal" centered show={showAccount} onHide={accountClose}>
      <Modal.Header>
        <div className="user-img-container position-relative">
          <img className="user-img" src={authUser?.profile_pic ? authUser.profile_pic : user1} alt="user" />
          <div onClick={() => {
            accountClose()
            handleShowChangeImage()
          }} className="edit-icon">
            <img src={editIcon} alt="edit" />
          </div>
        </div>
        <div className="left">
          <h2 className="status" className="mb-0">{t("account_status")}</h2>
          <span className="status-title">{t("active")}</span>
        </div>

      </Modal.Header>
      <Modal.Body>
        <h3 className="my-3">{t("registered_information")}</h3>
        <form onSubmit={handleSubmit(changeUser)}>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <label className="account-label" htmlFor="name">{t("name")}</label>
                <div className="position-relative">
                  <input className="acount-input" type="text" id="name" {...register("name")} defaultValue={authUser?.name} />
                  <img className="input-edit" src={editColor} alt="edit" />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label className="account-label" htmlFor="email">{t("email_address")}</label>
                <div className="position-relative">
                  <input className="acount-input" type="email" id="email" {...register("email")} defaultValue={authUser?.email} />
                  <img className="input-edit" src={editColor} alt="edit" />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label className="account-label" htmlFor="birth_day">{t("birth_date")}</label>
                <div className="position-relative">
                  <input className="acount-input" type="date" id="birth_day" {...register("birth_day")} defaultValue={authUser?.birth_day} />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label className="account-label" htmlFor="college">{t("college/institution")}</label>
                <div className="position-relative">
                  <input className="acount-input" type="text" id="college" {...register("college")} defaultValue={authUser?.college} />
                  <img className="input-edit" src={editColor} alt="edit" />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label className="account-label" htmlFor="renewal">{t("days_until_renewal")}</label>
                <input className="acount-input" type="text" id="renewal" defaultValue={remainingDays} disabled />
              </div>
            </Col>
          </Row>

          <div className="changes-btns">
            <div onClick={passwordShow} className="single-btns">
              <CgArrowRight className="icon" />
              <span className="span"> {t("change_password")}</span>
            </div>
            <div className="single-btns">
              <CgArrowRight className="icon" />
              <a href={dataInCSV} download className="span">{t("download_csv")}</a>
            </div>
            <div className="text-center single-btns">
              <button type="submit">{t("save_changes")}</button>
            </div>

          </div>
        </form>
      </Modal.Body>
      <div className="cross-icon" onClick={accountClose}>
        <FaTimes />
      </div>
    </Modal>
  )
}

export default ChangeAccount