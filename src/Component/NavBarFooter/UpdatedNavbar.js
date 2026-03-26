import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Button from '../Metiral/Button'
import LoginModal from './LoginModal';
import { useAuth } from '../../Context/ContextProvider';
import { Avatar } from '@mui/material';
import dummyProfile from '../../Asset/HomePage/Profile.svg'
import More_FullMenu from './More_FullMenu';
import Global_Menu from './Global_Menu';
import { IoMdClose } from 'react-icons/io';
import { TfiUser } from "react-icons/tfi";
import { Helmet } from 'react-helmet';
import add from '../../Asset/HomePage/slider/add.png'
import PrimaryBorderButton from '../Metiral/Button/PrimaryBorderButton';
import login1 from '../../Asset/HomePage/new-loginImg.svg'
import login2 from '../../Asset/HomePage/filled-new-loginImg.svg'
import SignpuModal from './SignpuModal';
import globalIcon from '../../Asset/HomePage/planet-earth-global-svgrepo-com 2.svg'
import wishlistIcon from '../../Asset/HomePage/ant-design_heart-filled.svg'
import PrimaryButton from '../Metiral/Button/PrimaryButton';

import Image from 'next/image';
function NavBar({ propertyData, prevButton, blogSliderButton , setBlogSlider }) {
    const [scrolled, setScrolled] = useState(false);
    const { loginData, logout, propertyType, projectTypeData, setCloseDashboard, setOpenLoanModal, favouriteList, savedSearches, openSignUp, setOpenSignUp, ceoLogin } = useAuth()
    const [moreMenu, setMoreMenu] = useState(false)
    const [projectsMenu, setProjectsMenu] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [globalMenu, setGlobalMenu] = useState(false)
    const [navActive, setNavActive] = useState("Buy")
    const [show, setShow] = useState(false)
    const [newProperties, setNewProperties] = useState([])
    const { serchProperty } = useAuth();
    const [userAvatar, setUserAvatar] = useState(null)
    const { pathname: location } = useLocation()
    const navigate = useNavigate()

    // Handler for back navigation that prevents scroll issues
    const handleBackNavigation = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        navigate(-1);
    }

    useEffect(() => {
        if (loginData && loginData?.data?.role === "agent") {
            setUserAvatar(loginData?.data?.user?.avatar || null)
        } else if (ceoLogin && loginData?.data?.role === "agency") {
            setUserAvatar(ceoLogin?.ceo_image || null)
        } else {
            setUserAvatar(null)
        }
    }, [loginData, ceoLogin])
    useEffect(() => {

        const featchFeatuerAgnecy = async () => {
            try {
                let result = await serchProperty()
                if (result?.success) {
                    setNewProperties(result?.data?.data?.properties)
                }
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }

        }
        if (openMenu && !newProperties?.length) {

            featchFeatuerAgnecy()
        }
    }, [openMenu])

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    // Check if nav-header has scrolled out of view (it has height of ~44px)
                    // When scrolled past nav-header height, apply scrolled styles to navbar-second-row
                    const navHeaderHeight = 40; // Height of nav-header
                    const shouldShowScrolled = scrollY > navHeaderHeight;

                    // Update scrolled state when navbar-second-row reaches top
                    setScrolled(prev => {
                        if (shouldShowScrolled !== prev) return shouldShowScrolled;
                        return prev;
                    });

                    if (shouldShowScrolled && location === '/property-listing') {
                        setGlobalMenu(false);
                        setOpenMenu(false);
                        setMenu(false);
                    }

                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check on mount
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location]);
    useEffect(() => {
        const handleResize = () => {
            setShow(window.innerWidth <= 609);
        };

        window.addEventListener("resize", handleResize);

        // Run once initially
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [menu, setMenu] = useState(false)
    const wrapperRef = useRef();
    const [topNavMenu, setTopNavMenu] = useState(false)
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
    //             setMenu(false);
    //         }
    //         if (topNavMenuRef.current && !topNavMenuRef.current.contains(event.target)) {
    //             setTopNavMenu(false);
    //         }
    //         if (global_Menu.current && !global_Menu.current.contains(event.target)) {
    //             setMoreMenu(false);
    //         }
    //     };
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => document.removeEventListener('mousedown', handleClickOutside);
    // }, []);

    const menuRef = useRef(null)
    const projectsMenuRef = useRef(null)
    const buttonRef = useRef(null)
    const global_Menu = useRef(null)
    const global_Button = useRef(null)
    const sideNavbar = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {

            // 👉 FIX: If clicking a link, allow React Router to navigate
            if (event.target.closest("a")) return;
            if (
                event.target.closest(".profile_menu")
            ) {
                return;
            }

            // Check if click is inside search-menu or search-button
            if (event.target.closest(".search-menu") || event.target.closest(".search-button")) {
                return;
            }

            const refs = [
                menuRef.current,
                projectsMenuRef.current,
                buttonRef.current,
                global_Menu.current,
                global_Button.current,
                wrapperRef.current
            ];

            const clickedInside = refs.some(ref => ref && ref.contains(event.target));

            if (!clickedInside) {
                setOpenMenu(false);
                setGlobalMenu(false);
                setMoreMenu(false);
                setProjectsMenu(false);
                setMenu(false);
                setSideBar(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [activeSide, setSideBar] = useState(false)

    const handleOpen = () => {
        setOpenLoanModal(true);
        setCloseDashboard(false)
    }

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        const preventScroll = (e) => {
            // Allow scrolling within the sidebar
            if (sideNavbar.current && sideNavbar.current.contains(e.target)) {
                return;
            }
            e.preventDefault();
        };

        if (activeSide) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
            document.body.style.overscrollBehavior = 'none';
            // Prevent touch scrolling on iOS (but allow sidebar scrolling)
            document.addEventListener('touchmove', preventScroll, { passive: false });
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            document.body.style.overscrollBehavior = '';
            document.removeEventListener('touchmove', preventScroll);
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            document.body.style.overscrollBehavior = '';
            document.removeEventListener('touchmove', preventScroll);
        };
    }, [activeSide]);
    const handleAddProperty = () => {
        if (loginData) {
            navigate('/agent-portal/add-property')
        }
        else {
            handleOpen()
        }
    }
    const handleOpenSignup = () => {
        setOpenSignUp(true);
    }
    const handleOpenlogin = () => {
        setOpenLoanModal(true);
    }

    const canonicalUrl = window?.location?.href
    return (
        <>
            <Helmet>
                <link rel="canonical" href={canonicalUrl} />

            </Helmet>
            <div className={`new-navbar ${scrolled ? 'scrolled' : ''}`} style={{ zIndex: scrolled ? "" : "9999999" }}>
                <div className="nav-header">
                    <div className="main-container">
                        <div className="tab-box">
                            <Link to="/property-trend" className="tab">Property Trends</Link>
                            <Link to="/property-index" className="tab">Property Index</Link>
                            <Link to="/blogs" className="tab">Blogs</Link>
                            <Link to="/news" className="tab">News</Link>
                            <Link to="/our-story" className="tab">Story</Link>
                            <div className="tab dropdown-tab d-md-flex d-none" ref={menuRef} onClick={(e) => { setMoreMenu(!moreMenu); }}>
                                <div className="div d-flex align-items-center" style={{ gap: "9px" }}>
                                    <span>More</span>
                                    <svg style={{ transform: moreMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} xmlns="http://www.w3.org/2000/svg" width="14" height="7" viewBox="0 0 14 7" fill="none">
                                        <path d="M13.7092 0.288658C13.6163 0.197192 13.5057 0.124593 13.3839 0.0750502C13.262 0.025507 13.1313 0 12.9993 0C12.8673 0 12.7366 0.025507 12.6148 0.0750502C12.4929 0.124593 12.3824 0.197192 12.2894 0.288658L7.70992 4.7581C7.61697 4.84956 7.50638 4.92216 7.38453 4.9717C7.26269 5.02125 7.132 5.04676 7 5.04676C6.868 5.04676 6.73731 5.02125 6.61547 4.9717C6.49362 4.92216 6.38303 4.84956 6.29008 4.7581L1.7106 0.288658C1.61765 0.197192 1.50706 0.124593 1.38521 0.0750502C1.26337 0.025507 1.13268 0 1.00068 0C0.868682 0 0.737991 0.025507 0.616146 0.0750502C0.4943 0.124593 0.383712 0.197192 0.29076 0.288658C0.10453 0.471497 0 0.718831 0 0.976639C0 1.23445 0.10453 1.48178 0.29076 1.66462L4.88024 6.14382C5.44268 6.69206 6.20509 7 7 7C7.79491 7 8.55732 6.69206 9.11976 6.14382L13.7092 1.66462C13.8955 1.48178 14 1.23445 14 0.976639C14 0.718831 13.8955 0.471497 13.7092 0.288658Z" fill="white" />
                                    </svg>
                                </div>
                                {moreMenu && <div className="new-menu-box" style={{ zIndex: "9999999" }} onClick={(e) => e.stopPropagation()}>
                                    <Link to="/construction-cost-calculator" className="menu" >Cost Calculator</Link>
                                    <Link to="/loan-calculator" className="menu" >Loan Calculator</Link>
                                    <Link to="/area-unit-converter" className="menu" >Area unit Converter</Link>
                                </div>
                                }
                            </div>
                        </div>
                        <div className="tab-box function-box">
                            <div className='search-button d-sm-flex d-flex' ref={global_Button}>
                                <div className="search-icon" onClick={() => { setGlobalMenu(!globalMenu); setOpenMenu(false); setTopNavMenu(false) }}>
                                    <Image src={globalIcon} alt="search" />
                                </div>
                                {
                                    show ?
                                        "" :
                                        <Global_Menu setGlobalMenu={setGlobalMenu} globalMenu={globalMenu} global_Menu={global_Menu} />
                                }
                            </div>
                            <div className="tab d-sm-flex d-none" style={{ margin: "0 8px 0 6px", position: "relative" }}>
                                <Link to={'/property-wishlist'}>
                                    <Image style={{ width: "24px", height: "24px" }} src={wishlistIcon} alt="wishlist" />
                                    {(favouriteList && favouriteList.length > 0) && (
                                        <span className="wishlist-badge">
                                            {favouriteList.length > 99 ? "99+" : favouriteList.length}
                                        </span>
                                    )}
                                </Link>
                            </div>

                            <div ref={wrapperRef} onClick={(e) => { e.stopPropagation(); setMenu(!menu); setGlobalMenu(false); setTopNavMenu(false); setMoreMenu(false); }} className=' profile_menu d-sm-flex d-none'>
                                {loginData ?
                                    <Image style={{ marginLeft: "6px" }} src={login2} alt="" /> :
                                    <Image style={{ marginLeft: "6px" }} src={login1}  alt="" />}
                                {menu && <div className='dropdown_menu' style={{ width: "246px", paddingTop: loginData ? "" : "8px" }} onClick={(e) => e.stopPropagation()}>
                                    {
                                        loginData &&
                                        <div className="global-profile-box">
                                            <Avatar alt="Cindy Baker" style={{ width: "40px", height: "40px" }} src={userAvatar || dummyProfile} />
                                            <div className="profile-box-info">
                                                <p className="name">{loginData?.data?.user?.name}</p>
                                                <p className="email">{loginData?.data?.user?.email}</p>
                                            </div>
                                        </div>
                                    }
                                    <ul className='w-100 mb-0'>
                                        {
                                            loginData ?
                                                <>
                                                    <li ><Link to={`/${loginData?.data?.role}-portal/dashboard`} className='link m-0' style={{ textTransform: "capitalize" }} onClick={(e) => { e.stopPropagation(); setMenu(false); }}>Go to Portal</Link></li>
                                                    <li ><Link to={`/saved-search`} className='link m-0 d-flex align-items-center' style={{ textTransform: "capitalize", gap: "8px" }} onClick={(e) => { e.stopPropagation(); setMenu(false); }}>
                                                        <span>Saved Search</span>
                                                        {(savedSearches && savedSearches.length > 0) && (
                                                            <span className="wishlist-badge" style={{ position: "relative", top: "0", right: "0" }}>
                                                                {savedSearches.length > 99 ? "99+" : savedSearches.length}
                                                            </span>
                                                        )}
                                                    </Link></li>
                                                    <li><p onClick={async (e) => {
                                                        let result = await logout()
                                                        if (result) {
                                                            navigate('/')
                                                        }
                                                        setMenu(false)
                                                    }} className='link m-0' >Logout</p></li>
                                                </>
                                                :
                                                <>
                                                    <li onClick={() => { setOpenLoanModal(true); setMenu(false) }} className="link m-0">Login</li>
                                                    <li onClick={() => { setOpenSignUp(true); setMenu(false) }} className="link m-0">Sign Up</li>
                                                </>
                                        }

                                    </ul>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="navbar-second-row">
                    <div className='main-container updated-main-container'>
                        <div className="row w-100 m-0 align-items-center" style={{ padding: "0", height: '68px' }}>
                            <div className='col-lg-2 col-md-6 col-sm-6 col-12 d-flex justify-content-center justify-content-sm-start ps-0' style={{ height: "fit-content" }}>
                                <Link to={'/'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="149" height="38" viewBox="0 0 149 38" fill="none">
                                        <path d="M42.5996 29.1875H45.8996C46.8996 29.1875 48.0996 29.7875 48.0996 31.3875C48.0996 33.2875 46.8996 33.7875 45.9996 33.7875H43.1996V36.1875H42.5996V29.1875ZM43.1996 29.6875V33.1875H45.8996C46.5996 33.1875 47.4996 32.8875 47.4996 31.3875C47.4996 29.9875 46.6996 29.6875 45.8996 29.6875H43.1996Z" fill="black" />
                                        <path d="M56 33.4881C56.5 33.8881 56.8 34.6881 57.1 35.4881L57.4 36.1881H56.8L56.4 35.0881C56 33.9881 55.5 33.5881 54.7 33.5881H52.6V36.2881H52V29.2881H55.3C56.4 29.2881 57.5 29.7881 57.5 31.3881C57.5 31.7881 57.4 33.1881 56 33.4881ZM55.2 32.9881C56 32.9881 56.8 32.9881 56.8 31.2881C56.8 29.8881 56 29.6881 55.2 29.6881H52.6V32.9881H55.2Z" fill="black" />
                                        <path d="M61.1992 32.4879C61.1992 29.9879 63.0992 29.0879 64.6992 29.0879C66.2992 29.0879 68.0992 29.9879 68.0992 32.4879C68.0992 35.5879 65.9992 36.1879 64.6992 36.1879C63.2992 36.2879 61.1992 35.5879 61.1992 32.4879ZM67.4992 32.5879C67.4992 30.3879 66.0992 29.6879 64.6992 29.6879C63.2992 29.6879 61.7992 30.3879 61.7992 32.5879C61.7992 35.1879 63.4992 35.6879 64.6992 35.6879C65.7992 35.6879 67.4992 35.1879 67.4992 32.5879Z" fill="black" />
                                        <path d="M72.1992 29.1875H75.4992C76.4992 29.1875 77.6992 29.7875 77.6992 31.3875C77.6992 33.2875 76.4992 33.7875 75.5992 33.7875H72.7992V36.1875H72.1992V29.1875ZM72.7992 29.6875V33.1875H75.4992C76.1992 33.1875 77.0992 32.8875 77.0992 31.3875C77.0992 29.9875 76.2992 29.6875 75.4992 29.6875H72.7992Z" fill="black" />
                                        <path d="M82.1996 29.6875V32.2875H85.5996V32.8875H82.1996V35.5875H86.3996V36.1875H81.5996V29.1875H86.3996V29.7875H82.1996V29.6875Z" fill="black" />
                                        <path d="M94.5996 33.4881C95.0996 33.8881 95.3996 34.6881 95.6996 35.4881L95.9996 36.1881H95.3996L94.9996 35.0881C94.5996 33.9881 94.0996 33.5881 93.2996 33.5881H91.1996V36.2881H90.5996V29.2881H93.8996C94.9996 29.2881 96.0996 29.7881 96.0996 31.3881C96.0996 31.7881 95.9996 33.1881 94.5996 33.4881ZM93.8996 32.9881C94.6996 32.9881 95.4996 32.9881 95.4996 31.2881C95.4996 29.8881 94.6996 29.6881 93.8996 29.6881H91.2996V32.9881H93.8996Z" fill="black" />
                                        <path d="M99.5996 29.1875H105V29.7875H102.6V36.2875H102V29.7875H99.5996V29.1875Z" fill="black" />
                                        <path d="M113.9 29.1875H114.6L111.9 33.7875V36.1875H111.3V33.7875L108.6 29.1875H109.3L111.7 33.1875L113.9 29.1875Z" fill="black" />
                                        <path d="M116.9 35.5879H117.5V36.1879H116.9V35.5879Z" fill="black" />
                                        <path d="M122.2 32.5879C122.2 35.1879 123.9 35.6879 125.2 35.6879C125.8 35.6879 126.4 35.5879 127 35.2879L127.3 35.6879C126.7 36.0879 125.9 36.1879 125.3 36.1879C124 36.1879 121.6 35.5879 121.6 32.4879C121.6 29.8879 123.4 29.0879 125.3 29.0879C126 29.0879 126.7 29.2879 127.3 29.5879L127 29.9879C126.4 29.6879 125.8 29.5879 125.3 29.5879C123.8 29.6879 122.2 30.1879 122.2 32.5879Z" fill="black" />
                                        <path d="M130.9 32.4879C130.9 29.9879 132.8 29.0879 134.4 29.0879C136 29.0879 137.8 29.9879 137.8 32.4879C137.8 35.5879 135.7 36.1879 134.4 36.1879C133 36.2879 130.9 35.5879 130.9 32.4879ZM137.2 32.5879C137.2 30.3879 135.8 29.6879 134.4 29.6879C133 29.6879 131.5 30.3879 131.5 32.5879C131.5 35.1879 133.2 35.6879 134.4 35.6879C135.5 35.6879 137.2 35.1879 137.2 32.5879Z" fill="black" />
                                        <path d="M145.1 34.4875L142.5 30.5875V36.1875H141.9V29.1875H142.3L145.3 33.8875L148.3 29.1875H148.7V36.1875H148.1V30.5875L145.6 34.4875H145.1Z" fill="black" />
                                        <path d="M49.4004 10.8877C50.2004 10.8877 50.9004 10.9877 51.6004 11.2877C52.3004 11.5877 52.9004 11.9877 53.4004 12.4877C53.9004 12.9877 54.3004 13.5877 54.6004 14.2877C54.9004 14.9877 55.0004 15.6877 55.0004 16.4877C55.0004 17.2877 54.9004 17.9877 54.6004 18.5877C54.3004 19.2877 54.0004 19.7877 53.5004 20.2877C53.0004 20.7877 52.4004 21.1877 51.6004 21.4877C50.8004 21.7877 50.0004 21.8877 48.9004 21.8877H45.4004V26.5877H42.4004V10.8877H49.4004ZM49.4004 19.1877C49.8004 19.1877 50.2004 19.0877 50.6004 18.9877C50.9004 18.7877 51.2004 18.5877 51.4004 18.3877C51.6004 18.0877 51.8004 17.8877 51.9004 17.4877C52.0004 17.1877 52.1004 16.7877 52.1004 16.4877C52.1004 16.0877 52.0004 15.7877 51.9004 15.3877C51.8004 14.9877 51.6004 14.6877 51.3004 14.4877C51.1004 14.1877 50.8004 13.9877 50.4004 13.7877C50.0004 13.5877 49.6004 13.4877 49.2004 13.4877H45.4004V19.1877H49.4004Z" fill="black" />
                                        <path d="M53.2012 26.5877L61.2012 10.8877H61.5012L69.5012 26.5877H66.2012L65.0012 24.0877H57.6012L56.4012 26.5877H53.2012ZM59.1012 21.4877H63.6012L61.4012 16.7877L59.1012 21.4877Z" fill="black" />
                                        <path d="M81.0004 26.5877L74.4004 19.4877V26.5877H71.4004V10.8877H74.4004V18.8877L80.6004 10.8877H84.3004L77.8004 18.9877L84.9004 26.5877H81.0004Z" fill="black" />
                                        <path d="M90.5996 26.5877H87.5996V10.8877H90.5996V26.5877Z" fill="black" />
                                        <path d="M93.8008 24.4881L95.4008 22.0881C96.2008 22.5881 97.0008 23.0881 97.8008 23.4881C98.6008 23.8881 99.5008 24.0881 100.401 24.0881C100.901 24.0881 101.301 23.9881 101.701 23.8881C102.101 23.7881 102.401 23.5881 102.601 23.3881C102.901 23.1881 103.101 22.9881 103.201 22.6881C103.301 22.4881 103.401 22.1881 103.401 21.9881C103.401 21.6881 103.301 21.3881 103.101 21.1881C102.901 20.9881 102.601 20.7881 102.301 20.6881C102.001 20.5881 101.601 20.3881 101.201 20.2881C100.801 20.1881 100.301 20.0881 99.8008 19.9881C99.5008 19.8881 99.1008 19.8881 98.7008 19.7881C98.3008 19.6881 97.9008 19.5881 97.4008 19.4881C97.0008 19.3881 96.5008 19.1881 96.1008 18.9881C95.7008 18.7881 95.3008 18.4881 94.9008 18.1881C94.6008 17.8881 94.3008 17.4881 94.1008 16.9881C93.9008 16.4881 93.8008 15.9881 93.8008 15.3881C93.8008 14.4881 94.0008 13.6881 94.4008 13.0881C94.8008 12.4881 95.2008 11.9881 95.8008 11.6881C96.4008 11.2881 97.0008 11.0881 97.7008 10.9881C98.4008 10.8881 99.1008 10.7881 99.7008 10.7881C100.401 10.7881 100.901 10.7881 101.501 10.8881C102.001 10.9881 102.501 11.0881 102.901 11.2881C103.301 11.4881 103.801 11.6881 104.201 11.8881C104.601 12.1881 105.101 12.3881 105.601 12.7881L103.901 15.1881C103.201 14.6881 102.401 14.2881 101.801 13.9881C101.101 13.6881 100.401 13.5881 99.6008 13.5881C99.3008 13.5881 99.1008 13.5881 98.7008 13.6881C98.4008 13.7881 98.1008 13.8881 97.8008 13.9881C97.5008 14.0881 97.3008 14.2881 97.1008 14.4881C96.9008 14.6881 96.8008 14.9881 96.8008 15.2881C96.8008 15.5881 96.9008 15.8881 97.1008 16.0881C97.3008 16.2881 97.6008 16.4881 98.0008 16.5881C98.4008 16.6881 98.8008 16.8881 99.2008 16.9881C99.6008 17.0881 100.001 17.1881 100.401 17.2881C100.701 17.3881 101.101 17.3881 101.501 17.4881C101.901 17.5881 102.301 17.6881 102.801 17.7881C103.201 17.8881 103.701 18.0881 104.101 18.2881C104.501 18.4881 104.901 18.7881 105.201 19.0881C105.501 19.3881 105.801 19.8881 106.001 20.2881C106.201 20.6881 106.301 21.3881 106.301 22.0881C106.301 22.8881 106.201 23.5881 105.901 24.1881C105.601 24.7881 105.201 25.2881 104.701 25.6881C104.201 26.0881 103.501 26.3881 102.801 26.5881C102.101 26.7881 101.301 26.8881 100.401 26.8881C99.6008 26.8881 98.9008 26.7881 98.2008 26.6881C97.6008 26.5881 97.0008 26.3881 96.5008 26.1881C96.0008 25.9881 95.5008 25.6881 95.0008 25.4881C94.8008 25.1881 94.3008 24.8881 93.8008 24.4881Z" fill="black" />
                                        <path d="M119 13.4881H114.5V26.4881H111.5V13.4881H107V10.7881H119V13.4881Z" fill="black" />
                                        <path d="M117 26.5877L125 10.8877H125.3L133.3 26.5877H130L128.8 24.0877H121.4L120.2 26.5877H117ZM122.9 21.4877H127.4L125.2 16.7877L122.9 21.4877Z" fill="black" />
                                        <path d="M148.501 26.5877L138.201 17.2877V26.5877H135.201V10.8877H135.501L145.801 20.3877V10.8877H148.801V26.5877H148.501Z" fill="black" />
                                        <path d="M1 10.0881L5.1 7.18809C5.3 7.08809 5.4 6.88809 5.4 6.68809V5.18809C5.4 4.08809 4.5 3.28809 3.5 3.28809H1.9C0.8 3.28809 0 4.18809 0 5.18809V9.68809C0 10.0881 0.6 10.3881 1 10.0881Z" fill="#1B573E" />
                                        <path d="M32.9 36.2884C34.6 36.2884 35.9 34.9884 35.9 33.2884V13.0884C35.9 12.0884 35.4 11.0884 34.5 10.5884L18.9 0.488412C17.9 -0.211588 16.5 -0.111588 15.5 0.588412L1.3 10.6884C0.499999 11.2884 0 12.1884 0 13.0884V33.1884C0 34.8884 1.3 36.1884 3 36.1884L32.9 36.2884Z" fill="#1B573E" />
                                        <path d="M12.5004 19.6889H14.2004V10.9889H19.4004C19.4004 10.9889 25.2004 11.7889 25.4004 18.0889C25.4004 18.0889 25.5004 23.9889 19.4004 25.0889H12.4004V37.8889H14.2004V26.9889L18.9004 27.0889C18.9004 27.0889 26.6004 26.6889 27.2004 17.9889C27.2004 17.9889 27.4004 10.9889 19.8004 9.08887H12.4004V19.6889H12.5004Z" fill="white" />
                                        <path d="M16.1008 12.6885H19.2008C19.2008 12.6885 23.5008 13.7885 23.6008 17.5885C23.6008 17.5885 24.3008 22.2885 19.0008 23.3885H10.7008V37.9885H8.80078V12.6885H16.1008Z" fill="white" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M20.7002 19.6891C20.1002 20.2891 19.1002 20.8891 17.8002 20.7891C14.8002 20.6891 13.1002 17.3891 14.6002 14.8891C14.7002 14.6891 14.9002 14.4891 15.0002 14.2891C15.2002 14.0891 15.3002 13.9891 15.5002 13.7891C15.2002 13.7891 14.8002 14.0891 14.6002 14.1891C13.8002 14.6891 13.1002 15.5891 12.8002 16.4891C11.5002 20.4891 16.3002 23.6891 19.5002 21.0891C19.9002 20.9891 20.6002 20.1891 20.7002 19.6891Z" fill="#1B573E" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M17.7008 15.9893L16.3008 16.5893L17.7008 16.8893L17.9008 18.4893L18.7008 17.1893L20.2008 17.4893L19.2008 16.3893L20.0008 14.9893L18.5008 15.5893L17.5008 14.4893L17.7008 15.9893Z" fill="#1B573E" />
                                    </svg>
                                </Link>
                            </div>
                            <div className='col-8 d-none d-lg-flex align-items-center justify-content-center'>
                                <ul className='d-flex flex-row justify-content-between align-items-center m-0 p-0'>
                                    {propertyType?.map((item) => (
                                        <li key={item?.slug}><Link to={`/property-for-${item?.slug}`} className={`${location === `/property-for-${item?.slug}` ? "active_page" : ""} nav_link`}>{item?.name === "Sell" ? "Buy" : item?.name}</Link></li>
                                    ))}
                                    <li className='nav-dropdown' style={{ position: "relative" }}><Link to={"/new-projects"} className={`${location === "/new-projects" || location === "/project-listing" ? "active_page" : ""} nav_link`}>Projects</Link>
                                        <div className='new-menu-box tab' style={{ top: "42px" }}>
                                            {projectTypeData?.map((item) => (
                                                <div key={item?.name} onClick={() => navigate(`/new-projects/${item?.name?.toLowerCase().replace(/\s+/g, "-")}`)} className='menu'>{item?.name}</div>
                                            ))}
                                        </div>
                                    </li>
                                    <li><Link to={"/valuation"} className={`${location === "/valuation" ? "active_page" : ""} nav_link`}>Valuation</Link></li>
                                    <li><Link to={"/agencies"} className={`${location === "/agency-property-Listing" || location === "/agencies" ? "active_page" : ""} nav_link`}>Agencies</Link></li>
                                </ul>
                            </div>
                            <div className='col-lg-2 pe-0 col-md-6 col-6 d-sm-flex d-none  justify-content-end align-items-center action_btn_nav' >

                                <span>
                                    <span className='d-sm-flex d-none'>
                                        <PrimaryBorderButton text={"Add Property"} onFunction={handleAddProperty} />
                                    </span>
                                    <div className="img d-none " onClick={() => handleAddProperty()}>
                                        <Image src={add} alt="" />
                                    </div>
                                </span>
                                <div ref={wrapperRef} onClick={(e) => { e.stopPropagation(); setMenu(!menu); setGlobalMenu(false); setTopNavMenu(false); setMoreMenu(false); }} className=' profile_menu d-none '>
                                    {loginData ?
                                        <Image src={login2} alt="" /> :
                                        <Image src={login1}  alt="" />}
                                    {menu && <div className='dropdown_menu' style={{ width: "296px", paddingTop: loginData ? "" : "8px" }} onClick={(e) => e.stopPropagation()}>
                                        <ul className='w-100 mb-0'>
                                            {
                                                loginData &&
                                                <div className="global-profile-box">
                                                    <Avatar alt="Cindy Baker" style={{ width: "40px", height: "40px" }} src={userAvatar || dummyProfile} />
                                                    <div className="profile-box-info">
                                                        <p className="name">{loginData?.data?.user?.name}</p>
                                                        <p className="email">{loginData?.data?.user?.email}</p>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                loginData ?
                                                    <>
                                                        <li ><Link to={`/${loginData?.data?.role}-portal/dashboard`} className='link m-0' style={{ textTransform: "capitalize" }} onClick={(e) => { e.stopPropagation(); setMenu(false); }}>Go to Portal</Link></li>
                                                        <li><p onClick={async (e) => {
                                                            let result = await logout()
                                                            if (result) {
                                                                navigate('/')
                                                            }
                                                            setMenu(false)
                                                        }} className='link m-0' >Logout</p></li>
                                                    </>
                                                    :
                                                    <>
                                                        <li onClick={() => { setOpenLoanModal(true); setMenu(false) }} className="link m-0">Login</li>
                                                        <li onClick={() => { setOpenSignUp(true); setMenu(false) }} className="link m-0">Sign Up</li>
                                                    </>
                                            }

                                        </ul>
                                    </div>}
                                </div>
                                <button onClick={() => setSideBar(!activeSide)} className='mobail_btn d-lg-none d-sm-flex d-none'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                        <g clipPath="url(#clip0_50760_2951)">
                                            <path d="M1.3999 6.00001H23.3999C23.6651 6.00001 23.9195 5.89465 24.107 5.70712C24.2945 5.51958 24.3999 5.26523 24.3999 5.00001C24.3999 4.7348 24.2945 4.48044 24.107 4.29291C23.9195 4.10537 23.6651 4.00002 23.3999 4.00002H1.3999C1.13469 4.00002 0.880332 4.10537 0.692796 4.29291C0.505259 4.48044 0.399902 4.7348 0.399902 5.00001C0.399902 5.26523 0.505259 5.51958 0.692796 5.70712C0.880332 5.89465 1.13469 6.00001 1.3999 6.00001Z" fill="#2D2D2D" />
                                            <path d="M23.4001 9H9.40005C9.13484 9 8.88048 9.10536 8.69295 9.29289C8.50541 9.48043 8.40005 9.73478 8.40005 10C8.40005 10.2652 8.50541 10.5196 8.69295 10.7071C8.88048 10.8946 9.13484 11 9.40005 11H23.4001C23.6653 11 23.9196 10.8946 24.1072 10.7071C24.2947 10.5196 24.4001 10.2652 24.4001 10C24.4001 9.73478 24.2947 9.48043 24.1072 9.29289C23.9196 9.10536 23.6653 9 23.4001 9Z" fill="#2D2D2D" />
                                            <path d="M23.4001 19H9.40005C9.13484 19 8.88048 19.1053 8.69295 19.2929C8.50541 19.4804 8.40005 19.7348 8.40005 20C8.40005 20.2652 8.50541 20.5195 8.69295 20.7071C8.88048 20.8946 9.13484 21 9.40005 21H23.4001C23.6653 21 23.9196 20.8946 24.1072 20.7071C24.2947 20.5195 24.4001 20.2652 24.4001 20C24.4001 19.7348 24.2947 19.4804 24.1072 19.2929C23.9196 19.1053 23.6653 19 23.4001 19Z" fill="#2D2D2D" />
                                            <path d="M23.3999 14H1.3999C1.13469 14 0.880332 14.1054 0.692796 14.2929C0.505259 14.4805 0.399902 14.7348 0.399902 15C0.399902 15.2653 0.505259 15.5196 0.692796 15.7071C0.880332 15.8947 1.13469 16 1.3999 16H23.3999C23.6651 16 23.9195 15.8947 24.107 15.7071C24.2945 15.5196 24.3999 15.2653 24.3999 15C24.3999 14.7348 24.2945 14.4805 24.107 14.2929C23.9195 14.1054 23.6651 14 23.3999 14Z" fill="#2D2D2D" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_50760_2951">
                                                <rect width="24" height="24" fill="white" transform="translate(0.399902)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                                {/* 
                                {activeSide && (
                                    <div
                                        className="sidebar-backdrop"
                                        onClick={() => setSideBar(false)}
                                    ></div>
                                )} */}


                            </div>
                            <div className={`side_bar ${activeSide ? "active-sideBar" : ""} px-0`} style={{ paddingTop: "10px", paddingBottom: "0", height: "100dvh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", overflow: "hidden", top: "0", bottom: "0" }} ref={sideNavbar}>
                                <div className="supoorter-side-bar" style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", paddingBottom: loginData ? "calc(0px + env(safe-area-inset-bottom))" : "0" }}>
                                    <div className='d-flex justify-content-between align-items-center mb-2'>
                                        <Link to={'/'}>
                                            <svg style={{ paddingLeft: "1rem" }} xmlns="http://www.w3.org/2000/svg" width="149" height="38" viewBox="0 0 149 38" fill="none">
                                                <path d="M42.5996 29.1875H45.8996C46.8996 29.1875 48.0996 29.7875 48.0996 31.3875C48.0996 33.2875 46.8996 33.7875 45.9996 33.7875H43.1996V36.1875H42.5996V29.1875ZM43.1996 29.6875V33.1875H45.8996C46.5996 33.1875 47.4996 32.8875 47.4996 31.3875C47.4996 29.9875 46.6996 29.6875 45.8996 29.6875H43.1996Z" fill="black" />
                                                <path d="M56 33.4881C56.5 33.8881 56.8 34.6881 57.1 35.4881L57.4 36.1881H56.8L56.4 35.0881C56 33.9881 55.5 33.5881 54.7 33.5881H52.6V36.2881H52V29.2881H55.3C56.4 29.2881 57.5 29.7881 57.5 31.3881C57.5 31.7881 57.4 33.1881 56 33.4881ZM55.2 32.9881C56 32.9881 56.8 32.9881 56.8 31.2881C56.8 29.8881 56 29.6881 55.2 29.6881H52.6V32.9881H55.2Z" fill="black" />
                                                <path d="M61.1992 32.4879C61.1992 29.9879 63.0992 29.0879 64.6992 29.0879C66.2992 29.0879 68.0992 29.9879 68.0992 32.4879C68.0992 35.5879 65.9992 36.1879 64.6992 36.1879C63.2992 36.2879 61.1992 35.5879 61.1992 32.4879ZM67.4992 32.5879C67.4992 30.3879 66.0992 29.6879 64.6992 29.6879C63.2992 29.6879 61.7992 30.3879 61.7992 32.5879C61.7992 35.1879 63.4992 35.6879 64.6992 35.6879C65.7992 35.6879 67.4992 35.1879 67.4992 32.5879Z" fill="black" />
                                                <path d="M72.1992 29.1875H75.4992C76.4992 29.1875 77.6992 29.7875 77.6992 31.3875C77.6992 33.2875 76.4992 33.7875 75.5992 33.7875H72.7992V36.1875H72.1992V29.1875ZM72.7992 29.6875V33.1875H75.4992C76.1992 33.1875 77.0992 32.8875 77.0992 31.3875C77.0992 29.9875 76.2992 29.6875 75.4992 29.6875H72.7992Z" fill="black" />
                                                <path d="M82.1996 29.6875V32.2875H85.5996V32.8875H82.1996V35.5875H86.3996V36.1875H81.5996V29.1875H86.3996V29.7875H82.1996V29.6875Z" fill="black" />
                                                <path d="M94.5996 33.4881C95.0996 33.8881 95.3996 34.6881 95.6996 35.4881L95.9996 36.1881H95.3996L94.9996 35.0881C94.5996 33.9881 94.0996 33.5881 93.2996 33.5881H91.1996V36.2881H90.5996V29.2881H93.8996C94.9996 29.2881 96.0996 29.7881 96.0996 31.3881C96.0996 31.7881 95.9996 33.1881 94.5996 33.4881ZM93.8996 32.9881C94.6996 32.9881 95.4996 32.9881 95.4996 31.2881C95.4996 29.8881 94.6996 29.6881 93.8996 29.6881H91.2996V32.9881H93.8996Z" fill="black" />
                                                <path d="M99.5996 29.1875H105V29.7875H102.6V36.2875H102V29.7875H99.5996V29.1875Z" fill="black" />
                                                <path d="M113.9 29.1875H114.6L111.9 33.7875V36.1875H111.3V33.7875L108.6 29.1875H109.3L111.7 33.1875L113.9 29.1875Z" fill="black" />
                                                <path d="M116.9 35.5879H117.5V36.1879H116.9V35.5879Z" fill="black" />
                                                <path d="M122.2 32.5879C122.2 35.1879 123.9 35.6879 125.2 35.6879C125.8 35.6879 126.4 35.5879 127 35.2879L127.3 35.6879C126.7 36.0879 125.9 36.1879 125.3 36.1879C124 36.1879 121.6 35.5879 121.6 32.4879C121.6 29.8879 123.4 29.0879 125.3 29.0879C126 29.0879 126.7 29.2879 127.3 29.5879L127 29.9879C126.4 29.6879 125.8 29.5879 125.3 29.5879C123.8 29.6879 122.2 30.1879 122.2 32.5879Z" fill="black" />
                                                <path d="M130.9 32.4879C130.9 29.9879 132.8 29.0879 134.4 29.0879C136 29.0879 137.8 29.9879 137.8 32.4879C137.8 35.5879 135.7 36.1879 134.4 36.1879C133 36.2879 130.9 35.5879 130.9 32.4879ZM137.2 32.5879C137.2 30.3879 135.8 29.6879 134.4 29.6879C133 29.6879 131.5 30.3879 131.5 32.5879C131.5 35.1879 133.2 35.6879 134.4 35.6879C135.5 35.6879 137.2 35.1879 137.2 32.5879Z" fill="black" />
                                                <path d="M145.1 34.4875L142.5 30.5875V36.1875H141.9V29.1875H142.3L145.3 33.8875L148.3 29.1875H148.7V36.1875H148.1V30.5875L145.6 34.4875H145.1Z" fill="black" />
                                                <path d="M49.4004 10.8877C50.2004 10.8877 50.9004 10.9877 51.6004 11.2877C52.3004 11.5877 52.9004 11.9877 53.4004 12.4877C53.9004 12.9877 54.3004 13.5877 54.6004 14.2877C54.9004 14.9877 55.0004 15.6877 55.0004 16.4877C55.0004 17.2877 54.9004 17.9877 54.6004 18.5877C54.3004 19.2877 54.0004 19.7877 53.5004 20.2877C53.0004 20.7877 52.4004 21.1877 51.6004 21.4877C50.8004 21.7877 50.0004 21.8877 48.9004 21.8877H45.4004V26.5877H42.4004V10.8877H49.4004ZM49.4004 19.1877C49.8004 19.1877 50.2004 19.0877 50.6004 18.9877C50.9004 18.7877 51.2004 18.5877 51.4004 18.3877C51.6004 18.0877 51.8004 17.8877 51.9004 17.4877C52.0004 17.1877 52.1004 16.7877 52.1004 16.4877C52.1004 16.0877 52.0004 15.7877 51.9004 15.3877C51.8004 14.9877 51.6004 14.6877 51.3004 14.4877C51.1004 14.1877 50.8004 13.9877 50.4004 13.7877C50.0004 13.5877 49.6004 13.4877 49.2004 13.4877H45.4004V19.1877H49.4004Z" fill="black" />
                                                <path d="M53.2012 26.5877L61.2012 10.8877H61.5012L69.5012 26.5877H66.2012L65.0012 24.0877H57.6012L56.4012 26.5877H53.2012ZM59.1012 21.4877H63.6012L61.4012 16.7877L59.1012 21.4877Z" fill="black" />
                                                <path d="M81.0004 26.5877L74.4004 19.4877V26.5877H71.4004V10.8877H74.4004V18.8877L80.6004 10.8877H84.3004L77.8004 18.9877L84.9004 26.5877H81.0004Z" fill="black" />
                                                <path d="M90.5996 26.5877H87.5996V10.8877H90.5996V26.5877Z" fill="black" />
                                                <path d="M93.8008 24.4881L95.4008 22.0881C96.2008 22.5881 97.0008 23.0881 97.8008 23.4881C98.6008 23.8881 99.5008 24.0881 100.401 24.0881C100.901 24.0881 101.301 23.9881 101.701 23.8881C102.101 23.7881 102.401 23.5881 102.601 23.3881C102.901 23.1881 103.101 22.9881 103.201 22.6881C103.301 22.4881 103.401 22.1881 103.401 21.9881C103.401 21.6881 103.301 21.3881 103.101 21.1881C102.901 20.9881 102.601 20.7881 102.301 20.6881C102.001 20.5881 101.601 20.3881 101.201 20.2881C100.801 20.1881 100.301 20.0881 99.8008 19.9881C99.5008 19.8881 99.1008 19.8881 98.7008 19.7881C98.3008 19.6881 97.9008 19.5881 97.4008 19.4881C97.0008 19.3881 96.5008 19.1881 96.1008 18.9881C95.7008 18.7881 95.3008 18.4881 94.9008 18.1881C94.6008 17.8881 94.3008 17.4881 94.1008 16.9881C93.9008 16.4881 93.8008 15.9881 93.8008 15.3881C93.8008 14.4881 94.0008 13.6881 94.4008 13.0881C94.8008 12.4881 95.2008 11.9881 95.8008 11.6881C96.4008 11.2881 97.0008 11.0881 97.7008 10.9881C98.4008 10.8881 99.1008 10.7881 99.7008 10.7881C100.401 10.7881 100.901 10.7881 101.501 10.8881C102.001 10.9881 102.501 11.0881 102.901 11.2881C103.301 11.4881 103.801 11.6881 104.201 11.8881C104.601 12.1881 105.101 12.3881 105.601 12.7881L103.901 15.1881C103.201 14.6881 102.401 14.2881 101.801 13.9881C101.101 13.6881 100.401 13.5881 99.6008 13.5881C99.3008 13.5881 99.1008 13.5881 98.7008 13.6881C98.4008 13.7881 98.1008 13.8881 97.8008 13.9881C97.5008 14.0881 97.3008 14.2881 97.1008 14.4881C96.9008 14.6881 96.8008 14.9881 96.8008 15.2881C96.8008 15.5881 96.9008 15.8881 97.1008 16.0881C97.3008 16.2881 97.6008 16.4881 98.0008 16.5881C98.4008 16.6881 98.8008 16.8881 99.2008 16.9881C99.6008 17.0881 100.001 17.1881 100.401 17.2881C100.701 17.3881 101.101 17.3881 101.501 17.4881C101.901 17.5881 102.301 17.6881 102.801 17.7881C103.201 17.8881 103.701 18.0881 104.101 18.2881C104.501 18.4881 104.901 18.7881 105.201 19.0881C105.501 19.3881 105.801 19.8881 106.001 20.2881C106.201 20.6881 106.301 21.3881 106.301 22.0881C106.301 22.8881 106.201 23.5881 105.901 24.1881C105.601 24.7881 105.201 25.2881 104.701 25.6881C104.201 26.0881 103.501 26.3881 102.801 26.5881C102.101 26.7881 101.301 26.8881 100.401 26.8881C99.6008 26.8881 98.9008 26.7881 98.2008 26.6881C97.6008 26.5881 97.0008 26.3881 96.5008 26.1881C96.0008 25.9881 95.5008 25.6881 95.0008 25.4881C94.8008 25.1881 94.3008 24.8881 93.8008 24.4881Z" fill="black" />
                                                <path d="M119 13.4881H114.5V26.4881H111.5V13.4881H107V10.7881H119V13.4881Z" fill="black" />
                                                <path d="M117 26.5877L125 10.8877H125.3L133.3 26.5877H130L128.8 24.0877H121.4L120.2 26.5877H117ZM122.9 21.4877H127.4L125.2 16.7877L122.9 21.4877Z" fill="black" />
                                                <path d="M148.501 26.5877L138.201 17.2877V26.5877H135.201V10.8877H135.501L145.801 20.3877V10.8877H148.801V26.5877H148.501Z" fill="black" />
                                                <path d="M1 10.0881L5.1 7.18809C5.3 7.08809 5.4 6.88809 5.4 6.68809V5.18809C5.4 4.08809 4.5 3.28809 3.5 3.28809H1.9C0.8 3.28809 0 4.18809 0 5.18809V9.68809C0 10.0881 0.6 10.3881 1 10.0881Z" fill="#1B573E" />
                                                <path d="M32.9 36.2884C34.6 36.2884 35.9 34.9884 35.9 33.2884V13.0884C35.9 12.0884 35.4 11.0884 34.5 10.5884L18.9 0.488412C17.9 -0.211588 16.5 -0.111588 15.5 0.588412L1.3 10.6884C0.499999 11.2884 0 12.1884 0 13.0884V33.1884C0 34.8884 1.3 36.1884 3 36.1884L32.9 36.2884Z" fill="#1B573E" />
                                                <path d="M12.5004 19.6889H14.2004V10.9889H19.4004C19.4004 10.9889 25.2004 11.7889 25.4004 18.0889C25.4004 18.0889 25.5004 23.9889 19.4004 25.0889H12.4004V37.8889H14.2004V26.9889L18.9004 27.0889C18.9004 27.0889 26.6004 26.6889 27.2004 17.9889C27.2004 17.9889 27.4004 10.9889 19.8004 9.08887H12.4004V19.6889H12.5004Z" fill="white" />
                                                <path d="M16.1008 12.6885H19.2008C19.2008 12.6885 23.5008 13.7885 23.6008 17.5885C23.6008 17.5885 24.3008 22.2885 19.0008 23.3885H10.7008V37.9885H8.80078V12.6885H16.1008Z" fill="white" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M20.7002 19.6891C20.1002 20.2891 19.1002 20.8891 17.8002 20.7891C14.8002 20.6891 13.1002 17.3891 14.6002 14.8891C14.7002 14.6891 14.9002 14.4891 15.0002 14.2891C15.2002 14.0891 15.3002 13.9891 15.5002 13.7891C15.2002 13.7891 14.8002 14.0891 14.6002 14.1891C13.8002 14.6891 13.1002 15.5891 12.8002 16.4891C11.5002 20.4891 16.3002 23.6891 19.5002 21.0891C19.9002 20.9891 20.6002 20.1891 20.7002 19.6891Z" fill="#1B573E" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M17.7008 15.9893L16.3008 16.5893L17.7008 16.8893L17.9008 18.4893L18.7008 17.1893L20.2008 17.4893L19.2008 16.3893L20.0008 14.9893L18.5008 15.5893L17.5008 14.4893L17.7008 15.9893Z" fill="#1B573E" />
                                            </svg>
                                        </Link>
                                        {/* <button className='close_btn' onClick={() => setSideBar(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <g clipPath="url(#clip0_2343_173415)">
                                                <path d="M15.9994 7.99982C15.8119 7.81235 15.5576 7.70703 15.2924 7.70703C15.0273 7.70703 14.773 7.81235 14.5854 7.99982L11.9995 10.5858L9.41346 7.99982C9.22486 7.81766 8.97226 7.71687 8.71006 7.71914C8.44786 7.72142 8.19705 7.82659 8.01164 8.012C7.82623 8.19741 7.72107 8.44822 7.71879 8.71042C7.71651 8.97261 7.8173 9.22522 7.99946 9.41382L10.5855 11.9998L7.99946 14.5858C7.8173 14.7744 7.71651 15.027 7.71879 15.2892C7.72107 15.5514 7.82623 15.8022 8.01164 15.9876C8.19705 16.173 8.44786 16.2782 8.71006 16.2805C8.97226 16.2828 9.22486 16.182 9.41346 15.9998L11.9995 13.4138L14.5854 15.9998C14.7741 16.182 15.0267 16.2828 15.2888 16.2805C15.551 16.2782 15.8019 16.173 15.9873 15.9876C16.1727 15.8022 16.2778 15.5514 16.2801 15.2892C16.2824 15.027 16.1816 14.7744 15.9994 14.5858L13.4135 11.9998L15.9994 9.41382C16.1869 9.22629 16.2922 8.97198 16.2922 8.70682C16.2922 8.44165 16.1869 8.18735 15.9994 7.99982Z" fill="#2D2D2D" />
                                                <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2343_173415">
                                                    <rect width="24" height="24" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </button> */}

                                    </div>
                                    <div className="global-line-seperator" style={{ marginBottom: loginData ? "" : "10px" }}></div>
                                    {
                                        !loginData && <div className="mb-3" style={{ padding: "0 1rem" }} onClick={() => setOpenLoanModal(true)}>
                                            <PrimaryButton text={"Login"} widthSize={"100%"} />
                                        </div>
                                    }
                                    {
                                        loginData &&
                                        <div className="global-profile-box">
                                            <Avatar alt="Cindy Baker" style={{ width: "40px", height: "40px" }} src={userAvatar || dummyProfile} />
                                            <div className="profile-box-info">
                                                <p className="name">{loginData?.data?.user?.name}</p>
                                                <p className="email">{loginData?.data?.user?.email}</p>
                                            </div>
                                        </div>
                                    }
                                    {
                                        loginData &&
                                        <div className='mt-3 px-3'>
                                            <Link to="/agent-portal/add-property">
                                            <PrimaryButton text={"Add Property"} widthSize={"100%"} />
                                            </Link>
                                        </div>
                                       
                                    }
                                    <div className="side-bar-scroll" style={{ padding: "0 1rem", flex: "1", overflowY: "auto", paddingBottom: loginData ? "calc(60px + env(safe-area-inset-bottom))" : "20px" }}>
                                        <ul>
                                            <Link to="/property-for-sell"><li className={location === "/property-for-sell" ? "active" : ''} onClick={() => setNavActive("Buy")}>Buy</li></Link>
                                            <Link to="/property-for-rent"><li className={location === "/property-for-rent" ? "active" : ''} onClick={() => setNavActive("Rent")}>Rent</li></Link>
                                            <Link to="/property-for-lease"><li className={location === "/property-for-lease" ? "active" : ''} onClick={() => setNavActive("Lease")}>Lease</li></Link>
                                            <li
                                                className={`projects-dropdown ${projectsMenu ? "active" : ""} ${location === "/new-projects" || location === "/project-listing" ? "active" : ""}`}
                                                ref={projectsMenuRef}
                                                onClick={() => { setProjectsMenu(!projectsMenu); setMoreMenu(false) }}
                                            >
                                                <div className="d-flex align-items-center justify-content-between" style={{ gap: "9px" }}>
                                                    <span>Projects</span>
                                                    <svg style={{ transform: projectsMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} xmlns="http://www.w3.org/2000/svg" width="14" height="7" viewBox="0 0 14 7" fill="none">
                                                        <path d="M13.7092 0.288658C13.6163 0.197192 13.5057 0.124593 13.3839 0.0750502C13.262 0.025507 13.1313 0 12.9993 0C12.8673 0 12.7366 0.025507 12.6148 0.0750502C12.4929 0.124593 12.3824 0.197192 12.2894 0.288658L7.70992 4.7581C7.61697 4.84956 7.50638 4.92216 7.38453 4.9717C7.26269 5.02125 7.132 5.04676 7 5.04676C6.868 5.04676 6.73731 5.02125 6.61547 4.9717C6.49362 4.92216 6.38303 4.84956 6.29008 4.7581L1.7106 0.288658C1.61765 0.197192 1.50706 0.124593 1.38521 0.0750502C1.26337 0.025507 1.13268 0 1.00068 0C0.868682 0 0.737991 0.025507 0.616146 0.0750502C0.4943 0.124593 0.383712 0.197192 0.29076 0.288658C0.10453 0.471497 0 0.718831 0 0.976639C0 1.23445 0.10453 1.48178 0.29076 1.66462L4.88024 6.14382C5.44268 6.69206 6.20509 7 7 7C7.79491 7 8.55732 6.69206 9.11976 6.14382L13.7092 1.66462C13.8955 1.48178 14 1.23445 14 0.976639C14 0.718831 13.8955 0.471497 13.7092 0.288658Z" fill="currentColor" />
                                                    </svg>
                                                </div>
                                            </li>
                                            {projectsMenu && <div className={`new-menu-box ${projectsMenu ? "active" : ""}`} onClick={(e) => e.stopPropagation()}>
                                                {projectTypeData?.map((item) => (
                                                    <Link
                                                        key={item?.name}
                                                        to={`/new-projects/${item?.name?.toLowerCase().replace(/\s+/g, "-")}`}
                                                        className="menu"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setProjectsMenu(false);
                                                            setNavActive("Projects");
                                                            setSideBar(false)
                                                        }}
                                                    >
                                                        {item?.name}
                                                    </Link>
                                                ))}
                                                <Link
                                                    to={`/new-projects`}
                                                    className="menu"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setProjectsMenu(false);
                                                        setNavActive("Projects");
                                                        setSideBar(false)
                                                    }}
                                                >
                                                    Projects
                                                </Link>
                                            </div>
                                            }
                                            <Link to={"/valuation"} ><li className={location === "/valuation" ? "active" : ''} onClick={() => setNavActive("Valuation")}>Valuation</li></Link>
                                            <Link to="/agencies"><li className={location === "/agency-property-Listing" || location === "/agencies" ? "active" : ''} onClick={() => setNavActive("Agencies")}>Agencies</li></Link>
                                            <Link to="/property-trend"><li className={location === "/property-trend" ? "active" : ''} onClick={() => setNavActive("Property_Trends")}>Property Trends</li></Link>
                                            <Link to="/property-index"><li className={location === "/property-index" ? "active" : ''} onClick={() => setNavActive("Property_Index")}>Property Index</li></Link>
                                            <Link to="/blogs"><li className={location === "/blogs" ? "active" : ''} onClick={() => setNavActive("Blogs")}>Blogs</li></Link>
                                            <Link to="/news"><li className={location === "/news" ? "active" : ''} onClick={() => setNavActive("News")}>News</li></Link>
                                            <Link to="/our-story"><li className={location === "/our-story" ? "active" : ''} onClick={() => setNavActive("Story")}>Our Story</li></Link>
                                            <Link to="/property-wishlist"><li className={location === "/property-wishlist" ? "active" : ''} onClick={() => setNavActive("LikedProperties")}>Property WishList</li></Link>
                                            <Link to="/saved-search"><li className={location === "/saved-search" ? "active" : ''} onClick={() => setNavActive("Saved_Searches")}>Saved Searches</li></Link>
                                            <Link to="/construction-cost-calculator"><li className={location === "/construction-cost-calculator" ? "active" : ''} onClick={() => setNavActive("Cost_Calculator")}>Cost Calculator</li></Link>
                                            <Link to="/area-unit-converter"><li className={location === "/area-unit-converter" ? "active" : ''} onClick={() => setNavActive("AreaUnitConvertor")}>Area Unit Convertor</li></Link>
                                            <Link to="/loan-calculator"><li className={location === "/loan-calculator" ? "active" : ''} onClick={() => setNavActive("LoanCalculator")}>Loan Calculator</li></Link>
                                            <Link to="/privacy-policy"><li className={location === "/privacy-policy" ? "active" : ''} onClick={() => setNavActive("PrivacyPolicy")}>Privacy Policy</li></Link>
                                            <Link to="/term-and-condition"><li className={location === "/term-and-condition" ? "active" : ''} onClick={() => setNavActive("TermsConditions")}>Terms & Conditions</li></Link>
                                            <Link to="/faqs"><li className={location === "/faqs" ? "active" : ''} onClick={() => setNavActive("FAQs")}>FAQs</li></Link>
                                            <Link to="/forum"><li className={location === "/forum" ? "active" : ''} onClick={() => setNavActive("Forum")}>Forum</li></Link>
                                        </ul>
                                    </div>
                                    {loginData && (
                                        <div className="side-bar-footer" style={{
                                            position: "absolute",
                                            bottom: "-10px",
                                            left: "0",
                                            right: "0",
                                            width: "100%",
                                            zIndex: 100,
                                            background: "#F4F4F4",
                                            paddingBottom: "env(safe-area-inset-bottom)",
                                            minHeight: "40px",
                                            // boxShadow: "0 -2px 10px rgba(0,0,0,0.1)"
                                        }}
                                            onClick={async (e) => {
                                                let result = await logout()
                                                if (result) {
                                                    navigate('/')
                                                }
                                                setMenu(false)
                                            }}>Logout</div>
                                    )}
                                </div>
                            </div>
                            {prevButton ? (
                                <div onClick={handleBackNavigation} className='hamburger-icon d-sm-none d-flex ps-0' style={{ width: "48px", height: "48px", justifyContent: "start", alignItems: "center" }}>
                                    <svg style={{ marginLeft: "-6px" }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M15 18L9 12L15 6" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            ) :
                                blogSliderButton ? (
                                    <>
                                        <div onClick={handleBackNavigation} className='hamburger-icon d-sm-none d-flex ps-0' style={{ width: "48px", height: "48px", justifyContent: "start", alignItems: "center" }}>
                                            <svg style={{ marginLeft: "-6px" }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M15 18L9 12L15 6" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className="hamburger-icon d-sm-none d-flex" style={{right:"6px"}} onClick={() => setBlogSlider(true)}>
                                            <i className="fa-solid fa-bars"></i>
                                        </div>
                                    </>

                                ) :
                                    (
                                        <div className="hamburger-icon d-sm-none d-flex" onClick={() => setSideBar(true)}>
                                            <i className="fa-solid fa-bars"></i>
                                        </div>
                                    )}
                        </div>
                    </div>
                </div>
                <LoginModal handleOpen={handleOpenSignup} />
                <SignpuModal handleOpen={handleOpenlogin} open={openSignUp} setOpen={setOpenSignUp} />
                {
                    show ?
                        <Global_Menu setGlobalMenu={setGlobalMenu} globalMenu={globalMenu} global_Menu={global_Menu} />
                        : ""
                }
            </div>
        </>
    )
}

export default NavBar