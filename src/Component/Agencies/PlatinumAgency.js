import buildings from '../../Asset/Agencies/Group.svg'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useRef, useState, useEffect } from "react";
import AgencyTag from '../Metiral/AgencyTag'
import SliderArrows from '../Metiral/SliderArrows';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/ContextProvider';
import { FallbackImage } from '../Metiral/FallbackImage';
import featuredTag from '../../Asset/Agencylisting/Agencies TAG.svg'

function PlatinumAgency({ agencyData, packageName }) {
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
    const convertDaysToTimeUnit = (days) => {
        if (!days || days === 0) {
            return { value: 0, unit: 'days' };
        }

        const years = Math.floor(days / 365);
        const remainingDays = days % 365;
        const months = Math.floor(remainingDays / 30);
        const remainingDaysAfterMonths = remainingDays % 30;
        if (years > 0) {
            return { value: years, unit: years === 1 ? 'year' : 'years' };
        }
        if (months > 0) {
            return { value: months, unit: months === 1 ? 'month' : 'months' };
        }
        return { value: remainingDaysAfterMonths, unit: remainingDaysAfterMonths === 1 ? 'day' : 'days' };
    };
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
            <div className='platinum-agency' style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                <div className="main-container w-100 platinum-agency-container" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                    <div className="heading" style={{ marginBottom: "29px" }}>
                        <div className='placeholder-glow'>
                            <div className='placeholder' style={{ width: '200px', height: '32px' }} />
                        </div>
                    </div>
                    <div className="card-box justify-content-start" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                        <div className="global-scroll-box d-flex" style={{ gap: "24px", width: '100%', maxWidth: '100%', overflowX: 'auto', overflowY: 'hidden', boxSizing: 'border-box' }}>
                            {[...Array(4)].map((_, idx) => (
                                <div key={idx} style={{ flexShrink: 0, boxSizing: 'border-box' }}>
                                    <div className="platinum-card" style={{ minWidth: "288px", maxWidth: "288px", width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                                        <div className="placeholder-glow">
                                            {/* Top section placeholder */}
                                            <div className="top">
                                                <div className="img">
                                                    <div className="top-img placeholder" style={{ height: "120px", borderRadius: "4px 4px 0 0" }} />
                                                </div>
                                                <div className="title placeholder" style={{ width: '80%', height: '20px', margin: '12px auto 0' }} />
                                            </div>
                                            {/* Center section placeholder */}
                                            <div className="center" style={{ marginTop: "8px" }}>
                                                <div className="tab">
                                                    <div className="name placeholder" style={{ width: '70px', height: '14px', marginBottom: '4px' }} />
                                                    <div className="number placeholder" style={{ width: '50px', height: '18px' }} />
                                                </div>
                                                <div className="tab">
                                                    <div className="name placeholder" style={{ width: '100px', height: '14px', marginBottom: '4px' }} />
                                                    <div className="number placeholder" style={{ width: '40px', height: '18px' }} />
                                                </div>
                                                <div className="tab">
                                                    <div className="name placeholder" style={{ width: '100px', height: '14px', marginBottom: '4px' }} />
                                                    <div className="number placeholder" style={{ width: '40px', height: '18px' }} />
                                                </div>
                                            </div>
                                            {/* Bottom section placeholder */}
                                            <div className="bottom">
                                                <div className="location placeholder" style={{ width: '70%', height: '16px', marginBottom: '8px' }} />
                                                <div className="phone placeholder" style={{ width: '60%', height: '16px' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='platinum-agency' style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
            <div className="main-container w-100 platinum-agency-container" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                <div className="heading" style={{ marginBottom: "29px" }}>{packageName?.name} Agencies</div>
                <div className="card-box justify-content-start" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                    {
                        agencyData?.length > 4 && window.innerWidth >= 576 ?
                            (
                                <div style={{ position: "relative", width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                                    <Slider ref={sliderRef} {...sliderSettings} style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
                                        {
                                            agencyData?.map((data, idx) => (
                                                <div onClick={() => handleClick(data?.id || data?.agency_profile?.agency_id)} className="col-lg-3 col-md-4 col-sm-6 col-12 px-0" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                                                    <div className="platinum-card" style={{ minWidth: "288px", maxWidth: "288px", width: '100%', boxSizing: 'border-box', overflow: 'hidden' }} key={idx}>
                                                        {data?.agnecy_profile?.is_featured && <div className="featured-tag">
                                                            <FallbackImage src={featuredTag} alt="featured" pageName="AgencyDetail" />
                                                        </div>}
                                                        <div className="top">
                                                            <div className="img">
                                                                <div className="top-img" style={{borderRadius: data?.agency_profile?.package?.name ? "4px 4px  0 0 " : '4px'}}>
                                                                    <FallbackImage  className='w-100 h-100' style={{ objectFit: 'contain' , borderRadius: '4px'}} src={data?.agency_profile?.agency_image} alt="" pageName="AgencyDefault" />
                                                                </div>
                                                                {data?.agency_profile?.package?.name === "Bronze" ? <AgencyTag leftArrow={true} text={data?.agency_profile?.package?.name} bottom={-14} borderR={true} rightArrow={true} size={'12px'} width={'78px'} backColor={" var(--Tags-Gold, linear-gradient(90deg, #804A00 0%, #91631B 34.26%, #9F7C3D 75%, #B08D57 100%))"} /> : ""}
                                                                {data?.agency_profile?.package?.name === "Gold" ? <AgencyTag leftArrow={true} text={data?.agency_profile?.package?.name} bottom={-14} width={'62px'} svgColor={"#C6A700"} borderR={true} rightArrow={true} size={'12px'} backColor={" var(--Tags-Gold, linear-gradient(90deg, #AE8626 0%, #F7EF8A 28.16%, #D1AC49 63.01%, #ECCA68 100%))"} /> : ""}
                                                                {data?.agency_profile?.package?.name === "Platinum" ? <AgencyTag leftArrow={true} text={data?.agency_profile?.package?.name} bottom={-14} width={'91px'} borderR={true} rightArrow={true} size={'12px'} backColor={" var(--Tags-Platinum, linear-gradient(90deg, #E5E4E2 0%, #9D9D9D 25%, #B7B6B3 50%, #9D9D9D 75%, #E5E4E2 100%))"} /> : ""}
                                                            </div>
                                                            <div className="title">
                                                                {data?.agency_profile?.agency_name}
                                                            </div>
                                                        </div>
                                                        <div className="center" style={{marginTop: "8px" }}>
                                                            <div className="tab">
                                                                <div className="name">Total Time</div>
                                                                {(() => {
                                                                    const timeUnit = convertDaysToTimeUnit(data?.agency_profile?.total_time_on_pakistan_property || 0);
                                                                    return (
                                                                        <>
                                                                            <div className='number'>{timeUnit.value} {timeUnit.unit}</div>
                                                                        </>
                                                                    );
                                                                })()}
                                                            </div>
                                                            <div className="tab">
                                                                <div className="name">Properties for Rent</div>
                                                                <div className="number">{data?.rent_count}</div>
                                                            </div>
                                                            <div className="tab">
                                                                <div className="name">Properties for Sale</div>
                                                                <div className="number">{data?.sell_count}</div>
                                                            </div>
                                                        </div>
                                                        <div className="bottom">
                                                            <div className="location">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                    <path d="M7.9987 14C10.332 11.6 12.6654 9.45093 12.6654 6.8C12.6654 4.14903 10.576 2 7.9987 2C5.42137 2 3.33203 4.14903 3.33203 6.8C3.33203 9.45093 5.66536 11.6 7.9987 14Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M8 8.66699C9.1046 8.66699 10 7.77159 10 6.66699C10 5.56243 9.1046 4.66699 8 4.66699C6.8954 4.66699 6 5.56243 6 6.66699C6 7.77159 6.8954 8.66699 8 8.66699Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                                <div>{data?.agency_profile?.address}{data?.agency_profile?.address ? ", " : ""}{data?.agency_profile?.city?.name}</div>
                                                            </div>
                                                            <div className="phone">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                    <path d="M8.52347 2.13467C8.52347 1.99299 8.57975 1.85711 8.67993 1.75693C8.78012 1.65675 8.91599 1.60046 9.05768 1.60046C10.474 1.60202 11.8319 2.16535 12.8334 3.16685C13.8349 4.16835 14.3982 5.52623 14.3998 6.94257C14.3998 7.08425 14.3435 7.22013 14.2433 7.32032C14.1431 7.4205 14.0072 7.47678 13.8656 7.47678C13.7239 7.47678 13.588 7.4205 13.4878 7.32032C13.3876 7.22013 13.3314 7.08425 13.3314 6.94257C13.3301 5.80951 12.8794 4.72322 12.0782 3.92202C11.277 3.12083 10.1907 2.67016 9.05768 2.66888C8.91599 2.66888 8.78012 2.6126 8.67993 2.51242C8.57975 2.41223 8.52347 2.27635 8.52347 2.13467ZM9.05768 4.80573C9.6244 4.80573 10.1679 5.03086 10.5686 5.43159C10.9694 5.83233 11.1945 6.37585 11.1945 6.94257C11.1945 7.08425 11.2508 7.22013 11.351 7.32032C11.4512 7.4205 11.587 7.47678 11.7287 7.47678C11.8704 7.47678 12.0063 7.4205 12.1065 7.32032C12.2067 7.22013 12.2629 7.08425 12.2629 6.94257C12.2621 6.09274 11.9241 5.27796 11.3232 4.67704C10.7223 4.07612 9.9075 3.73815 9.05768 3.73731C8.91599 3.73731 8.78012 3.79359 8.67993 3.89377C8.57975 3.99396 8.52347 4.12984 8.52347 4.27152C8.52347 4.4132 8.57975 4.54908 8.67993 4.64926C8.78012 4.74944 8.91599 4.80573 9.05768 4.80573ZM13.9152 10.5426C14.2248 10.8531 14.3987 11.2736 14.3987 11.712C14.3987 12.1504 14.2248 12.571 13.9152 12.8814L13.4291 13.4418C9.05394 17.6305 -1.59287 6.98638 2.53123 2.5973L3.14557 2.06309C3.45636 1.76216 3.87313 1.59568 4.30572 1.59968C4.73831 1.60368 5.15193 1.77783 5.4571 2.08446C5.47366 2.10102 6.46355 3.38686 6.46355 3.38686C6.75728 3.69544 6.92078 4.10534 6.92009 4.53136C6.91939 4.95738 6.75454 5.36674 6.45981 5.67435L5.8412 6.45217C6.18354 7.28399 6.68689 8.03997 7.3223 8.67667C7.95771 9.31337 8.71268 9.81823 9.54381 10.1623L10.3264 9.5399C10.6341 9.2454 11.0434 9.08075 11.4693 9.08015C11.8952 9.07955 12.3049 9.24306 12.6134 9.5367C12.6134 9.5367 13.8987 10.5261 13.9152 10.5426ZM13.1802 11.3194C13.1802 11.3194 11.9018 10.3359 11.8852 10.3193C11.7752 10.2102 11.6265 10.149 11.4715 10.149C11.3165 10.149 11.1678 10.2102 11.0578 10.3193C11.0433 10.3343 9.96583 11.1928 9.96583 11.1928C9.89322 11.2505 9.80681 11.2884 9.7151 11.3027C9.62339 11.3169 9.52956 11.307 9.44284 11.274C8.36612 10.8731 7.38813 10.2455 6.57511 9.43364C5.7621 8.62182 5.13305 7.64475 4.73057 6.56862C4.69489 6.48072 4.68325 6.3849 4.69687 6.29101C4.71048 6.19713 4.74885 6.10856 4.80803 6.03441C4.80803 6.03441 5.66651 4.95638 5.68093 4.94249C5.79006 4.83243 5.85128 4.68372 5.85128 4.52874C5.85128 4.37376 5.79006 4.22505 5.68093 4.11499C5.66437 4.09897 4.68089 2.81953 4.68089 2.81953C4.56919 2.71937 4.4234 2.66573 4.27342 2.6696C4.12344 2.67348 3.98062 2.73457 3.87424 2.84037L3.25989 3.37458C0.24588 6.99866 9.47222 15.7132 12.6481 12.712L13.1348 12.1511C13.2488 12.0455 13.3173 11.8997 13.3258 11.7444C13.3343 11.5892 13.282 11.4368 13.1802 11.3194Z" fill="#2D2D2D" />
                                                                </svg>                                                        <div>{data?.agency_profile?.whatsapp_number}</div>
                                                            </div>
                                                        </div>
                                                        <div className="back-img">
                                                            <FallbackImage src={buildings} alt="" componentName="PlatinumAgency" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </Slider>
                                    {shouldShowArrows && (
                                    <SliderArrows
                                        sliderRef={sliderRef}
                                        totalSlides={agencyData?.length || 0}
                                        slidesToShow={currentSlidesToShow}
                                        uniqueId="platinum-agency"
                                        currentSlideIndex={currentSlideIndex}
                                    />
                                    )} 
                                </div>
                            )
                            :
                            (
                                <div className="global-scroll-box d-flex" style={{ gap: "24px", width: '100%', maxWidth: '100%', overflowX: 'auto', overflowY: 'hidden', boxSizing: 'border-box' }}>
                                    {agencyData?.map((data, idx) => (
                                        <div onClick={() => handleClick(data?.id || data?.agency_profile?.agency_id)} className={`${window.innerWidth >= 576 ? "" : ""}`} style={{ flexShrink: 0, boxSizing: 'border-box' }}>
                                            <div className="platinum-card" style={{ minWidth: "288px", maxWidth: "288px", width: '100%', boxSizing: 'border-box', overflow: 'hidden' }} key={idx}>
                                                {data?.agency_profile?.is_featured && <div className="featured-tag">
                                                    <FallbackImage src={featuredTag} alt="featured" pageName="AgencyDetail" />
                                                </div>}
                                                <div className="top">
                                                    <div className="img">
                                                        <div className="top-img" style={{borderRadius: data?.agency_profile?.package?.name ? "4px 4px  0 0 " : '4px'}}>
                                                            <FallbackImage className='w-100 h-100' style={{ objectFit: 'contain' , borderRadius: '4px'}} src={data?.agency_profile?.agency_image} alt="" pageName="AgencyDefault" />
                                                        </div>
                                                        {data?.agency_profile?.package?.name === "Bronze" ? <AgencyTag leftArrow={true} text={data?.agency_profile?.package?.name} bottom={-14} borderR={true} rightArrow={true} size={'12px'} width={'78px'} backColor={" var(--Tags-Gold, linear-gradient(90deg, #804A00 0%, #91631B 34.26%, #9F7C3D 75%, #B08D57 100%))"} /> : ""}
                                                        {data?.agency_profile?.package?.name === "Gold" ? <AgencyTag leftArrow={true} text={data?.agency_profile?.package?.name} bottom={-14} width={'62px'} svgColor={"#C6A700"} borderR={true} rightArrow={true} size={'12px'} backColor={" var(--Tags-Gold, linear-gradient(90deg, #AE8626 0%, #F7EF8A 28.16%, #D1AC49 63.01%, #ECCA68 100%))"} /> : ""}
                                                        {data?.agency_profile?.package?.name === "Platinum" ? <AgencyTag leftArrow={true} text={data?.agency_profile?.package?.name} bottom={-14} width={'91px'} borderR={true} rightArrow={true} size={'12px'} backColor={" var(--Tags-Platinum, linear-gradient(90deg, #E5E4E2 0%, #9D9D9D 25%, #B7B6B3 50%, #9D9D9D 75%, #E5E4E2 100%))"} /> : ""}
                                                    </div>
                                                    <div className="title">
                                                        {data?.agency_profile?.agency_name}
                                                    </div>
                                                </div>
                                                <div className="center" style={{marginTop: "8px" }}>
                                                    <div className="tab">
                                                        <div className="name">Total Time</div>
                                                        {(() => {
                                                            const timeUnit = convertDaysToTimeUnit(data?.agency_profile?.total_time_on_pakistan_property || 0);
                                                            return (
                                                                <>
                                                                    <div className='number'>{timeUnit.value} {timeUnit.unit}</div>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                    <div className="tab">
                                                        <div className="name">Properties for Rent</div>
                                                        <div className="number">{data?.rent_count}</div>
                                                    </div>
                                                    <div className="tab">
                                                        <div className="name">Properties for Sale</div>
                                                        <div className="number">{data?.sell_count}</div>
                                                    </div>
                                                </div>
                                                <div className="bottom">
                                                    <div className="location">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M7.9987 14C10.332 11.6 12.6654 9.45093 12.6654 6.8C12.6654 4.14903 10.576 2 7.9987 2C5.42137 2 3.33203 4.14903 3.33203 6.8C3.33203 9.45093 5.66536 11.6 7.9987 14Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M8 8.66699C9.1046 8.66699 10 7.77159 10 6.66699C10 5.56243 9.1046 4.66699 8 4.66699C6.8954 4.66699 6 5.56243 6 6.66699C6 7.77159 6.8954 8.66699 8 8.66699Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <div>{data?.agency_profile?.address}{data?.agency_profile?.address ? ", " : ""}{data?.agency_profile?.city?.name}</div>
                                                    </div>
                                                    <div className="phone">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M8.52347 2.13467C8.52347 1.99299 8.57975 1.85711 8.67993 1.75693C8.78012 1.65675 8.91599 1.60046 9.05768 1.60046C10.474 1.60202 11.8319 2.16535 12.8334 3.16685C13.8349 4.16835 14.3982 5.52623 14.3998 6.94257C14.3998 7.08425 14.3435 7.22013 14.2433 7.32032C14.1431 7.4205 14.0072 7.47678 13.8656 7.47678C13.7239 7.47678 13.588 7.4205 13.4878 7.32032C13.3876 7.22013 13.3314 7.08425 13.3314 6.94257C13.3301 5.80951 12.8794 4.72322 12.0782 3.92202C11.277 3.12083 10.1907 2.67016 9.05768 2.66888C8.91599 2.66888 8.78012 2.6126 8.67993 2.51242C8.57975 2.41223 8.52347 2.27635 8.52347 2.13467ZM9.05768 4.80573C9.6244 4.80573 10.1679 5.03086 10.5686 5.43159C10.9694 5.83233 11.1945 6.37585 11.1945 6.94257C11.1945 7.08425 11.2508 7.22013 11.351 7.32032C11.4512 7.4205 11.587 7.47678 11.7287 7.47678C11.8704 7.47678 12.0063 7.4205 12.1065 7.32032C12.2067 7.22013 12.2629 7.08425 12.2629 6.94257C12.2621 6.09274 11.9241 5.27796 11.3232 4.67704C10.7223 4.07612 9.9075 3.73815 9.05768 3.73731C8.91599 3.73731 8.78012 3.79359 8.67993 3.89377C8.57975 3.99396 8.52347 4.12984 8.52347 4.27152C8.52347 4.4132 8.57975 4.54908 8.67993 4.64926C8.78012 4.74944 8.91599 4.80573 9.05768 4.80573ZM13.9152 10.5426C14.2248 10.8531 14.3987 11.2736 14.3987 11.712C14.3987 12.1504 14.2248 12.571 13.9152 12.8814L13.4291 13.4418C9.05394 17.6305 -1.59287 6.98638 2.53123 2.5973L3.14557 2.06309C3.45636 1.76216 3.87313 1.59568 4.30572 1.59968C4.73831 1.60368 5.15193 1.77783 5.4571 2.08446C5.47366 2.10102 6.46355 3.38686 6.46355 3.38686C6.75728 3.69544 6.92078 4.10534 6.92009 4.53136C6.91939 4.95738 6.75454 5.36674 6.45981 5.67435L5.8412 6.45217C6.18354 7.28399 6.68689 8.03997 7.3223 8.67667C7.95771 9.31337 8.71268 9.81823 9.54381 10.1623L10.3264 9.5399C10.6341 9.2454 11.0434 9.08075 11.4693 9.08015C11.8952 9.07955 12.3049 9.24306 12.6134 9.5367C12.6134 9.5367 13.8987 10.5261 13.9152 10.5426ZM13.1802 11.3194C13.1802 11.3194 11.9018 10.3359 11.8852 10.3193C11.7752 10.2102 11.6265 10.149 11.4715 10.149C11.3165 10.149 11.1678 10.2102 11.0578 10.3193C11.0433 10.3343 9.96583 11.1928 9.96583 11.1928C9.89322 11.2505 9.80681 11.2884 9.7151 11.3027C9.62339 11.3169 9.52956 11.307 9.44284 11.274C8.36612 10.8731 7.38813 10.2455 6.57511 9.43364C5.7621 8.62182 5.13305 7.64475 4.73057 6.56862C4.69489 6.48072 4.68325 6.3849 4.69687 6.29101C4.71048 6.19713 4.74885 6.10856 4.80803 6.03441C4.80803 6.03441 5.66651 4.95638 5.68093 4.94249C5.79006 4.83243 5.85128 4.68372 5.85128 4.52874C5.85128 4.37376 5.79006 4.22505 5.68093 4.11499C5.66437 4.09897 4.68089 2.81953 4.68089 2.81953C4.56919 2.71937 4.4234 2.66573 4.27342 2.6696C4.12344 2.67348 3.98062 2.73457 3.87424 2.84037L3.25989 3.37458C0.24588 6.99866 9.47222 15.7132 12.6481 12.712L13.1348 12.1511C13.2488 12.0455 13.3173 11.8997 13.3258 11.7444C13.3343 11.5892 13.282 11.4368 13.1802 11.3194Z" fill="#2D2D2D" />
                                                        </svg>
                                                        <div>{data?.agency_profile?.whatsapp_number}</div>
                                                    </div>
                                                </div>
                                                <div className="back-img">
                                                    <FallbackImage src={buildings} alt="" componentName="PlatinumAgency" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    )
}

export default PlatinumAgency
