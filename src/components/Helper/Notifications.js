import { useEffect, useState } from "react";
import axios from "axios";

import { useAuthContext } from "../../context/AuthContext";
import notificationIcon from '../../assets/images/icons/notification.png';
import notification from '../../assets/images/notification.png';

const Notifications = ({ showNotification }) => {
  const { API } = useAuthContext()
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    axios.get(`${API}/view-notification?limit=4&page=1`)
      .then(res => setNotifications(res.data.data.data))
  }, [])
  return (
    <>
      <div className="notification-icon position-relative">
        <img src={notification} alt="notification" />
        <div className="notification-light"><span>{notifications.length}</span></div>
      </div>
      <div className={`notification-pannel ${showNotification ? "" : "toggled"}`}>
        {notifications.map(({ title, content, time }, i) => <div key={i} className="single-pannel">
          <img src={notificationIcon} alt="notification" />
          <div className="text">
            <h4>{title} <span>{time}</span></h4>
            <p className="mb-0">{content}</p>
          </div>
        </div>)}
      </div>
    </>
  )
}

export default Notifications
