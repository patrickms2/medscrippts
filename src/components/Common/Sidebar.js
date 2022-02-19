import { NavLink, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import Select from 'react-select';
import { FaChevronRight } from 'react-icons/fa';
import moment from 'moment';
import axios from 'axios';

import logo from '../../assets/images/logo-small.png';
import logoutIcon from '../../assets/images/icons/logout.svg';
import pred from '../../assets/images/icons/pred.png';
import study from '../../assets/images/icons/study.svg';
import { useAuthContext } from '../../context/AuthContext';
import { useCategoryContext } from "../../context/CategoryContext";
import { handleDiagnosis, handleEpidemiology, handlePathophysiology, handleSymptoms, handleTreatments } from '../Helper/blurFunction';
import ModalLoader from './ModalLoader';

const Sidebar = ({ showLeftSidebar, setShowLeftSidebar }) => {
  const [isPedi, setisPedi] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  const { categories, scripts, setFilterdScripts } = useCategoryContext()
  const { API } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false);
  const [scriptByCategory, setScriptByCategory] = useState("");
  const [showScriptSidebar, setShowScriptSidebar] = useState(false);
  const { t } = useTranslation()
  const { register, handleSubmit, reset } = useForm();
  const [selectedOption, setSelectedOption] = useState();
  const inputRef = useRef(null)
  const { logout } = useAuthContext()
  const navigate = useNavigate();

  const handleClick = async () => {
    const res = await logout()
    if (res.success) {
      swal(res.message, "", "success");
      navigate("/signin")
    } else {
      navigate("/signin")
    }
  }
  const handleAllBlur = () => {
    const checkBox = document.getElementsByClassName("blur-input");
    const allCheckBox = [...checkBox];
    const collection1 = document.querySelectorAll(".patho")
    const collection2 = document.querySelectorAll(".epide")
    const collection3 = document.querySelectorAll(".symp")
    const collection4 = document.querySelectorAll(".diagn")
    const collection5 = document.querySelectorAll(".treat")
    if (inputRef.current.checked) {
      allCheckBox.forEach(i => i.checked = true);
      localStorage.setItem("allBlur", true)
      for (let i = 0; i < collection1.length; i++) {
        collection1[i].classList.add("blur")
        localStorage.setItem("patho", true)
      }
      for (let i = 0; i < collection2.length; i++) {
        collection2[i].classList.add("blur")
        localStorage.setItem("epide", true)
      }
      for (let i = 0; i < collection3.length; i++) {
        collection3[i].classList.add("blur")
        localStorage.setItem("symp", true)
      }
      for (let i = 0; i < collection4.length; i++) {
        collection4[i].classList.add("blur")
        localStorage.setItem("diagn", true)
      }
      for (let i = 0; i < collection5.length; i++) {
        collection5[i].classList.add("blur")
        localStorage.setItem("treat", true)
      }
    } else {
      localStorage.removeItem("allBlur")
      allCheckBox.forEach(i => i.checked = false);
      for (let i = 0; i < collection1.length; i++) {
        collection1[i].classList.remove("blur")
        localStorage.removeItem("patho")
      }
      for (let i = 0; i < collection2.length; i++) {
        collection2[i].classList.remove("blur")
        localStorage.removeItem("epide")
      }
      for (let i = 0; i < collection3.length; i++) {
        collection3[i].classList.remove("blur")
        localStorage.removeItem("symp")
      }
      for (let i = 0; i < collection4.length; i++) {
        collection4[i].classList.remove("blur")
        localStorage.removeItem("diagn")
      }
      for (let i = 0; i < collection5.length; i++) {
        collection5[i].classList.remove("blur")
        localStorage.removeItem("treat")
      }
    }
  }
  const onSubmit = (data) => {
    setShowScriptSidebar(false)
    reset()
    navigate(`/compare-script/${selectedOption}/${data.keyword}`)
  }
  const getScriptByCategory = (slug) => {
    axios.get(`${API}/find-script-by-category/${slug}`)
      .then(res => {
        setIsLoading(false)
        setScriptByCategory(res.data.data)
      })
  }
  const handleChange = (data) => {
    setIsLoading(true)
    setSelectedOption(data.value)
    getScriptByCategory(data.value)
  }
  const handlePedi = (e) => {
    setisPedi(e.target.checked)
  }
  const handleAdult = (e) => {
    setIsAdult(e.target.checked)
  }
  useEffect(() => {
    if (isPedi && !isAdult) {
      const pedScripts = scripts.filter(item => Number(item.isPediatrics))
      setFilterdScripts(pedScripts)
    } else if (isAdult && !isPedi) {
      const adultScripts = scripts.filter(item => Number(item.isAdult))
      setFilterdScripts(adultScripts)
    } else if (isAdult && isPedi) {
      const newScripts = scripts.filter(item => Number(item.isAdult) || Number(item.isPediatrics))
      setFilterdScripts(newScripts)
    } else {
      setFilterdScripts([])
    }


  }, [isPedi, isAdult]);

  // console.log(filterdScripts)
  const options = categories.map(({ name, slug }) => { return { value: slug, label: name } })
  return (
    <>
      <div className={`sidebar ${showLeftSidebar ? "show-sidebar" : ""}`}>
        <div className="sidebar-top">
          <div className="logo text-center">
            <NavLink to="/">
              <img src={logo} alt="logo" />
            </NavLink>
          </div>
          <div className="categories">
            <button className='btns'> {t('select_categorie')}</button>
            <form onSubmit={handleSubmit(onSubmit)} className="select-category">
              <Select options={options} placeholder={t("pick_from_list")} onChange={handleChange} />
              <div>
                <input className='search-terms' type="text" placeholder={t("search_term")} {...register("keyword")} required autoComplete='off' />
              </div>
              <button className='compare-btn'> {t("compare")}</button>
            </form>
            <button className='btns'> <img src={study} alt="category" /> {t('study_mode')}</button>
            <div className="form-switch ps-0 blure-switch">
              <label className="form-check-label" htmlFor="patho">{t("blur_all")}</label>
              <input ref={inputRef} onChange={handleAllBlur} className="form-check-input blur-input" type="checkbox" role="switch" id="all-blur" defaultChecked={localStorage.getItem("allBlur") ? true : false} />
            </div>
            <div className="form-switch ps-0 blure-switch">
              <label className="form-check-label" htmlFor="patho">{t("pathophysiology")}</label>
              <input className="form-check-input blur-input" type="checkbox" role="switch" id="patho" onChange={handlePathophysiology} defaultChecked={localStorage.getItem("patho") ? true : false} />
            </div>
            <div className="form-switch ps-0 blure-switch">
              <label className="form-check-label" htmlFor="epide">{t("epidemiology")}</label>
              <input className="form-check-input blur-input" type="checkbox" role="switch" id="epide" onChange={handleEpidemiology} defaultChecked={localStorage.getItem("epide") ? true : false} />
            </div>
            <div className="form-switch ps-0 blure-switch">
              <label className="form-check-label" htmlFor="symp">{t("sign_symptom")}</label>
              <input className="form-check-input blur-input" type="checkbox" role="switch" id="symp" onChange={handleSymptoms} defaultChecked={localStorage.getItem("symp") ? true : false} />
            </div>
            <div className="form-switch ps-0 blure-switch">
              <label className="form-check-label" htmlFor="diagn">{t("diagnosis")}</label>
              <input className="form-check-input blur-input" type="checkbox" role="switch" id="diagn" onChange={handleDiagnosis} defaultChecked={localStorage.getItem("diagn") ? true : false} />
            </div>
            <div className="form-switch ps-0 blure-switch">
              <label className="form-check-label" htmlFor="treat">{t("treatments")}</label>
              <input className="form-check-input blur-input" type="checkbox" role="switch" id="treat" onChange={handleTreatments} defaultChecked={localStorage.getItem("treat") ? true : false} />
            </div>

            <button className='btns'><img src={pred} alt="category" />{t('filter')}</button>
            <div className="form-switch ps-0 blure-switch">
              <label className="form-check-label" htmlFor="pedi">{t("pediatrics_scrippts")}</label>
              <input className="form-check-input" type="checkbox" role="switch" id="pedi" onChange={handlePedi} />
            </div>
            <div className="form-switch ps-0 blure-switch">
              <label className="form-check-label" htmlFor="adult">{t("adult_scrippts")}</label>
              <input className="form-check-input" type="checkbox" role="switch" id="adult" onChange={handleAdult} />
            </div>
          </div>
        </div>
        <div className="sidebar-bottom">
          <button onClick={handleClick} className='logout-btn'><img src={logoutIcon} alt="logout" /> {t("logout")}</button>
        </div>
      </div>
      <div onClick={() => setShowLeftSidebar(false)} className={`overlay ${showLeftSidebar ? "show-overlay" : ''}`} />
      {showLeftSidebar && <div onClick={() => setShowScriptSidebar(true)} className="script-sidebar-btn">
        <button><FaChevronRight /></button>
      </div>}
      {showLeftSidebar && <div onClick={() => setShowScriptSidebar(false)} className={`${showScriptSidebar ? "show-sidebar" : ""} ${showLeftSidebar ? "" : "margin-left"} script-sidebar`}>
        <h3 className='main-title' >available scripts <FaChevronRight className='icon' /> </h3>
        <div className="scripts">

          {isLoading ? <ModalLoader /> : Array.isArray(scriptByCategory) && scriptByCategory.length == 0 ? <h3 className='missing'>{t("no_data_found")}</h3> : scriptByCategory ? scriptByCategory.map(({ id, title, category, created_at, slug }) => <div key={id} className="script" onClick={() => navigate(`/view-script/${slug}`)}>
            <div className="top">
              <span className="sub">{category}</span>
              <h3 className="title">{title}</h3>
            </div>
            <div className="bottom">
              <div className="date">{moment.unix(created_at).format("D MMM, Y")}</div>
            </div>
          </div>) : <h3 className='missing'>{t("select_a_categorie")}</h3>}
        </div>
      </div>}

    </>
  )
}

export default Sidebar;
