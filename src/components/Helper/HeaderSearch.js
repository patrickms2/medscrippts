import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCategoryContext } from '../../context/CategoryContext';
import search from '../../assets/images/search.png';
import { FaTimes } from 'react-icons/fa';

const HeaderSearch = () => {
  const navigate = useNavigate()
  const { scripts, getAllScripts } = useCategoryContext()
  const [filterdata, setFilterdata] = useState([]);
  const [wordInter, setWordInter] = useState('');

  const handleFilter = (e) => {
    const searchWord = e.target.value
    setWordInter(searchWord)
    const newFilter = scripts.filter((item) => item.title.toLowerCase().includes(searchWord.toLowerCase()))
    if (searchWord) {
      setFilterdata(newFilter)
    } else {
      setFilterdata([])
    }
  }
  const clearInput = () => {
    setFilterdata([])
    setWordInter("")
  }
  useEffect(() => {
    getAllScripts()
  }, [])

  return <div className="header-search position-relative">
    <div className="serch-box position-relative">
      <input onChange={handleFilter} value={wordInter} type="text" placeholder={t("search_scrippts")} autoComplete="off" />
      <button>
        {wordInter ? <FaTimes onClick={clearInput} /> : <img src={search} alt="search" />}
        {/* <img src={search} alt="search" /> */}
      </button>
    </div>
    {filterdata.length !== 0 && <div className="data-result">
      {scripts && filterdata.slice(0, 15).map(({ title, id, slug }) => (
        <div key={id} onClick={() => {
          setFilterdata([])
          setWordInter("")
          navigate(`/view-script/${slug}`)
        }} className="data-item">
          <p>{title}</p>
        </div>
      ))}
    </div>}

  </div>;
};

export default HeaderSearch;
