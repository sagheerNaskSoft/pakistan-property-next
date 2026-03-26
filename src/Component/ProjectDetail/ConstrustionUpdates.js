import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "./ConstrustionUpdates.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";

// Slick CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ConstructionUpdate = ({ construction_update, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [currentSlides, setCurrentSlides] = useState([]);
  const sliderRef = useRef(null)
  if (!Array.isArray(construction_update) || construction_update.length === 0) {
    return null;
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const handleImageClick = (item, imageIndex = 0) => {
    const slides =
      item?.images?.map((image) => ({
        src: image?.url,
        title: item?.title,
        description: formatDate(item?.month_date),
      })) || [];

    setCurrentSlides(slides);
    setPhotoIndex(imageIndex);
    setIsOpen(true);
  };

  const sliderSettings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: false,
    arrows: false,
    dots: false,
    centerMode: false,
    centerPadding: '0px',
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, centerMode: false, centerPadding: '0px' } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerMode: false, centerPadding: '0px' } },
    ],
  };

  return (
    <div className="construction-section">
      <h3 className="cs-title">Construction Updates</h3>
     {
      construction_update.length > 3 && 
      <div className="timeline-container w-100 justify-content-between">
      <button className="arrow-btn ps-0" onClick={() => { sliderRef.current?.slickPrev() }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="12" transform="matrix(-1 0 0 1 24 0)" fill="#D9D9D9" />
          <path d="M13.7951 19.1998C13.874 19.2002 13.9523 19.1851 14.0254 19.1553C14.0985 19.1254 14.1649 19.0814 14.221 19.0258C14.2772 18.9701 14.3218 18.9037 14.3523 18.8306C14.3828 18.7575 14.3984 18.6791 14.3984 18.5999C14.3984 18.5207 14.3828 18.4423 14.3523 18.3692C14.3218 18.2961 14.2772 18.2297 14.221 18.174L9.31982 13.2728C8.9828 12.9354 8.7935 12.4779 8.7935 12.001C8.7935 11.5241 8.9828 11.0667 9.31982 10.7292L14.221 5.82808C14.334 5.71512 14.3974 5.56191 14.3974 5.40216C14.3974 5.2424 14.334 5.08919 14.221 4.97623C14.108 4.86327 13.9548 4.7998 13.7951 4.7998C13.6353 4.7998 13.4821 4.86327 13.3691 4.97623L8.46797 9.87739C8.18863 10.156 7.96702 10.487 7.8158 10.8514C7.66459 11.2158 7.58675 11.6065 7.58675 12.001C7.58675 12.3956 7.66459 12.7862 7.8158 13.1506C7.96702 13.515 8.18863 13.846 8.46797 14.1247L13.3691 19.0258C13.4252 19.0814 13.4917 19.1254 13.5648 19.1553C13.6378 19.1851 13.7161 19.2002 13.7951 19.1998Z" fill="#2D2D2D" />
        </svg>
      </button>

      <button className="arrow-btn pe-0" onClick={() => { sliderRef.current?.slickNext() }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="12" fill="#D9D9D9" />
          <path d="M10.2049 19.1998C10.126 19.2002 10.0477 19.1851 9.97463 19.1553C9.90154 19.1254 9.83507 19.0814 9.77901 19.0258C9.72278 18.9701 9.67815 18.9037 9.6477 18.8306C9.61724 18.7575 9.60156 18.6791 9.60156 18.5999C9.60156 18.5207 9.61724 18.4423 9.6477 18.3692C9.67815 18.2961 9.72278 18.2297 9.77901 18.174L14.6802 13.2728C15.0172 12.9354 15.2065 12.4779 15.2065 12.001C15.2065 11.5241 15.0172 11.0667 14.6802 10.7292L9.77901 5.82808C9.66605 5.71512 9.60259 5.56191 9.60259 5.40216C9.60259 5.2424 9.66605 5.08919 9.77901 4.97623C9.89197 4.86327 10.0452 4.7998 10.2049 4.7998C10.3647 4.7998 10.5179 4.86327 10.6309 4.97623L15.532 9.87739C15.8114 10.156 16.033 10.487 16.1842 10.8514C16.3354 11.2158 16.4132 11.6065 16.4132 12.001C16.4132 12.3956 16.3354 12.7862 16.1842 13.1506C16.033 13.515 15.8114 13.846 15.532 14.1247L10.6309 19.0258C10.5748 19.0814 10.5083 19.1254 10.4352 19.1553C10.3622 19.1851 10.2839 19.2002 10.2049 19.1998Z" fill="#2D2D2D" />
        </svg>
      </button>
    </div>
     }
      <Slider ref={sliderRef}  {...sliderSettings} className="construction-slider">
        {construction_update.map((item, idx) => (
          <div key={item.id || idx} className="slider-item">

            {/* DATE TAB */}
            <div className="position-relative">
              <div className="timeline-date text-center mb-2">
                {formatDate(item?.month_date)}
              </div>
              {construction_update.length > 2 && idx !== construction_update.length - 1 && (
                <div className="arrow-box" style={{ position: "absolute", top: 2, right: 12 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="142" height="1" viewBox="0 0 142 1" fill="none">
                    <path d="M0 0.5L142 0.499988" stroke="#2D2D2D" strokeDasharray="6 6" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M10.2049 19.1998C10.126 19.2002 10.0477 19.1851 9.97463 19.1553C9.90154 19.1254 9.83507 19.0814 9.77901 19.0258C9.72278 18.9701 9.67815 18.9037 9.6477 18.8306C9.61724 18.7575 9.60156 18.6791 9.60156 18.5999C9.60156 18.5207 9.61724 18.4423 9.6477 18.3692C9.67815 18.2961 9.72278 18.2297 9.77901 18.174L14.6802 13.2728C15.0172 12.9354 15.2065 12.4779 15.2065 12.001C15.2065 11.5241 15.0172 11.0667 14.6802 10.7292L9.77901 5.82808C9.66605 5.71512 9.60259 5.56191 9.60259 5.40216C9.60259 5.2424 9.66605 5.08919 9.77901 4.97623C9.89197 4.86327 10.0452 4.7998 10.2049 4.7998C10.3647 4.7998 10.5179 4.86327 10.6309 4.97623L15.532 9.87739C15.8114 10.156 16.033 10.487 16.1842 10.8514C16.3354 11.2158 16.4132 11.6065 16.4132 12.001C16.4132 12.3956 16.3354 12.7862 16.1842 13.1506C16.033 13.515 15.8114 13.846 15.532 14.1247L10.6309 19.0258C10.5748 19.0814 10.5083 19.1254 10.4352 19.1553C10.3622 19.1851 10.2839 19.2002 10.2049 19.1998Z" fill="#2D2D2D" />
                  </svg>
                </div>
              )}
            </div>

            {/* CARD */}
            <div
              className="update-card"
              onClick={() => handleImageClick(item, 0)}
            >
              <img
                className="update-img"
                src={item?.images?.[0]?.url}
                alt={item?.title}
              />
              <div className="update-content">
                <h4>{item?.title}</h4>
                <p>{title}</p>
              </div>
            </div>

          </div>
        ))}
      </Slider>

      {/* LIGHTBOX */}
      {isOpen && currentSlides.length > 0 && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={currentSlides}
          index={photoIndex}
          plugins={[Fullscreen, Slideshow, Thumbnails, Zoom, Download, Counter]}
          counter={{ container: { style: { top: "20px" } } }}
        />
      )}
    </div>
  );
};

export default ConstructionUpdate;


