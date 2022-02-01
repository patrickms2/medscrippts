import icon from '../../assets/images/loader.svg';

const ModalLoader = () => {
  return <div style={{ display: "flex", justifyContent: "center" }}>
    <img src={icon} alt="icon" />
  </div>;
};

export default ModalLoader;
