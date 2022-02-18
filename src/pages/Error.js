import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import errorIcon from '../assets/images/error.png';

const Error = ({ height }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return <div className='error-page' style={{ height: height ? "calc(100vh - 103px)" : "100vh" }}>
    <div>
      <div className="img">
        <img src={errorIcon} alt="error icon" />
      </div>
      <div className="text text-center">
        <h4>{t("lost_text")}</h4>
        <p>{t("error_text")}</p>
        <button onClick={() => navigate('/')}>{t("go_home")}</button>
      </div>
    </div>
  </div>;
};

export default Error;
