import React, { useState, useEffect } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';

// Custom Next and Prev Arrow Components
function NextArrow(props) {
    const { onClick } = props;
    return (
        <button
            style={{ right: '32px', zIndex: 2 }}
            className="slick-arrow slick-next blog-custom-arrow"
            onClick={onClick}
            aria-label="Next"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
}
function PrevArrow(props) {
    const { onClick } = props;
    return (
        <button
            style={{ left: '32px', zIndex: 2 }}
            className="slick-arrow slick-prev blog-custom-arrow"
            onClick={onClick}
            aria-label="Previous"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
}

function Banner({ blogData }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Slider settings
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />, // Custom next arrow
        prevArrow: <PrevArrow />, // Custom prev arrow
        autoplay:true,
        autoplaySpeed: 3000,
        pauseOnHover: false
    };
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    const navigate=useNavigate()
    return (
        <div className='blog-banner-slider' style={{ overflow: 'hidden', width: '100%' }}> {/* Prevent unwanted horizontal scroll */}
            <Slider {...settings}>
                {blogData?.map((item, idx) => (
                    <div key={idx}
                        className="blog-banner-img"

                    >
                        <img className='blog-banner-img-img' src={item.featured_image_url} alt={item.featured_image_alt} />
                        <div className='blog-banner-img-overlay' />
                        <div className='main-container' style={{ width: '100%' }}>
                            <div className='blog-inner-card' style={{ width: window?.innerWidth >= 992 ? "65%" : '100%' , margin: window?.innerWidth >= 992 ? "0" : '' }}>
                                <div className='blog-inner'>
                                    <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <g clipPath="url(#clip0_7474_218756)">
                                            <path d="M7.34447 1.876C7.37304 1.72307 7.45419 1.58495 7.57387 1.48555C7.69355 1.38615 7.84423 1.33174 7.99981 1.33174C8.15538 1.33174 8.30606 1.38615 8.42574 1.48555C8.54542 1.58495 8.62657 1.72307 8.65514 1.876L9.35581 5.58134C9.40557 5.84477 9.53359 6.08708 9.72316 6.27665C9.91273 6.46622 10.155 6.59424 10.4185 6.644L14.1238 7.34467C14.2767 7.37324 14.4149 7.45439 14.5143 7.57407C14.6137 7.69375 14.6681 7.84443 14.6681 8C14.6681 8.15558 14.6137 8.30626 14.5143 8.42594C14.4149 8.54562 14.2767 8.62677 14.1238 8.65534L10.4185 9.356C10.155 9.40577 9.91273 9.53379 9.72316 9.72336C9.53359 9.91293 9.40557 10.1552 9.35581 10.4187L8.65514 14.124C8.62657 14.2769 8.54542 14.4151 8.42574 14.5145C8.30606 14.6139 8.15538 14.6683 7.99981 14.6683C7.84423 14.6683 7.69355 14.6139 7.57387 14.5145C7.45419 14.4151 7.37304 14.2769 7.34447 14.124L6.64381 10.4187C6.59404 10.1552 6.46602 9.91293 6.27645 9.72336C6.08688 9.53379 5.84457 9.40577 5.58114 9.356L1.87581 8.65534C1.72287 8.62677 1.58475 8.54562 1.48535 8.42594C1.38595 8.30626 1.33154 8.15558 1.33154 8C1.33154 7.84443 1.38595 7.69375 1.48535 7.57407C1.58475 7.45439 1.72287 7.37324 1.87581 7.34467L5.58114 6.644C5.84457 6.59424 6.08688 6.46622 6.27645 6.27665C6.46602 6.08708 6.59404 5.84477 6.64381 5.58134L7.34447 1.876Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M13.3335 1.33333V3.99999" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M14.6667 2.66667H12" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2.66683 14.6667C3.40321 14.6667 4.00016 14.0697 4.00016 13.3333C4.00016 12.597 3.40321 12 2.66683 12C1.93045 12 1.3335 12.597 1.3335 13.3333C1.3335 14.0697 1.93045 14.6667 2.66683 14.6667Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_7474_218756">
                                                <rect width="16" height="16" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>Property Market Blogs & Insights</span>
                                </div>
                                {/* Headings pulled from item: fallback for unknown structure */}
                                <h1>{item.title || item.heading || 'No Title'}</h1>
                                <h4>{item?.description?.replace(/<[^>]+>/g, ' ') || '...'}</h4>
                                <span style={{ textTransform: 'capitalize' }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M15.8332 17.5V15.8333C15.8332 14.9493 15.482 14.1014 14.8569 13.4763C14.2317 12.8512 13.3839 12.5 12.4998 12.5H7.49984C6.61578 12.5 5.76794 12.8512 5.14281 13.4763C4.51769 14.1014 4.1665 14.9493 4.1665 15.8333V17.5" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9.99984 9.16667C11.8408 9.16667 13.3332 7.67428 13.3332 5.83333C13.3332 3.99238 11.8408 2.5 9.99984 2.5C8.15889 2.5 6.6665 3.99238 6.6665 5.83333C6.6665 7.67428 8.15889 9.16667 9.99984 9.16667Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>{item.author?.replace("Admin", ' ') || item.writer || 'Author'}</span>
                                <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M6.6665 1.66669V5.00002" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M13.3335 1.66669V5.00002" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15.8333 3.33331H4.16667C3.24619 3.33331 2.5 4.07951 2.5 4.99998V16.6666C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6666V4.99998C17.5 4.07951 16.7538 3.33331 15.8333 3.33331Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2.5 8.33331H17.5" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>{formatDate(item.published_at || item.created_at) || 'Date'}</span>
                                <div>
                                    <button  onClick={()=>{
                                                navigate(`/blog-detail/${item?.slug}`)
                                    }}>Read More</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default Banner
