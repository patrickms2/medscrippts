import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import swal from 'sweetalert';
import { useTranslation } from 'react-i18next';

import ModalLoader from '../Common/ModalLoader';
import { useAuthContext } from '../../context/AuthContext';

const PaymentForm = ({ selectedPackage, membershipClose }) => {
  const { t } = useTranslation()
  const { API } = useAuthContext()
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)
    })

    if (error) {
      setPaymentError(error.message);
    } else {
      setLoading(true)
      try {
        const checkMembership = await axios.get(`${API}/membership-check`)
        if (checkMembership.data.data.is_member) {
          membershipClose()
          setLoading(false)
          swal("Already a pro member!", "", "warning");
        } else {
          const { id } = paymentMethod
          const response = await axios.post(`${API}/payments/pay`, {
            value: selectedPackage.price,
            currency: "usd",
            payment_platform: 1,
            package_id: selectedPackage.id,
            payment_method: id
          })
          try {
            const createMembership = await axios.post(`${API}/create-membership`, {
              package_id: selectedPackage.id,
              txn: response.data.data.txn,
              store: "stripe"
            })
            setLoading(false)
            membershipClose()
            swal(createMembership.data.message, "", "success");
            window.location.reload(false);
          } catch (err) {
            setLoading(false)
            membershipClose()
            swal(err.response.message, "", "error");
          }
        }
      } catch (err) {
        setLoading(false)
        membershipClose()
        swal(err.response.message, "", "error");
      }

    }
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setPaymentError("");
    }, 3000);
    return () => clearTimeout(timeOut);
  }, [paymentError]);
  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {paymentError && (
        <p style={{ color: "red", marginBottom: "0" }}>
          {paymentError}
        </p>
      )}
      {loading ? <ModalLoader /> : <button disabled={!stripe} className="subscrib mt-4">{t("subscribe")}</button>}

    </form>
  )
}

export default PaymentForm
