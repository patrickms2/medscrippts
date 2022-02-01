import icon from '../../assets/images/loader.svg';

const Loader = () => {
  return <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "calc(100vh - 103px)"
  }}>
    <img src={icon} alt="icon" />
  </div>;
};

export default Loader;
