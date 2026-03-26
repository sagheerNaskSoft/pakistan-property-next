import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../Context/ContextProvider";
import { FallbackImage } from "../Metiral/FallbackImage";
import SliderArrows from "../Metiral/SliderArrows";

function FeaturedProjects({ featuredProjectsData, data }) {
    const { slug } = useParams()
    const { formatPriceWithCommas } = useAuth()

    const sliderRef = useRef(null)
    const navigate = useNavigate()

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const currentSlidesToShow = windowWidth < 576 ? 1 : windowWidth < 768 ? 2 : windowWidth < 992 ? 3 : 4;
    const shouldUseSlider = windowWidth >= 576 && featuredProjectsData?.length > currentSlidesToShow;
    const showArrows = shouldUseSlider && featuredProjectsData?.length > currentSlidesToShow;

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
                    slidesToShow: 3,
                    afterChange: (index) => {
                        setCurrentSlideIndex(index);
                    },
                },
            },
            {
                breakpoint: 768,
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
    
    return (
        <>
            <div className="featured-projects">
                <div className="slider-slick-box" >
                    <div className="heading">{data ? data : "Featured Projects"}</div>
                    <div className="position-relative">
                        {
                            window.innerWidth >= 576 ?
                                (featuredProjectsData?.length < 4 && window.innerWidth > 992 ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                                    {featuredProjectsData?.map((data, index) => (
                                        <div onClick={() => {
                                            navigate(`/project-detail/${slug}/${data?.slug}`)
                                        }} key={index}>
                                            <div className="featured-card">
                                                <div className="img-box">
                                                    <FallbackImage src={data?.project_cover_image} alt={data?.project_title} pageName="DefaultProject" />
                                                </div>
                                                <div className="price-tag">
                                                    {formatPriceWithCommas(data?.min_price)} <span>{data?.currency}</span>
                                                </div>
                                                <div className="bottom-box">
                                                    <div className="head-box">
                                                        <div className="heading">{data?.project_title}</div>
                                                        {
                                                            data?.is_trending &&
                                                            <div className="tag">
                                                                Trending
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="18"
                                                                    height="18"
                                                                    viewBox="0 0 18 18"
                                                                    fill="none"
                                                                >
                                                                    <rect width="18" height="18" rx="9" fill="#62A27D" />
                                                                    <path
                                                                        d="M4.5 11.5L7.14644 8.85355C7.34171 8.6583 7.65829 8.6583 7.85356 8.85355L9.14645 10.1464C9.3417 10.3417 9.6583 10.3417 9.85355 10.1464L13.5 6.5M13.5 6.5H11M13.5 6.5V9"
                                                                        stroke="white"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="location">{data?.city?.city}, Pakistan</div>
                                                    {
                                                        data?.project_categories &&
                                                        <div className="type-tag">
                                                            {data.types.map((type, idx) => (
                                                                <div className="tag-name" key={idx}>
                                                                    {type}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    ))}            </div> : <Slider ref={sliderRef} {...sliderSettings}>
                                    {featuredProjectsData?.map((data, index) => (
                                        <div onClick={() => {
                                            navigate(`/project-detail/${slug}/${data?.slug}`)
                                        }} className="custom-col" key={index}>
                                            <div className="featured-card">
                                                <div className="img-box">
                                                    <FallbackImage src={data?.project_cover_image} alt={data?.project_title} pageName="DefaultProject" />
                                                </div>
                                                <div className="price-tag">
                                                    {formatPriceWithCommas(data?.min_price)} <span>{data?.currency}</span>
                                                </div>
                                                <div className="bottom-box">
                                                    <div className="head-box">
                                                        <div className="heading">{data?.project_title}</div>
                                                        {
                                                            data?.is_trending &&
                                                            <div className="tag">
                                                                Trending
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="18"
                                                                    height="18"
                                                                    viewBox="0 0 18 18"
                                                                    fill="none"
                                                                >
                                                                    <rect width="18" height="18" rx="9" fill="#62A27D" />
                                                                    <path
                                                                        d="M4.5 11.5L7.14644 8.85355C7.34171 8.6583 7.65829 8.6583 7.85356 8.85355L9.14645 10.1464C9.3417 10.3417 9.6583 10.3417 9.85355 10.1464L13.5 6.5M13.5 6.5H11M13.5 6.5V9"
                                                                        stroke="white"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="location">{data?.city?.city}, Pakistan</div>
                                                    {
                                                        data?.project_categories &&
                                                        <div className="type-tag">
                                                            {data.types.map((type, idx) => (
                                                                <div className="tag-name" key={idx}>
                                                                    {type}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>) :

                                <div className="global-scroll-box d-flex " style={{ gap: '24px' }}>
                                    {featuredProjectsData?.map((data, index) => (
                                        <div className="featured-card" onClick={() => {
                                            navigate(`/project-detail/${slug}/${data?.slug}`)
                                        }} key={index}>
                                            <div className="img-box">
                                                <FallbackImage src={data?.project_cover_image} alt={data?.project_title} pageName="DefaultProject" />
                                            </div>
                                            <div className="price-tag">
                                                {formatPriceWithCommas(data?.min_price)} <span>{data?.currency}</span>
                                            </div>
                                            <div className="bottom-box">
                                                <div className="head-box">
                                                    <div className="heading">{data?.project_title}</div>
                                                    {
                                                        data?.is_trending &&
                                                        <div className="tag">
                                                            Trending
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 18 18"
                                                                fill="none"
                                                            >
                                                                <rect width="18" height="18" rx="9" fill="#62A27D" />
                                                                <path
                                                                    d="M4.5 11.5L7.14644 8.85355C7.34171 8.6583 7.65829 8.6583 7.85356 8.85355L9.14645 10.1464C9.3417 10.3417 9.6583 10.3417 9.85355 10.1464L13.5 6.5M13.5 6.5H11M13.5 6.5V9"
                                                                    stroke="white"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </div>
                                                    }
                                                </div>
                                                <div className="location">{data?.city?.city}, Pakistan</div>
                                                {
                                                    data?.project_categories &&
                                                    <div className="type-tag">
                                                        {data.types.map((type, idx) => (
                                                            <div className="tag-name" key={idx}>
                                                                {type}
                                                            </div>
                                                        ))}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                        }

                        {shouldUseSlider && showArrows && (
                            <SliderArrows
                                sliderRef={sliderRef}
                                totalSlides={featuredProjectsData?.length || 0}
                                slidesToShow={currentSlidesToShow}
                                uniqueId="featured-projects"
                                currentSlideIndex={currentSlideIndex}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default FeaturedProjects
