import label from '../../Asset/Agencies/Agencies TAG.svg'
import back from '../../Asset/Agencies/Vector.svg'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/ContextProvider'
import { FallbackImage } from '../Metiral/FallbackImage';
import SliderArrows from '../Metiral/SliderArrows';

import Image from 'next/image';
function FeaturedAgencies({ agencyData }) {
    const { loading } = useAuth()
    const sliderRef = useRef(null)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const currentSlidesToShow = windowWidth < 576 ? 1 : windowWidth < 992 ? 2 : 4;
    const shouldShowArrows = agencyData?.length > currentSlidesToShow;

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        afterChange: (index) => {
            setCurrentSlideIndex(index);
        },
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    afterChange: (index) => {
                        setCurrentSlideIndex(index);
                    },
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    afterChange: (index) => {
                        setCurrentSlideIndex(index);
                    },
                },
            },
        ],
    };

    const navigate = useNavigate()
    const handleClick = (id) => {
        navigate(`/agency-detail/${id}`)
    }

    // Loading or no data state
    if (loading || !agencyData || agencyData.length === 0) {
        return (
            <div className='featured-agency'>
                <div className="heading">
                    <div className='placeholder-glow'>
                        <div className='placeholder' style={{ width: '300px', height: '32px' }} />
                    </div>
                </div>
                <div className="card-box row">
                    <div className="global-scroll-box d-flex" style={{ gap: "24px" }}>
                        {[...Array(4)].map((_, index) => (
                            <div key={index} style={{ flexShrink: 0 }}>
                                <div className="featured-agency-card" style={{ minWidth: "288px" }}>
                                    <div className="placeholder-glow">
                                        {/* Label placeholder */}
                                        <div className="label placeholder" style={{ width: '60px', height: '20px', borderRadius: '4px', marginBottom: '8px' }} />
                                        {/* Image placeholder */}
                                        <div className="img placeholder" style={{ width: '100%', height: '120px', borderRadius: '8px', marginBottom: '12px' }} />
                                        {/* Text box placeholder */}
                                        <div className="text-box">
                                            <div className="title placeholder" style={{ width: '80%', height: '20px', marginBottom: '8px' }} />
                                            <div className="location placeholder" style={{ width: '60%', height: '16px' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='featured-agency'>
            <div className="heading">Trusted Agencies & Property Agents in Pakistan
            </div>
            <div className="card-box row ">
                    {
                        agencyData?.length > 4 && window.innerWidth >= 576 ? (
                            // ✅ Show in Slider if more than 3 cards
                            <div>
                            <Slider ref={sliderRef} {...sliderSettings}>
                                {agencyData?.map((data, index) => (
                                    <div onClick={() => handleClick(data?.id || data?.agency_profile?.agency_id)} className="col-12" key={index}>
                                        <div className="featured-agency-card">
                                            {
                                                data?.agency_profile?.is_featured
                                                    ?
                                                    <div className="label">
                                                        <FallbackImage src={label} alt="" componentName="FeaturedAgencies" />
                                                    </div>
                                                    : ""
                                            }
                                            <div className="img">
                                                <FallbackImage src={data?.agency_profile?.agency_image} alt="" componentName="AgencyDefault" />
                                            </div>
                                            <div className="text-box">
                                                <div className="title">{data?.agency_profile?.agency_name}</div>
                                                <div className="location">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path
                                                            d="M7.9987 14C10.332 11.6 12.6654 9.45093 12.6654 6.8C12.6654 4.14903 10.576 2 7.9987 2C5.42137 2 3.33203 4.14903 3.33203 6.8C3.33203 9.45093 5.66536 11.6 7.9987 14Z"
                                                            stroke="#737678"
                                                            strokeWidth="1.33333"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M8 8.66699C9.1046 8.66699 10 7.77159 10 6.66699C10 5.56243 9.1046 4.66699 8 4.66699C6.8954 4.66699 6 5.56243 6 6.66699C6 7.77159 6.8954 8.66699 8 8.66699Z"
                                                            stroke="#737678"
                                                            strokeWidth="1.33333"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <span>{data?.agency_profile?.city?.name}</span>
                                                </div>
                                            </div>
                                            <div className="back-img">
                                                <FallbackImage src={back} alt="" componentName="FeaturedAgencies" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                            {shouldShowArrows && (
                                <SliderArrows
                                    sliderRef={sliderRef}
                                    totalSlides={agencyData?.length || 0}
                                    slidesToShow={currentSlidesToShow}
                                    uniqueId="featured-agencies"
                                    currentSlideIndex={currentSlideIndex}
                                    top={"70%"}
                                />
                            )} 
                            </div>
                        ) : (
                           <div className="global-scroll-box d-flex" style={{ gap: "24px" }}>
                             {
                                agencyData?.map((data, index) => (
                                    <div onClick={() => handleClick(data?.id || data?.agency_profile?.agency_id)} key={index}>
                                        <div className="featured-agency-card" style={{ minWidth: "288px" }}>
                                            {
                                                data?.agency_profile?.is_featured
                                                    ?
                                                    <div className="label">
                                                        <FallbackImage src={label} alt="" componentName="FeaturedAgencies" />
                                                    </div>
                                                    : ""
                                            }
                                            <div className="img">
                                                <FallbackImage src={data?.agency_profile?.agency_image} alt="" pageName="AgencyDefault" />
                                            </div>
                                            <div className="text-box">
                                                <div className="title">{data?.agency_profile?.agency_name}</div>
                                                <div className="location">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path
                                                            d="M7.9987 14C10.332 11.6 12.6654 9.45093 12.6654 6.8C12.6654 4.14903 10.576 2 7.9987 2C5.42137 2 3.33203 4.14903 3.33203 6.8C3.33203 9.45093 5.66536 11.6 7.9987 14Z"
                                                            stroke="#737678"
                                                            strokeWidth="1.33333"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M8 8.66699C9.1046 8.66699 10 7.77159 10 6.66699C10 5.56243 9.1046 4.66699 8 4.66699C6.8954 4.66699 6 5.56243 6 6.66699C6 7.77159 6.8954 8.66699 8 8.66699Z"
                                                            stroke="#737678"
                                                            strokeWidth="1.33333"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <span>{data?.agency_profile?.city?.name}</span>
                                                </div>
                                            </div>
                                            <div className="back-img">
                                                <Image src={back} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                             }
                           </div>


                        )
                    }
                </div>

            {/* {agencyData?.length > 4 &&
                <div className="arrow-box" onClick={() => sliderRef.current?.slickNext()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clipPath="url(#clip0_2945_60967)">
                            <path d="M6.99799 24.0002C6.86638 24.0009 6.73592 23.9757 6.61408 23.9259C6.49224 23.8762 6.38143 23.8028 6.28799 23.7102C6.19426 23.6172 6.11986 23.5066 6.06909 23.3847C6.01833 23.2629 5.99219 23.1322 5.99219 23.0002C5.99219 22.8681 6.01833 22.7374 6.06909 22.6156C6.11986 22.4937 6.19426 22.3831 6.28799 22.2902L14.458 14.1202C15.0198 13.5577 15.3353 12.7952 15.3353 12.0002C15.3353 11.2052 15.0198 10.4427 14.458 9.88017L6.28799 1.71018C6.09968 1.52188 5.99389 1.26649 5.99389 1.00018C5.99389 0.733883 6.09968 0.478489 6.28799 0.290185C6.47629 0.101882 6.73168 -0.00390625 6.99799 -0.00390625C7.26429 -0.00390625 7.51968 0.101882 7.70799 0.290185L15.878 8.46017C16.3436 8.92463 16.713 9.47639 16.9651 10.0838C17.2172 10.6913 17.3469 11.3425 17.3469 12.0002C17.3469 12.6578 17.2172 13.3091 16.9651 13.9165C16.713 14.524 16.3436 15.0757 15.878 15.5402L7.70799 23.7102C7.61455 23.8028 7.50373 23.8762 7.38189 23.9259C7.26005 23.9757 7.12959 24.0009 6.99799 24.0002Z" fill="#2D2D2D" />
                        </g>
                        <defs>
                            <clipPath id="clip0_2945_60967">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            } */}
        </div>
    )
}

export default FeaturedAgencies
