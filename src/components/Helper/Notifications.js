import { useEffect, useState } from "react";
import axios from "axios";

import { useAuthContext } from "../../context/AuthContext";
import notificationIcon from '../../assets/images/icons/notification.png';
import notification from '../../assets/images/notification.png';
import { Dropdown } from "react-bootstrap";

const Notifications = ({ showNotification }) => {
  const { API } = useAuthContext()
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    axios.get(`${API}/view-notification?limit=4&page=1`)
      .then(res => setNotifications(res.data.data.data))
  }, [])
  return (
    <>
      <Dropdown drop="down">
        <Dropdown.Toggle as='div' className="notification-box">
          <div className="position-relative">
            <img src={notification} alt="notification" />
            <div className="notification-light"><span>{notifications.length}</span></div>
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <div className="notification-pannel">
            {notifications.map(({ title, content, time }, i) => <div key={i} className="single-pannel">
              <img src={notificationIcon} alt="notification" />
              <div className="text">
                <h4>{title} <span>{time}</span></h4>
                <p className="mb-0">{content}</p>
              </div>
            </div>)}
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

export default Notifications
