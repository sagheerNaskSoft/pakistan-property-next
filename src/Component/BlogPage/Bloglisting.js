import React, { useEffect, useRef, useState, useMemo } from 'react'
import BlogCard from '../Metiral/BlogCard/BlogCard'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/ContextProvider';
import { FallbackImage } from '../Metiral/FallbackImage';
function Bloglisting({ blogSlider, setBlogSlider, popular_blogs, blogList, categoryList, pagination, filterData, setFilterData }) {
    const { objectToQueryString, subscribeNewsLater, button_loading, getAd, adsClick, adsImpression } = useAuth()
    const [showCard, setShowCard] = useState(false)
    const pageRef = useRef(null)
    const trackedImpressionsRef = useRef(new Set()); // Track which ad IDs have already been tracked
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const num = ["05", "10", "15", "20", "25", "30"]
    const navigate = useNavigate()
    const number = Array.from({ length: pagination?.total_pages }, (v, i) => i + 1);
    const handlePageChange = async (pageAction) => {
        let goPage = filterData?.current_page || 1;

        if (pageAction?.action === "next" && filterData?.current_page < pagination?.total_pages) {
            goPage = filterData?.current_page + 1;
        }

        if (pageAction?.action === "back" && filterData?.current_page > 1) {
            goPage = filterData?.current_page - 1;
        }

        if (pageAction?.action === "pageChange") {
            goPage = pageAction?.page_number;
        }

        // Update current page in state
        setFilterData((prev) => ({ ...prev, current_page: goPage }));

        // Build search payload
        const queryString = objectToQueryString({ current_page: goPage });

        // Navigate to new page with updated query string
        navigate(`/all-blog?${queryString}`);
    };
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    const renderPages = () => {
        const totalPages = number.length;
        const current = pagination.current_page;
        const pagesToShow = [];

        // Always show first page
        pagesToShow.push(1);

        // Left ellipsis
        if (current > 3) pagesToShow.push("...");

        // Current -1
        if (current > 2) pagesToShow.push(current - 1);

        // Current
        if (current !== 1 && current !== totalPages) pagesToShow.push(current);

        // Current +1
        if (current < totalPages - 1) pagesToShow.push(current + 1);

        // Right ellipsis
        if (current < totalPages - 2) pagesToShow.push("...");

        // Always show last page
        if (totalPages > 1) pagesToShow.push(totalPages);

        return pagesToShow;
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateEmail = () => {
        let error = "";
        if (!email || email.trim() === "") {
            error = "Email is required.";
        } else if (!isValidEmail(email)) {
            error = "Please enter a valid email address.";
        }
        setEmailError(error);
        return error === "";
    };

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        if (validateEmail()) {
            const result = await subscribeNewsLater({ email: email.trim() });
            if (result?.success) {
                setEmail("");
                setEmailError("");
            } else {
                setEmailError(result?.error?.message || "Something went wrong. Please try again.");
            }
        }
    };
    const [adData, setAdData] = useState([])
    const [deviceType, setDeviceType] = useState('desktop'); // 'mobile', 'tablet', 'desktop'
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
            // Detect device type for ad filtering
            // Bootstrap breakpoints: xs < 576, sm >= 576, md >= 768, lg >= 992
            if (width < 576) {
                setDeviceType('mobile');
            } else if (width < 992) {
                setDeviceType('tablet');
            } else {
                setDeviceType('desktop');
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [])

    useEffect(() => {
        const fetchAds = async () => {
            const result = await getAd()
            if (result?.success) {
                setAdData(result?.data?.data)
            }
        }
        fetchAds()
    }, [])

    // Filter ads based on device type and ad type, sorted by priority
    const getFilteredAds = useMemo(() => {
        if (!adData || adData.length === 0) return { vertical: [], horizontal: [] };

        const filtered = adData.filter(ad => {
            // Check if ad is active
            if (ad.status !== 1) return false;

            // Check date validity
            const now = new Date();
            const startDate = new Date(ad.start_date);
            const endDate = new Date(ad.end_date);
            if (now < startDate || now > endDate) return false;

            // Check device type
            const deviceTypes = ad.device_type || [];
            if (deviceTypes.includes('all') || deviceTypes.includes(deviceType)) {
                return true;
            }
            return false;
        });

        // Separate by ad type and sort by priority (lower number = higher priority)
        const verticalAds = filtered
            .filter(ad => ad.ad_type === 'vertical')
            .sort((a, b) => (a.priority || 999) - (b.priority || 999));

        const horizontalAds = filtered
            .filter(ad => ad.ad_type === 'horizontal')
            .sort((a, b) => (a.priority || 999) - (b.priority || 999));

        return {
            vertical: verticalAds,
            horizontal: horizontalAds
        };
    }, [adData, deviceType]);

    // Track ad impressions when ads are displayed
    useEffect(() => {
        const trackImpressions = async () => {
            // Track horizontal ad impressions
            getFilteredAds.horizontal.forEach(async (ad) => {
                if (ad?.id && !trackedImpressionsRef.current.has(ad.id)) {
                    trackedImpressionsRef.current.add(ad.id);
                    await adsImpression(ad.id);
                }
            });
            
            // Track vertical ad impressions
            getFilteredAds.vertical.forEach(async (ad) => {
                if (ad?.id && !trackedImpressionsRef.current.has(ad.id)) {
                    trackedImpressionsRef.current.add(ad.id);
                    await adsImpression(ad.id);
                }
            });
        };

        if (getFilteredAds.horizontal.length > 0 || getFilteredAds.vertical.length > 0) {
            trackImpressions();
        }
    }, [getFilteredAds.horizontal, getFilteredAds.vertical, adsImpression]);

    // Handle ad click
    const handleAdClick = (adId, adUrl) => {
        // Track click without blocking navigation
        if (adId) {
            adsClick(adId).catch(err => console.error('Error tracking ad click:', err));
        }
        // Open the ad URL in a new tab
        window.open(adUrl, '_blank', 'noopener,noreferrer');
    };

    // Mix blog cards with horizontal ads - show after every 3 cards
    const getMixedContent = useMemo(() => {
        if (!blogList || blogList.length === 0) return [];

        const horizontalAds = getFilteredAds.horizontal;
        const items = [];
        let adIndex = 0;

        blogList.forEach((blog, index) => {
            items.push({ type: 'blog', data: blog, index });

            // Insert horizontal ad after every 3 cards (after 3rd, 6th, 9th, etc.)
            // Only insert if there are ads available and not all ads have been used
            if (horizontalAds.length > 0 && adIndex < horizontalAds.length) {
                // After 3rd card (index 2), 6th card (index 5), 9th card (index 8), etc.
                const shouldInsertAd = (index + 1) % 3 === 0;
                if (shouldInsertAd) {
                    items.push({ type: 'ad', data: horizontalAds[adIndex], index: `ad-${adIndex}` });
                    adIndex++; // Move to next ad, don't cycle (no repeat until all ads shown)
                }
            }
        });

        return items;
    }, [blogList, getFilteredAds.horizontal]);

    return (
        <>
            <div className='blog-listing'>
                <div className='row m-0'>
                    <div className='col-xl-3 col-lg-4  order-lg-1  order-2 ps-0 pe-lg-3 px-0'>

                        <div className='blog-side-section'>
                            <div className='row'>
                                <div className='col-lg-12 d-none'>
                                    <div className="blog-input-section">
                                        <span className="blog-search-pill">
                                            {/* search icon */}
                                            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <circle cx="11" cy="11" r="7" stroke="#7A7A7A" strokeWidth="2" />
                                                <path d="M20 20L16.5 16.5" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            <input type="text" placeholder="Search articles…" className="blog-search-input" />
                                        </span>
                                    </div>
                                </div>
                                <div className='col-lg-12'>
                                    <div className={`blog-categories ${blogSlider ? "blog-slider-categories" : ""}`}>
                                        <div className="d-flex align-items-center justify-content-between global-input-section-header">
                                            <h4 className='global-input-section-title mb-sm-2 mb-0'>Categories</h4>
                                            <div onClick={() => setBlogSlider(false)} className="input-section-close-btn d-sm-none d-flex justify-content-center align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15.9999 8.00031C15.8124 7.81284 15.5581 7.70752 15.2929 7.70752C15.0278 7.70752 14.7735 7.81284 14.5859 8.00031L11.9999 10.5863L9.41395 8.00031C9.22534 7.81815 8.97274 7.71735 8.71055 7.71963C8.44835 7.72191 8.19754 7.82708 8.01213 8.01249C7.82672 8.1979 7.72155 8.44871 7.71928 8.7109C7.717 8.9731 7.81779 9.2257 7.99995 9.41431L10.5859 12.0003L7.99995 14.5863C7.81779 14.7749 7.717 15.0275 7.71928 15.2897C7.72155 15.5519 7.82672 15.8027 8.01213 15.9881C8.19754 16.1735 8.44835 16.2787 8.71055 16.281C8.97274 16.2833 9.22534 16.1825 9.41395 16.0003L11.9999 13.4143L14.5859 16.0003C14.7745 16.1825 15.0271 16.2833 15.2893 16.281C15.5515 16.2787 15.8023 16.1735 15.9878 15.9881C16.1732 15.8027 16.2783 15.5519 16.2806 15.2897C16.2829 15.0275 16.1821 14.7749 15.9999 14.5863L13.4139 12.0003L15.9999 9.41431C16.1874 9.22678 16.2927 8.97247 16.2927 8.70731C16.2927 8.44214 16.1874 8.18783 15.9999 8.00031Z" fill="#2D2D2D"></path><path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D"></path></svg></div>
                                        </div>
                                        <ul>
                                            <li
                                                className="active"
                                                onClick={() => {
                                                    navigate("/all-blog")
                                                }}
                                            >
                                                <span>All Categories</span>
                                                <span className="count">{categoryList?.reduce((acc, cat) => acc + cat.blogs_count, 0)}</span>
                                            </li>
                                            {categoryList
                                                ?.filter(cat => Number(cat.blogs_count) > 0)
                                                .map((cat) => (
                                                    <li
                                                        key={cat.name}
                                                        onClick={() => {
                                                            const queryString = objectToQueryString({ category: cat?.slug });
                                                            navigate(`/all-blog?${queryString}`);
                                                        }}
                                                    >
                                                        <span>{cat.name}</span>
                                                        <span className="count">{cat.blogs_count}</span>
                                                    </li>
                                                ))
                                            }

                                        </ul>
                                    </div>
                                </div>
                                <div className='col-lg-12'>
                                    <h3 className='d-sm-none d-block new-renewed-heading'>Popular Blogs</h3>
                                    <div className='popular-blogs'>
                                        <h3 className='d-sm-block d-none'>Popular Blogs</h3>
                                        {popular_blogs?.map((item, index) => {
                                            return (
                                                <div
                                                    key={`popular-blog-${item?.id || item?.slug || index}`}
                                                    onClick={() => {
                                                    navigate(`/blog-detail/${item?.slug}`)
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                    className='popular-blog-lower-section'
                                                >
                                                    <FallbackImage src={item?.featured_image_url} alt={item?.featured_image_alt} componentName="Bloglisting" />
                                                    <div>
                                                        <h5>{item?.title}</h5>
                                                        <h6>{formatDate(item?.published_at)}</h6>
                                                    </div>
                                                </div>
                                            )

                                        })}

                                    </div>
                                </div>
                                <div className='col-lg-12'>
                                    <div className='blog-newsletter'>
                                        <div className='newsletter-heading'>
                                            <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M22 7L13.009 12.727C12.7039 12.9042 12.3573 12.9976 12.0045 12.9976C11.6517 12.9976 11.3051 12.9042 11 12.727L2 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg></span>
                                            <div>
                                                <h4>Subscribe to Our Newsletter</h4>
                                                <h6>Get weekly real estate insights</h6>
                                            </div>
                                        </div>
                                        <div className="news-inputt-section">
                                            <form
                                                className="news-inputt-row"
                                                onSubmit={handleNewsletterSubmit}
                                                id="newsletter-form"
                                            >
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                        if (emailError) setEmailError("");
                                                    }}
                                                    placeholder="Enter your email"
                                                    className={`news-inputt ${emailError ? "error" : ""}`}
                                                />

                                            </form>
                                            <button type="submit" form="newsletter-form" className="news-sub-btn">{
                                                button_loading ? <div className="spinner-border spinner-border-sm text-dark" role="status" /> : "Subscribe"}</button>
                                            {emailError && (
                                                <span className="newsletter-error" style={{ color: "#ff4444", fontSize: "10px", marginTop: "5px", display: "block" }}>
                                                    {emailError}
                                                </span>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {getFilteredAds.vertical.map((item) => (
                            <div key={item.id} className='my-3'>
                                <a 
                                    href={item?.url} 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAdClick(item?.id, item?.url);
                                    }}
                                >
                                    <img className='w-100 ' src={item?.image} alt={item?.title || 'Advertisement'} />
                                </a>
                            </div>
                        ))}
                    </div>
                    <div className="col-xl-9 col-lg-8  order-lg-2  order-1 px-lg-3 px-0">
                        <div onClick={() => navigate("/all-blog")} className='blog-card-data' style={{ cursor: "pointer" }}>
                            <h1>All Blogs</h1>
                            <h5>View All <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9.28866 5.29076C9.19719 5.38371 9.12459 5.4943 9.07505 5.61615C9.02551 5.73799 9 5.86868 9 6.00068C9 6.13268 9.02551 6.26337 9.07505 6.38521C9.12459 6.50706 9.19719 6.61765 9.28866 6.7106L13.7581 11.2901C13.8496 11.383 13.9222 11.4936 13.9717 11.6155C14.0212 11.7373 14.0468 11.868 14.0468 12C14.0468 12.132 14.0212 12.2627 13.9717 12.3845C13.9222 12.5064 13.8496 12.617 13.7581 12.7099L9.28866 17.2894C9.19719 17.3824 9.12459 17.4929 9.07505 17.6148C9.02551 17.7366 9 17.8673 9 17.9993C9 18.1313 9.02551 18.262 9.07505 18.3839C9.12459 18.5057 9.19719 18.6163 9.28866 18.7092C9.4715 18.8955 9.71883 19 9.97664 19C10.2344 19 10.4818 18.8955 10.6646 18.7092L15.1438 14.1198C15.6921 13.5573 16 12.7949 16 12C16 11.2051 15.6921 10.4427 15.1438 9.88024L10.6646 5.29076C10.4818 5.10453 10.2344 5 9.97664 5C9.71883 5 9.4715 5.10453 9.28866 5.29076Z" fill="#2D2D2D" />
                            </svg></h5>
                        </div>
                        <div className='blog-grid'>
                            {getMixedContent.map((item) => {
                                if (item.type === 'blog') {
                                    return <BlogCard key={item.data?.id || item.index} data={item.data} />;
                                } else if (item.type === 'ad') {
                                    return (
                                        <div key={item.data.id} className="w-100" style={{ gridColumn: '1 / -1' }}>
                                            <a 
                                                href={item.data.url} 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleAdClick(item.data.id, item.data.url);
                                                }}
                                                className="global-horizontal-ad-box w-100 d-block"
                                            >
                                                <img src={item.data.image} alt={item.data.title || 'Advertisement'} className="w-100" />
                                            </a>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                        <div className="card-section blog-card-section">
                            {pagination?.total_pages > 1 ? <div className="col-12 mt-4">
                                <div className="row w-100 m-0 align-items-center">
                                    <div className="col-md-6 col-sm-6 col-12 order-sm-first order-last p-0">
                                        <div className="pagination ">
                                            <div className="move-btn back" onClick={() => handlePageChange({ action: "back" })}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.2329 4.18414C10.4626 4.423 10.4551 4.80282 10.2163 5.0325L7.06605 8L10.2163 10.9675C10.4551 11.1972 10.4626 11.577 10.2329 11.8159C10.0032 12.0547 9.62339 12.0622 9.38452 11.8325L5.78452 8.4325C5.66688 8.31938 5.60039 8.16321 5.60039 8C5.60039 7.83679 5.66688 7.68062 5.78452 7.5675L9.38452 4.1675C9.62339 3.93782 10.0032 3.94527 10.2329 4.18414Z" fill="#737678" />
                                                </svg>
                                                Back
                                            </div>

                                            {renderPages()?.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className={`page-number ${item === pagination.current_page ? 'active' : ''} ${item === "..." ? 'dots' : ''}`}
                                                    onClick={() => item !== "..." && handlePageChange({ action: "pageChange", page_number: item })}
                                                >
                                                    {item}
                                                </div>
                                            ))}

                                            <div className="move-btn next" onClick={() => handlePageChange({ action: "next" })}>
                                                Next
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.76711 11.8159C5.53743 11.577 5.54488 11.1972 5.78374 10.9675L8.93395 8L5.78374 5.0325C5.54488 4.80282 5.53743 4.423 5.76711 4.18413C5.99679 3.94527 6.37661 3.93782 6.61548 4.1675L10.2155 7.5675C10.3331 7.68062 10.3996 7.83679 10.3996 8C10.3996 8.16321 10.3331 8.31938 10.2155 8.4325L6.61548 11.8325C6.37661 12.0622 5.99679 12.0547 5.76711 11.8159Z" fill="#737678" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 p-0">
                                        <div className="card-showing-box per_page_box">
                                            <div className="text" onClick={() => setShowCard(!showCard)}>Result per page</div>
                                            <div className="box" ref={pageRef} onClick={() => setShowCard(!showCard)}>{pagination?.per_page || 15}
                                                {
                                                    !showCard ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <path d="M5.71484 7.85742L10.0006 12.1431L14.2863 7.85742" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        :
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                                                            <path d="M13.6094 12.1426L9.56673 7.85686L5.52409 12.1426" stroke="#444545" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                }
                                                {
                                                    showCard ?
                                                        <>
                                                            <div className="input-drop-menu">
                                                                {
                                                                    num?.map((item) => (
                                                                        <div key={`per-page-${item}`} className={filterData?.per_page === item ? "title active" : "title"} onClick={async () => {
                                                                            setFilterData({ ...filterData, per_page: item }); setShowCard(false)
                                                                            const queryString = objectToQueryString({ ...filterData, per_page: item });
                                                                            navigate(`/all-blog?${queryString}`)

                                                                        }}>{item}</div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </>
                                                        :
                                                        ''
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> : ""}

                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Bloglisting
