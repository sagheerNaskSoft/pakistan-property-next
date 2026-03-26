import React, { useEffect, useRef, useState } from "react";
// import "./Banner.css";
import BreadCrumb from '../Metiral/BreadCrumb'
import BlogCard from "../Metiral/BlogCard/BlogCard";
import { useAuth } from "../../Context/ContextProvider";
import { useNavigate } from "react-router-dom";
function Banner({ filter, categoryList, blogList, pagination , blogSlider , setBlogSlider }) {
    const [active, setActive] = useState("All");
    const { subscribeNewsLater, button_loading, objectToQueryString } = useAuth()
    const [showCard, setShowCard] = useState(false)
    const pageRef = useRef(null)
    const activeTabRef = useRef(null)
    const num = ["5", "10", "15", "20", "25", "30"]
    const navigate = useNavigate()
    const number = Array.from({ length: pagination?.total_pages }, (v, i) => i + 1);
    const handlePageChange = async (pageAction) => {
        let goPage = filter?.current_page || 1;

        if (pageAction?.action === "next" && filter?.current_page < pagination?.total_pages) {
            goPage = filter?.current_page + 1;
        }

        if (pageAction?.action === "back" && filter?.current_page > 1) {
            goPage = filter?.current_page - 1;
        }

        if (pageAction?.action === "pageChange") {
            goPage = pageAction?.page_number;
        }


        // Build search payload
        const queryString = objectToQueryString({ ...filter, current_page: goPage });

        // Navigate to new page with updated query string
        navigate(`/all-blog?${queryString}`);
    };
    const chips = ["Investment", "Buying", "Renting", "Architecture"];
    const [data, setData] = useState({
        email: "",
        interest: ""
    })
    const [errorFaild, setErrors] = useState()
    const validateStep = () => {
        let errors = {};

        if (!data.email) {
            errors.email = "Email is required.";
        } else if (!isValidEmail(data.email)) {
            errors.email = "Please enter a valid email address.";
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };
    const handleSubmit = async () => {
        if (validateStep()) {
            let result = await subscribeNewsLater(data)
            if (result?.success) {
                setData({
                    email: "",
                    interest: ""
                })
            }
        }
    }
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    useEffect(() => {
        if (filter?.category) {
            setActive(filter?.category)
        } else {
            setActive("All")
        }
    }, [filter?.category])

    useEffect(() => {
        if (activeTabRef.current) {
            activeTabRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [active])
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
    return (
        <div className="all-blogs-section">
             <div  className={`all-blog-li ${blogSlider ? "blog-slider-li" : ""}`}>
                <div className="d-flex align-items-center justify-content-between global-input-section-header">
                    <h4 className='global-input-section-title mb-sm-2 mb-0 d-sm-none d-block'>Categories</h4>
                    <div onClick={() => setBlogSlider(false)} className="input-section-close-btn d-sm-none d-flex justify-content-center align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15.9999 8.00031C15.8124 7.81284 15.5581 7.70752 15.2929 7.70752C15.0278 7.70752 14.7735 7.81284 14.5859 8.00031L11.9999 10.5863L9.41395 8.00031C9.22534 7.81815 8.97274 7.71735 8.71055 7.71963C8.44835 7.72191 8.19754 7.82708 8.01213 8.01249C7.82672 8.1979 7.72155 8.44871 7.71928 8.7109C7.717 8.9731 7.81779 9.2257 7.99995 9.41431L10.5859 12.0003L7.99995 14.5863C7.81779 14.7749 7.717 15.0275 7.71928 15.2897C7.72155 15.5519 7.82672 15.8027 8.01213 15.9881C8.19754 16.1735 8.44835 16.2787 8.71055 16.281C8.97274 16.2833 9.22534 16.1825 9.41395 16.0003L11.9999 13.4143L14.5859 16.0003C14.7745 16.1825 15.0271 16.2833 15.2893 16.281C15.5515 16.2787 15.8023 16.1735 15.9878 15.9881C16.1732 15.8027 16.2783 15.5519 16.2806 15.2897C16.2829 15.0275 16.1821 14.7749 15.9999 14.5863L13.4139 12.0003L15.9999 9.41431C16.1874 9.22678 16.2927 8.97247 16.2927 8.70731C16.2927 8.44214 16.1874 8.18783 15.9999 8.00031Z" fill="#2D2D2D"></path><path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D"></path></svg></div>
                </div>
                <ul>
                    <li
                        // key={cat?.id}
                        className={active === "All" ? "active" : ""}
                        onClick={() => {
                            navigate("/all-blog");
                            setBlogSlider(false);
                        }}
                    >
                        ALL
                    </li>
                    {categoryList?.length > 0
                        ? categoryList
                            // ?.filter(cat => Number(cat.blogs_count) > 0)
                            // ?.slice(0, 8)
                            ?.map((cat) => (
                                <li
                                    key={cat?.name}
                                    className={active === cat?.slug ? "active" : ""}
                                    onClick={() => {
                                        const queryString = objectToQueryString({ category: cat?.slug });
                                        navigate(`/all-blog?${queryString}`);
                                        setBlogSlider(false);
                                    }}
                                >
                                    {cat?.name}
                                </li>
                            ))
                        : ""}

                </ul>
                {/* <ul>
                    <li
                            // key={cat?.id}
                            className={active === "All" ? "active" : ""}
                            onClick={() => {
                                navigate("/all-blog")
                            }}
                        >
                            ALL
                        </li>
                    {categoryList?.slice(0,8)?.map((cat) => (
                        <li
                            key={cat?.id}
                            className={active === cat?.name ? "active" : ""}
                            onClick={() => {
                                const queryString = objectToQueryString({category:cat?.slug});
                                navigate(`/all-blog?${queryString}`)
                            }}
                        >
                            {cat?.name}
                        </li>
                    ))}
                </ul> */}
            </div>
            <div className="main-container">
                <div className="all-blogs-banner-details">
                    <span className="d-sm-block d-none"><BreadCrumb items={['Home',   "Blogs", "All blogs"]} paths={["/", "/blogs", "/all-blogs"]} /></span>
                    <h4>OUR BLOGS</h4>
                    <h1>Find our all blogs from here</h1>
                    <h4>Our blogs are written from very research research and well known writers writers so that  we can<br /> provide you the best blogs and articles articles for you to read them all along</h4>
                </div>
                {/* <h6>All Blog</h6> */}
                <div className='blog-grid mt-4'>
                    {blogList?.map((item) => {
                        return (
                            <BlogCard data={item} />
                        )
                    })}
                </div>
                <div style={{ background: "none", borderBottom: "1px solid", paddingBottom: "30px" }} className="card-section">
                    {pagination?.total_pages > 1 ? <div className="col-12 mt-4">
                        <div className="row w-100 m-0 align-items-center">
                            <div className="col-12 p-0" style={{ position: 'relative' }}>
                                <div className="d-flex justify-content-center">
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
                                                style={{cursor:"pointer"}}
                                                className={`page-number ${item === pagination.current_page ? 'active' : ''} ${item === "..." ? 'dots' : ''}`}
                                                onClick={() => {
                                                    if(item !== "...") handlePageChange({ action: "pageChange", page_number: item })
                                                }}
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
                                <div className="p-0 d-md-inline-block d-none" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                                    <div className="card-showing-box">
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
                                                                    <div className={filter?.per_page === item ? "title active" : "title"} onClick={async () => {
                                                                        setShowCard(false)
                                                                        const queryString = objectToQueryString({ ...filter, per_page: item });
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
                        </div>
                    </div> : ""}
                </div>
                <div className="insights-all-blog">
                    <div className="iab-inner">

                        {/* LEFT: copy + bullets */}
                        <div className="iab-left">
                            <span className="iab-badge">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M14.6666 4.66663L8.67258 8.48463C8.46918 8.60277 8.23814 8.665 8.00292 8.665C7.76769 8.665 7.53666 8.60277 7.33325 8.48463L1.33325 4.66663" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M13.3333 2.66663H2.66659C1.93021 2.66663 1.33325 3.26358 1.33325 3.99996V12C1.33325 12.7363 1.93021 13.3333 2.66659 13.3333H13.3333C14.0696 13.3333 14.6666 12.7363 14.6666 12V3.99996C14.6666 3.26358 14.0696 2.66663 13.3333 2.66663Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Weekly Newsletter
                            </span>

                            <h2 className="iab-title">
                                Get the Best Real Estate <br />Insights
                            </h2>

                            <p className="iab-sub">
                                Join 20,000+ property investors, developers, and homeowners who <br />
                                receive our curated newsletter every week.
                            </p>

                            <ul className="iab-bullets">
                                {[
                                    "Market analysis and price trends",
                                    "New property listings and opportunities",
                                    "Expert investment advice",
                                    "Legal and regulatory updates",
                                ].map((t, i) => (
                                    <li key={i}>
                                        <span className="tick">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* RIGHT: form card */}
                        <div className="iab-right">
                            <div className="iab-card">
                                <div className="inp_newsLater">
                                    <label className="iab-label">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="abc@gmail.com"
                                        value={data?.email}
                                        className="iab-input"
                                        onChange={(e) => setData({ ...data, email: e.target.value })}
                                    />
                                    {errorFaild?.email ? <span>{errorFaild?.email}</span> : ""}
                                </div>

                                <label className="iab-label">Interests (Optional)</label>
                                <div className="iab-chips">
                                    {chips.map((c) => (
                                        <button onClick={() => setData({ ...data, interest: c })} key={c} type="button" className={`iab-chip ${c === data?.interest ? "active" : ""}`}>
                                            {c}
                                        </button>
                                    ))}
                                </div>

                                <button onClick={handleSubmit} className="iab-cta">  {button_loading ? <div className="primiry_spiner spinner-border spinner-border-sm text-light" role="status" /> : "Subscribe Now"}</button>

                                <p className="iab-foot">
                                    No spam. Unsubscribe anytime. We respect your privacy.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Banner;
