import React, { useRef, useState, useEffect } from 'react'
import Card from '../Metiral/Card'
import property_not_found from '../../Asset/property_not_found.svg'
import NoResultFound from '../Metiral/NoResultFound'
import { FallbackImage } from '../Metiral/FallbackImage'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SimilerProperty({ similarPropertyData, areaPropertyData, propertyData }) {
  const similarSliderRef = useRef(null);
  const areaSliderRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentSlidesToShow, setCurrentSlidesToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      // Determine current slidesToShow based on breakpoint
      if (width < 576) {
        setCurrentSlidesToShow(1);
      } else if (width < 768) {
        setCurrentSlidesToShow(2);
      } else {
        setCurrentSlidesToShow(3);
      }
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Determine if slider should be shown (more than 3 cards and below 768px)
  const shouldShowSimilarSlider = windowWidth < 768 && similarPropertyData?.length > 3;
  const shouldShowAreaSlider = windowWidth < 768 && areaPropertyData?.length > 3;
  return (
    <>
      <div>
        {similarPropertyData?.length > 0 ?
          <>
            <h3 className='similar-properties-heading'>More Listings by This Agent</h3>
            <div className='position-relative'>
              {/* Desktop: global-scroll-box (above 768px) */}
              <div className={`d-none d-md-flex ${shouldShowSimilarSlider ? 'global-scroll-box' : ''}`} style={{ gap: "24px" }}>
                {similarPropertyData?.length ? similarPropertyData?.map((item, index) => {
                  return (
                    <Card mobileChanged={true} key={index} data={item} length={similarPropertyData?.length} />
                  )
                }) : <div className="property_not_found">
                  <FallbackImage src={property_not_found} alt="property_not_found" componentName="SimilerProperty" />
                </div>}
              </div>

              {/* Mobile: Slick Slider (below 768px and more than 3 cards) */}
              {shouldShowSimilarSlider ? (
                <Slider ref={similarSliderRef} {...sliderSettings}>
                  {similarPropertyData?.map((item, index) => {
                    return (
                      <div key={index} style={{ paddingRight: "12px" }}>
                        <Card data={item}  />
                      </div>
                    )
                  })}
                </Slider>
              ) : (
                // Mobile: global-scroll-box when 3 or fewer cards
                <div className='global-scroll-box d-md-none d-flex' style={{ gap: "24px" }}>
                  {similarPropertyData?.map((item, index) => {
                    return (
                      <Card mobileChanged={true} key={index} data={item} length={similarPropertyData?.length} />
                    )
                  })}
                </div>
              )}

              {/* Arrow controls for mobile slider */}
              {shouldShowSimilarSlider && similarPropertyData?.length > currentSlidesToShow && (
                <>
                  <div className="new-arrow-box" style={{ left: "-15px" }} onClick={() => similarSliderRef.current?.slickPrev()}>
                    <svg style={{ transform: `scaleX(-1)` }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <g clipPath="url(#clip0_similar_prev)">
                        <path d="M4.66663 16C4.57889 16.0005 4.49191 15.9837 4.41069 15.9505C4.32946 15.9173 4.25559 15.8684 4.19329 15.8066C4.13081 15.7447 4.08121 15.6709 4.04737 15.5897C4.01352 15.5084 3.99609 15.4213 3.99609 15.3333C3.99609 15.2453 4.01352 15.1582 4.04737 15.0769C4.08121 14.9957 4.13081 14.9219 4.19329 14.86L9.63996 9.4133C10.0145 9.0383 10.2249 8.52997 10.2249 7.99997C10.2249 7.46997 10.0145 6.96164 9.63996 6.58664L4.19329 1.13998C4.06776 1.01444 3.99723 0.844181 3.99723 0.666647C3.99723 0.489113 4.06776 0.31885 4.19329 0.193314C4.31883 0.0677786 4.48909 -0.00274658 4.66663 -0.00274658C4.84416 -0.00274658 5.01442 0.0677786 5.13996 0.193314L10.5866 5.63997C10.897 5.94961 11.1433 6.31745 11.3114 6.72242C11.4794 7.12738 11.5659 7.56152 11.5659 7.99997C11.5659 8.43842 11.4794 8.87256 11.3114 9.27753C11.1433 9.68249 10.897 10.0503 10.5866 10.36L5.13996 15.8066C5.07767 15.8684 5.00379 15.9173 4.92256 15.9505C4.84134 15.9837 4.75436 16.0005 4.66663 16Z" fill="#2D2D2D" />
                      </g>
                      <defs>
                        <clipPath id="clip0_similar_prev">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="new-arrow-box" style={{ right: "-15px" }} onClick={() => similarSliderRef.current?.slickNext()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <g clipPath="url(#clip0_similar_next)">
                        <path d="M4.66663 16C4.57889 16.0005 4.49191 15.9837 4.41069 15.9505C4.32946 15.9173 4.25559 15.8684 4.19329 15.8066C4.13081 15.7447 4.08121 15.6709 4.04737 15.5897C4.01352 15.5084 3.99609 15.4213 3.99609 15.3333C3.99609 15.2453 4.01352 15.1582 4.04737 15.0769C4.08121 14.9957 4.13081 14.9219 4.19329 14.86L9.63996 9.4133C10.0145 9.0383 10.2249 8.52997 10.2249 7.99997C10.2249 7.46997 10.0145 6.96164 9.63996 6.58664L4.19329 1.13998C4.06776 1.01444 3.99723 0.844181 3.99723 0.666647C3.99723 0.489113 4.06776 0.31885 4.19329 0.193314C4.31883 0.0677786 4.48909 -0.00274658 4.66663 -0.00274658C4.84416 -0.00274658 5.01442 0.0677786 5.13996 0.193314L10.5866 5.63997C10.897 5.94961 11.1433 6.31745 11.3114 6.72242C11.4794 7.12738 11.5659 7.56152 11.5659 7.99997C11.5659 8.43842 11.4794 8.87256 11.3114 9.27753C11.1433 9.68249 10.897 10.0503 10.5866 10.36L5.13996 15.8066C5.07767 15.8684 5.00379 15.9173 4.92256 15.9505C4.84134 15.9837 4.75436 16.0005 4.66663 16Z" fill="#2D2D2D" />
                      </g>
                      <defs>
                        <clipPath id="clip0_similar_next">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </>
              )}
            </div>
          </> : ""}
        {
          similarPropertyData?.length > 0 && areaPropertyData?.length > 0 &&
          <span className='deatial-hr-marketing'>
            <hr style={{ marginBottom: '30px', marginTop: '40px' }} />
          </span>
        }
        {areaPropertyData?.length ? <div className='cards-heading-property'>
          <h3 className='similar-properties-heading'>Similar properties around {propertyData?.location?.name}</h3>
        </div> : ""}
        {areaPropertyData?.length ? (
          <div className='position-relative'>
            {/* Desktop: global-scroll-box (above 768px) */}
            <div className='global-scroll-box d-none d-md-flex' style={{ gap: "24px" }}>
              {areaPropertyData?.map((item, index) => {
                return (
                  <Card key={index} data={item} length={areaPropertyData?.length} />
                )
              })}
            </div>

            {/* Mobile: Slick Slider (below 768px and more than 3 cards) */}
            {shouldShowAreaSlider ? (
              <Slider ref={areaSliderRef} {...sliderSettings}>
                {areaPropertyData?.map((item, index) => {
                  return (
                    <div key={index} style={{ paddingRight: "12px" }}>
                      <Card data={item} length={areaPropertyData?.length} />
                    </div>
                  )
                })}
              </Slider>
            ) : (
              // Mobile: global-scroll-box when 3 or fewer cards
              <div className='global-scroll-box d-md-none d-flex' style={{ gap: "24px" }}>
                {areaPropertyData?.map((item, index) => {
                  return (
                    <Card mobileChanged={true} key={index} data={item} length={areaPropertyData?.length} />
                  )
                })}
              </div>
            )}

            {/* Arrow controls for mobile slider */}
            {shouldShowAreaSlider && areaPropertyData?.length > currentSlidesToShow && (
              <>
                <div className="new-arrow-box" style={{ left: "-15px" }} onClick={() => areaSliderRef.current?.slickPrev()}>
                  <svg style={{ transform: `scaleX(-1)` }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <g clipPath="url(#clip0_area_prev)">
                      <path d="M4.66663 16C4.57889 16.0005 4.49191 15.9837 4.41069 15.9505C4.32946 15.9173 4.25559 15.8684 4.19329 15.8066C4.13081 15.7447 4.08121 15.6709 4.04737 15.5897C4.01352 15.5084 3.99609 15.4213 3.99609 15.3333C3.99609 15.2453 4.01352 15.1582 4.04737 15.0769C4.08121 14.9957 4.13081 14.9219 4.19329 14.86L9.63996 9.4133C10.0145 9.0383 10.2249 8.52997 10.2249 7.99997C10.2249 7.46997 10.0145 6.96164 9.63996 6.58664L4.19329 1.13998C4.06776 1.01444 3.99723 0.844181 3.99723 0.666647C3.99723 0.489113 4.06776 0.31885 4.19329 0.193314C4.31883 0.0677786 4.48909 -0.00274658 4.66663 -0.00274658C4.84416 -0.00274658 5.01442 0.0677786 5.13996 0.193314L10.5866 5.63997C10.897 5.94961 11.1433 6.31745 11.3114 6.72242C11.4794 7.12738 11.5659 7.56152 11.5659 7.99997C11.5659 8.43842 11.4794 8.87256 11.3114 9.27753C11.1433 9.68249 10.897 10.0503 10.5866 10.36L5.13996 15.8066C5.07767 15.8684 5.00379 15.9173 4.92256 15.9505C4.84134 15.9837 4.75436 16.0005 4.66663 16Z" fill="#2D2D2D" />
                    </g>
                    <defs>
                      <clipPath id="clip0_area_prev">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="new-arrow-box" style={{ right: "-15px" }} onClick={() => areaSliderRef.current?.slickNext()}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <g clipPath="url(#clip0_area_next)">
                      <path d="M4.66663 16C4.57889 16.0005 4.49191 15.9837 4.41069 15.9505C4.32946 15.9173 4.25559 15.8684 4.19329 15.8066C4.13081 15.7447 4.08121 15.6709 4.04737 15.5897C4.01352 15.5084 3.99609 15.4213 3.99609 15.3333C3.99609 15.2453 4.01352 15.1582 4.04737 15.0769C4.08121 14.9957 4.13081 14.9219 4.19329 14.86L9.63996 9.4133C10.0145 9.0383 10.2249 8.52997 10.2249 7.99997C10.2249 7.46997 10.0145 6.96164 9.63996 6.58664L4.19329 1.13998C4.06776 1.01444 3.99723 0.844181 3.99723 0.666647C3.99723 0.489113 4.06776 0.31885 4.19329 0.193314C4.31883 0.0677786 4.48909 -0.00274658 4.66663 -0.00274658C4.84416 -0.00274658 5.01442 0.0677786 5.13996 0.193314L10.5866 5.63997C10.897 5.94961 11.1433 6.31745 11.3114 6.72242C11.4794 7.12738 11.5659 7.56152 11.5659 7.99997C11.5659 8.43842 11.4794 8.87256 11.3114 9.27753C11.1433 9.68249 10.897 10.0503 10.5866 10.36L5.13996 15.8066C5.07767 15.8684 5.00379 15.9173 4.92256 15.9505C4.84134 15.9837 4.75436 16.0005 4.66663 16Z" fill="#2D2D2D" />
                    </g>
                    <defs>
                      <clipPath id="clip0_area_next">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </>
            )}
          </div>
        ) : ""}
      </div>
    </>
  )
}

export default SimilerProperty
