import { useTranslation } from 'react-i18next';
import errorIcon from '../assets/images/error.png';

const NoDataFound = () => {
  const { t } = useTranslation()
  return <div className='error-page' style={{ height: "calc(100vh - 103px)" }}>
    <div>
      <div className="img">
        <img src={errorIcon} alt="error icon" />
      </div>
      <div className="text text-center">
        <h4>{t("no_data_found")}</h4>
      </div>
    </div>
  </div>;
};

export default NoDataFound;
