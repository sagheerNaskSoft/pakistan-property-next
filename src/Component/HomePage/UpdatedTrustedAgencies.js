import React, { useEffect, useRef, useState } from 'react'
import { FallbackImage } from '../Metiral/FallbackImage'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/ContextProvider'
import AgencyTag from '../Metiral/AgencyTag'
import featuredTag from '../../Asset/Agencylisting/Agencies TAG.svg'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SliderArrows from '../Metiral/SliderArrows';

function TrustedAgencies() {
    const { getTrustedAgency, trustedAgnecyList } = useAuth()
    const sliderRef = useRef(null)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

    useEffect(() => {
        if (!trustedAgnecyList?.length) {
            getTrustedAgency()
        }
    }, [])

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const naviage = useNavigate()

    /* -------------------- RESPONSIVE -------------------- */

    const getCardsToShow = () => {
        if (windowWidth >= 1200) return 4;
        if (windowWidth >= 992) return 3;
        if (windowWidth >= 768) return 3;
        if (windowWidth >= 576) return 2;
        return 1;
    };

    const cardsToShow = getCardsToShow();
    const hasData = trustedAgnecyList?.length > 0;
    const shouldShowSlider = hasData && trustedAgnecyList?.length > cardsToShow;
    const shouldShowArrows = hasData && trustedAgnecyList?.length > cardsToShow;
    const shouldUseCarousel = hasData && shouldShowSlider;

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

    return (
        <>
            <style>{`
                .new-trusted-agencies .slick-slide > div {
                    padding: 0 12px;
                    box-sizing: border-box;
                }
                .new-trusted-agencies .slick-list {
                    margin: 0 -12px;
                }
            `}</style>
            <div className='new-trusted-agencies'>
                <div className='d-flex justify-content-between align-items-center'>
                    <h2 className='section_title m-0'>Trusted Agencies</h2>
                    <h6 className='m-0'><Link className='links m-0' to='/agency-listing'>View All <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9.28866 5.29076C9.19719 5.38371 9.12459 5.4943 9.07505 5.61615C9.02551 5.73799 9 5.86868 9 6.00068C9 6.13268 9.02551 6.26337 9.07505 6.38521C9.12459 6.50706 9.19719 6.61765 9.28866 6.7106L13.7581 11.2901C13.8496 11.383 13.9222 11.4936 13.9717 11.6155C14.0212 11.7373 14.0468 11.868 14.0468 12C14.0468 12.132 14.0212 12.2627 13.9717 12.3845C13.9222 12.5064 13.8496 12.617 13.7581 12.7099L9.28866 17.2894C9.19719 17.3824 9.12459 17.4929 9.07505 17.6148C9.02551 17.7366 9 17.8673 9 17.9993C9 18.1313 9.02551 18.262 9.07505 18.3839C9.12459 18.5057 9.19719 18.6163 9.28866 18.7092C9.4715 18.8955 9.71883 19 9.97664 19C10.2344 19 10.4818 18.8955 10.6646 18.7092L15.1438 14.1198C15.6921 13.5573 16 12.7949 16 12C16 11.2051 15.6921 10.4427 15.1438 9.88024L10.6646 5.29076C10.4818 5.10453 10.2344 5 9.97664 5C9.71883 5 9.4715 5.10453 9.28866 5.29076Z" fill="#2D2D2D" />
                    </svg></Link></h6>
                </div>

                {/* -------------------- CONTENT -------------------- */}
                {hasData && (
                    windowWidth > 768 ? (
                        <div className="position-relative">
                            <div style={{ marginTop: '28px' }}>
                                {shouldUseCarousel ? (
                                    <Slider ref={sliderRef} {...sliderSettings}>
                                        {trustedAgnecyList?.map((items, index) => (
                                            <div key={items?.agency_profile?.agency_id || items?.agency_profile?.agency_profile_id || items?.user?.id || index}>
                                                <div onClick={() => naviage(`/agency-detail/${items?.agency_profile?.agency_id || items?.agency_profile?.agency_profile_id || items?.user?.id}`)} className='agency_card'>
                                                    <div className="circle"></div>
                                                    {items?.agency_profile?.is_featured && <div className="featured-tag">
                                                        <FallbackImage src={featuredTag} alt="featured" pageName="AgencyDetail" />
                                                    </div>}
                                                    <div className="top">
                                                        <div style={{ position: "relative" }}>
                                                            <div className='agency_img' style={{ borderRadius: items?.agency_profile?.package?.name ? "4px 4px  0 0 " : '4px' }}>
                                                                <FallbackImage src={items?.agency_profile?.agency_image} alt={items?.agency_profile?.agency_name || items?.name} className={"img"} pageName="AgencyDefault" />
                                                                <div style={{ position: "absolute", bottom: "-12px", left: "-14px" }}>
                                                                    {items?.agency_profile?.package?.name === "Bronze" ? <AgencyTag leftArrow={true} text={items?.agency_profile?.package?.name} borderR={true} rightArrow={true} size={'12px'} width={'78px'} backColor={" var(--Tags-Gold, linear-gradient(90deg, #804A00 0%, #91631B 34.26%, #9F7C3D 75%, #B08D57 100%))"} /> : ""}
                                                                    {items?.agency_profile?.package?.name === "Gold" ? <AgencyTag leftArrow={true} text={items?.agency_profile?.package?.name} width={'62px'} svgColor={"#C6A700"} borderR={true} rightArrow={true} size={'12px'} backColor={" var(--Tags-Gold, linear-gradient(90deg, #AE8626 0%, #F7EF8A 28.16%, #D1AC49 63.01%, #ECCA68 100%))"} /> : ""}
                                                                    {items?.agency_profile?.package?.name === "Platinum" ? <AgencyTag leftArrow={true} text={items?.agency_profile?.package?.name} width={'91px'} borderR={true} rightArrow={true} size={'12px'} backColor={" var(--Tags-Platinum, linear-gradient(90deg, #E5E4E2 0%, #9D9D9D 25%, #B7B6B3 50%, #9D9D9D 75%, #E5E4E2 100%))"} /> : ""}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="text-box">
                                                            <h5 className='mb-0'>{items?.agency_profile?.agency_name || items?.name}</h5>
                                                            <div style={{ gap: "4px" }} className='d-flex align-items-start justify-content-center'>
                                                                <svg style={{ minWidth: "16px", minHeight: "16px" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                    <path d="M7.99992 14C10.3333 11.6 12.6666 9.45093 12.6666 6.8C12.6666 4.14903 10.5773 2 7.99992 2C5.42259 2 3.33325 4.14903 3.33325 6.8C3.33325 9.45093 5.66659 11.6 7.99992 14Z" stroke="#555555" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M8 8.66663C9.1046 8.66663 10 7.77123 10 6.66663C10 5.56206 9.1046 4.66663 8 4.66663C6.8954 4.66663 6 5.56206 6 6.66663C6 7.77123 6.8954 8.66663 8 8.66663Z" stroke="#555555" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                                <p className='m-0'> {items?.agency_profile?.address}, {items?.agency_profile?.city?.name}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bottom" style={{ marginTop: "10px" }}>
                                                        <div className="bottom-tab">
                                                            <div className="text">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                    <g clipPath="url(#clip0_97_4504)">
                                                                        <path d="M4 14.6667V2.66671C4 2.31309 4.14048 1.97395 4.39052 1.7239C4.64057 1.47385 4.97971 1.33337 5.33333 1.33337H10.6667C11.0203 1.33337 11.3594 1.47385 11.6095 1.7239C11.8595 1.97395 12 2.31309 12 2.66671V14.6667H4Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M4.00004 8H2.66671C2.31309 8 1.97395 8.14048 1.7239 8.39052C1.47385 8.64057 1.33337 8.97971 1.33337 9.33333V13.3333C1.33337 13.687 1.47385 14.0261 1.7239 14.2761C1.97395 14.5262 2.31309 14.6667 2.66671 14.6667H4.00004" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M12 6H13.3333C13.687 6 14.0261 6.14048 14.2761 6.39052C14.5262 6.64057 14.6667 6.97971 14.6667 7.33333V13.3333C14.6667 13.687 14.5262 14.0261 14.2761 14.2761C14.0261 14.5262 13.687 14.6667 13.3333 14.6667H12" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M6.66663 4H9.33329" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M6.66663 6.66663H9.33329" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M6.66663 9.33337H9.33329" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M6.66663 12H9.33329" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </g>
                                                                    <defs>
                                                                        <clipPath id="clip0_97_4504">
                                                                            <rect width="16" height="16" fill="white" />
                                                                        </clipPath>
                                                                    </defs>
                                                                </svg>
                                                                Listings
                                                            </div>
                                                            <div className="text">
                                                                {items?.rent_count + items?.sell_count + items?.lease_count || 0}
                                                            </div>
                                                        </div>
                                                        <div className="bottom-tab">
                                                            <div className="text">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                    <path d="M10.6667 14V12.6667C10.6667 11.9594 10.3858 11.2811 9.88566 10.781C9.38556 10.281 8.70728 10 8.00004 10H4.00004C3.2928 10 2.61452 10.281 2.11442 10.781C1.61433 11.2811 1.33337 11.9594 1.33337 12.6667V14" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M10.6666 2.08533C11.2385 2.23357 11.7449 2.5675 12.1064 3.0347C12.4679 3.5019 12.6641 4.07592 12.6641 4.66666C12.6641 5.2574 12.4679 5.83142 12.1064 6.29862C11.7449 6.76582 11.2385 7.09975 10.6666 7.24799" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M14.6666 14V12.6667C14.6662 12.0758 14.4695 11.5019 14.1075 11.0349C13.7455 10.5679 13.2387 10.2344 12.6666 10.0867" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M6.00004 7.33333C7.4728 7.33333 8.66671 6.13943 8.66671 4.66667C8.66671 3.19391 7.4728 2 6.00004 2C4.52728 2 3.33337 3.19391 3.33337 4.66667C3.33337 6.13943 4.52728 7.33333 6.00004 7.33333Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                                Agents
                                                            </div>
                                                            <div className="text">
                                                                {items?.agency_profile?.staff?.length || 0}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="button">
                                                        View Details
                                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M3.33337 8H12.6667" stroke="#698B75" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M8 3.33301L12.6667 7.99967L8 12.6663" stroke="#698B75" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg> */}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                ) : (
                                    <div className='grid list_agencies mt-0'>
                                        {trustedAgnecyList?.map((items, index) => (
                                            <div key={items?.agency_profile?.agency_id || items?.agency_profile?.agency_profile_id || items?.user?.id || index} onClick={() => naviage(`/agency-detail/${items?.agency_profile?.agency_id || items?.agency_profile?.agency_profile_id || items?.user?.id}`)} className='agency_card'>
                                                <div className="circle"></div>
                                                {items?.agency_profile?.is_featured && <div className="featured-tag">
                                                    <FallbackImage src={featuredTag} alt="featured" pageName="AgencyDetail" />
                                                </div>}
                                                <div className="top">
                                                    <div style={{ position: "relative" }}>
                                                        <div className='agency_img' style={{ borderRadius: items?.agency_profile?.package?.name ? "4px 4px  0 0 " : '4px' }}>
                                                            <FallbackImage src={items?.agency_profile?.agency_image} alt={items?.agency_profile?.agency_name || items?.name} className={"img"} pageName="AgencyDefault" />
                                                            <div style={{ position: "absolute", bottom: "-12px", left: "-14px" }}>
                                                                {items?.agency_profile?.package?.name === "Bronze" ? <AgencyTag leftArrow={true} text={items?.agency_profile?.package?.name} borderR={true} rightArrow={true} size={'12px'} width={'78px'} backColor={" var(--Tags-Gold, linear-gradient(90deg, #804A00 0%, #91631B 34.26%, #9F7C3D 75%, #B08D57 100%))"} /> : ""}
                                                                {items?.agency_profile?.package?.name === "Gold" ? <AgencyTag leftArrow={true} text={items?.agency_profile?.package?.name} width={'62px'} svgColor={"#C6A700"} borderR={true} rightArrow={true} size={'12px'} backColor={" var(--Tags-Gold, linear-gradient(90deg, #AE8626 0%, #F7EF8A 28.16%, #D1AC49 63.01%, #ECCA68 100%))"} /> : ""}
                                                                {items?.agency_profile?.package?.name === "Platinum" ? <AgencyTag leftArrow={true} text={items?.agency_profile?.package?.name} width={'91px'} borderR={true} rightArrow={true} size={'12px'} backColor={" var(--Tags-Platinum, linear-gradient(90deg, #E5E4E2 0%, #9D9D9D 25%, #B7B6B3 50%, #9D9D9D 75%, #E5E4E2 100%))"} /> : ""}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-box">
                                                        <h5 className='mb-0'>{items?.agency_profile?.agency_name || items?.name}</h5>
                                                        <div style={{ gap: "4px" }} className='d-flex align-items-start justify-content-center'>
                                                            <svg style={{ minWidth: "16px", minHeight: "16px" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                <path d="M7.99992 14C10.3333 11.6 12.6666 9.45093 12.6666 6.8C12.6666 4.14903 10.5773 2 7.99992 2C5.42259 2 3.33325 4.14903 3.33325 6.8C3.33325 9.45093 5.66659 11.6 7.99992 14Z" stroke="#555555" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M8 8.66663C9.1046 8.66663 10 7.77123 10 6.66663C10 5.56206 9.1046 4.66663 8 4.66663C6.8954 4.66663 6 5.56206 6 6.66663C6 7.77123 6.8954 8.66663 8 8.66663Z" stroke="#555555" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            <p className='m-0'> {items?.agency_profile?.address}, {items?.agency_profile?.city?.name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bottom" style={{ marginTop: "10px" }}>
                                                    <div className="bottom-tab">
                                                        <div className="text">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                <g clipPath="url(#clip0_97_4504)">
                                                                    <path d="M4 14.6667V2.66671C4 2.31309 4.14048 1.97395 4.39052 1.7239C4.64057 1.47385 4.97971 1.33337 5.33333 1.33337H10.6667C11.0203 1.33337 11.3594 1.47385 11.6095 1.7239C11.8595 1.97395 12 2.31309 12 2.66671V14.6667H4Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M4.00004 8H2.66671C2.31309 8 1.97395 8.14048 1.7239 8.39052C1.47385 8.64057 1.33337 8.97971 1.33337 9.33333V13.3333C1.33337 13.687 1.47385 14.0261 1.7239 14.2761C1.97395 14.5262 2.31309 14.6667 2.66671 14.6667H4.00004" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M12 6H13.3333C13.687 6 14.0261 6.14048 14.2761 6.39052C14.5262 6.64057 14.6667 6.97971 14.6667 7.33333V13.3333C14.6667 13.687 14.5262 14.0261 14.2761 14.2761C14.0261 14.5262 13.687 14.6667 13.3333 14.6667H12" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M6.66663 4H9.33329" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M6.66663 6.66663H9.33329" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M6.66663 9.33337H9.33329" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M6.66663 12H9.33329" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                </g>
                                                                <defs>
                                                                    <clipPath id="clip0_97_4504">
                                                                        <rect width="16" height="16" fill="white" />
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                            Listings
                                                        </div>
                                                        <div className="text">
                                                            {items?.rent_count + items?.sell_count + items?.lease_count || 0}
                                                        </div>
                                                    </div>
                                                    <div className="bottom-tab">
                                                        <div className="text">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                <path d="M10.6667 14V12.6667C10.6667 11.9594 10.3858 11.2811 9.88566 10.781C9.38556 10.281 8.70728 10 8.00004 10H4.00004C3.2928 10 2.61452 10.281 2.11442 10.781C1.61433 11.2811 1.33337 11.9594 1.33337 12.6667V14" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M10.6666 2.08533C11.2385 2.23357 11.7449 2.5675 12.1064 3.0347C12.4679 3.5019 12.6641 4.07592 12.6641 4.66666C12.6641 5.2574 12.4679 5.83142 12.1064 6.29862C11.7449 6.76582 11.2385 7.09975 10.6666 7.24799" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M14.6666 14V12.6667C14.6662 12.0758 14.4695 11.5019 14.1075 11.0349C13.7455 10.5679 13.2387 10.2344 12.6666 10.0867" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M6.00004 7.33333C7.4728 7.33333 8.66671 6.13943 8.66671 4.66667C8.66671 3.19391 7.4728 2 6.00004 2C4.52728 2 3.33337 3.19391 3.33337 4.66667C3.33337 6.13943 4.52728 7.33333 6.00004 7.33333Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            Agents
                                                        </div>
                                                        <div className="text">
                                                            {items?.agency_profile?.staff?.length || 0}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="button">
                                                    View Details
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {shouldUseCarousel && shouldShowArrows && (
                                <SliderArrows
                                    sliderRef={sliderRef}
                                    totalSlides={trustedAgnecyList?.length || 0}
                                    slidesToShow={cardsToShow}
                                    uniqueId="updated-trusted-agencies"
                                    currentSlideIndex={currentSlideIndex}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="global-scroll-box">
                            <div className='grid list_agencies' style={{ marginTop: "28px" }}>
                                {trustedAgnecyList?.map((items, index) => (
                                    <div key={items?.agency_profile?.agency_id || items?.agency_profile?.agency_profile_id || items?.user?.id || index} onClick={() => naviage(`/agency-detail/${items?.agency_profile?.agency_id || items?.agency_profile?.agency_profile_id || items?.user?.id}`)} className='agency_card'>
                                        <div className="circle"></div>
                                        {items?.agency_profile?.is_featured && <div className="featured-tag">
                                            <FallbackImage src={featuredTag} alt="featured" pageName="AgencyDetail" />
                                        </div>}
                                        <div className="top">
                                            <div style={{ position: "relative" }}>
                                                <div className='agency_img' style={{ borderRadius: items?.agency_profile?.package?.name ? "4px 4px  0 0 " : '4px' }}>
                                                    <FallbackImage src={items?.agency_profile?.agency_image} alt={items?.agency_profile?.agency_name || items?.name} className={"img"} pageName="AgencyDefault" />
                                                    <div style={{ position: "absolute", bottom: "-12px", left: "-14px" }}>
                                                        {items?.agency_profile?.package?.name === "Bronze" ? <AgencyTag leftArrow={true} text={items?.agency_profile?.package?.name} borderR={true} rightArrow={true} size={'12px'} width={'78px'} backColor={" var(--Tags-Gold, linear-gradient(90deg, #804A00 0%, #91631B 34.26%, #9F7C3D 75%, #B08D57 100%))"} /> : ""}
                                                        {items?.agency_profile?.package?.name === "Gold" ? <AgencyTag leftArrow={true} text={items?.agency_profile?.package?.name} width={'62px'} svgColor={"#C6A700"} borderR={true} rightArrow={true} size={'12px'} backColor={" var(--Tags-Gold, linear-gradient(90deg, #AE8626 0%, #F7EF8A 28.16%, #D1AC49 63.01%, #ECCA68 100%))"} /> : ""}
                                                        {items?.agency_profile?.package?.name === "Platinum" ? <AgencyTag leftArrow={true} text={items?.agency_profile?.package?.name} width={'91px'} borderR={true} rightArrow={true} size={'12px'} backColor={" var(--Tags-Platinum, linear-gradient(90deg, #E5E4E2 0%, #9D9D9D 25%, #B7B6B3 50%, #9D9D9D 75%, #E5E4E2 100%))"} /> : ""}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-box">
                                                <h5 className='mb-0'>{items?.agency_profile?.agency_name || items?.name}</h5>
                                                <div style={{ gap: "4px" }} className='d-flex align-items-start justify-content-center'>
                                                    <svg style={{ minWidth: "16px", minHeight: "16px" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M7.99992 14C10.3333 11.6 12.6666 9.45093 12.6666 6.8C12.6666 4.14903 10.5773 2 7.99992 2C5.42259 2 3.33325 4.14903 3.33325 6.8C3.33325 9.45093 5.66659 11.6 7.99992 14Z" stroke="#555555" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M8 8.66663C9.1046 8.66663 10 7.77123 10 6.66663C10 5.56206 9.1046 4.66663 8 4.66663C6.8954 4.66663 6 5.56206 6 6.66663C6 7.77123 6.8954 8.66663 8 8.66663Z" stroke="#555555" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <p className='m-0'> {items?.agency_profile?.address}, {items?.agency_profile?.city?.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bottom" style={{ marginTop: "10px" }}>
                                            <div className="bottom-tab">
                                                <div className="text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <g clipPath="url(#clip0_97_4504)">
                                                            <path d="M4 14.6667V2.66671C4 2.31309 4.14048 1.97395 4.39052 1.7239C4.64057 1.47385 4.97971 1.33337 5.33333 1.33337H10.6667C11.0203 1.33337 11.3594 1.47385 11.6095 1.7239C11.8595 1.97395 12 2.31309 12 2.66671V14.6667H4Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M4.00004 8H2.66671C2.31309 8 1.97395 8.14048 1.7239 8.39052C1.47385 8.64057 1.33337 8.97971 1.33337 9.33333V13.3333C1.33337 13.687 1.47385 14.0261 1.7239 14.2761C1.97395 14.5262 2.31309 14.6667 2.66671 14.6667H4.00004" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M12 6H13.3333C13.687 6 14.0261 6.14048 14.2761 6.39052C14.5262 6.64057 14.6667 6.97971 14.6667 7.33333V13.3333C14.6667 13.687 14.5262 14.0261 14.2761 14.2761C14.0261 14.5262 13.687 14.6667 13.3333 14.6667H12" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M6.66663 4H9.33329" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M6.66663 6.66663H9.33329" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M6.66663 9.33337H9.33329" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M6.66663 12H9.33329" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_97_4504">
                                                                <rect width="16" height="16" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                    Listings
                                                </div>
                                                <div className="text">
                                                    {items?.rent_count + items?.sell_count + items?.lease_count || 0}
                                                </div>
                                            </div>
                                            <div className="bottom-tab">
                                                <div className="text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M10.6667 14V12.6667C10.6667 11.9594 10.3858 11.2811 9.88566 10.781C9.38556 10.281 8.70728 10 8.00004 10H4.00004C3.2928 10 2.61452 10.281 2.11442 10.781C1.61433 11.2811 1.33337 11.9594 1.33337 12.6667V14" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M10.6666 2.08533C11.2385 2.23357 11.7449 2.5675 12.1064 3.0347C12.4679 3.5019 12.6641 4.07592 12.6641 4.66666C12.6641 5.2574 12.4679 5.83142 12.1064 6.29862C11.7449 6.76582 11.2385 7.09975 10.6666 7.24799" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M14.6666 14V12.6667C14.6662 12.0758 14.4695 11.5019 14.1075 11.0349C13.7455 10.5679 13.2387 10.2344 12.6666 10.0867" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M6.00004 7.33333C7.4728 7.33333 8.66671 6.13943 8.66671 4.66667C8.66671 3.19391 7.4728 2 6.00004 2C4.52728 2 3.33337 3.19391 3.33337 4.66667C3.33337 6.13943 4.52728 7.33333 6.00004 7.33333Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    Agents
                                                </div>
                                                <div className="text">
                                                    {items?.agency_profile?.staff?.length || 0}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="button">
                                            View Details
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                )}
            </div>
        </>
    )
}

export default TrustedAgencies