import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import Select from 'react-select';

import { useCategoryContext } from "../context/CategoryContext";
import { useAuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import Loader from "../components/Common/Loader";
import Error from "./Error";

const EditScript = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [count, setCount] = useState(1);
  const [links, setLinks] = useState({});
  const { t } = useTranslation()
  const { API } = useAuthContext()
  const { editScript, deleteScript, getAllScripts } = useCategoryContext()
  const navigate = useNavigate();
  const [isSelected, setIsSelected] = useState(false)
  const { register, handleSubmit } = useForm();
  const [script, setScript] = useState([])
  const { categories } = useCategoryContext()
  const params = useParams();
  const [selectedFiles, setSelectedFiles] = useState([])
  const [selectedOption, setSelectedOption] = useState('');

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
    return source.map((photo, i) => (
      <span key={i} className="position-relative img-box">
        <img src={photo.path ? photo.path : photo} alt="upload-image" />
        {!isSelected && <span onClick={() => deleteScriptImg(photo.id)} className="cross-icon"><FaTimes /></span>}
      </span>))
  }

  const onSubmit = async (data) => {
    const propertyValues = Object.values(links);
    const isPediatrics = data.isPediatrics ? 1 : 0
    const isAdult = data.isAdult ? 1 : 0
    const formData = new FormData()
    if (isSelected) {
      for (let i = 0; i < isSelected.length; i++) {
        formData.append("image[]", isSelected[i])
      }
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

    const res = await editScript(formData, params.slug)
    console.log(res)
    if (res.success) {
      getAllScripts()
      swal(res.message, "", "success");
      navigate("/")
    } else {
      swal(res.message, "", "error");
    }
  }
  const handleDeleteScript = async () => {
    const res = await deleteScript(params.slug)
    if (res.success) {
      swal(res.message, "", "success");
      getAllScripts()
      navigate("/")
    } else {
      swal(res.message, "", "error");
    }
  }
  const deleteScriptImg = (imgId) => {
    axios.get(`${API}/delete-script-image/${script.id}/${imgId}`)
      .then(res => {
        if (res.data.success) {
          setSelectedFiles(selectedFiles.filter(({ id }) => id !== imgId))
        }
      })
  }
  function autoGrow(e) {
    e.target.style.height = "90px";
    e.target.style.height = (e.target.scrollHeight) + "px";
  }

  const getScript = async () => {
    try {
      const res = await axios.get(`${API}/view-script/${params.slug}`)
      setScript(res.data.data)
      setSelectedOption(res.data.data.category_id)
      setSelectedFiles(res.data.data.images)
      setCount(res.data.data.useful_links.length)
      let newLinks = {}
      for (let i = 0; i < res.data.data.useful_links.length; i++) {
        newLinks = { ...newLinks, [i]: res.data.data.useful_links[i].link }
      }
      setLinks(newLinks)
      setIsLoading(false)
      setIsError(false)
    } catch (err) {
      setIsError(true)
      setIsLoading(false)
    }
  }

  const handleSelect = (data) => {
    setSelectedOption(data.value)
  }
  useEffect(() => {
    getScript()
  }, [])


  if (isLoading) {
    return <Loader />
  }
  if (isError) {
    return <Error height={true} />
  }
  const options = categories.map(({ id, name }) => { return { value: id, label: name } })
  const { title, pathophysiology, symptoms, diagnostics, epidemiology, treatments, category_id, isPediatrics, isAdult } = script

  return (
    <>
      <Container fluid>
        <form className="new-script-form" onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <div>
                <label className="script-label" htmlFor="title">{t("title")}</label>
                <input className="script-form" type="text" id="title" defaultValue={title} {...register("title")} required />
              </div>
              <div>
                <label className="script-label" htmlFor="pathophysiology">{t("pathophysiology")}</label>
                <textarea className="script-textarea" id="pathophysiology" {...register("pathophysiology")} required onInput={autoGrow} defaultValue={pathophysiology}></textarea>
              </div>
              <div>
                <label className="script-label" htmlFor="epidemiology">{t("epidemiology")}</label>
                <textarea className="script-textarea" onInput={autoGrow} id="epidemiology" {...register("epidemiology")} required defaultValue={epidemiology} ></textarea>
              </div>
              <div>
                <label className="script-label" htmlFor="symptoms">{t("sign_symptoms")}</label>
                <textarea className="script-textarea" onInput={autoGrow} id="symptoms" {...register("symptoms")} required defaultValue={symptoms}></textarea>
              </div>
              <div>
                <label className="script-label" htmlFor="diagnostics">{t("testing_diagnostics")}</label>
                <textarea className="script-textarea" onInput={autoGrow} id="diagnostics" {...register("diagnostics")} required defaultValue={diagnostics}></textarea>
              </div>
              <div>
                <label className="script-label" htmlFor="treatments">{t("treatments")}</label>
                <textarea className="script-textarea" onInput={autoGrow} id="treatments" {...register("treatments")} required defaultValue={treatments}></textarea>
              </div>
            </Col>
            <Col md={6}>
              <label className="script-label">{t("category")}</label>
              <Select options={options} defaultValue={options.find(item => item.value == category_id)} onChange={handleSelect} />

              <label className="script-label">{t("select_type")}</label>
              <div className="form-check form-check-inline type-check">
                <input className="form-check-input" type="checkbox" id="pedi-check" defaultChecked={isPediatrics == 1 ? true : false} value={true} {...register('isPediatrics')} />
                <label className="form-check-label" htmlFor="pedi-check"> {t("pediatrics")}</label>
              </div>
              <div className="form-check form-check-inline type-check">
                <input className="form-check-input" type="checkbox" id="adult-check" defaultChecked={isAdult == 1 ? true : false} value={true} {...register('isAdult')} />
                <label className="form-check-label" htmlFor="adult-check"> {t("adult")}</label>
              </div>

              <label className="script-label" htmlFor="useful_link1">{t("useful_links")}</label>
              {[...Array(count).keys()].map((item) => {
                return <input key={item} className="script-form color" type="text" required name={item} value={links[item]} onChange={handleChange} />
              })}
              <div className="d-flex mb-3">
                <span className="plus-btn me-2" onClick={handleClick}><FaPlus /></span>
                {count > 1 && <span className="plus-btn" onClick={handleDecrease}><FaMinus /></span>}
              </div>
              <label className="file-label" htmlFor="image"><span>{t("upload_image")}</span></label>
              <input type="file" id="image" onChange={handleImageChange} multiple />
              <div className="upload-image">
                {renderPhotos(selectedFiles)}
              </div>

              <button type="submit" className="script-btn save">{t("update_script")}</button>
              <button type="reset" onClick={handleShow} className="script-btn delete">{t("delete_script")}</button>
            </Col>
          </Row>
        </form>
      </Container >
      <Modal show={show} onHide={handleClose} centered>

        <Modal.Body className="text-center">
          <p>{t("delete_text")}</p>
          <Button onClick={handleClose} className="me-3">NO</Button>
          <Button variant="danger" onClick={handleDeleteScript}>{t("yes")}</Button>
        </Modal.Body>

      </Modal>
    </>
  )
}

export default EditScript;