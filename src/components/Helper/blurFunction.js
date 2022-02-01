export const handlePathophysiology = (e) => {
  const collection = document.querySelectorAll(".patho")
  const allBlur = document.getElementById("all-blur")
  if (e.target.checked == true) {
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.add("blur")
      localStorage.setItem("patho", true)
    }
  } else {
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.remove("blur")
      localStorage.removeItem("patho")
      localStorage.removeItem("allBlur")
      allBlur.checked = false
    }
  }
}
export const handleEpidemiology = (e) => {
  const collection = document.querySelectorAll(".epide")
  const allBlur = document.getElementById("all-blur")
  if (e.target.checked == true) {
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.add("blur")
      localStorage.setItem("epide", true)
    }
  } else {
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.remove("blur")
      localStorage.removeItem("epide")
      localStorage.removeItem("allBlur")
      allBlur.checked = false
    }
  }
}
export const handleSymptoms = (e) => {
  const collection = document.querySelectorAll(".symp")
  const allBlur = document.getElementById("all-blur")
  if (e.target.checked == true) {
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.add("blur")
      localStorage.setItem("symp", true)
    }
  } else {
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.remove("blur")
      localStorage.removeItem("symp")
      localStorage.removeItem("allBlur")
      allBlur.checked = false
    }
  }
}
export const handleDiagnosis = (e) => {
  const collection = document.querySelectorAll(".diagn")
  const allBlur = document.getElementById("all-blur")
  if (e.target.checked == true) {
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.add("blur")
      localStorage.setItem("diagn", true)
    }
  } else {
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.remove("blur")
      localStorage.removeItem("diagn")
      localStorage.removeItem("allBlur")
      allBlur.checked = false
    }
  }
}
export const handleTreatments = (e) => {
  const collection = document.querySelectorAll(".treat")
  const allBlur = document.getElementById("all-blur")
  if (e.target.checked == true) {
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.add("blur")
      localStorage.setItem("treat", true)
    }
  } else {
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.remove("blur")
      localStorage.removeItem("treat")
      localStorage.removeItem("allBlur")
      allBlur.checked = false
    }
  }
}