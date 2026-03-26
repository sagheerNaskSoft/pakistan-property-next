import React, { useEffect, useRef, useState } from 'react'
import './agentPortal.css'
import Image from 'next/image';
// import logoWithoutText from '../../Asset/logo-with-text.svg'
// import logoWithText from '../../Asset/logo-without-text.svg'
import logo from '../../Asset/DAshBoardImg.svg'
import Button from '../../../Component/Metiral/Button';
import { Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../Context/ContextProvider';
import dummyProfile from '../../../Asset/HomePage/Profile.svg'
import { Avatar } from '@mui/material';
import Dashboard from '../../Pages/Dashboard';
import AddProperty from '../../Pages/AddProperty';
import CustomizedSnackbars from '../../../Component/NavBarFooter/CustomizedSnackbars'
import PropertyListing from '../../Pages/PropertyListing';
import QuotaCredit from '../../Pages/QuotaCredit';
import PropShop from '../../Pages/PropShop';
import CheckOut from '../../Pages/CheckOut';
import OrderHistory from '../../Pages/OrderHistory';
import AgentSetting from '../../Pages/AgentSetting';
import AgencySettings from '../../Pages/AgencySettings';
import PropertyLeads from '../../Pages/PropertyLeads';
import StaffList from '../../Pages/StaffList';
import AgencyDashBoard from '../../Pages/AgencyDashBoard';
import { Helmet } from 'react-helmet';
import NewPackageShop from '../../Pages/PackageShop';
import TawkTo from '../Modal/TawkTo';
import pakistanPropertyLogo from '../../Asset/ppp.png'
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import Chat from '../../Pages/Chat';

function MainPortal() {
    const [activeSideBar, setActiveSideBar] = useState(false);
    const [menu, setMenu] = useState(false)

    const [activeTab, setActiveTab] = useState("/${role}-portal/dashboard")
    const [dashBoardOwner, setDashBoaredOwner] = useState(dummyProfile)
    const ceo_obj = JSON.parse(localStorage.getItem("ceo_profile"))
    const { logout, setOpenLoanModal, loginData, getagency } = useAuth()
    const role = loginData?.data?.role
    const wrapperRef = useRef();
    const sidebarRef = useRef();
    const pagesRef = useRef();
    const sidebarPortalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Outside click handler for sidebar and body scroll lock
    useEffect(() => {
        const handleClickOutsideSidebar = (event) => {
            if (
                activeSideBar &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                !event.target.closest('.menu-btn') &&
                !event.target.closest('.sidebar-backdrop') &&
                !event.target.closest('.sidebar-button')
            ) {
                setActiveSideBar(false);
            }
        };

        const handleResize = () => {
            // Close sidebar when resizing to desktop size
            if (window.innerWidth >= 992 && activeSideBar) {
                setActiveSideBar(false);
            }
        };

        if (activeSideBar) {
            document.addEventListener('mousedown', handleClickOutsideSidebar);
            window.addEventListener('resize', handleResize);
            // Prevent body scroll when sidebar is open on mobile
            if (window.innerWidth < 992) {
                document.body.style.overflow = 'hidden';
            }
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideSidebar);
            window.removeEventListener('resize', handleResize);
            document.body.style.overflow = 'unset';
        };
    }, [activeSideBar]);

    const location = useLocation();

    useEffect(() => {
        setActiveSideBar(false);
        setActiveTab(location.pathname);
    }, [location.pathname])

    // Check for overflow and apply padding-bottom only when needed
    useEffect(() => {
        let rafId = null;
        let resizeTimeout = null;

        const checkOverflow = () => {
            if (sidebarPortalRef.current) {
                const element = sidebarPortalRef.current;
                // Batch layout reads
                const scrollHeight = element.scrollHeight;
                const clientHeight = element.clientHeight;
                const hasOverflow = scrollHeight > clientHeight;

                // Batch style writes
                element.style.paddingBottom = hasOverflow ? '200px' : '0';
            }
        };

        const scheduleCheck = () => {
            if (rafId) return; // Already scheduled
            rafId = requestAnimationFrame(() => {
                checkOverflow();
                rafId = null;
            });
        };

        // Check on mount and when sidebar state changes
        scheduleCheck();

        // Throttle resize events
        const handleResize = () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(scheduleCheck, 100);
        };

        window.addEventListener('resize', handleResize);

        // Use MutationObserver with requestAnimationFrame to batch DOM changes
        const observer = new MutationObserver(scheduleCheck);
        if (sidebarPortalRef.current) {
            observer.observe(sidebarPortalRef.current, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            if (resizeTimeout) clearTimeout(resizeTimeout);
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    }, [activeSideBar]);

    // Show scrollbar only when scrolling
    useEffect(() => {
        const pagesElement = pagesRef.current;
        if (!pagesElement) return;

        let scrollTimeout;
        const handleScroll = () => {
            pagesElement.classList.add('scrolling');
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                pagesElement.classList.remove('scrolling');
            }, 500); // Hide scrollbar 500ms after scrolling stops
        };

        pagesElement.addEventListener('scroll', handleScroll);
        return () => {
            pagesElement.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [])
    const navigate = useNavigate()
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);   // Day, Month Date
    const handleAddProperty = () => {
        navigate(`/${role}-portal/add-property`)

    }

    useEffect(() => {
        if (role === "agency") {
            const fetchQuota = async () => {
                try {
                    const result = await getagency();

                    if (result?.success) {
                        const ceoImage = result?.data?.data?.ceo_image;

                        // Retrieve existing object from localStorage or create empty
                        const existingProfile = JSON.parse(localStorage.getItem("ceo_profile")) || {};

                        // Update or set the ceo_image
                        const updatedProfile = {
                            ...existingProfile,
                            ceo_image: ceoImage
                        };

                        // Store back in localStorage
                        localStorage.setItem("ceo_profile", JSON.stringify(updatedProfile));
                    }
                } catch (error) {
                    console.error("Error fetching CEO data:", error);
                }
            };

            fetchQuota(); // Call the async function
        }
    }, [role]);

    useEffect(() => {
        if (role == "agent") {
            setDashBoaredOwner(loginData?.data?.user?.avatar)
        }
        if (role == "agency") {
            setDashBoaredOwner(ceo_obj?.ceo_image)
        }
    }, [])


    return (
        <>
            <Helmet>
                <link rel="icon" href="/fav-icon.svg" />
            </Helmet>
            <div className='portal-header d-flex align-items-center' style={{ position: activeTab === `/${role}-portal/add-property` && window?.innerWidth <= 576 ? "" : "" }}>
                <div className="sidebar-button d-lg-flex d-none" style={{ marginRight: "48px", transform: activeSideBar ? "rotateY(180deg)" : "rotateY(0deg)", transition: "all 0.2s linear", cursor: "pointer" }} onClick={() => setActiveSideBar(!activeSideBar)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <path d="M6 9H30M6 18H21M6 27H13.5" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="menu-btn d-lg-none d-flex" style={{ width: "48px", height: "48px", justifyContent: "center", alignItems: "center" }} onClick={() => setActiveSideBar(true)}>
                    <i style={{ fontSize: "24px" }} className="fa-solid fa-bars"></i>
                </div>
                {/* <div className="logo">
                    <Image src={logo} alt="" />
                </div> */}
                <div className="d-sm-flex d-none w-100 align-items-center justify-content-between">
                    <p className='date d-sm-block d-none'>{today}</p>
                </div>
                <div style={{ gap: "20px" }} className='action-header d-flex align-items-center'>
                    <Link to={`/${role}-portal/chat`}>
                        <div className='chat-icon'>
                            <HiOutlineChatBubbleOvalLeftEllipsis className='chat-icon-icon' />
                        </div>
                    </Link>
                    <Link className='d-flex' style={{ textDecoration: "none" }} to={'/'}>
                        <div className="home-route-link d-flex" style={{ borderBottom: window?.innerWidth <= 576 ? "1px solid #447158" : '' }}>
                            PakistanProperty.com
                        </div>
                    </Link>
                    <svg className="d-lg-block d-none" xmlns="http://www.w3.org/2000/svg" width="2" height="30" viewBox="0 0 2 30" fill="none">
                        <path d="M1 7.62939e-06L1 30" stroke="#BBBBBB" strokeWidth="0.7" />
                    </svg>
                    <Button onClick={handleAddProperty} variant="primary d-none d-lg-flex" state='hover'>Add Property</Button>
                    <svg className="d-lg-block d-none" xmlns="http://www.w3.org/2000/svg" width="2" height="30" viewBox="0 0 2 30" fill="none">
                        <path d="M1 7.62939e-06L1 30" stroke="#BBBBBB" strokeWidth="0.7" />
                    </svg>
                    <div ref={wrapperRef} onClick={() => { setMenu(!menu) }} className='profile_menu d-sm-flex d-none'>
                        <Avatar alt="Cindy Baker" src={(role == "agent" ? loginData?.data?.user?.avatar : ceo_obj?.ceo_image) || dummyProfile} />
                        {menu && <div className='dropdown_menu pt-0'>
                            <ul className='w-100 mb-0'>
                                <div className="profile-box">
                                    <div className="img">
                                        <Avatar alt="Cindy Baker" src={(role == "agent" ? loginData?.data?.user?.avatar : ceo_obj?.ceo_image) || dummyProfile} />
                                    </div>
                                    <div className="text">
                                        <div className="name">{loginData?.data?.user?.name}</div>
                                        <div className="email">{loginData?.data?.user?.email}</div>
                                    </div>
                                </div>
                                <li><Link to={'/'} className='link'>PakistanProperty.com</Link></li>
                                <li><Link className='link'>Settings</Link></li>
                                <li ><p onClick={async () => {
                                    let result = await logout()
                                    if (result) {
                                        navigate('/')
                                    }
                                    setMenu(false)
                                }} className='link m-0'>Logout</p></li>
                            </ul>
                        </div>}
                    </div>
                    {/* <div className="pakistinPropertyLogo" onClick={() => navigate('/')}>
                        <Image src={pakistanPropertyLogo} alt="" />
                    </div> */}
                </div>
            </div>
            <div className='main-portal'>
                <CustomizedSnackbars />

                {/* Backdrop overlay for md screens */}
                {/* {activeSideBar && (
                    <div
                        className="sidebar-backdrop d-lg-none"
                        onClick={() => setActiveSideBar(false)}
                    />
                )} */}

                <div
                    ref={sidebarRef}
                    className={`side-bar ${activeSideBar ? "expanded" : ''}`}
                >
                    <div className="logo d-lg-none d-flex" style={{ paddingTop: '12px', marginBottom: '8px', backgroundColor: 'transparent', height: '52px' }}>
                        <Image src={logo} alt="" />
                    </div>
                    {
                        loginData &&
                        (
                            <>
                                <div className="global-profile-box d-sm-none" style={{ borderTop: "1px solid #BBBBBB", padding: "12px", borderBottom: "1px solid #BBBBBB", background: 'unset' }}>
                                    <Avatar alt="Cindy Baker" style={{ width: "40px", height: "40px" }} src={(role == "agent" ? loginData?.data?.user?.avatar : ceo_obj?.ceo_image) || dummyProfile} />
                                    <div className="profile-box-info">
                                        <p className="name">{loginData?.data?.user?.name}</p>
                                        <p className="email">{loginData?.data?.user?.email}</p>
                                    </div>
                                </div>
                                <div className="side-bar-footer d-sm-none" style={{
                                    position: "absolute",
                                    bottom: "0",
                                    left: "0",
                                    right: "0",
                                    width: "100%",
                                    zIndex: 99999,
                                    background: "white",
                                    borderTop: "1px solid #BBBBBB",
                                    paddingLeft: '16px',
                                    paddingBottom: "env(safe-area-inset-bottom)",
                                    minHeight: "52px",
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: "14px",
                                    fontStyle: "normal",
                                    fontWeight: "500",
                                    lineHeight: "18px",
                                    fontFamily: "var(--font-family)",
                                    color: "#2D2D2D",
                                    // justifyContent: "center",
                                    // boxShadow: "0 -2px 10px rgba(0,0,0,0.1)"
                                }}
                                    onClick={async (e) => {
                                        let result = await logout()
                                        if (result) {
                                            navigate('/')
                                        }
                                        setMenu(false)
                                    }}>Logout</div>
                            </>
                        )
                    }

                    <div ref={sidebarPortalRef} className='side-bar-portal h-100' style={{ paddingRight: activeSideBar ? "16px" : "7px" }}>
                        <p className="main-devider first"></p>
                        <div className={`side-bar-links first ${activeTab === `/${role}-portal/dashboard` ? "active" : ""}`}>
                            <Link to={`/${role}-portal/dashboard`} onClick={() => setActiveSideBar(false)} className={`link ${activeSideBar ? 'active' : ''}`}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M3.99894 0H6.99816C9.20671 0 10.9971 1.79087 10.9971 4V7.00001C10.9971 9.20915 9.20671 11 6.99816 11H3.99894C1.79039 11.0001 0 9.2092 0 7.00001V4C0 1.79087 1.79039 0 3.99894 0Z" fill="black" />
                                <path d="M17.0019 0H20.0011C22.2096 0 24 1.79087 24 4V7.00001C24 9.20915 22.2096 11 20.0011 11H17.0019C14.7933 11 13.0029 9.20915 13.0029 7.00001V4C13.0029 1.79087 14.7933 0 17.0019 0Z" fill="black" />
                                <path d="M3.99894 13H6.99816C9.20671 13 10.9971 14.7909 10.9971 17V20C10.9971 22.2092 9.20671 24 6.99816 24H3.99894C1.79039 24.0001 0 22.2092 0 20.0001V17.0001C0 14.7909 1.79039 13 3.99894 13Z" fill="black" />
                                <path d="M17.0019 12.9999H20.0011C22.2096 12.9999 24 14.7908 24 16.9999V19.9999C24 22.2091 22.2096 24 20.0011 24H17.0019C14.7933 24 13.0029 22.2091 13.0029 20V16.9999C13.0029 14.7908 14.7933 12.9999 17.0019 12.9999Z" fill="black" />
                            </svg> <span></span></Link>
                        </div>
                        <p className="main-devider second"></p>
                        <div className={`side-bar-links second ${activeTab === `/${role}-portal/add-property` ? "active" : ""}`}>
                            <Link to={`/${role}-portal/add-property`} onClick={() => setActiveSideBar(false)} className={`link ${activeSideBar ? 'active' : ''}`}> <svg xmlns="http://www.w3.org/2000/svg" width="25" height="23" viewBox="0 0 25 23" fill="none">
                                <path d="M1 6.5L12 1L22.5 6.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3.5 22V5.5L12 1.5L20 5.5V12.5C20 12.5 15.5 12.5 15.5 17C15.5 21.5 20 22 20 22H12V13H6.5V22H3.5Z" fill="black" />
                                <path d="M21 14V20" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M24 17H18" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                            </svg> <span></span></Link>
                        </div>
                        <div className={`side-bar-links third ${activeTab === `/${role}-portal/property-listing` ? "active" : ""}`}>
                            <Link to={`/${role}-portal/property-listing`} onClick={() => setActiveSideBar(false)} className={`link ${activeSideBar ? 'active' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M9.66685 0V4H21.6668V0H9.66685ZM3.00018 0V4H7.00018V0H3.00018ZM9.66685 13.3333V17.3333H21.6668V13.3333H9.66685ZM3.00018 13.3333V17.3333H7.00018V13.3333H3.00018ZM9.66685 6.66667V10.6667H21.6668V6.66667H9.66685ZM3.00018 6.66667V10.6667H7.00018V6.66667H3.00018ZM9.66685 20V24H21.6668V20H9.66685ZM3.00018 20V24H7.00018V20H3.00018Z" fill="black" />
                            </svg> <span></span></Link>
                        </div>
                        <div className={`side-bar-links ninth ${activeTab === `/${role}-portal/property-leads` ? "active" : ""}`}>
                            <Link to={`/${role}-portal/property-leads`} onClick={() => setActiveSideBar(false)} className={`link ${activeSideBar ? 'active' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g clipPath="url(#clip0_2396_5375)">
                                    <path d="M23.7636 0.481625C23.5956 0.31209 23.3617 0.224574 23.1241 0.241948L19.3781 0.515887C18.9285 0.548776 18.5906 0.939887 18.6234 1.38958C18.6562 1.83928 19.0476 2.1756 19.4971 2.14417L21.0537 2.03031L15.57 7.52106L9.19265 2.12041C8.86852 1.84583 8.38812 1.86579 8.08784 2.16607L0.23911 10.0149C-0.0796779 10.3337 -0.0796779 10.8506 0.23911 11.1694C0.398544 11.3287 0.607433 11.4085 0.816403 11.4085C1.02537 11.4085 1.23418 11.3288 1.39362 11.1694L8.71095 3.85197L15.0887 9.25294C15.4129 9.52769 15.8937 9.50748 16.1939 9.20688L22.1865 3.20647L22.0627 4.70134C22.0255 5.15063 22.3596 5.54498 22.8089 5.58223C22.8318 5.58417 22.8545 5.58506 22.8772 5.58506C23.2975 5.58498 23.6545 5.26239 23.6899 4.83605L23.9973 1.1234C24.0169 0.885665 23.9316 0.651241 23.7636 0.481625Z" fill="black" />
                                    <path d="M7.28139 9.8379C6.97642 9.71168 6.62523 9.7815 6.39169 10.0149L2.99969 13.4069C2.84664 13.5601 2.76058 13.7677 2.76058 13.9842V22.944C2.76058 23.3948 3.12608 23.7603 3.57691 23.7603H6.96891C7.41973 23.7603 7.78523 23.3948 7.78523 22.944V10.5921C7.78531 10.2619 7.58636 9.96428 7.28139 9.8379Z" fill="black" />
                                    <path d="M10.9384 10.0149C10.705 9.7814 10.354 9.71166 10.0487 9.83789C9.74377 9.96427 9.54482 10.2619 9.54482 10.5921V22.944C9.54482 23.3948 9.91032 23.7603 10.3611 23.7603H13.7532C14.2041 23.7603 14.5696 23.3948 14.5696 22.944V13.9842C14.5696 13.7677 14.4836 13.5601 14.3304 13.407L10.9384 10.0149Z" fill="black" />
                                    <path d="M20.8498 9.8379C20.5447 9.71168 20.1936 9.7815 19.9601 10.0149L16.568 13.407C16.415 13.5602 16.3289 13.7678 16.3289 13.9842V22.9439C16.3289 23.3947 16.6944 23.7602 17.1452 23.7602H20.5373C20.9881 23.7602 21.3536 23.3947 21.3536 22.9439V10.5921C21.3537 10.2619 21.1548 9.96428 20.8498 9.8379Z" fill="black" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_2396_5375">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg><span></span></Link>
                        </div>
                        <p className="main-devider third"></p>
                        <div className={`side-bar-links forth ${activeTab === `/${role}-portal/quota-credit` ? "active" : ""}`}>
                            <Link to={`/${role}-portal/quota-credit`} onClick={() => setActiveSideBar(false)} className={`link ${activeSideBar ? 'active' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M21.6702 6.94942C21.0302 4.77942 19.2202 2.96942 17.0502 2.32942C15.4002 1.84942 14.2602 1.88942 13.4702 2.47942C12.5202 3.18942 12.4102 4.46942 12.4102 5.37942V7.86942C12.4102 10.3294 13.5302 11.5794 15.7302 11.5794H18.6002C19.5002 11.5794 20.7902 11.4694 21.5002 10.5194C22.1102 9.73941 22.1602 8.59942 21.6702 6.94942Z" fill="black" />
                                <path d="M18.9094 13.3611C18.6494 13.0611 18.2694 12.8911 17.8794 12.8911H14.2994C12.5394 12.8911 11.1094 11.4611 11.1094 9.70113V6.12113C11.1094 5.73113 10.9394 5.35113 10.6394 5.09113C10.3494 4.83113 9.94941 4.71113 9.56941 4.76113C7.21941 5.06113 5.05941 6.35113 3.64941 8.29113C2.22941 10.2411 1.70941 12.6211 2.15941 15.0011C2.80941 18.4411 5.55941 21.1911 9.00941 21.8411C9.55941 21.9511 10.1094 22.0011 10.6594 22.0011C12.4694 22.0011 14.2194 21.4411 15.7094 20.3511C17.6494 18.9411 18.9394 16.7811 19.2394 14.4311C19.2894 14.0411 19.1694 13.6511 18.9094 13.3611Z" fill="black" />
                            </svg> <span></span></Link>
                        </div>
                        {role === "agency" ? <>
                            <p className="main-devider agency-before"></p>
                            <div className={`side-bar-links staff ${activeTab === `/${role}-portal/agency-staff` ? "active" : ""}`}>
                                <Link to={`/${role}-portal/agency-staff`} onClick={() => setActiveSideBar(false)} className={`link ${activeSideBar ? 'active' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z" fill="black" />
                                    <path d="M14.0809 14.1489C11.2909 12.2889 6.74094 12.2889 3.93094 14.1489C2.66094 14.9989 1.96094 16.1489 1.96094 17.3789C1.96094 18.6089 2.66094 19.7489 3.92094 20.5889C5.32094 21.5289 7.16094 21.9989 9.00094 21.9989C10.8409 21.9989 12.6809 21.5289 14.0809 20.5889C15.3409 19.7389 16.0409 18.5989 16.0409 17.3589C16.0309 16.1289 15.3409 14.9889 14.0809 14.1489Z" fill="black" />
                                    <path d="M19.9894 7.33815C20.1494 9.27815 18.7694 10.9781 16.8594 11.2081C16.8494 11.2081 16.8494 11.2081 16.8394 11.2081H16.8094C16.7494 11.2081 16.6894 11.2081 16.6394 11.2281C15.6694 11.2781 14.7794 10.9681 14.1094 10.3981C15.1394 9.47815 15.7294 8.09815 15.6094 6.59815C15.5394 5.78815 15.2594 5.04815 14.8394 4.41815C15.2194 4.22815 15.6594 4.10815 16.1094 4.06815C18.0694 3.89815 19.8194 5.35815 19.9894 7.33815Z" fill="black" />
                                    <path d="M21.9883 16.5904C21.9083 17.5604 21.2883 18.4004 20.2483 18.9704C19.2483 19.5204 17.9883 19.7804 16.7383 19.7504C17.4583 19.1004 17.8783 18.2904 17.9583 17.4304C18.0583 16.1904 17.4683 15.0004 16.2883 14.0504C15.6183 13.5204 14.8383 13.1004 13.9883 12.7904C16.1983 12.1504 18.9783 12.5804 20.6883 13.9604C21.6083 14.7004 22.0783 15.6304 21.9883 16.5904Z" fill="black" />
                                </svg><span></span></Link>
                            </div>
                        </> : ""}


                        <p className="main-devider forth"></p>
                        <div className={`side-bar-links fifth ${activeTab === `/${role}-portal/products` ? "active" : ""}`}>
                            <Link to={`/${role}-portal/products`} onClick={() => setActiveSideBar(false)} className={`link ${activeSideBar ? 'active' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g clipPath="url(#clip0_101_8039)">
                                    <path d="M9.31624 20.6198C9.04915 20.4391 8.72393 20.3325 8.37813 20.3329C8.14788 20.3329 7.92574 20.3798 7.72455 20.4651C7.42296 20.5927 7.16787 20.8047 6.98688 21.0725C6.80585 21.3396 6.70001 21.6649 6.70038 22.0107C6.70001 22.2409 6.74693 22.463 6.83219 22.6638C6.96012 22.9658 7.17176 23.2209 7.43922 23.4015C7.70669 23.5829 8.03233 23.6887 8.37813 23.6887C8.60838 23.6887 8.8301 23.6418 9.03091 23.5565C9.33288 23.429 9.58835 23.2166 9.76901 22.9491C9.94966 22.682 10.0558 22.3564 10.0558 22.0106C10.0558 21.7804 10.0085 21.5586 9.92365 21.3574C9.7961 21.0555 9.58371 20.8004 9.31624 20.6198ZM9.00143 22.2738C8.95024 22.3947 8.8638 22.499 8.75561 22.5719C8.6471 22.6448 8.51993 22.6871 8.37808 22.6874C8.28311 22.6871 8.19508 22.6684 8.11488 22.6339C7.99432 22.5836 7.88965 22.4967 7.81676 22.3889C7.74387 22.28 7.70201 22.1525 7.70126 22.0106C7.70168 21.916 7.72066 21.8284 7.75479 21.7474C7.80518 21.6268 7.89204 21.5225 8.00013 21.4493C8.10869 21.3764 8.23624 21.3345 8.37808 21.3342C8.47268 21.3342 8.56029 21.3532 8.64091 21.3873C8.76185 21.438 8.86572 21.5245 8.93904 21.633C9.01193 21.7415 9.05416 21.8687 9.05416 22.0106C9.05416 22.1056 9.03555 22.1932 9.00143 22.2738Z" fill="black" />
                                    <path d="M7.909 18.4146C7.7276 18.4146 7.55782 18.3781 7.402 18.3126C7.16941 18.2142 6.9686 18.0482 6.8283 17.8397C6.6934 17.6393 6.61352 17.4032 6.60733 17.1443C6.61432 16.8353 6.7128 16.5671 6.88568 16.3527C6.97521 16.2422 7.08569 16.1454 7.2198 16.0651C7.35236 15.986 7.50855 15.9233 7.69197 15.8837L19.1452 14.0195C19.8937 13.8974 20.4888 13.3253 20.64 12.5821L22.0409 5.6949V5.69415C22.0572 5.61427 22.0649 5.5329 22.0649 5.45227C22.0649 5.17393 21.9696 4.90182 21.7905 4.6824C21.5598 4.40021 21.2141 4.23624 20.8489 4.23624H4.9901L4.44972 2.3798V2.38018C4.20161 1.55026 3.5209 0.921476 2.67429 0.740069L0.735348 0.324897C0.407411 0.254351 0.0840672 0.463647 0.0135672 0.792007C-0.0566047 1.12032 0.152317 1.44362 0.481052 1.51379L2.41929 1.92933C2.83211 2.01769 3.1639 2.32393 3.28446 2.72865L6.8275 14.899C6.74768 14.9362 6.67052 14.9765 6.5965 15.0211C6.21429 15.2487 5.90805 15.5681 5.7026 15.941C5.5061 16.2953 5.4018 16.6969 5.3921 17.1113H5.39013V17.1744H5.39168C5.39946 17.4982 5.46846 17.8087 5.58822 18.092C5.78013 18.5452 6.09874 18.9286 6.50032 19.1999C6.90189 19.4716 7.38954 19.6309 7.909 19.6305H14.3435C14.3415 19.5705 14.3346 19.5119 14.3346 19.4514C14.3346 19.0967 14.371 18.7506 14.4365 18.4145H7.909V18.4146ZM16.5686 6.32518C16.91 6.22594 17.2675 6.42132 17.3667 6.7628L18.6715 11.2288C18.7707 11.5704 18.575 11.9274 18.2335 12.0273C17.8923 12.127 17.535 11.9312 17.4354 11.5897L16.1309 7.12369C16.0312 6.78259 16.227 6.42521 16.5686 6.32518ZM13.7531 6.3368C14.0943 6.23677 14.4516 6.43252 14.5512 6.77405L15.9805 11.6684C16.0805 12.0095 15.8843 12.3673 15.5432 12.4669C15.202 12.5665 14.8447 12.3708 14.7446 12.0293L13.3154 7.1349C13.2158 6.79388 13.4116 6.43604 13.7531 6.3368ZM10.9369 6.34688C11.2784 6.24765 11.6358 6.4434 11.735 6.78488L13.2817 12.0804C13.3817 12.422 13.1856 12.7794 12.8445 12.879C12.5034 12.9786 12.1459 12.7829 12.0459 12.4413L10.4992 7.1454C10.3996 6.80429 10.5954 6.44691 10.9369 6.34688ZM8.12107 6.35813C8.4626 6.25848 8.82002 6.45427 8.91963 6.7958L10.5869 12.505C10.6869 12.8465 10.4907 13.2043 10.1496 13.3036C9.80847 13.4035 9.4511 13.2074 9.35107 12.8663L7.68344 7.15637C7.58416 6.81516 7.77954 6.45779 8.12107 6.35813Z" fill="black" />
                                    <path d="M19.7627 15.2137C17.4221 15.2137 15.5254 17.1109 15.5254 19.4514C15.5254 21.7916 17.4221 23.6887 19.7627 23.6887C22.1029 23.6887 24 21.7916 24 19.4514C24 17.1109 22.1029 15.2137 19.7627 15.2137ZM22.5 19.9999H20.5V21.9999H19.5V19.9999H17.5V18.9999H19.5V16.9999H20.5V18.9999H22.5V19.9999Z" fill="black" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_101_8039">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg><span></span></Link>
                        </div>
                        {
                            role === "agency" &&
                            <div className={`side-bar-links tenth ${activeTab === `/${role}-portal/packages` ? "active" : ""}`}>
                                <Link to={`/${role}-portal/packages`} onClick={() => setActiveSideBar(false)} className={`link ${activeSideBar ? 'active' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <g clipPath="url(#clip0_101_8039)">
                                        <path d="M9.31624 20.6198C9.04915 20.4391 8.72393 20.3325 8.37813 20.3329C8.14788 20.3329 7.92574 20.3798 7.72455 20.4651C7.42296 20.5927 7.16787 20.8047 6.98688 21.0725C6.80585 21.3396 6.70001 21.6649 6.70038 22.0107C6.70001 22.2409 6.74693 22.463 6.83219 22.6638C6.96012 22.9658 7.17176 23.2209 7.43922 23.4015C7.70669 23.5829 8.03233 23.6887 8.37813 23.6887C8.60838 23.6887 8.8301 23.6418 9.03091 23.5565C9.33288 23.429 9.58835 23.2166 9.76901 22.9491C9.94966 22.682 10.0558 22.3564 10.0558 22.0106C10.0558 21.7804 10.0085 21.5586 9.92365 21.3574C9.7961 21.0555 9.58371 20.8004 9.31624 20.6198ZM9.00143 22.2738C8.95024 22.3947 8.8638 22.499 8.75561 22.5719C8.6471 22.6448 8.51993 22.6871 8.37808 22.6874C8.28311 22.6871 8.19508 22.6684 8.11488 22.6339C7.99432 22.5836 7.88965 22.4967 7.81676 22.3889C7.74387 22.28 7.70201 22.1525 7.70126 22.0106C7.70168 21.916 7.72066 21.8284 7.75479 21.7474C7.80518 21.6268 7.89204 21.5225 8.00013 21.4493C8.10869 21.3764 8.23624 21.3345 8.37808 21.3342C8.47268 21.3342 8.56029 21.3532 8.64091 21.3873C8.76185 21.438 8.86572 21.5245 8.93904 21.633C9.01193 21.7415 9.05416 21.8687 9.05416 22.0106C9.05416 22.1056 9.03555 22.1932 9.00143 22.2738Z" fill="black" />
                                        <path d="M7.909 18.4146C7.7276 18.4146 7.55782 18.3781 7.402 18.3126C7.16941 18.2142 6.9686 18.0482 6.8283 17.8397C6.6934 17.6393 6.61352 17.4032 6.60733 17.1443C6.61432 16.8353 6.7128 16.5671 6.88568 16.3527C6.97521 16.2422 7.08569 16.1454 7.2198 16.0651C7.35236 15.986 7.50855 15.9233 7.69197 15.8837L19.1452 14.0195C19.8937 13.8974 20.4888 13.3253 20.64 12.5821L22.0409 5.6949V5.69415C22.0572 5.61427 22.0649 5.5329 22.0649 5.45227C22.0649 5.17393 21.9696 4.90182 21.7905 4.6824C21.5598 4.40021 21.2141 4.23624 20.8489 4.23624H4.9901L4.44972 2.3798V2.38018C4.20161 1.55026 3.5209 0.921476 2.67429 0.740069L0.735348 0.324897C0.407411 0.254351 0.0840672 0.463647 0.0135672 0.792007C-0.0566047 1.12032 0.152317 1.44362 0.481052 1.51379L2.41929 1.92933C2.83211 2.01769 3.1639 2.32393 3.28446 2.72865L6.8275 14.899C6.74768 14.9362 6.67052 14.9765 6.5965 15.0211C6.21429 15.2487 5.90805 15.5681 5.7026 15.941C5.5061 16.2953 5.4018 16.6969 5.3921 17.1113H5.39013V17.1744H5.39168C5.39946 17.4982 5.46846 17.8087 5.58822 18.092C5.78013 18.5452 6.09874 18.9286 6.50032 19.1999C6.90189 19.4716 7.38954 19.6309 7.909 19.6305H14.3435C14.3415 19.5705 14.3346 19.5119 14.3346 19.4514C14.3346 19.0967 14.371 18.7506 14.4365 18.4145H7.909V18.4146ZM16.5686 6.32518C16.91 6.22594 17.2675 6.42132 17.3667 6.7628L18.6715 11.2288C18.7707 11.5704 18.575 11.9274 18.2335 12.0273C17.8923 12.127 17.535 11.9312 17.4354 11.5897L16.1309 7.12369C16.0312 6.78259 16.227 6.42521 16.5686 6.32518ZM13.7531 6.3368C14.0943 6.23677 14.4516 6.43252 14.5512 6.77405L15.9805 11.6684C16.0805 12.0095 15.8843 12.3673 15.5432 12.4669C15.202 12.5665 14.8447 12.3708 14.7446 12.0293L13.3154 7.1349C13.2158 6.79388 13.4116 6.43604 13.7531 6.3368ZM10.9369 6.34688C11.2784 6.24765 11.6358 6.4434 11.735 6.78488L13.2817 12.0804C13.3817 12.422 13.1856 12.7794 12.8445 12.879C12.5034 12.9786 12.1459 12.7829 12.0459 12.4413L10.4992 7.1454C10.3996 6.80429 10.5954 6.44691 10.9369 6.34688ZM8.12107 6.35813C8.4626 6.25848 8.82002 6.45427 8.91963 6.7958L10.5869 12.505C10.6869 12.8465 10.4907 13.2043 10.1496 13.3036C9.80847 13.4035 9.4511 13.2074 9.35107 12.8663L7.68344 7.15637C7.58416 6.81516 7.77954 6.45779 8.12107 6.35813Z" fill="black" />
                                        <path d="M19.7627 15.2137C17.4221 15.2137 15.5254 17.1109 15.5254 19.4514C15.5254 21.7916 17.4221 23.6887 19.7627 23.6887C22.1029 23.6887 24 21.7916 24 19.4514C24 17.1109 22.1029 15.2137 19.7627 15.2137ZM22.5 19.9999H20.5V21.9999H19.5V19.9999H17.5V18.9999H19.5V16.9999H20.5V18.9999H22.5V19.9999Z" fill="black" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_101_8039">
                                            <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg><span></span></Link>
                            </div>
                        }
                        <div className={`side-bar-links sixth ${activeTab === `/${role}-portal/order-history` ? "active" : ""}`}>
                            <Link to={`/${role}-portal/order-history`} onClick={() => setActiveSideBar(false)} className={`link ${activeSideBar ? 'active' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M23 12.4801C23.0107 18.2653 18.2928 22.9959 12.5076 22.9999C10.009 23.0017 7.7139 22.1307 5.91032 20.6751C5.44133 20.2966 5.40627 19.5937 5.83245 19.1675L6.30948 18.6905C6.67398 18.326 7.25588 18.2861 7.65971 18.6065C8.98851 19.6609 10.6702 20.2903 12.5 20.2903C16.806 20.2903 20.2903 16.8054 20.2903 12.5C20.2903 8.19394 16.8054 4.70967 12.5 4.70967C10.4333 4.70967 8.55619 5.5128 7.16244 6.82373L9.3113 8.97259C9.73807 9.39936 9.43581 10.129 8.83232 10.129H2.67742C2.30327 10.129 2 9.82575 2 9.45161V3.29671C2 2.69321 2.72966 2.39096 3.15644 2.81769L5.24678 4.90803C7.13183 3.10656 9.68667 2 12.5 2C18.2923 2 22.9893 6.69028 23 12.4801ZM15.3404 15.8157L15.7563 15.281C16.1009 14.838 16.021 14.1996 15.5781 13.8551L13.8548 12.5148V8.09677C13.8548 7.53557 13.3999 7.08064 12.8387 7.08064H12.1613C11.6001 7.08064 11.1452 7.53557 11.1452 8.09677V13.8401L13.9145 15.994C14.3575 16.3385 14.9959 16.2587 15.3404 15.8157Z" fill="black" />
                            </svg><span></span></Link>
                        </div>
                        <p className="main-devider fifth"></p>
                        <div className={`side-bar-links seventh ${activeTab === `/${role}-portal/setting` ? "active" : ""}`}>
                            <Link to={`/${role}-portal/setting`} onClick={() => setActiveSideBar(false)} className={`link ${activeSideBar ? 'active' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M13.9838 2.54161C14.0711 2.71093 14.0928 2.92777 14.1361 3.36144C14.2182 4.1823 14.2593 4.59274 14.4311 4.81793C14.649 5.10358 15.0034 5.25038 15.3595 5.20248C15.6402 5.16472 15.9594 4.90352 16.5979 4.38113C16.9352 4.10515 17.1038 3.96716 17.2853 3.90918C17.5158 3.83555 17.7652 3.84798 17.9872 3.94419C18.162 4.01994 18.3161 4.17402 18.6243 4.4822L19.5178 5.37567C19.8259 5.68385 19.98 5.83794 20.0558 6.01275C20.152 6.23478 20.1644 6.48415 20.0908 6.71464C20.0328 6.89612 19.8948 7.06478 19.6188 7.4021C19.0964 8.0406 18.8352 8.35984 18.7975 8.64056C18.7496 8.99662 18.8964 9.35102 19.182 9.56893C19.4072 9.74072 19.8176 9.78176 20.6385 9.86385C21.0722 9.90722 21.2891 9.92891 21.4584 10.0162C21.6734 10.1272 21.841 10.3123 21.9299 10.5373C22 10.7145 22 10.9324 22 11.3682V12.6319C22 13.0676 22 13.2855 21.93 13.4626C21.841 13.6877 21.6734 13.8729 21.4583 13.9838C21.289 14.0711 21.0722 14.0928 20.6386 14.1361C19.818 14.2182 19.4077 14.2592 19.1825 14.4309C18.8967 14.6489 18.7499 15.0034 18.7979 15.3596C18.8357 15.6402 19.0968 15.9593 19.619 16.5976C19.8949 16.9348 20.0328 17.1034 20.0908 17.2848C20.1645 17.5154 20.152 17.7648 20.0558 17.9869C19.98 18.1617 19.826 18.3157 19.5179 18.6238L18.6243 19.5174C18.3162 19.8255 18.1621 19.9796 17.9873 20.0554C17.7652 20.1516 17.5159 20.164 17.2854 20.0904C17.1039 20.0324 16.9352 19.8944 16.5979 19.6184C15.9594 19.096 15.6402 18.8348 15.3595 18.7971C15.0034 18.7492 14.649 18.896 14.4311 19.1816C14.2593 19.4068 14.2183 19.8173 14.1362 20.6383C14.0928 21.0722 14.0711 21.2891 13.9837 21.4585C13.8728 21.6735 13.6877 21.8409 13.4628 21.9299C13.2856 22 13.0676 22 12.6316 22H11.3682C10.9324 22 10.7145 22 10.5373 21.9299C10.3123 21.841 10.1272 21.6734 10.0162 21.4584C9.92891 21.2891 9.90722 21.0722 9.86385 20.6385C9.78176 19.8176 9.74072 19.4072 9.56892 19.182C9.35101 18.8964 8.99663 18.7496 8.64057 18.7975C8.35985 18.8352 8.04059 19.0964 7.40208 19.6189C7.06475 19.8949 6.89607 20.0329 6.71458 20.0908C6.4841 20.1645 6.23474 20.152 6.01272 20.0558C5.8379 19.9801 5.6838 19.826 5.37561 19.5178L4.48217 18.6243C4.17398 18.3162 4.01988 18.1621 3.94414 17.9873C3.84794 17.7652 3.8355 17.5159 3.90913 17.2854C3.96711 17.1039 4.10511 16.9352 4.3811 16.5979C4.90351 15.9594 5.16471 15.6402 5.20247 15.3594C5.25037 15.0034 5.10357 14.649 4.81792 14.4311C4.59273 14.2593 4.1823 14.2182 3.36143 14.1361C2.92776 14.0928 2.71093 14.0711 2.54161 13.9838C2.32656 13.8728 2.15902 13.6877 2.07005 13.4627C2 13.2855 2 13.0676 2 12.6318V11.3683C2 10.9324 2 10.7144 2.07008 10.5372C2.15905 10.3123 2.32654 10.1272 2.54152 10.0163C2.71088 9.92891 2.92777 9.90722 3.36155 9.86384C4.18263 9.78173 4.59319 9.74068 4.81842 9.56881C5.10395 9.35092 5.2507 8.99664 5.20287 8.64066C5.16514 8.35987 4.90385 8.04052 4.38128 7.40182C4.10516 7.06435 3.96711 6.89561 3.90914 6.71405C3.83557 6.48364 3.848 6.23438 3.94413 6.01243C4.01988 5.83754 4.17403 5.68339 4.48233 5.37509L5.37565 4.48177C5.68384 4.17357 5.83795 4.01947 6.01277 3.94373C6.23478 3.84753 6.48414 3.8351 6.71463 3.90872C6.89612 3.9667 7.06481 4.10472 7.4022 4.38076C8.04061 4.9031 8.35982 5.16427 8.64044 5.20207C8.99661 5.25003 9.35113 5.10319 9.56907 4.81742C9.74077 4.59227 9.78181 4.18195 9.86387 3.36131C9.90722 2.92776 9.9289 2.71098 10.0162 2.5417C10.1271 2.32658 10.3123 2.15898 10.5374 2.07001C10.7145 2 10.9324 2 11.3681 2H12.6318C13.0676 2 13.2855 2 13.4627 2.07005C13.6877 2.15902 13.8728 2.32656 13.9838 2.54161ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="black" />
                            </svg><span></span></Link>
                        </div>
                        {role === "agency" ? <div className={`side-bar-links eight ${activeTab === `/${role}-portal/agency-setting` ? "active" : ""}`}>
                            <Link to={`/${role}-portal/agency-setting`} onClick={() => setActiveSideBar(false)} className={`link ${activeSideBar ? 'active' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M8.74035 1.24219C6.19035 1.24219 4.11035 3.32219 4.11035 5.87219C4.11035 8.42219 6.19035 10.5022 8.74035 10.5022C11.2904 10.5022 13.3704 8.42219 13.3704 5.87219C13.3704 3.32219 11.3004 1.24219 8.74035 1.24219Z" fill="black" />
                                <path d="M17.4707 16.4766C16.9207 16.4766 16.4707 16.9266 16.4707 17.4766C16.4707 17.7666 16.6007 18.0466 16.8307 18.2466C17.1807 18.5366 17.7507 18.5466 18.1207 18.2466C18.3407 18.0566 18.4707 17.7766 18.4707 17.4866C18.4707 16.9366 18.0207 16.4866 17.4707 16.4866V16.4766Z" fill="black" />
                                <path d="M21.8704 15.7475C21.8004 15.7275 21.8004 15.6275 21.8004 15.5775C22.0604 15.1175 21.9804 14.5475 21.6004 14.1375L20.8204 13.3675C20.4604 12.9675 19.9004 12.8375 19.3104 13.1475C19.2904 13.1475 19.2104 13.1475 19.1804 13.0475C19.0204 12.5275 18.5604 12.1875 18.0304 12.1875H16.8904C16.3604 12.1875 15.9004 12.5375 15.7404 13.0475C15.7104 13.1375 15.6304 13.1475 15.5904 13.1475C15.5704 13.1375 15.5004 13.0975 15.4804 13.0875C15.4504 13.0675 15.4204 13.0575 15.3904 13.0475C14.9504 12.8975 14.4604 12.9975 14.1404 13.3275L13.3304 14.1275C13.1004 14.3575 12.9804 14.6575 12.9804 14.9775C12.9804 15.1775 13.0404 15.3875 13.1404 15.6075C13.1404 15.6075 13.1404 15.7175 13.0504 15.7375C12.5304 15.8975 12.1904 16.3575 12.1904 16.8975V18.0275C12.1904 18.5675 12.5404 19.0275 13.1304 19.2475V19.3575C12.8704 19.8275 12.9404 20.3975 13.3204 20.7775L14.1304 21.5875C14.5404 21.9975 15.2204 21.9575 15.6104 21.7775C15.7104 21.7775 15.7304 21.8475 15.7404 21.8875C15.9004 22.3875 16.3604 22.7275 16.8904 22.7275H18.0304C18.5604 22.7275 19.0204 22.3875 19.1804 21.8775C19.1804 21.8575 19.2104 21.7775 19.3704 21.7975C19.8504 22.0475 20.4204 21.9675 20.7904 21.5975L21.6004 20.7875C21.8304 20.5575 21.9504 20.2675 21.9504 19.9375C21.9504 19.7075 21.8804 19.4875 21.8004 19.3775C21.7704 19.3275 21.7904 19.2775 21.8004 19.2575L21.8804 19.1875C22.4004 19.0375 22.7404 18.5675 22.7404 18.0275V16.8975C22.7404 16.3575 22.3904 15.8975 21.8604 15.7375L21.8704 15.7475ZM19.0904 19.3775C18.6304 19.7675 18.0504 19.9675 17.4704 19.9675C16.8904 19.9675 16.3204 19.7575 15.8604 19.3875C15.2904 18.8975 14.9704 18.1975 14.9704 17.4675C14.9704 16.0875 16.0904 14.9675 17.4704 14.9675C18.8504 14.9675 19.9704 16.0875 19.9704 17.4675C19.9704 18.1975 19.6504 18.8875 19.0904 19.3775Z" fill="black" />
                                <path d="M11.1898 18.0419V16.9119C11.1898 16.2319 11.4898 15.6219 11.9898 15.2119C11.9898 15.1419 11.9798 15.0719 11.9798 14.9919C11.9798 14.4019 12.2098 13.8519 12.6198 13.4319L13.4398 12.6219C13.8198 12.2319 14.3198 12.0319 14.8498 11.9919C14.1798 11.2419 13.3498 10.6119 12.3798 10.1719C11.3998 11.0019 10.1298 11.5019 8.74977 11.5019C7.36977 11.5019 6.12977 11.0119 5.14977 10.1919C2.82977 11.2619 1.25977 13.3319 1.25977 15.6919C1.25977 16.1019 1.40977 16.7119 2.10977 17.2719C3.36977 18.2619 6.12977 18.7319 8.82977 18.7319C9.66977 18.7319 10.4898 18.6819 11.2798 18.5919C11.2298 18.4119 11.1998 18.2219 11.1998 18.0219L11.1898 18.0419Z" fill="black" />
                            </svg><span></span></Link>
                        </div> : ""}
                    </div>
                    {/* <div className="side-button d-lg-flex d-none" onClick={() => setActiveSideBar(!activeSideBar)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                            <path d="M1 1L5 5L1 9" stroke="#447158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div> */}

                </div>
                <div className='main-page'>

                    <div className='pages'>
                        <Routes key={location.pathname}>
                            {role !== "agency" ? <Route path='/dashboard' element={<Dashboard />} /> : ""}
                            {role === "agency" ? <Route path='/dashboard' element={<AgencyDashBoard />} /> : ""}
                            <Route path='/add-property' element={<AddProperty />} />
                            <Route path='/property-listing' element={<PropertyListing />} />
                            <Route path='/quota-credit' element={<QuotaCredit />} />
                            <Route path='/products' element={<PropShop />} />
                            {
                                role === "agency" &&
                                <Route path='/packages' element={<NewPackageShop />} />
                            }
                            <Route path='/checkout' element={<CheckOut />} />
                            <Route path='/order-history' element={<OrderHistory />} />
                            <Route path='/setting' element={<AgentSetting role={role} />} />
                            <Route path='/agency-setting' element={<AgencySettings />} />
                            <Route path='/property-leads' element={<PropertyLeads />} />
                            <Route path='/agency-staff' element={<StaffList />} />
                            <Route path='/chat/:id/:slug' element={<Chat />} />
                            <Route path='/chat' element={<Chat />} />
                        </Routes>
                    </div>
                </div>
            </div>
            <TawkTo />
        </>
    )
}

export default MainPortal