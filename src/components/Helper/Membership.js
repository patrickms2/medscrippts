import { FaTimes } from "react-icons/fa";
import { Col, Modal, Row } from "react-bootstrap";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";

import packegIcon from '../../assets/images/icons/packeg.png';
import PaymentForm from "./PaymentForm";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import swal from "sweetalert";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Membership = ({ showMembership, membershipClose, remainingDays, packages, selectedPackage, handleSlectedPackages, getRemainingDays, checkMembership }) => {
  const { logout } = useAuthContext();
  const navigate = useNavigate()
  const { t } = useTranslation()
  const handleClick = async () => {
    const res = await logout()
    if (res.success) {
      swal(res.message, "", "success");
      navigate("/signin")
    } else {
      navigate("/signin")
    }
  }

  return (
    <Modal show={showMembership} onHide={remainingDays && membershipClose} centered className="membership-modal">
      <Modal.Body>
        <div className="text-center">
          <h4 className="title">{t("choose_your_plan")}</h4>
          <p className="sub-title">{t("membership_text")}</p>
        </div>
        <Row className="justify-content-center">
          {packages.map((packag) => (
            <Col key={packag.id} sm={6} className="mb-4 mb-sm-0">
              <div className={`${packag.id === selectedPackage.id ? "active" : ""} pricing text-center`}>
                <img src={packegIcon} alt="packeg-icon" />
                <h3 className="price">${packag.price}</h3>
                <h5 className="name">{packag.name}</h5>
                <button className="select" onClick={() => handleSlectedPackages(packag)}>{t("select")}</button>
              </div>
            </Col>
          ))}
        </Row>
        <Elements stripe={stripePromise}>
          <PaymentForm selectedPackage={selectedPackage} membershipClose={membershipClose} getRemainingDays={getRemainingDays} checkMembershipFun={checkMembership} />
        </Elements>
        {remainingDays < 1 && (
          <button className="subscrib mt-4" onClick={handleClick}>logout</button>
        )}
      </Modal.Body>
      {remainingDays > 0 && (
        <div className="cross-icon" onClick={membershipClose}>
          <FaTimes />
        </div>
      )}
    </Modal>
  )
}

export default Membership;
