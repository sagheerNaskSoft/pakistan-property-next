import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useRef, useState, useEffect } from "react";
import Card from '../Metiral/Card'
import SliderArrows from '../Metiral/SliderArrows';

function ViewedProperty() {
    const sliderRef = useRef(null)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

    /* -------------------- EFFECTS -------------------- */

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /* -------------------- RESPONSIVE -------------------- */

    const getCardsToShow = () => {
        if (windowWidth >= 1200) return 4;
        if (windowWidth >= 992) return 3;
        if (windowWidth >= 768) return 3;
        if (windowWidth >= 576) return 2;
        return 1;
    };

    const cardsToShow = getCardsToShow();
    const recentViewed = JSON.parse(localStorage.getItem("recentViewed"))

    const shouldShowSlider = windowWidth <= 1200;
    const shouldShowArrows = recentViewed?.length > cardsToShow;
    const shouldUseCarousel = shouldShowSlider || shouldShowArrows;

    /* -------------------- SLIDER SETTINGS -------------------- */

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: cardsToShow,
        slidesToScroll: 1,
        arrows: false,
        afterChange: setCurrentSlideIndex,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 3 } },
            { breakpoint: 992, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 576, settings: { slidesToShow: 1 } }
        ]
    };

    /* -------------------- JSX -------------------- */

    return (
        <>
            {recentViewed?.length ? (
                <div className='viewed_property'>
                    <div className="main-container">
                        <div className="position-relative">
                            <div className='d-flex justify-content-between align-items-center' style={{ flexWrap: 'wrap', gap: "20px" }}>
                                <h2 className='section_title m-0'>Recently Viewed Properties</h2>
                                {/* <h5 className='m-0'>
                                    <Link className='links'>View All <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M9.28866 5.29076C9.19719 5.38371 9.12459 5.4943 9.07505 5.61615C9.02551 5.73799 9 5.86868 9 6.00068C9 6.13268 9.02551 6.26337 9.07505 6.38521C9.12459 6.50706 9.19719 6.61765 9.28866 6.7106L13.7581 11.2901C13.8496 11.383 13.9222 11.4936 13.9717 11.6155C14.0212 11.7373 14.0468 11.868 14.0468 12C14.0468 12.132 14.0212 12.2627 13.9717 12.3845C13.9222 12.5064 13.8496 12.617 13.7581 12.7099L9.28866 17.2894C9.19719 17.3824 9.12459 17.4929 9.07505 17.6148C9.02551 17.7366 9 17.8673 9 17.9993C9 18.1313 9.02551 18.262 9.07505 18.3839C9.12459 18.5057 9.19719 18.6163 9.28866 18.7092C9.4715 18.8955 9.71883 19 9.97664 19C10.2344 19 10.4818 18.8955 10.6646 18.7092L15.1438 14.1198C15.6921 13.5573 16 12.7949 16 12C16 11.2051 15.6921 10.4427 15.1438 9.88024L10.6646 5.29076C10.4818 5.10453 10.2344 5 9.97664 5C9.71883 5 9.4715 5.10453 9.28866 5.29076Z" fill="#2D2D2D" />
                                    </svg></Link>
                                </h5> */}
                            </div>

                            {/* -------------------- CONTENT -------------------- */}
                            {windowWidth > 576 ? (
                                <div className="position-relative">
                                    <div style={{ overflow: 'hidden', maxWidth: '1220px', marginTop: '29px' }}>
                                        {shouldUseCarousel ? (
                                              <Slider ref={sliderRef} {...sliderSettings}>
                                              {recentViewed.map((card, i) => (
                                                  <div key={i} style={{ padding: '0 12px' }}>
                                                      <Card cardTypeDisabled={true} data={card} width={true} />
                                                  </div>
                                              ))}
                                          </Slider>
                                        ) : (
                                            <div className='row d-md-flex d-none mx-0 w-100' style={{ display: 'flex', flexWrap: 'nowrap', gap: '24px', width: '100%' }}>
                                                {recentViewed?.map((item, index) => (
                                                    <div key={index} style={{ display: 'flex', height: '100%', minHeight: "351px", flex: '1 1 0', minWidth: '0' }}>
                                                        <Card data={item} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {shouldUseCarousel && shouldShowArrows && (
                                        <SliderArrows
                                            sliderRef={sliderRef}
                                            totalSlides={recentViewed?.length || 0}
                                            slidesToShow={cardsToShow}
                                            uniqueId="viewed-property"
                                            currentSlideIndex={currentSlideIndex}
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="global-scroll-box d-md-none d-flex mt-md-0 mt-sm-4 mt-0" style={{ gap: "24px" }}>
                                    {recentViewed?.map((item, index) => (
                                        <Card key={index} mobileChanged={true} gridNumber={true} data={item} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : ""}
        </>
    )
}

export default ViewedProperty