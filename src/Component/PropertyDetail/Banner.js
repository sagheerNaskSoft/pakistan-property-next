import React, { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import img1 from '../../Asset/PropertyListing/985069493feb4c9e7356013239aafbe3e5dbdab3.jpg'
import img2 from '../../Asset/PropertyListing/9b3e159247606dffe2b72270c05958ec417396e7.jpg'
import img3 from '../../Asset/PropertyListing/e1d0d6ed1957a3104f11e348ecec816268de3e47.jpg'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Radio from '@mui/material/Radio';
import watermark1 from '../../Asset/PropertyListing/Logo (1).svg'
import watermark2 from '../../Asset/PropertyListing/Logo (2).svg'
import watermark3 from '../../Asset/PropertyListing/Logo (3).svg'
import { useAuth } from '../../Context/ContextProvider';
import { IoIosArrowDown } from 'react-icons/io';
import { Link, useNavigate, useParams } from 'react-router-dom';
import img6 from '../../Asset/ProjectListing/Text.png'
import img7 from '../../Asset/ProjectListing/badge.png'
import defaultImage from '../../Asset/no-property-large.svg'
import { FallbackImage } from '../Metiral/FallbackImage'
import featuredTag from '../../Asset/Agencylisting/Agencies detail  TAG 2.svg'
import SpinerLoading from '../Metiral/SpinerLoading';
import PrimaryButton from '../Metiral/Button/PrimaryButton';
import { buildPropertyWhatsappMessage, getPropertyDetailUrl } from '../../utils/propertyWhatsappMessage';
import Image from 'next/image';
// Lazy load all components for better performance
const Detail = lazy(() => import('./Detail'));
const Maps = lazy(() => import('./Maps'));
const Searched = lazy(() => import('./Searched'));
const Finance = lazy(() => import('./Finance'));
const Agreement = lazy(() => import('./Agreement'));
const SimilerProperty = lazy(() => import('./SimilerProperty'));
const ShareModal = lazy(() => import('./ShareModal'));
const Popup = lazy(() => import('../Metiral/Popup'));
const BreadCrumb = lazy(() => import('../Metiral/BreadCrumb'));
const Rsbuttons = lazy(() => import('../ProjectDetail/Rsbuttons'));
const Amenities = lazy(() => import('./Amenities'));
const CallModal = lazy(() => import('../Metiral/CallModal'));
const AgencyTag = lazy(() => import('../Metiral/AgencyTag'));

gsap.registerPlugin(ScrollTrigger);

function Banner({ setEndUserChatOpen, aminitiesWithCategory, propertyData, simlerProperties, mostSearchs, userOfProperty }) {
    const navigate = useNavigate()
    const sectionRef = useRef(null)
    const [open1, setOpen1] = useState(false)
    const { slug } = useParams()
    useEffect(() => {
        const scrollBox = sectionRef.current.querySelector('.detail-code-scroll-side')
        gsap.fromTo(
            scrollBox,
            { y: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top center',
                    end: 'bottom top',
                    scrub: true,
                },
            }
        )
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    const controlProps = (item) => ({
        checked: data?.type === item,
        onChange: () => setData({ ...data, type: item }),
        value: item,
        name: 'color-radio-button-demo',
        inputProps: { 'aria-label': item },
    });
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const titleRef = useRef(null);
    const [titleExpanded, setTitleExpanded] = useState(false);
    const [isTitleClamped, setIsTitleClamped] = useState(false);

    useEffect(() => {
        const el = titleRef.current;
        if (!el || !propertyData?.title || titleExpanded) {
            if (!titleExpanded) setIsTitleClamped(false);
            return;
        }
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || el.offsetParent === null) {
            setIsTitleClamped(false);
            return;
        }
        const check = () => {
            if (!titleRef.current || titleExpanded) return;
            const elem = titleRef.current;
            // Require clear overflow (e.g. at least one extra line) to avoid subpixel false positives
            const lineHeight = parseInt(window.getComputedStyle(elem).lineHeight, 10) || 24;
            const clamped = elem.scrollHeight > elem.clientHeight + lineHeight * 0.5;
            setIsTitleClamped(clamped);
        };
        const id = setTimeout(check, 100);
        window.addEventListener('resize', check);
        return () => {
            clearTimeout(id);
            window.removeEventListener('resize', check);
        };
    }, [propertyData?.title, titleExpanded]);
    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    const sliderRef = useRef(null);
    const imgArray = [img1, img2, img3]
    const CustomRadioIcon = (
        <span
            style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '1px solid #737678',
                display: 'inline-block',
            }}
        />
    );
    const { callingCode, properyEnquery, formatPakistaniPhoneNumber, handleOpenWhatsapp, whatsappImpretion, button_loading, isLikedProperties, handleLikeClick, setOpen: setSnackbarOpen, setError: setSnackbarError, backtoSearchContentState, setOpenLoanModal, loginData, sendUserLog } = useAuth()
    const parms = useParams()
    const [show, setShow] = useState(false)

    const propertyWhatsappPrefill = useMemo(() => {
        const userName = loginData?.data?.user?.name;
        const cityLine = [propertyData?.location?.name, propertyData?.city].filter(Boolean).join(', ');
        return buildPropertyWhatsappMessage({
            userName: (userName && String(userName).trim()) || 'there',
            propertyTitle: propertyData?.title,
            city: cityLine,
            propertyUrl: getPropertyDetailUrl(slug),
        });
    }, [loginData?.data?.user?.name, propertyData?.title, propertyData?.location?.name, propertyData?.city, slug])

    const handleLikeWithSnackbar = async (propertyId) => {
        const result = await handleLikeClick(propertyId);

        // Don't show snackbar if login is required (modal will open)
        if (result?.requiresLogin) {
            return;
        }

        if (result?.success) {
            const isLiked = result?.isLiked ?? !isLikedProperties?.includes(propertyId);
            setSnackbarError({
                message: isLiked ? "Property added to favorites successfully" : "Property removed from favorites successfully",
                color: "success"
            });
            setSnackbarOpen(true);
        } else {
            setSnackbarError({
                message: result?.error || "Failed to update favorite. Please try again.",
                color: "error"
            });
            setSnackbarOpen(true);
        }
    };
    const callingRef = React.useRef(null);
    const handleClickOutside = (event) => {
        if (callingRef.current && !callingRef.current.contains(event.target)) {
            setShow(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const [selectedCode, setSelectedCode] = useState({
        flag: 'https://flagcdn.com/pk.svg',
        callingCode: '+92'
    });
    const CustomCheckedIcon = (
        <span
            style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '1px solid #447158', // Thin border
                backgroundColor: '#447158',
                boxShadow: 'inset 0 0 0 4px white', // creates the small center circle
                display: 'inline-block',
            }}
        />
    );
    const [data, setData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        type: "buyer/tenant",
        keep_informed: false,
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        // Name validation
        if (!data.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (data.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        if (!data.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Enter a valid email';
        }

        // Phone validation
        if (!data.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!/^\d{7,15}$/.test(data.phone)) {
            newErrors.phone = 'Enter a valid phone number';
        }

        // Message validation
        if (!data.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (data.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            let result = await properyEnquery({
                email: data?.email,
                name: data?.name,
                contact_number: "+92" + data?.phone,
                message: data?.message,
                property_id: propertyData?.property_id,
                type: data?.type,
                keep_informed: data?.keep_informed,
                inquiry_type:  'email',   
            });
            if (result?.success) {
                console.log(result?.data?.data?.inquiry_id);
                await sendUserLog?.('email', {
                    currentPropertyId: propertyData?.property_id,
                    propertySlug: parms?.slug,
                    contact: propertyData?.contact?.[0] || "+92" + data?.phone,
                    email: data?.email,
                    inquiry_id: result?.data?.data?.inquiry_id ?? null
                });
                setData({
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                    type: "buyer/tenant",
                    keep_informed: false,
                })
            }
        }
    };

    const [showProperty, setShowProperty] = useState(false);

    useEffect(() => {
        const handleScroll = () => {


            if (window.scrollY > 0) {
                setShowProperty(true)
            }
            else {
                setShowProperty(false)
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const lastBreadcrumbFull = parms?.slug
        ?.replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()) || '';
    // Last breadcrumb truncated to 6 words + clamp above md is handled in BreadCrumb
    const breadcrumbItems = [
        "Home",
        `${propertyData?.city || ''}`.trim(),
        lastBreadcrumbFull
    ].filter(item => item); // Remove empty items
    const handleOpen1 = () => {
       
        setOpen1(true)
    }



    const SearchIcon = <svg style={{ marginTop: '-4px' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 18">
        <path
            d="M18.436 17.8325L14.9569 14.3535C15.905 13.194 16.3712 11.7144 16.2589 10.2208C16.1467 8.72721 15.4647 7.33389 14.354 6.32905C13.2433 5.3242 11.7889 4.7847 10.2916 4.82214C8.79424 4.85958 7.36858 5.47109 6.30948 6.53019C5.25038 7.58929 4.63887 9.01494 4.60144 10.5123C4.564 12.0096 5.1035 13.464 6.10834 14.5747C7.11319 15.6854 8.50651 16.3674 10.0001 16.4796C11.4937 16.5919 12.9732 16.1257 14.1328 15.1776L17.6118 18.6567C17.7218 18.7629 17.869 18.8216 18.0218 18.8203C18.1746 18.819 18.3208 18.7577 18.4289 18.6496C18.537 18.5415 18.5983 18.3953 18.5996 18.2425C18.6009 18.0897 18.5422 17.9425 18.436 17.8325ZM10.4468 15.3303C9.52459 15.3303 8.62308 15.0569 7.85628 14.5445C7.08948 14.0322 6.49183 13.3039 6.13891 12.4519C5.78599 11.5999 5.69365 10.6623 5.87357 9.75784C6.05349 8.85334 6.49758 8.0225 7.14969 7.37039C7.8018 6.71828 8.63263 6.27419 9.53714 6.09427C10.4416 5.91436 11.3792 6.0067 12.2312 6.35961C13.0832 6.71253 13.8115 7.31018 14.3238 8.07698C14.8362 8.84378 15.1096 9.74529 15.1096 10.6675C15.1083 11.9037 14.6165 13.089 13.7424 13.9631C12.8682 14.8373 11.683 15.329 10.4468 15.3303Z"
            fill="white"
        />
    </svg>

    const handleChatWithAgent = async () => {
        if (!loginData) {
            setOpenLoanModal(true);
        } else {
            setEndUserChatOpen(true)
            // try {
            //     const userId = propertyData?.user_id || userOfProperty?.user?.id;
            //     const chatData = {
            //         userId,
            //         userName: userOfProperty?.user?.id === userOfProperty?.agency?.agency_id
            //             ? userOfProperty?.agency?.ceo_full_name
            //             : userOfProperty?.user?.name,
            //         userImage: userOfProperty?.user?.id === userOfProperty?.agency?.agency_id
            //             ? userOfProperty?.agency?.ceo_image
            //             : userOfProperty?.user?.image,
            //         propertyPrice: propertyData?.price,
            //         propertyLocation: propertyData?.location?.name,
            //         propertyCity: propertyData?.city,
            //         propertyImage: (() => {
            //             const img = propertyData?.property_images?.[0];
            //             return typeof img === 'string' ? img : (img?.image || img?.url || null);
            //         })(),
            //         propertyTitle: propertyData?.title || propertyData?.property_title || propertyData?.property_name,
            //         propertySlug: slug
            //     };
            //     const storageKey = `chat_${userId}_${slug}`;
            //     localStorage.setItem(storageKey, JSON.stringify(chatData));
            //     navigate(`/${loginData?.data?.role}-portal/chat/${userId}/${slug}`);
            // } catch (error) {
            //     console.error("Error storing chat data:", error);
            //     navigate(`/${loginData?.data?.role}-portal/chat/${propertyData?.user_id}/${slug}`);
            // }
        }
    }
    return (
        <>
            <div className='row m-0 w-100 pt-lg-2'> 
                <Suspense fallback={<></>}>
                    <Rsbuttons propertyData={propertyData} handleOpen={handleOpen1} radio={true} whatsapp={propertyData?.contact?.length ? propertyData?.contact[0] : ""} whatsappPrefillText={propertyWhatsappPrefill} />
                </Suspense>
                <div className='detail-lis px-0 d-lg-flex align-items-center justify-content-between d-none' style={{ marginBottom: "15px" }}>
                    <Suspense fallback={<></>}>
                        <BreadCrumb items={breadcrumbItems} paths={["/", `/properties?property_type_id=${propertyData?.property_type_slug === 'sell' ? 1 : propertyData?.property_type_slug === 'rent' ? 2 : propertyData?.property_type_slug === 'lease' ? 3 : 0

                            }&city_code=${propertyData?.city_app_code}`, `/properties?property_type_id=${propertyData?.property_type_slug === 'sell' ? 1 : propertyData?.property_type_slug === 'rent' ? 2 : propertyData?.property_type_slug === 'lease' ? 3 : 0

                            }&city_code=${propertyData?.city_app_code}&location_id[]=${propertyData?.location?.id}`]} />
                    </Suspense>
                    {
                        backtoSearchContentState && (
                            <div className="mt-2 d-md-flex d-none backButton" onClick={() => navigate(`/properties${backtoSearchContentState?.search}`)} style={{ cursor: "pointer", width: '120px', justifyContent: 'center', alignItems: 'center', whiteSpace: 'nowrap' }}>
                                {/* <PrimaryButton onFunction={() => navigate(`/properties${backtoSearchContentState?.search}`)} widthSize={'fit-content'} height={"28px"} whiteSpace={'nowrap'} text="Back to Search" icon={SearchIcon} /> */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M7.99967 12.6667L3.33301 8L7.99967 3.33333" stroke="#4A5565" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12.6663 8H3.33301" stroke="#4A5565" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Back to Search
                            </div>
                        )
                    }
                </div>
            </div>
            <div className='detail-heading d-sm-inline d-none'>
                <div className="title-box pt-lg-0 pt-3" style={{ borderBottom: "0.5px solid #BBB", paddingBottom: '8px', marginBottom: '12px' }}>
                    <h1
                        ref={titleRef}
                        className=''
                        style={!titleExpanded ? {
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        } : undefined}
                    >
                        {propertyData?.title}
                    </h1>
                    {(isTitleClamped || titleExpanded) && (
                        <div
                            className="show-button"
                            onClick={() => setTitleExpanded((prev) => !prev)}
                            onKeyDown={(e) => e.key === 'Enter' && setTitleExpanded((prev) => !prev)}
                            role="button"
                            tabIndex={0}
                        >
                            {titleExpanded ? 'Show less' : 'Show more'}
                            <svg
                                style={{
                                    marginTop: '2px',
                                    transform: titleExpanded ? 'rotate(180deg)' : 'none',
                                    transition: 'transform 0.2s ease',
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                width="10"
                                height="6"
                                viewBox="0 0 10 6"
                                fill="none"
                            >
                                <path d="M0.666992 0.666687L4.66699 4.66669L8.66699 0.666687" stroke="#737678" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className='detail-p row' style={{ marginBottom: '8px' }}>
                   <div className="col-9">
                   <p style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: '0' }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="19" viewBox="0 0 16 19" fill="none">
                        <path d="M16 8.00054C16.0029 9.05139 15.7973 10.0924 15.3952 11.0633C14.993 12.0341 14.4023 12.9155 13.6571 13.6565L9.63998 17.5857C9.20022 18.0114 8.6121 18.2495 7.99999 18.2495C7.38787 18.2495 6.79975 18.0114 6.35999 17.5857L2.352 13.6657C1.41988 12.7365 0.731415 11.5916 0.347642 10.3327C-0.0361305 9.0737 -0.103358 7.7395 0.151919 6.44834C0.407197 5.15717 0.977094 3.94894 1.81109 2.93074C2.64508 1.91254 3.7174 1.11584 4.933 0.611255C6.14859 0.106675 7.46991 -0.0901951 8.7798 0.0380992C10.0897 0.166393 11.3477 0.615889 12.4423 1.34674C13.5369 2.07758 14.4342 3.0672 15.0548 4.22787C15.6754 5.38853 16.0001 6.68438 16 8.00054ZM13.7143 8.00054C13.7143 7.06085 13.4825 6.13566 13.0396 5.30691C12.5967 4.47817 11.9562 3.77145 11.1749 3.24935C10.3936 2.72726 9.49557 2.4059 8.56041 2.31374C7.62525 2.22158 6.6818 2.36146 5.81361 2.721C4.94542 3.08054 4.1793 3.64864 3.58311 4.37498C2.98691 5.10132 2.57904 5.96347 2.39562 6.88509C2.2122 7.8067 2.2589 8.75933 2.53157 9.65859C2.80424 10.5578 3.29448 11.376 3.95885 12.0405L7.95884 15.9514L12.0503 12.0314C12.5801 11.5027 13 10.8743 13.2856 10.1825C13.5712 9.4906 13.7169 8.74902 13.7143 8.00054ZM11.4286 7.99254C11.4286 8.67064 11.2275 9.33352 10.8507 9.89735C10.474 10.4612 9.93853 10.9006 9.31204 11.1601C8.68555 11.4196 7.99618 11.4875 7.33111 11.3552C6.66603 11.2229 6.05512 10.8964 5.57562 10.4169C5.09613 9.93741 4.76959 9.32649 4.6373 8.66142C4.50501 7.99634 4.5729 7.30697 4.8324 6.68048C5.0919 6.05399 5.53135 5.51853 6.09518 5.14179C6.659 4.76506 7.32188 4.56397 7.99999 4.56397C8.9093 4.56397 9.78137 4.9252 10.4243 5.56818C11.0673 6.21116 11.4286 7.08323 11.4286 7.99254Z" fill="#737678" />
                    </svg>{propertyData?.location?.name}, {propertyData?.city}</p>
                   </div>
                   <div className="col-3"> <div style={{ display: "flex", gap: "10px", alignItems: "center" }} className='detail-icon'>
                        <div className="new-button-design" onClick={() => handleChatWithAgent()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M4.60033 12.0053C5.87271 12.658 7.33638 12.8348 8.72758 12.5038C10.1188 12.1728 11.346 11.3558 12.1882 10.2C13.0303 9.04428 13.4319 7.62573 13.3207 6.20003C13.2095 4.77434 12.5927 3.43524 11.5815 2.42405C10.5703 1.41287 9.23125 0.796094 7.80555 0.684871C6.37985 0.573647 4.96131 0.975291 3.80554 1.81742C2.64977 2.65956 1.83279 3.8868 1.50181 5.278C1.17083 6.6692 1.34762 8.13288 2.00033 9.40526L0.666992 13.3386L4.60033 12.0053Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="button-text">Chat with Agent</span>
                        </div>
                        <div className="icon-hover-box new-icon-hover-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="tooltip">Share</div>
                            <span style={{ marginRight: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Suspense fallback={<></>}>
                                    <ShareModal icon={true} />
                                </Suspense>
                            </span>
                        </div>


                        {/* Save SVG icon with tooltip */}
                        <div className={`icon-hover-box new-icon-hover-box ${(propertyData?.is_liked || isLikedProperties?.includes(propertyData?.id ?? propertyData?.property_id)) ? 'save-icon-liked' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="tooltip">Save</div>
                            <span style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleLikeWithSnackbar(propertyData?.id ?? propertyData?.property_id)}>
                                {propertyData?.is_liked || isLikedProperties?.includes(propertyData?.id ?? propertyData?.property_id) ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ display: 'block' }}>
                                        <path d="M15.8337 11.6666C17.0753 10.4499 18.3337 8.99161 18.3337 7.08327C18.3337 5.8677 17.8508 4.70191 16.9912 3.84237C16.1317 2.98282 14.9659 2.49994 13.7503 2.49994C12.2837 2.49994 11.2503 2.91661 10.0003 4.16661C8.75033 2.91661 7.71699 2.49994 6.25033 2.49994C5.03475 2.49994 3.86896 2.98282 3.00942 3.84237C2.14988 4.70191 1.66699 5.8677 1.66699 7.08327C1.66699 8.99994 2.91699 10.4583 4.16699 11.6666L10.0003 17.4999L15.8337 11.6666Z" fill="#C94444" stroke="#8E8E8E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ display: 'block' }}>
                                        <path d="M15.8337 11.6666C17.0753 10.4499 18.3337 8.99161 18.3337 7.08327C18.3337 5.8677 17.8508 4.70191 16.9912 3.84237C16.1317 2.98282 14.9659 2.49994 13.7503 2.49994C12.2837 2.49994 11.2503 2.91661 10.0003 4.16661C8.75033 2.91661 7.71699 2.49994 6.25033 2.49994C5.03475 2.49994 3.86896 2.98282 3.00942 3.84237C2.14988 4.70191 1.66699 5.8677 1.66699 7.08327C1.66699 8.99994 2.91699 10.4583 4.16699 11.6666L10.0003 17.4999L15.8337 11.6666Z" stroke="#2D2D2D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </span>
                        </div>
                    </div></div>
                </div>
            </div>
            <div className='row detail-code m-0'>
                <div className="detail-code-box pb-lg-5 pb-3 px-0" ref={sectionRef}>
                    <div className={`row ${window?.innerWidth <= 992 ? "m-0" : ""}`}>
                        <div className='col-lg-9 col-md-12 ps-0 pe-xl-3 pe-lg-2 ps-lg-3 px-0'>
                            <div className="detail-code-scroll-side">
                                <Suspense fallback={<SpinerLoading />}>
                                    <div style={{ background: "lightgray" }} className='detial-imges pe-0' onClick={handleOpen} >
                                        {
                                            propertyData?.property_images?.length > 0 ?
                                                <Slider ref={sliderRef} {...settings}>
                                                    {propertyData?.property_images?.map((imgUrl, index) => (
                                                        <div key={index}>
                                                            <FallbackImage src={imgUrl?.url} alt={`img-${index}`} style={{ objectFit: "cover", height: "460px" }} className="img-fluid w-100" pageName="PropertyDetail" />
                                                        </div>
                                                    ))}
                                                </Slider> :
                                                <FallbackImage src={defaultImage} alt="" style={{ objectFit: "cover", height: "100%" }} className="img-fluid w-100" pageName="PropertyDetail" />
                                        }
                                        {
                                            propertyData?.property_images?.length > 1 &&
                                            <div className="arrow-box">
                                                <div className="arrow arrow-left" onClick={(e) => { sliderRef.current?.slickPrev(); e.stopPropagation(); }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M10.5999 12.7098C10.5061 12.6169 10.4317 12.5063 10.381 12.3844C10.3302 12.2625 10.3041 12.1318 10.3041 11.9998C10.3041 11.8678 10.3302 11.7371 10.381 11.6152C10.4317 11.4934 10.5061 11.3828 10.5999 11.2898L15.1899 6.70982C15.2836 6.61685 15.358 6.50625 15.4088 6.38439C15.4595 6.26253 15.4857 6.13183 15.4857 5.99982C15.4857 5.8678 15.4595 5.7371 15.4088 5.61524C15.358 5.49338 15.2836 5.38278 15.1899 5.28982C15.0025 5.10356 14.749 4.99902 14.4849 4.99902C14.2207 4.99902 13.9672 5.10356 13.7799 5.28982L9.18986 9.87982C8.62806 10.4423 8.3125 11.2048 8.3125 11.9998C8.3125 12.7948 8.62806 13.5573 9.18986 14.1198L13.7799 18.7098C13.9661 18.8946 14.2175 18.9987 14.4799 18.9998C14.6115 19.0006 14.7419 18.9754 14.8638 18.9256C14.9856 18.8758 15.0964 18.8025 15.1899 18.7098C15.2836 18.6169 15.358 18.5063 15.4088 18.3844C15.4595 18.2625 15.4857 18.1318 15.4857 17.9998C15.4857 17.8678 15.4595 17.7371 15.4088 17.6152C15.358 17.4934 15.2836 17.3828 15.1899 17.2898L10.5999 12.7098Z" fill="white" />
                                                    </svg>
                                                </div>
                                                <div className="arrow arrow-right" onClick={(e) => { sliderRef.current?.slickNext(); e.stopPropagation(); }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M15.3993 9.87982L10.8093 5.28982C10.622 5.10356 10.3685 4.99902 10.1043 4.99902C9.84013 4.99902 9.58668 5.10356 9.39931 5.28982C9.30559 5.38278 9.23119 5.49338 9.18042 5.61524C9.12965 5.7371 9.10352 5.8678 9.10352 5.99982C9.10352 6.13183 9.12965 6.26253 9.18042 6.38439C9.23119 6.50625 9.30559 6.61685 9.39931 6.70982L13.9993 11.2898C14.093 11.3828 14.1674 11.4934 14.2182 11.6152C14.269 11.7371 14.2951 11.8678 14.2951 11.9998C14.2951 12.1318 14.269 12.2625 14.2182 12.3844C14.1674 12.5063 14.093 12.6169 13.9993 12.7098L9.39931 17.2898C9.21101 17.4768 9.1047 17.7309 9.10376 17.9963C9.10282 18.2616 9.20734 18.5165 9.39431 18.7048C9.58129 18.8931 9.83541 18.9994 10.1008 19.0004C10.3661 19.0013 10.621 18.8968 10.8093 18.7098L15.3993 14.1198C15.9611 13.5573 16.2767 12.7948 16.2767 11.9998C16.2767 11.2048 15.9611 10.4423 15.3993 9.87982Z" fill="white" />
                                                    </svg>
                                                </div>
                                            </div>
                                        }
                                        <div className='img-icons'>
                                            <div style={{ marginRight: '8px' }} className='icon-box'>
                                                <span><svg style={{ marginRight: '5px' }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                    <g clipPath="url(#clip0_2381_150511)">
                                                        <path d="M9.5 0H2.5C1.8372 0.000793929 1.20178 0.264441 0.73311 0.73311C0.264441 1.20178 0.000793929 1.8372 0 2.5L0 9.5C0.000793929 10.1628 0.264441 10.7982 0.73311 11.2669C1.20178 11.7356 1.8372 11.9992 2.5 12H9.5C10.1628 11.9992 10.7982 11.7356 11.2669 11.2669C11.7356 10.7982 11.9992 10.1628 12 9.5V2.5C11.9992 1.8372 11.7356 1.20178 11.2669 0.73311C10.7982 0.264441 10.1628 0.000793929 9.5 0V0ZM2.5 1H9.5C9.89782 1 10.2794 1.15804 10.5607 1.43934C10.842 1.72064 11 2.10218 11 2.5V9.5C10.9991 9.72274 10.9479 9.9424 10.85 10.1425L6.2685 5.561C6.03635 5.32878 5.76072 5.14458 5.45736 5.0189C5.154 4.89322 4.82886 4.82853 4.5005 4.82853C4.17214 4.82853 3.847 4.89322 3.54364 5.0189C3.24028 5.14458 2.96466 5.32878 2.7325 5.561L1 7.293V2.5C1 2.10218 1.15804 1.72064 1.43934 1.43934C1.72064 1.15804 2.10218 1 2.5 1ZM2.5 11C2.10218 11 1.72064 10.842 1.43934 10.5607C1.15804 10.2794 1 9.89782 1 9.5V8.707L3.439 6.268C3.5783 6.12861 3.7437 6.01804 3.92575 5.94259C4.1078 5.86715 4.30294 5.82832 4.5 5.82832C4.69706 5.82832 4.8922 5.86715 5.07425 5.94259C5.2563 6.01804 5.4217 6.12861 5.561 6.268L10.1425 10.85C9.9424 10.9479 9.72274 10.9991 9.5 11H2.5Z" fill="white" />
                                                        <path d="M8 5.25C8.34612 5.25 8.68446 5.14737 8.97225 4.95507C9.26003 4.76278 9.48434 4.48947 9.61679 4.1697C9.74924 3.84993 9.7839 3.49806 9.71637 3.15859C9.64885 2.81913 9.48218 2.50731 9.23744 2.26256C8.9927 2.01782 8.68087 1.85115 8.34141 1.78363C8.00194 1.7161 7.65007 1.75076 7.3303 1.88321C7.01053 2.01566 6.73722 2.23997 6.54493 2.52775C6.35264 2.81554 6.25 3.15388 6.25 3.5C6.25 3.96413 6.43437 4.40925 6.76256 4.73744C7.09075 5.06563 7.53587 5.25 8 5.25ZM8 2.75C8.14834 2.75 8.29334 2.79399 8.41668 2.8764C8.54001 2.95881 8.63614 3.07594 8.69291 3.21299C8.74968 3.35003 8.76453 3.50083 8.73559 3.64632C8.70665 3.7918 8.63522 3.92544 8.53033 4.03033C8.42544 4.13522 8.2918 4.20665 8.14632 4.23559C8.00083 4.26453 7.85003 4.24968 7.71299 4.19291C7.57594 4.13614 7.45881 4.04002 7.3764 3.91668C7.29399 3.79334 7.25 3.64834 7.25 3.5C7.25 3.30109 7.32902 3.11032 7.46967 2.96967C7.61032 2.82902 7.80109 2.75 8 2.75Z" fill="white" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_2381_150511">
                                                            <rect width="12" height="12" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>{propertyData?.property_images?.length}</span>
                                            </div>
                                            {propertyData?.video_links?.length > 0 && <div style={{ marginRight: '8px' }} className='icon-box'>
                                                <span><svg style={{ marginRight: '5px' }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                    <g clipPath="url(#clip0_2381_150517)">
                                                        <path d="M11.45 4.47752C11.1123 4.30637 10.7066 4.34205 10.404 4.56951L9.4875 5.25002C9.35756 3.97333 8.28328 3.00163 7.00001 3.00002H6.95752L4.89652 0.939507C4.61604 0.657062 4.23408 0.498765 3.83602 0.500007H0.499992C0.223852 0.500007 0 0.723882 0 1.00002C0 1.27616 0.223852 1.50002 0.499992 1.50002H3.83599C3.96853 1.50037 4.09556 1.55301 4.1895 1.64652L5.54299 3.00002H2.50001C1.11998 3.00168 0.00166406 4.12 0 5.50002V9.50003C0.00166406 10.88 1.11998 11.9984 2.50001 12H7.00001C8.2833 11.9984 9.35756 11.0267 9.4875 9.75002L10.4025 10.432C10.8443 10.7634 11.4711 10.6739 11.8025 10.232C11.9323 10.0589 12.0025 9.84841 12.0025 9.63203V5.37152C12.0038 4.99255 11.7895 4.64584 11.45 4.47752ZM8.50001 9.50001C8.50001 10.3284 7.82843 11 7.00001 11H2.50001C1.67159 11 1.00001 10.3284 1.00001 9.50001V5.50002C1.00001 4.6716 1.67159 4.00002 2.50001 4.00002H7.00001C7.82843 4.00002 8.50001 4.6716 8.50001 5.50002V9.50001ZM11 9.62852L9.49999 8.51052V6.48953L11 5.37154V9.62852Z" fill="white" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_2381_150517">
                                                            <rect width="12" height="12" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>{propertyData?.video_links?.length}</span>
                                            </div>}
                                            <div className='icon-box'>
                                                <span><svg style={{ marginRight: '5px', marginLeft: '5px' }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                    <g clipPath="url(#clip0_2381_150523)">
                                                        <path d="M6 3C5.60444 3 5.21776 3.1173 4.88886 3.33706C4.55996 3.55682 4.30362 3.86918 4.15224 4.23463C4.00087 4.60009 3.96126 5.00222 4.03843 5.39018C4.1156 5.77814 4.30608 6.13451 4.58579 6.41421C4.86549 6.69392 5.22186 6.8844 5.60982 6.96157C5.99778 7.03874 6.39992 6.99913 6.76537 6.84776C7.13082 6.69638 7.44318 6.44004 7.66294 6.11114C7.8827 5.78224 8 5.39556 8 5C8 4.46957 7.78929 3.96086 7.41421 3.58579C7.03914 3.21071 6.53043 3 6 3ZM6 6C5.80222 6 5.60888 5.94135 5.44443 5.83147C5.27998 5.72159 5.15181 5.56541 5.07612 5.38268C5.00043 5.19996 4.98063 4.99889 5.01922 4.80491C5.0578 4.61093 5.15304 4.43275 5.29289 4.29289C5.43275 4.15304 5.61093 4.0578 5.80491 4.01921C5.99889 3.98063 6.19996 4.00043 6.38268 4.07612C6.56541 4.15181 6.72159 4.27998 6.83147 4.44443C6.94135 4.60888 7 4.80222 7 5C7 5.26522 6.89464 5.51957 6.70711 5.70711C6.51957 5.89464 6.26522 6 6 6Z" fill="white" />
                                                        <path d="M6.00016 12C5.57913 12.0022 5.16371 11.9034 4.78869 11.712C4.41367 11.5207 4.08995 11.2422 3.84466 10.9C1.93916 8.27152 0.972656 6.29552 0.972656 5.02652C0.972656 3.69315 1.50234 2.41438 2.44518 1.47154C3.38802 0.528705 4.66678 -0.000976562 6.00016 -0.000976562C7.33353 -0.000976562 8.6123 0.528705 9.55514 1.47154C10.498 2.41438 11.0277 3.69315 11.0277 5.02652C11.0277 6.29552 10.0612 8.27152 8.15566 10.9C7.91036 11.2422 7.58665 11.5207 7.21162 11.712C6.8366 11.9034 6.42118 12.0022 6.00016 12ZM6.00016 1.09052C4.95636 1.09171 3.95566 1.50689 3.21759 2.24496C2.47952 2.98303 2.06435 3.98373 2.06316 5.02752C2.06316 6.03252 3.00966 7.89102 4.72766 10.2605C4.8735 10.4614 5.06484 10.6249 5.28601 10.7377C5.50718 10.8504 5.75191 10.9092 6.00016 10.9092C6.24841 10.9092 6.49313 10.8504 6.7143 10.7377C6.93547 10.6249 7.12681 10.4614 7.27266 10.2605C8.99066 7.89102 9.93716 6.03252 9.93716 5.02752C9.93597 3.98373 9.52079 2.98303 8.78272 2.24496C8.04465 1.50689 7.04395 1.09171 6.00016 1.09052Z" fill="white" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_2381_150523">
                                                            <rect width="12" height="12" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg></span>
                                            </div>
                                        </div>
                                    </div>

                                </Suspense>

                                <div className='px-sm-0 px-2 mx-sm-0 mx-2'>
                                    <Suspense fallback={<SpinerLoading />}>
                                        <Detail propertyData={propertyData} />
                                    </Suspense>
                                </div>

                                <div>
                                    {aminitiesWithCategory?.some(a => a.data && a.data.length > 0) && (
                                        <Suspense fallback={<></>}>
                                            <Amenities profileData={{ amenities: aminitiesWithCategory }} />
                                        </Suspense>
                                    )}
                                </div>
                                <div className='mb-4 px-sm-0 mx-sm-0 px-2 mx-2'>
                                    <Suspense fallback={<></>}>
                                        <Maps profileData={propertyData} />
                                    </Suspense>
                                </div>
                                {propertyData?.property_type_slug !== "rent" && <div className='mb-3 px-sm-0 mx-sm-0 px-2 mx-2'>
                                    <Suspense fallback={<></>}>
                                        <Finance propertyPrice={propertyData?.price} />
                                    </Suspense>
                                </div>}
                                <div className='col-12'>
                                    <div className='property-detail-lower-chages d-block d-lg-none px-sm-0 px-2 mx-sm-0 mx-2'>
                                        <div className="finance-h d-sm-none d-block">
                                            <h3 className='mb-3'>Property by</h3>
                                        </div>
                                        <div className="agent-card">
                                            <div className="upper-detail-section">
                                                <div className="img-upe-section">
                                                    {userOfProperty?.user?.id === userOfProperty?.agency?.agency_id ?
                                                        <Link to={`/agent-profile/${userOfProperty?.agency?.agency_id}/${userOfProperty?.agency?.agency_profile?.ceo_username || ''}`}>
                                                            <FallbackImage className='agent-avatar' src={userOfProperty?.agency?.agency_profile?.ceo_image} alt="profile" pageName="AgentDefault" />
                                                        </Link> :
                                                        <Link to={`/agent-profile/${userOfProperty?.user?.id}/${userOfProperty?.user?.name || ''}`}>
                                                            <FallbackImage className='agent-avatar' src={userOfProperty?.user?.image} alt="profile" pageName="AgentDefault" />
                                                        </Link>}
                                                    <span>
                                                        <FallbackImage src={img7} alt='.../' pageName="PropertyDetail" />
                                                    </span>
                                                </div>

                                                <div className="upper-heading-section">
                                                    {userOfProperty?.user?.id === userOfProperty?.agency?.agency_id ?
                                                        <h4>{userOfProperty?.agency?.ceo_full_name}</h4> :
                                                        <h4>{userOfProperty?.user?.name}</h4>}

                                                    <div className="rating-row">
                                                        <span className="star">
                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                <path
                                                                    d="M7.683 1.53c.03-.06.075-.108.131-.142A.334.334 0 0 1 8 1.333c.066 0 .13.018.186.054.056.035.1.083.13.143l1.54 3.119c.101.205.25.383.436.518.185.135.4.222.626.256l3.444.504c.172.025.3.156.333.326a.47.47 0 0 1-.091.369l-2.49 2.426a1.28 1.28 0 0 0-.357.98l.588 3.427a.34.34 0 0 1-.48.366l-3.078-1.62a1.56 1.56 0 0 0-1.316 0l-3.078 1.62a.34.34 0 0 1-.48-.366l.588-3.426a1.28 1.28 0 0 0-.357-.98L1.44 6.53a.47.47 0 0 1-.091-.369.39.39 0 0 1 .333-.326l3.443-.504c.226-.034.441-.121.626-.256.185-.135.335-.313.436-.518L7.683 1.53Z"
                                                                    fill="#FFB900"
                                                                    stroke="#FFB900"
                                                                    strokeWidth="1.333"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </span>
                                                        <span className="rating-value">{parseInt(userOfProperty?.user?.average_rating).toFixed(1) || 5}</span>
                                                        <span className="rating-count">{userOfProperty?.user?.ratings_count} Ratings</span>
                                                    </div>

                                                    <div className="view-profile" type="button"
                                                        onClick={() => navigate(`/agent-profile/${userOfProperty?.user?.id}/${userOfProperty?.user?.username}`)}>View Profile</div>
                                                </div>
                                            </div>

                                            {/* middle: agency card */}
                                            {propertyData?.user?.agency && <div className="agency-card" style={{ paddingTop: propertyData?.agency?.package_name ? '28px' : '0px' }} >
                                                {
                                                    propertyData?.agency?.package_name == "Bronze" && <div className="platinum-tag">
                                                        <Suspense fallback={<></>}>
                                                            <AgencyTag width={'fit-content'} bottom={"0px"} left={"0px"} backColor={" var(--Tags-Gold, linear-gradient(90deg, #804A00 0%, #91631B 34.26%, #9F7C3D 75%, #B08D57 100%))"} text={propertyData?.agency?.package_name} leftArrow={true} rightArrow={true} noTag={true} />
                                                        </Suspense>
                                                    </div>
                                                }
                                                {
                                                    propertyData?.agency?.package_name === "Gold" && <div className="platinum-tag">
                                                        <Suspense fallback={<></>}>
                                                            <AgencyTag width={'fit-content'} bottom={"0px"} left={"0px"} to backColor={` var(--Tags-Gold, linear-gradient(90deg, #AE8626 0%, #F7EF8A 28.16%, #D1AC49 63.01%, #ECCA68 100%))`} text={propertyData?.agency?.package_name} leftArrow={true} rightArrow={true} noTag={true} />
                                                        </Suspense>
                                                    </div>
                                                }
                                                {
                                                    propertyData?.agency?.package_name === "Platinum" &&
                                                    <div className="platinum-tag">
                                                        <Suspense fallback={<></>}>
                                                            <AgencyTag width={'fit-content'} bottom={"0px"} left={"0px"} backColor={` linear-gradient(90deg, #E5E4E2 0%, #9D9D9D 25%, #B7B6B3 50%, #9D9D9D 75%, #E5E4E2 100%)`} text={propertyData?.agency?.package_name} leftArrow={true} rightArrow={true} noTag={true} />
                                                        </Suspense>
                                                    </div>
                                                }
                                                <div className="agency-logo-box" onClick={() => navigate(`/agency-detail/${propertyData?.user?.agency?.agency_profile?.id}`)}>
                                                    <div className="agency-logo" style={{ marginBottom: propertyData?.user?.agency?.agency_profile?.is_featured ? '24px' : '' }}>
                                                        <FallbackImage src={propertyData?.user?.agency?.agency_profile?.agency_image || img6} alt={propertyData?.user?.agency?.name} pageName="AgencyDefault" />
                                                    </div>
                                                    {
                                                        propertyData?.user?.agency?.agency_profile?.is_featured && <div className="featured-tag">
                                                            <Image className='featured-tag-img' src={featuredTag} alt="featured" />
                                                        </div>
                                                    }
                                                </div>
                                                <h3>{propertyData?.user?.agency?.agency_profile?.agency_name || propertyData?.user?.agency?.name}</h3>
                                                <p className="agency-role">Real Estate Agent</p>
                                            </div>}

                                            {/* bottom note */}
                                            <div className="respond-note">
                                                <h6>Usually responds</h6>
                                                <h5>within 2 hours</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {propertyData?.property_type_slug === "rent" && <div className='px-sm-0 px-2 mx-sm-0 mx-2'>
                                    <Suspense fallback={<></>}>
                                        <Agreement propertyPrice={propertyData?.price} />
                                    </Suspense>
                                </div>}
                                <div className='mb-4 mt-3 px-sm-0 px-2 mx-sm-0 mx-2'>
                                    <Suspense fallback={<></>}>
                                        <Searched propertyData={propertyData} mostSearchs={mostSearchs} />
                                    </Suspense>
                                </div>
                                {/* <div className=''>
                                    <Marketing />
                                </div> */}

                                <div className=' mt-3 px-sm-0 px-2 mx-sm-0 mx-2'>
                                    <Suspense fallback={<></>}>
                                        <SimilerProperty similarPropertyData={simlerProperties?.similar_properties_by_vendors} areaPropertyData={simlerProperties?.similar_properties_by_area} propertyData={propertyData} />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-3 col-md-6 px-0 px-xl-3 px-lg-2'>
                            <div className="detail-code-sticky-side">
                                <div className="special-box">
                                    <div className='property-detail-changes-sectoin'>
                                        <div className='detail-chanes-icons'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M6 22V4C6 3.46957 6.21071 2.96086 6.58579 2.58579C6.96086 2.21071 7.46957 2 8 2H16C16.5304 2 17.0391 2.21071 17.4142 2.58579C17.7893 2.96086 18 3.46957 18 4V22H6Z" stroke="#447158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M6 12H4C3.46957 12 2.96086 12.2107 2.58579 12.5858C2.21071 12.9609 2 13.4696 2 14V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H6" stroke="#447158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M18 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H18" stroke="#447158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M10 6H14" stroke="#447158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M10 10H14" stroke="#447158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M10 14H14" stroke="#447158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M10 18H14" stroke="#447158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <h5>Get in Touch</h5>
                                        <h6>We'll respond within 2 hours</h6>
                                    </div>
                                    <form className="contact-form" onSubmit={handleSubmit}>
                                        <div className='property-up-img'><FallbackImage src={watermark1} pageName="PropertyDetail" /></div>
                                        <div className='property-center-img'><FallbackImage src={watermark2} pageName="PropertyDetail" /></div>
                                        <div className='property-last-img'><FallbackImage src={watermark3} pageName="PropertyDetail" /></div>
                                        <div className="button-group">
                                            <button onClick={handleOpen1} type="button" className="call-btn"><span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                                                <g clipPath="url(#clip0_2399_52345)">
                                                    <path d="M13.989 1.67992V4.01325C13.989 4.16796 13.9275 4.31633 13.8181 4.42573C13.7087 4.53512 13.5603 4.59658 13.4056 4.59658C13.2509 4.59658 13.1025 4.53512 12.9931 4.42573C12.8838 4.31633 12.8223 4.16796 12.8223 4.01325V2.51817L9.73063 5.5935C9.62032 5.69949 9.47279 5.7579 9.31982 5.75616C9.16685 5.75441 9.02069 5.69265 8.91283 5.58417C8.80496 5.4757 8.74403 5.32919 8.74315 5.17621C8.74227 5.02324 8.80152 4.87604 8.90813 4.76633L12.0115 1.67992H10.489C10.3343 1.67992 10.1859 1.61846 10.0765 1.50906C9.96709 1.39966 9.90563 1.25129 9.90563 1.09658C9.90563 0.941872 9.96709 0.793499 10.0765 0.684103C10.1859 0.574707 10.3343 0.513249 10.489 0.513249H12.8223C13.1317 0.513249 13.4285 0.636165 13.6473 0.854957C13.866 1.07375 13.989 1.3705 13.989 1.67992ZM13.461 10.2777C13.7991 10.6166 13.9889 11.0758 13.9889 11.5546C13.9889 12.0333 13.7991 12.4925 13.461 12.8315L12.929 13.444C8.15096 18.0162 -3.47429 6.39442 1.02904 1.60233L1.69929 1.019C2.03885 0.690448 2.49399 0.508617 2.96646 0.512765C3.43893 0.516912 3.89081 0.706705 4.22454 1.04117C4.24204 1.05925 5.32296 2.46392 5.32296 2.46392C5.6436 2.80076 5.82214 3.24819 5.82149 3.71324C5.82084 4.17829 5.64104 4.62522 5.31946 4.96117L4.64338 5.81108C5.01721 6.7194 5.56683 7.54489 6.26067 8.24014C6.95452 8.93538 7.7789 9.48667 8.68646 9.86233L9.54104 9.18275C9.87696 8.86134 10.3238 8.68165 10.7887 8.681C11.2536 8.68035 11.7009 8.85878 12.0377 9.17925C12.0377 9.17925 13.443 10.2602 13.461 10.2777ZM12.659 11.1258C12.659 11.1258 11.263 10.0513 11.245 10.0338C11.1248 9.91468 10.9624 9.84782 10.7932 9.84782C10.6239 9.84782 10.4616 9.91468 10.3414 10.0338C10.3256 10.049 9.14904 10.987 9.14904 10.987C9.06976 11.0501 8.97539 11.0915 8.87525 11.107C8.77512 11.1226 8.67265 11.1118 8.57796 11.0757C7.4015 10.6382 6.33293 9.9527 5.44479 9.06577C4.55665 8.17883 3.86972 7.1112 3.43063 5.93533C3.39221 5.83973 3.37981 5.73567 3.39466 5.63372C3.40952 5.53177 3.45111 5.43557 3.51521 5.35492C3.51521 5.35492 4.45263 4.17833 4.46838 4.16258C4.58753 4.04241 4.65439 3.88002 4.65439 3.71079C4.65439 3.54156 4.58753 3.37917 4.46838 3.259C4.45088 3.2415 3.37638 1.845 3.37638 1.845C3.25448 1.73555 3.09533 1.67688 2.93155 1.681C2.76778 1.68512 2.61179 1.75173 2.49554 1.86717L1.82529 2.4505C-1.46704 6.40667 8.60888 15.9243 12.0756 12.6483L12.6076 12.0358C12.7331 11.9207 12.8086 11.7612 12.8182 11.5913C12.8278 11.4213 12.7706 11.2543 12.659 11.1258Z" fill="#698B75" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_2399_52345">
                                                        <rect width="14" height="14" fill="white" transform="translate(0 0.5)" />
                                                    </clipPath>
                                                </defs>
                                            </svg></span> Call</button>
                                            <button onClick={async () => {
                                                let result = await properyEnquery({
                                                    email: "enquiry@pakistanproperty.com",
                                                    name: "Enquiry",
                                                    contact_number: "+923001234567",
                                                    message: "Chat from property detail page",
                                                    property_id: propertyData?.property_id,
                                                    type: "buyer/tenant",
                                                    inquiry_type: 'whatsapp',
                                                });
                                                if (result?.success) {
                                                   await sendUserLog?.('whatsapp', {
                                                        currentPropertyId: propertyData?.property_id,
                                                        propertySlug: parms?.slug,
                                                        contact: propertyData?.contact?.[0] || "+92" + data?.phone,
                                                        email: "enquiry@pakistanproperty.com",
                                                        inquiry_id: result?.data?.data?.inquiry_id ?? null
                                                   });
                                                }
                                                handleOpenWhatsapp(propertyData?.contact[0], propertyWhatsappPrefill)
                                                whatsappImpretion("whatsapp", parms?.slug)
                                            }} type="button" className="whatsapp-btn"><span><svg xmlns="http://www.w3.org/2000/svg" width="25" height="30" viewBox="0 0 25 25" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.4977 4.5C8.08742 4.5 4.5 8.08842 4.5 12.4999C4.5 14.2495 5.06421 15.872 6.02334 17.189L5.02653 20.1613L8.10148 19.1785C9.3662 20.0157 10.8755 20.5 12.5023 20.5C16.9126 20.5 20.5 16.9114 20.5 12.5001C20.5 8.08857 16.9126 4.50013 12.5023 4.50013L12.4977 4.5ZM10.2643 8.56361C10.1092 8.19209 9.9916 8.17802 9.75659 8.16847C9.67658 8.16382 9.5874 8.15918 9.48855 8.15918C9.18282 8.15918 8.86316 8.24851 8.67035 8.44601C8.43535 8.68586 7.85227 9.24546 7.85227 10.3931C7.85227 11.5407 8.68919 12.6506 8.80198 12.8059C8.91955 12.9609 10.4336 15.3501 12.7844 16.3238C14.6228 17.0857 15.1683 17.0151 15.5867 16.9258C16.1979 16.7941 16.9643 16.3424 17.1571 15.797C17.35 15.2514 17.3499 14.7857 17.2934 14.687C17.237 14.5882 17.0818 14.5319 16.8468 14.4142C16.6118 14.2966 15.4691 13.7322 15.2528 13.657C15.0412 13.5771 14.8391 13.6053 14.6793 13.8311C14.4536 14.1462 14.2327 14.4661 14.0539 14.6588C13.9129 14.8094 13.6824 14.8282 13.4897 14.7482C13.2311 14.6401 12.5071 14.3859 11.6137 13.5911C10.9225 12.9751 10.4523 12.2086 10.316 11.9782C10.1796 11.7431 10.302 11.6065 10.41 11.4796C10.5275 11.3337 10.6403 11.2303 10.7579 11.0939C10.8755 10.9576 10.9413 10.887 11.0165 10.727C11.0966 10.5719 11.04 10.4119 10.9836 10.2943C10.9272 10.1767 10.4571 9.0291 10.2643 8.56361Z" fill="#20A853" />
                                            </svg></span> WhatsApp</button>
                                        </div>
                                        <div className='inp_box'>
                                            <input
                                                className={`${data.name ? 'focus_inp' : ''}`}
                                                onChange={(e) => {
                                                    setData({ ...data, name: e.target.value });
                                                    setErrors({ ...errors, name: '' });
                                                }}
                                                placeholder='Name'
                                                type='text'
                                                value={data.name}
                                                style={{ borderColor: errors.name ? '#C94444' : '' }}
                                            />
                                            {errors.name && <span className="error-text">{errors.name}</span>}
                                        </div>
                                        <div className='inp_box'>
                                            <input
                                                className={`${data.email ? 'focus_inp' : ''}`}
                                                onChange={(e) => {
                                                    setData({ ...data, email: e.target.value });
                                                    setErrors({ ...errors, email: '' });
                                                }}
                                                placeholder='Email'
                                                type='email'
                                                value={data.email}
                                                style={{ borderColor: errors.email ? '#C94444' : '' }}
                                            />
                                            {errors.email && <span className="error-text">{errors.email}</span>}
                                        </div>
                                        <div className={errors.phone ? 'contect_inp_box mb-0' : 'contect_inp_box'}>
                                            <div ref={callingRef} onClick={() => setShow(false)} className='flag' style={{ cursor: "not-allowed" }}>
                                                <FallbackImage src={selectedCode?.flag} alt='flag' pageName="PropertyDetail" />
                                                {selectedCode?.callingCode}
                                                <IoIosArrowDown
                                                    style={{ transform: show ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                                    className='icon'
                                                />
                                                {show && (
                                                    <div className='option_code'>
                                                        {callingCode?.map((item, index) => (
                                                            <div
                                                                key={index}
                                                                onClick={() =>
                                                                    setSelectedCode({
                                                                        flag: item.flag,
                                                                        callingCode: item.callingCode,
                                                                    })
                                                                }
                                                                className='d-flex option_value'
                                                            >
                                                                <FallbackImage src={item.flag} alt='code' pageName="PropertyDetail" />
                                                                <span>{item.callingCode}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                placeholder='**********'
                                                type='text'
                                                value={data.phone}
                                                onChange={(e) => {
                                                    setData({ ...data, phone: formatPakistaniPhoneNumber(e.target.value) });
                                                    setErrors({ ...errors, phone: '' });
                                                }}
                                                style={{ borderColor: errors.phone ? '#C94444' : '' }}
                                            />
                                        </div>
                                        {errors.phone && <span className="error-text" style={{ marginBottom: errors.phone ? '10px' : 'unset' }}>{errors.phone}</span>}

                                        <div className='inp_box'>
                                            <textarea
                                                className={`${data.message ? 'focus_inp' : ''}`}
                                                onChange={(e) => {
                                                    setData({ ...data, message: e.target.value });
                                                    setErrors({ ...errors, message: '' });
                                                }}
                                                placeholder='Message'
                                                value={data.message}
                                                style={{
                                                    borderColor: errors.message ? '#C94444' : '',
                                                    height: '114px',
                                                }}
                                            />
                                            {errors.message && <span className="error-text">{errors.message}</span>}
                                        </div>
                                        <div className="checkbox-group pb-0">
                                            <label className='d-flex align-items-center'>
                                                <input className='mt-0'
                                                    type="checkbox"
                                                    name="keep_informed"
                                                    checked={data?.keep_informed}
                                                    onChange={handleChange}
                                                />
                                                <div> Keep me informed about similar properties</div>
                                            </label>
                                        </div>

                                        <div className="radio-group align-items-center" style={{ margin: '8px 0' }}>
                                            <div className="radio-gol flex-column align-items-start">
                                                <div className="radio-pera align-items-center d-flex">
                                                    <p className='mb-0'>I am a:</p>
                                                </div>
                                                <div className="d-flex align-items-center flex-wrap" style={{ gap: "5px" }}>
                                                    <div className='d-flex align-items-center' style={{ gap: "4px" }}>

                                                        <Radio
                                                            {...controlProps('buyer/tenant')}
                                                            icon={CustomRadioIcon}
                                                            checkedIcon={CustomCheckedIcon}
                                                            sx={{
                                                                padding: '1px',
                                                            }}
                                                        />
                                                    </div>
                                                    <label>Buyer/Tenant</label>

                                                    <div className='d-flex align-items-center' style={{ gap: "4px" }}>

                                                        <Radio
                                                            {...controlProps('agent')}
                                                            icon={CustomRadioIcon}
                                                            checkedIcon={CustomCheckedIcon}
                                                            sx={{
                                                                padding: '1px',
                                                            }}
                                                        />
                                                        <label>Agent</label>
                                                    </div>
                                                    <div className='d-flex align-items-center' style={{ gap: "4px" }}>
                                                        <Radio
                                                            {...controlProps('other')}
                                                            icon={CustomRadioIcon}
                                                            checkedIcon={CustomCheckedIcon}
                                                            sx={{
                                                                padding: '1px',
                                                            }}
                                                        />
                                                        <label>Other</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='email-button2' >
                                            <button type="submit" className="email-btn">
                                                {button_loading ? <div className="spinner-border spinner-border-sm text-light" role="status" /> : <span className="email-icon-wrapper">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                                                        <g clipPath="url(#clip0_2399_51835)">
                                                            <path d="M11.5833 0.583008H3.41667C2.6434 0.583934 1.90208 0.891522 1.3553 1.4383C0.808515 1.98508 0.500926 2.72641 0.5 3.49967L0.5 10.4997C0.500926 11.2729 0.808515 12.0143 1.3553 12.561C1.90208 13.1078 2.6434 13.4154 3.41667 13.4163H11.5833C12.3566 13.4154 13.0979 13.1078 13.6447 12.561C14.1915 12.0143 14.4991 11.2729 14.5 10.4997V3.49967C14.4991 2.72641 14.1915 1.98508 13.6447 1.4383C13.0979 0.891522 12.3566 0.583934 11.5833 0.583008ZM3.41667 1.74967H11.5833C11.9326 1.75036 12.2737 1.85556 12.5627 2.05173C12.8517 2.2479 13.0754 2.52606 13.205 2.85042L8.73783 7.31817C8.40908 7.64561 7.96399 7.82945 7.5 7.82945C7.03601 7.82945 6.59092 7.64561 6.26217 7.31817L1.795 2.85042C1.92459 2.52606 2.14827 2.2479 2.43728 2.05173C2.72628 1.85556 3.06738 1.75036 3.41667 1.74967ZM11.5833 12.2497H3.41667C2.95254 12.2497 2.50742 12.0653 2.17923 11.7371C1.85104 11.4089 1.66667 10.9638 1.66667 10.4997V4.37467L5.43733 8.14301C5.98487 8.68916 6.72665 8.99586 7.5 8.99586C8.27335 8.99586 9.01513 8.68916 9.56267 8.14301L13.3333 4.37467V10.4997C13.3333 10.9638 13.149 11.4089 12.8208 11.7371C12.4926 12.0653 12.0475 12.2497 11.5833 12.2497Z" fill="white" />
                                                        </g>
                                                    </svg>
                                                    <span className="email-label">Email</span>
                                                </span>}

                                            </button>
                                        </div>
                                    </form>
                                    <div className='col-12'>
                                        <div className='property-detail-lower-chages'>
                                            <div className="agent-card">
                                                <div className="upper-detail-section">
                                                    <div className="img-upe-section">
                                                        {userOfProperty?.user?.id === userOfProperty?.agency?.agency_id ?
                                                            <Link to={`/agent-profile/${userOfProperty?.agency?.agency_id}/${userOfProperty?.agency?.ceo_username || ''}`}>
                                                                <FallbackImage className='agent-avatar' src={userOfProperty?.agency?.ceo_image} alt="profile" pageName="AgentDefault" />
                                                            </Link> :
                                                            <Link to={`/agent-profile/${userOfProperty?.user?.id}/${userOfProperty?.user?.user_name || ''}`}>
                                                                <FallbackImage className='agent-avatar' src={userOfProperty?.user?.image} alt="profile" pageName="AgentDefault" />
                                                            </Link>}
                                                        <span>
                                                            <FallbackImage src={img7} alt='.../' pageName="PropertyDetail" />
                                                        </span>
                                                    </div>

                                                    <div className="upper-heading-section">
                                                        {userOfProperty?.user?.id === userOfProperty?.agency?.agency_id ?
                                                            <h4>{userOfProperty?.agency?.ceo_full_name}</h4> :
                                                            <h4>{userOfProperty?.user?.name}</h4>}

                                                        <div className="rating-row">
                                                            <span className="star">
                                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                    <path
                                                                        d="M7.683 1.53c.03-.06.075-.108.131-.142A.334.334 0 0 1 8 1.333c.066 0 .13.018.186.054.056.035.1.083.13.143l1.54 3.119c.101.205.25.383.436.518.185.135.4.222.626.256l3.444.504c.172.025.3.156.333.326a.47.47 0 0 1-.091.369l-2.49 2.426a1.28 1.28 0 0 0-.357.98l.588 3.427a.34.34 0 0 1-.48.366l-3.078-1.62a1.56 1.56 0 0 0-1.316 0l-3.078 1.62a.34.34 0 0 1-.48-.366l.588-3.426a1.28 1.28 0 0 0-.357-.98L1.44 6.53a.47.47 0 0 1-.091-.369.39.39 0 0 1 .333-.326l3.443-.504c.226-.034.441-.121.626-.256.185-.135.335-.313.436-.518L7.683 1.53Z"
                                                                        fill="#FFB900"
                                                                        stroke="#FFB900"
                                                                        strokeWidth="1.333"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                            </span>
                                                            <span className="rating-value">{parseInt(userOfProperty?.user?.average_rating).toFixed(1) || 5}</span>
                                                            <span className="rating-count">{userOfProperty?.user?.ratings_count} Ratings</span>
                                                        </div>
                                                        <Link to={`/agent-profile/${userOfProperty?.user?.id}/${userOfProperty?.user?.username}`}>
                                                            <div className="view-profile" type="button">View Profile</div>
                                                        </Link>
                                                    </div>
                                                </div>

                                                {/* middle: agency card */}
                                                {userOfProperty?.agency && <div className="agency-card" style={{ paddingTop: propertyData?.agency?.package_name ? '28px' : '12px' }}>
                                                    {
                                                        userOfProperty?.agency?.package_name == "Bronze" && <div className="platinum-tag">
                                                            <Suspense fallback={<></>}>
                                                                <AgencyTag width={'fit-content'} bottom={"0px"} left={"0px"} backColor={" var(--Tags-Gold, linear-gradient(90deg, #804A00 0%, #91631B 34.26%, #9F7C3D 75%, #B08D57 100%))"} text={userOfProperty?.agency?.package_name} leftArrow={true} rightArrow={true} noTag={true} />
                                                            </Suspense>
                                                        </div>
                                                    }
                                                    {
                                                        userOfProperty?.agency?.package_name === "Gold" && <div className="platinum-tag">
                                                            <Suspense fallback={<></>}>
                                                                <AgencyTag width={'fit-content'} bottom={"0px"} left={"0px"} to backColor={` var(--Tags-Gold, linear-gradient(90deg, #AE8626 0%, #F7EF8A 28.16%, #D1AC49 63.01%, #ECCA68 100%))`} text={userOfProperty?.agency?.package_name} leftArrow={true} rightArrow={true} noTag={true} />
                                                            </Suspense>
                                                        </div>
                                                    }
                                                    {
                                                        userOfProperty?.agency?.package_name === "Platinum" &&
                                                        <div className="platinum-tag">
                                                            <Suspense fallback={<></>}>
                                                                <AgencyTag width={'fit-content'} bottom={"0px"} left={"0px"} backColor={` linear-gradient(90deg, #E5E4E2 0%, #9D9D9D 25%, #B7B6B3 50%, #9D9D9D 75%, #E5E4E2 100%)`} text={userOfProperty?.agency?.package_name} leftArrow={true} rightArrow={true} noTag={true} />
                                                            </Suspense>
                                                        </div>
                                                    }
                                                    <div className="agency-logo-box">
                                                        <Link to={`/agency-detail/${userOfProperty?.agency?.agency_id}/${userOfProperty?.agency?.username || ''}`}>
                                                            <div className="agency-logo" style={{ marginBottom: userOfProperty?.agency?.is_featured ? '24px' : '' }}>
                                                                <FallbackImage src={userOfProperty?.agency?.agency_image || img6} alt={userOfProperty?.agency?.agency_name} pageName="AgencyDefault" />
                                                            </div>
                                                        </Link>
                                                        {
                                                            userOfProperty?.agency?.is_featured && <div className="featured-tag">
                                                                <Image className='featured-tag-img' src={featuredTag} alt="featured" />
                                                            </div>
                                                        }
                                                    </div>
                                                    <h3>{userOfProperty?.agency?.agency_name || userOfProperty?.user?.name}</h3>
                                                    <p className="agency-role">Real Estate Agent</p>
                                                </div>}

                                                {/* bottom note */}
                                                <div className="respond-note">
                                                    <h6>Usually responds</h6>
                                                    <h5>within 2 hours</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='big-line-hr mt-5 pt-4 row pe-0 d-lg-block d-none'>
                            <hr />
                        </div>
                    </div>
                </div>
                <Suspense fallback={<></>}>
                    <Popup profileData={{ ...propertyData, images: propertyData?.property_images, video_links: propertyData?.property_video }} open={open} setOpen={setOpen} />
                </Suspense>
                <Suspense fallback={<></>}>
                    <CallModal id={propertyData?.property_id} propertyId={slug} open={open1} setOpen={setOpen1} contact={propertyData?.contact} />
                </Suspense>
            </div >
        </>
    )
}

export default Banner
