import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import search from '../../assets/images/search.png';
import { useAuthContext } from '../../context/AuthContext';

const HeaderSearch = () => {
  const { API } = useAuthContext()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [filterdata, setFilterdata] = useState([]);
  const [wordInter, setWordInter] = useState('');

  const handleFilter = async (e) => {
    const searchWord = e.target.value
    setWordInter(searchWord)
    if (searchWord) {
      const res = await axios.get(`${API}/search/scripts/${searchWord}?limit=5`)
      setFilterdata(res.data.data.data)
      console.log(e.target.value)
    } else {
      console.log('empty')
      setFilterdata([])
    }
  }
  const clearInput = () => {
    setFilterdata([])
    setWordInter("")
  }

  return <div className="header-search position-relative">
    <div className="serch-box position-relative">
      <input onChange={handleFilter} value={wordInter} type="text" placeholder={t("search_scrippts")} autoComplete="off" />
      <button>
        {wordInter ? <FaTimes onClick={clearInput} /> : <img src={search} alt="search" />}
      </button>
    </div>
    {filterdata.length !== 0 && <div className="data-result">
      {filterdata.map(({ title, id, slug }) => (
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
