import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Select from 'react-select';
import spinner from '../assets/images/spinner.svg';

import { useCategoryContext } from "../context/CategoryContext";
import AddCategory from "../components/Helper/AddCategory";

const Script = () => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(1);
  const [links, setLinks] = useState({});
  const { t } = useTranslation()
  const { addScript, getAllScripts } = useCategoryContext()
  const navigate = useNavigate()
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isSelected, setIsSelected] = useState(false)
  const { register, handleSubmit } = useForm();
  const { categories } = useCategoryContext();
  const [selectedOption, setSelectedOption] = useState('');
  const [addShow, setAddShow] = useState(false)

  const handleAddShow = () => setAddShow(true)
  const handleAddClose = () => setAddShow(false)

  const handleClick = () => {
    setCount(count + 1)
  }
  const handleDecrease = () => {
    delete links[count - 1]
    setCount(count - 1)
  }

  function handleChange(evt) {
    const value = evt.target.value;
    setLinks({
      ...links,
      [evt.target.name]: value
    });
  }

  const handleImageChange = (e) => {
    setSelectedFiles([])
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(file => URL.createObjectURL(file))
      setSelectedFiles(prevImages => prevImages.concat(filesArray))
      Array.from(e.target.files).map(
        (file) => URL.revokeObjectURL(file)
      )
    }
    setIsSelected(e.target.files)
  }
  const renderPhotos = (source) => {
    return source.map((photo, i) => <img key={i} src={photo} alt="upload-image" />)
  }
  const onSubmit = async (data) => {
    setLoading(true)
    const propertyValues = Object.values(links);
    const isPediatrics = data.isPediatrics ? 1 : 0
    const isAdult = data.isAdult ? 1 : 0
    const formData = new FormData()

    for (let i = 0; i < isSelected.length; i++) {
      formData.append("image[]", isSelected[i])
    }
    for (let i = 0; i < propertyValues.length; i++) {
      formData.append("useful_link[]", propertyValues[i])
    }
    formData.append("category_id", selectedOption)
    formData.append("title", data.title)
    formData.append("pathophysiology", data.pathophysiology)
    formData.append("diagnostics", data.diagnostics)
    formData.append("symptoms", data.symptoms)
    formData.append("treatments", data.treatments)
    formData.append("epidemiology", data.epidemiology)
    formData.append("isPediatrics", isPediatrics)
    formData.append("isAdult", isAdult)

    const res = await addScript(formData)
    if (res.success) {
      setLoading(false)
      swal(res.message, "", "success");
      getAllScripts()
      navigate("/")
    } else {
      setLoading(false)
      swal(res.errors[Object.keys(res.errors)[0]][0], "", "error");
    }

  }
  function autoGrow(e) {
    e.target.style.height = "90px";
    e.target.style.height = (e.target.scrollHeight) + "px";
  }
  const handleSelect = (data) => {
    setSelectedOption(data.value)
  }
  const options = categories.map(({ id, name }) => { return { value: id, label: name } })
  return (
    <>
      <Container fluid>
        <form className="new-script-form" onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <div>
                <label className="script-label" htmlFor="title">{t("title")}</label>
                <input className="script-form" type="text" id="title" {...register("title")} required placeholder={`${t("write")} ${t("title")}`} />
              </div>
              <div>
                <label className="script-label" htmlFor="pathophysiology">{t("pathophysiology")}</label>
                <textarea className="script-textarea" id="pathophysiology" {...register("pathophysiology")} required onInput={autoGrow} placeholder={`${t("write")} ${t("pathophysiology")}`}></textarea>
              </div>
              <div>
                <label className="script-label" htmlFor="epidemiology">{t("epidemiology")}</label>
                <textarea className="script-textarea" onInput={autoGrow} id="epidemiology" {...register("epidemiology")} required placeholder={`${t("write")} ${t("epidemiology")}`}></textarea>
              </div>
              <div>
                <label className="script-label" htmlFor="symptoms">{t("sign_symptoms")}</label>
                <textarea className="script-textarea" onInput={autoGrow} id="symptoms" {...register("symptoms")} required placeholder={`${t("write")} ${t("sign_symptoms")}`}></textarea>
              </div>
              <div>
                <label className="script-label" htmlFor="diagnostics">{t("testing_diagnostics")}</label>
                <textarea className="script-textarea" onInput={autoGrow} id="diagnostics" {...register("diagnostics")} required placeholder={`${t("write")} ${t("testing_diagnostics")}`}></textarea>
              </div>
              <div>
                <label className="script-label" htmlFor="treatments">{t("treatments")}</label>
                <textarea className="script-textarea" onInput={autoGrow} id="treatments" {...register("treatments")} required placeholder={`${t("write")} ${t("treatments")}`}></textarea>
              </div>
            </Col>

            <Col md={6}>
              <div className="top-label">
                <label className="script-label">{t("category")}</label>
                <button onClick={handleAddShow}>+ {t("add_category")}</button>
              </div>
              <Select options={options} placeholder={t("select_categorie")} onChange={handleSelect} />

              <label className="script-label">{t("select_type")}</label>
              <div className="form-check form-check-inline type-check">
                <input className="form-check-input" type="checkbox" id="pedi-check" value={true} {...register('isPediatrics')} />
                <label className="form-check-label" htmlFor="pedi-check"> {t("pediatrics")}</label>
              </div>
              <div className="form-check form-check-inline type-check">
                <input className="form-check-input" type="checkbox" id="adult-check" value={true} {...register('isAdult')} />
                <label className="form-check-label" htmlFor="adult-check"> {t("adult")}</label>
              </div>

              <label className="script-label" htmlFor="useful_link1">{t("useful_links")}</label>
              {[...Array(count).keys()].map((item) => <input key={item} className="script-form color" type="text" name={item} required value={links.item} onChange={handleChange} placeholder={`https://link${item}.com`} />)}

              <div className="d-flex mb-3">
                <span className="plus-btn me-2" onClick={handleClick}><FaPlus /></span>
                {count > 1 && <span className="plus-btn" onClick={handleDecrease}><FaMinus /></span>}
              </div>

              <label className="file-label" htmlFor="image"><span>{t("upload_image")}</span></label>
              <input onChange={handleImageChange} type="file" id="image" multiple />
              <div className="upload-image">
                {renderPhotos(selectedFiles)}
              </div>

              <button type="submit" className="script-btn save">
                {t("save_script")}
                {loading && <img src={spinner} alt="spinner" />}
              </button>
              <button type="reset" onClick={() => navigate("/")} className="script-btn delete">{t("delete_script")}</button>
            </Col>
          </Row>
        </form>
      </Container>
      <AddCategory addShow={addShow} handleAddClose={handleAddClose} />
    </>
  )
}

export default Script;
