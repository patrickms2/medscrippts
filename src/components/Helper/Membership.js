import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";

import { useAuthContext } from "../../context/AuthContext";
import packegIcon from '../../assets/images/icons/packeg.png';
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Membership = ({ showMembership, membershipClose, remainingDays }) => {
  const { t } = useTranslation()
  const { API } = useAuthContext();
  const [selectedPackage, setSelectedPackage] = useState({})
  const [packages, setPackages] = useState([]);
  useEffect(() => {
    axios.get(`${API}/all-packages`)
      .then(res => {
        setPackages(res.data.data)
        setSelectedPackage(res.data.data[0])
      })

  }, [])
  return (
    <Modal show={showMembership} onHide={remainingDays && membershipClose} centered className="membership-modal">
      <Modal.Body>
        <div className="text-center">
          <h4 className="title">{t("choose_your_plan")}</h4>
          <p className="sub-title">{t("membership_text")}</p>
        </div>
        <Row>
          {packages.map((packag) => (
            <Col key={packag.id} sm={6} className="mb-4 mb-sm-0">
              <div className={`${packag.id === selectedPackage.id ? "active" : ""} pricing text-center`}>
                <img src={packegIcon} alt="packeg-icon" />
                <h3 className="price">${packag.price}</h3>
                <h5 className="name">{packag.name}</h5>
                <button className="select" onClick={() => setSelectedPackage(packag)}>{t("select")}</button>
              </div>
            </Col>
          ))}
        </Row>
        <Elements stripe={stripePromise}>
          <PaymentForm selectedPackage={selectedPackage} membershipClose={membershipClose} />
        </Elements>
      </Modal.Body>
      {remainingDays > 0 && (
        <div className="cross-icon" onClick={membershipClose}>
          <FaTimes />
        </div>
      )}
    </Modal>
  )
}

export default Membership
