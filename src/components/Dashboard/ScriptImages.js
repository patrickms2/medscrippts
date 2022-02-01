import { Swiper, SwiperSlide } from "swiper/react";
import Lightbox from 'react-image-lightbox';
import { useState } from "react";

const ScriptImages = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0)
  return (
    <>
      <div className="details-right">
        <Swiper direction={'vertical'} slidesPerView={3} >
          {images.map(({ id, path }, i) => (
            <SwiperSlide key={id} className="single-image-container">
              <img onClick={() => {
                setPhotoIndex(i)
                setIsOpen(true)
              }} src={path} alt="script" />
            </SwiperSlide>
          ))}
        </Swiper>

        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex].path}
            nextSrc={images[(photoIndex + 1) % images.length].path}
            prevSrc={images[(photoIndex + images.length - 1) % images.length].path}
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex((photoIndex + images.length - 1) % images.length)
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % images.length)
            }
          />
        )}
      </div>

    </>
  )
}

export default ScriptImages
