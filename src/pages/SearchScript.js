import { useEffect } from "react";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useCategoryContext } from "../context/CategoryContext"

const SearchScript = () => {
  const params = useParams();
  const { scripts } = useCategoryContext();
  const [allScripts, setAllScripts] = useState([])

  useEffect(() => {
    setAllScripts(scripts.filter((item) => item.title.toLowerCase().includes(params.keyword.toLowerCase())))
  }, [params.keyword])

  if (allScripts.length === 0) {
    return <h2>No Data Found</h2>
  }
  return (
    <Container>
      <Row className="justify-content-center">
        {allScripts.map(({ title, pathophysiology, symptoms, epidemiology, diagnostics, treatments }, i) => (<Col key={i} md={6} >
          <div className="compare-data-table">
            <h2 className="title">{title}</h2>
            <div className="details">
              <p>{pathophysiology}</p>
              <p>{epidemiology}</p>
              <p>{symptoms}</p>
              <p>{diagnostics}</p>
              <p>{treatments}</p>
            </div>
          </div>
        </Col>))}
      </Row>
    </Container>
  )
}

export default SearchScript
