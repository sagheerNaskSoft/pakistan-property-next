// import React from 'react'
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Radio from '@mui/material/Radio';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ProjectDetails from './ProjectDetails';
import ConstrustionUpdates from './ConstrustionUpdates';
import Location from './Location';
import watermark1 from '../../Asset/PropertyListing/Logo (1).svg'
import watermark2 from '../../Asset/PropertyListing/Logo (2).svg'
import watermark3 from '../../Asset/PropertyListing/Logo (3).svg'
import Plans from './Plans';
import PymentPlans from './PymentPlans';
import Developer from './Developer';
import { useAuth } from '../../Context/ContextProvider';
import { IoIosArrowDown } from 'react-icons/io';
import Popup from '../Metiral/Popup';
import Amenities from '../../Component/PropertyDetail/Amenities'
import CustomTooltip from '../Metiral/CustomTooltip';
import Rsbuttons from './Rsbuttons';
import { Link } from 'react-router-dom';
import { FallbackImage } from '../Metiral/FallbackImage';
import defaultImage from '../../Asset/no-property-large.svg'
import SideIcon from './SideIcon';
import CallModal from '../Metiral/CallModal';
gsap.registerPlugin(ScrollTrigger);
function Projectbanner({ aminitiesWithCategory, projectData }) {
    const boxRef = useRef(null);
    const [showProperty, setShowProperty] = useState(false);
    const [activeTab, setActiveTab] = useState('products');
    const [open1, setOpen1] = useState(false);
    const handleOpen1 = () => setOpen1(true);

    useEffect(() => {
        const handleScroll = () => {


            if (window.scrollY > 668) {
                setShowProperty(true)
            }
            else {
                setShowProperty(false)
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const sectionRef = useRef(null)
    useEffect(() => {
        // const scrollBox = sectionRef.current.querySelector('.detail-code-scroll-side')
        gsap.fromTo(
            // scrollBox,
            '.detail-code-scroll-side',
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

    useEffect(() => {
        const sectionMap = [
            { name: "products", id: "product-section" },
            { name: "overview", id: "description-rout" },
            { name: "features", id: "amenities-features" },
            { name: "construction", id: "constructions-sections" },
            { name: "Location", id: "location-sections" },
            { name: "FloorPlans", id: "plans-sections" },
            { name: "Payment Plan", id: "pyment-plans-sections" },
            { name: "Developer", id: "developers-sections" },
        ];
        const observer = new window.IntersectionObserver(
            (entries) => {
                const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible.length > 0) {
                    const active = sectionMap.find(sec => sec.id === visible[0].target.id)?.name;
                    if (active) setActiveTab(active);
                }
            },
            { threshold: 0.3 }
        );
        sectionMap.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };



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

    const [selectedValue, setSelectedValue] = React.useState('a');
    const handleChange1 = (event) => {
        setSelectedValue(event.target.value);
    };
    const controlProps = (item) => ({
        checked: data?.type === item,
        onChange: () => setData({ ...data, type: item }),
        value: item,
        name: 'color-radio-button-demo',
        inputProps: { 'aria-label': item },
    });

    const CustomRadioIcon = (
        <span
            style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '1px solid #737678', // Thin border
                display: 'inline-block',
            }}
        />
    );

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

    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    const sliderRef = useRef(null);
    const { callingCode, projectIquiry, formatPakistaniPhoneNumber, handleOpenWhatsapp } = useAuth()
    const [show, setShow] = useState(false)
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

    const [data, setData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        type: "buyer/tenant",
        keep_informed: false,
    });

    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            let result = await projectIquiry({
                email: data?.email,
                name: data?.name,
                contact_number: "+92" + data?.phone,
                message: data?.message,
                id: projectData?.slug,
                type: data?.type,
                keep_informed: data?.keep_informed,
            });
            if (result?.success) {
                setData({
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                    type: "buyer/tenant",
                    keep_informed: false,
                })
            }

            // Your API logic or form handling here
        }
    };
const [videos, setVideos] = useState([]);
    useEffect(()=>{
        setVideos(projectData?.videos?.map((item)=>{
            return item?.video_link
        }))
    },[projectData])
    return (
        <>
            <div className='project-detail-banner'>
                <div className="row m-0 detail-code">
                    <div className='col-xl-9 col-lg-8 col-md-12 ps-0 pe-lg-3 pe-0'>
                        <div className="detail-code-scroll-side" >
                            <div className='project-new-watermark'>
                                <div className='projectup-mark'>
                                    <span style={{ display: 'flex' }}><h6>Marketed by</h6>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="21" viewBox="0 0 80 21" fill="none">
                                            <path d="M22.9062 15.6865H24.6805C25.2181 15.6865 25.8633 16.0091 25.8633 16.8693C25.8633 17.8908 25.2181 18.1597 24.7342 18.1597H23.2288V19.45H22.9062V15.6865ZM23.2288 15.9553V17.8371H24.6805C25.0568 17.8371 25.5407 17.6758 25.5407 16.8693C25.5407 16.1166 25.1106 15.9553 24.6805 15.9553H23.2288Z" fill="black" />
                                            <path d="M30.1193 18.0022C30.3881 18.2173 30.5494 18.6474 30.7107 19.0775L30.872 19.4538H30.5494L30.3344 18.8624C30.1193 18.271 29.8505 18.056 29.4204 18.056H28.2913V19.5076H27.9688V15.7441H29.743C30.3344 15.7441 30.9258 16.013 30.9258 16.8732C30.9258 17.0882 30.872 17.8409 30.1193 18.0022ZM29.6892 17.7334C30.1193 17.7334 30.5494 17.7334 30.5494 16.8194C30.5494 16.0667 30.1193 15.9592 29.6892 15.9592H28.2913V17.7334H29.6892Z" fill="black" />
                                            <path d="M32.9023 17.4637C32.9023 16.1196 33.9239 15.6357 34.7841 15.6357C35.6443 15.6357 36.612 16.1196 36.612 17.4637C36.612 19.1304 35.483 19.453 34.7841 19.453C34.0314 19.5067 32.9023 19.1304 32.9023 17.4637ZM36.2895 17.5175C36.2895 16.3347 35.5368 15.9583 34.7841 15.9583C34.0314 15.9583 33.2249 16.3347 33.2249 17.5175C33.2249 18.9153 34.1389 19.1841 34.7841 19.1841C35.3755 19.1841 36.2895 18.9153 36.2895 17.5175Z" fill="black" />
                                            <path d="M38.8008 15.6865H40.575C41.1126 15.6865 41.7578 16.0091 41.7578 16.8693C41.7578 17.8908 41.1126 18.1597 40.6287 18.1597H39.1234V19.45H38.8008V15.6865ZM39.1234 15.9553V17.8371H40.575C40.9513 17.8371 41.4352 17.6758 41.4352 16.8693C41.4352 16.1166 41.0051 15.9553 40.575 15.9553H39.1234Z" fill="black" />
                                            <path d="M44.1859 15.9553V17.3532H46.0138V17.6758H44.1859V19.1274H46.4439V19.45H43.8633V15.6865H46.4439V16.0091H44.1859V15.9553Z" fill="black" />
                                            <path d="M50.8537 18.0022C51.1225 18.2173 51.2838 18.6474 51.4451 19.0775L51.6064 19.4538H51.2838L51.0687 18.8624C50.8537 18.271 50.5849 18.056 50.1547 18.056H49.0257V19.5076H48.7031V15.7441H50.4773C51.0687 15.7441 51.6601 16.013 51.6601 16.8732C51.6601 17.0882 51.6064 17.8409 50.8537 18.0022ZM50.4773 17.7334C50.9074 17.7334 51.3375 17.7334 51.3375 16.8194C51.3375 16.0667 50.9074 15.9592 50.4773 15.9592H49.0795V17.7334H50.4773Z" fill="black" />
                                            <path d="M53.5352 15.6865H56.4384V16.0091H55.1481V19.5037H54.8255V16.0091H53.5352V15.6865Z" fill="black" />
                                            <path d="M61.2284 15.6865H61.6047L60.1531 18.1597V19.45H59.8305V18.1597L58.3789 15.6865H58.7553L60.0456 17.8371L61.2284 15.6865Z" fill="black" />
                                            <path d="M62.8555 19.127H63.1756V19.4471H62.8555V19.127Z" fill="black" />
                                            <path d="M65.6976 17.5175C65.6976 18.9153 66.6116 19.1841 67.3105 19.1841C67.6331 19.1841 67.9557 19.1304 68.2782 18.9691L68.4395 19.1841C68.1169 19.3992 67.6868 19.453 67.3643 19.453C66.6653 19.453 65.375 19.1304 65.375 17.4637C65.375 16.0659 66.3427 15.6357 67.3643 15.6357C67.7406 15.6357 68.1169 15.7433 68.4395 15.9046L68.2782 16.1196C67.9557 15.9583 67.6331 15.9046 67.3643 15.9046C66.5578 15.9583 65.6976 16.2271 65.6976 17.5175Z" fill="black" />
                                            <path d="M70.375 17.4637C70.375 16.1196 71.3965 15.6357 72.2567 15.6357C73.117 15.6357 74.0847 16.1196 74.0847 17.4637C74.0847 19.1304 72.9557 19.453 72.2567 19.453C71.504 19.5067 70.375 19.1304 70.375 17.4637ZM73.7621 17.5175C73.7621 16.3347 73.0094 15.9583 72.2567 15.9583C71.504 15.9583 70.6976 16.3347 70.6976 17.5175C70.6976 18.9153 71.6116 19.1841 72.2567 19.1841C72.8481 19.1841 73.7621 18.9153 73.7621 17.5175Z" fill="black" />
                                            <path d="M78.0017 18.536L76.6038 16.4392V19.45H76.2812V15.6865H76.4963L78.1092 18.2134L79.7221 15.6865H79.9372V19.45H79.6146V16.4392L78.2705 18.536H78.0017Z" fill="black" />
                                            <path d="M26.5486 5.85156C26.9787 5.85156 27.3551 5.90533 27.7314 6.06662C28.1078 6.22791 28.4303 6.44296 28.6992 6.71178C28.968 6.9806 29.183 7.30318 29.3443 7.67953C29.5056 8.05588 29.5594 8.43222 29.5594 8.86233C29.5594 9.29244 29.5056 9.66879 29.3443 9.99137C29.183 10.3677 29.0217 10.6365 28.7529 10.9054C28.4841 11.1742 28.1615 11.3892 27.7314 11.5505C27.3013 11.7118 26.8712 11.7656 26.2798 11.7656H24.3981V14.2925H22.7852V5.85156H26.5486ZM26.5486 10.314C26.7637 10.314 26.9787 10.2602 27.1938 10.2064C27.3551 10.0989 27.5164 9.99137 27.6239 9.88384C27.7314 9.72255 27.8389 9.61502 27.8927 9.39997C27.9465 9.23868 28.0002 9.02362 28.0002 8.86233C28.0002 8.64728 27.9465 8.48599 27.8927 8.27093C27.8389 8.05588 27.7314 7.89458 27.5701 7.78706C27.4626 7.62577 27.3013 7.51824 27.0863 7.41071C26.8712 7.30318 26.6561 7.24942 26.4411 7.24942H24.3981V10.314H26.5486Z" fill="black" />
                                            <path d="M28.5977 14.2925L32.8988 5.85156H33.06L37.3611 14.2925H35.5869L34.9418 12.9484H30.9633L30.3181 14.2925H28.5977ZM31.7697 11.5505H34.1891L33.0063 9.02362L31.7697 11.5505Z" fill="black" />
                                            <path d="M43.5519 14.2925L40.0035 10.4752V14.2925H38.3906V5.85156H40.0035V10.1527L43.3369 5.85156H45.3261L41.8315 10.2064L45.6487 14.2925H43.5519Z" fill="black" />
                                            <path d="M48.6949 14.2925H47.082V5.85156H48.6949V14.2925Z" fill="black" />
                                            <path d="M50.4375 13.1606L51.2977 11.8702C51.7278 12.139 52.1579 12.4079 52.588 12.6229C53.0182 12.838 53.502 12.9455 53.9859 12.9455C54.2547 12.9455 54.4698 12.8917 54.6848 12.838C54.8999 12.7842 55.0612 12.6767 55.1687 12.5692C55.33 12.4616 55.4375 12.3541 55.4913 12.1928C55.5451 12.0853 55.5988 11.924 55.5988 11.8165C55.5988 11.6552 55.5451 11.4939 55.4375 11.3863C55.33 11.2788 55.1687 11.1713 55.0074 11.1175C54.8461 11.0638 54.6311 10.9562 54.416 10.9025C54.201 10.8487 53.9321 10.7949 53.6633 10.7412C53.502 10.6874 53.287 10.6874 53.0719 10.6337C52.8569 10.5799 52.6418 10.5261 52.373 10.4724C52.1579 10.4186 51.8891 10.3111 51.6741 10.2035C51.459 10.096 51.244 9.93473 51.0289 9.77344C50.8676 9.61215 50.7063 9.39709 50.5988 9.12827C50.4913 8.85945 50.4375 8.59064 50.4375 8.26805C50.4375 7.78418 50.545 7.35407 50.7601 7.03149C50.9751 6.70891 51.1902 6.44009 51.5128 6.2788C51.8354 6.06374 52.1579 5.95621 52.5343 5.90245C52.9106 5.84869 53.287 5.79492 53.6096 5.79492C53.9859 5.79492 54.2547 5.79492 54.5773 5.84869C54.8461 5.90245 55.1149 5.95621 55.33 6.06374C55.5451 6.17127 55.8139 6.2788 56.0289 6.38632C56.244 6.54761 56.5128 6.65514 56.7816 6.8702L55.8676 8.16053C55.4913 7.89171 55.0612 7.67665 54.7386 7.51536C54.3623 7.35407 53.9859 7.30031 53.5558 7.30031C53.3945 7.30031 53.287 7.30031 53.0719 7.35407C52.9106 7.40783 52.7493 7.4616 52.588 7.51536C52.4268 7.56912 52.3192 7.67665 52.2117 7.78418C52.1042 7.89171 52.0504 8.053 52.0504 8.21429C52.0504 8.37558 52.1042 8.53687 52.2117 8.6444C52.3192 8.75193 52.4805 8.85945 52.6956 8.91322C52.9106 8.96698 53.1257 9.07451 53.3407 9.12827C53.5558 9.18204 53.7709 9.2358 53.9859 9.28956C54.1472 9.34333 54.3623 9.34333 54.5773 9.39709C54.7924 9.45085 55.0074 9.50462 55.2762 9.55838C55.4913 9.61215 55.7601 9.71967 55.9752 9.8272C56.1902 9.93473 56.4053 10.096 56.5666 10.2573C56.7279 10.4186 56.8892 10.6874 56.9967 10.9025C57.1042 11.1175 57.158 11.4939 57.158 11.8702C57.158 12.3003 57.1042 12.6767 56.9429 12.9993C56.7816 13.3218 56.5666 13.5907 56.2977 13.8057C56.0289 14.0208 55.6526 14.1821 55.2762 14.2896C54.8999 14.3971 54.4698 14.4509 53.9859 14.4509C53.5558 14.4509 53.1795 14.3971 52.8031 14.3434C52.4805 14.2896 52.1579 14.1821 51.8891 14.0745C51.6203 13.967 51.3515 13.8057 51.0827 13.6982C50.9751 13.5369 50.7063 13.3756 50.4375 13.1606Z" fill="black" />
                                            <path d="M63.979 7.24654H61.5596V14.2358H59.9467V7.24654H57.5273V5.79492H63.979V7.24654Z" fill="black" />
                                            <path d="M62.9023 14.2925L67.2034 5.85156H67.3647L71.6658 14.2925H69.8916L69.2465 12.9484H65.2679L64.6228 14.2925H62.9023ZM66.0744 11.5505H68.4938L67.311 9.02362L66.0744 11.5505Z" fill="black" />
                                            <path d="M79.842 14.2925L74.3043 9.29244V14.2925H72.6914V5.85156H72.8527L78.3904 10.9591V5.85156H80.0033V14.2925H79.842Z" fill="black" />
                                            <path d="M0.537637 5.41765L2.74195 3.8585C2.84948 3.80474 2.90324 3.69721 2.90324 3.58969V2.78323C2.90324 2.19183 2.41937 1.76172 1.88173 1.76172H1.02151C0.43011 1.76172 0 2.24559 0 2.78323V5.2026C0 5.41765 0.322582 5.57894 0.537637 5.41765Z" fill="#1B573E" />
                                            <path d="M17.6883 19.5042C18.6022 19.5042 19.3012 18.8053 19.3012 17.8913V7.03104C19.3012 6.49341 19.0324 5.95577 18.5485 5.68695L10.1613 0.256813C9.62371 -0.119533 8.87101 -0.0657693 8.33338 0.310577L0.698928 5.74071C0.268818 6.0633 0 6.54717 0 7.03104V17.8376C0 18.7515 0.698928 19.4505 1.61291 19.4505L17.6883 19.5042Z" fill="#1B573E" />
                                            <path d="M6.72564 10.5808H7.63962V5.90335H10.4353C10.4353 5.90335 13.5536 6.33346 13.6612 9.72057C13.6612 9.72057 13.7149 12.8926 10.4353 13.484H6.67188V19.4679H7.63962V14.5055L10.1665 14.5593C10.1665 14.5593 14.3063 14.3443 14.6289 9.66681C14.6289 9.66681 14.7364 5.90335 10.6504 4.88184H6.67188V10.5808H6.72564Z" fill="white" />
                                            <path d="M8.65522 6.81934H10.3219C10.3219 6.81934 12.6337 7.41074 12.6875 9.45376C12.6875 9.45376 13.0638 11.9807 10.2144 12.5721H5.75198V19.4673H4.73047V6.81934H8.65522Z" fill="white" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M11.1303 10.5851C10.8077 10.9077 10.27 11.2303 9.57112 11.1765C7.95821 11.1228 7.04422 9.34858 7.85068 8.00449C7.90444 7.89696 8.01197 7.78943 8.06573 7.6819C8.17326 7.57438 8.22703 7.52061 8.33455 7.41309C8.17326 7.41309 7.95821 7.57438 7.85068 7.62814C7.42057 7.89696 7.04423 8.38083 6.88293 8.86471C6.18401 11.0153 8.76466 12.7357 10.4851 11.3378C10.7002 11.2841 11.0765 10.854 11.1303 10.5851Z" fill="#1B573E" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M9.52194 8.59326L8.76953 8.91572L9.52194 9.07695L9.62942 9.93684L10.0594 9.23818L10.8655 9.39941L10.3281 8.80823L10.758 8.05583L9.95188 8.37829L9.41445 7.78711L9.52194 8.59326Z" fill="#1B573E" />
                                        </svg></span>
                                </div>
                                <div className='project-new-check'>
                                    <div>
                                        <CustomTooltip
                                            title= { window?.innerWidth <= 768 ? "This Pakistan real estate project has been thoroughly verified by our team for accuracy, legal compliance, and authenticity. All project information, developer credentials, and documentation have been cross-checked with official records to ensure you're viewing a trustworthy and legitimate project within the Pakistani real estate market." : "Verified"}
                                            showModal={true}
                                            placement="right"
                                            color={window?.innerWidth <= 768 ? "" :"#698B75"}
                                            padding={window?.innerWidth <= 768 ? "" :"5px 12px"} 
                                            textColor="white"
                                            borderRadius="4px"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className='mt-1 ms-1' viewBox="0 0 28 28" fill="none">
                                                <path d="M10.7489 2.45031C11.4389 1.86031 12.5689 1.86031 13.2689 2.45031L14.8489 3.81031C15.1489 4.07031 15.7089 4.28031 16.1089 4.28031H17.8089C18.8689 4.28031 19.7389 5.15031 19.7389 6.21031V7.91031C19.7389 8.30031 19.9489 8.87031 20.2089 9.17031L21.5689 10.7503C22.1589 11.4403 22.1589 12.5703 21.5689 13.2703L20.2089 14.8503C19.9489 15.1503 19.7389 15.7103 19.7389 16.1103V17.8103C19.7389 18.8703 18.8689 19.7403 17.8089 19.7403H16.1089C15.7189 19.7403 15.1489 19.9503 14.8489 20.2103L13.2689 21.5703C12.5789 22.1603 11.4489 22.1603 10.7489 21.5703L9.16891 20.2103C8.86891 19.9503 8.30891 19.7403 7.90891 19.7403H6.17891C5.11891 19.7403 4.24891 18.8703 4.24891 17.8103V16.1003C4.24891 15.7103 4.03891 15.1503 3.78891 14.8503L2.43891 13.2603C1.85891 12.5703 1.85891 11.4503 2.43891 10.7603L3.78891 9.17031C4.03891 8.87031 4.24891 8.31031 4.24891 7.92031V6.20031C4.24891 5.14031 5.11891 4.27031 6.17891 4.27031H7.90891C8.29891 4.27031 8.86891 4.06031 9.16891 3.80031L10.7489 2.45031Z" fill="#447158" stroke="#447158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M8.37891 12.0001L10.7889 14.4201L15.6189 9.58008" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </CustomTooltip>
                                    </div>
                                </div>
                            </div>

                            <div className='detial-imges pe-0' onClick={handleOpen} style={{ background: "lightgray" }}>
                                {
                                    projectData?.images?.length > 0 ?
                                        <Slider ref={sliderRef} {...settings}>
                                            {[{url:projectData?.project_cover_image},...projectData?.images]?.map((imgUrl, index) => (
                                                <div className='w-100 h-100' key={index}>
                                                    <FallbackImage src={imgUrl?.url} alt={`img-${index}`} style={{ objectFit: "cover", height: "100%", minHeight: "460px" }} className="img-fluid w-100" pageName="PropertyDetail" />
                                                </div>
                                            ))}
                                        </Slider> :
                                        <div className='w-100 h-100 d-flex align-items-center justify-content-center'>
                                            <FallbackImage src={defaultImage} alt="" style={{ objectFit: "cover", height: "100%" }} className="img-fluid w-100" pageName="PropertyDetail" />
                                        </div>
                                }
                                {
                                    projectData?.images?.length > 0 &&
                                    <div className="arrow-box">
                                        <div className="arrow arrow-left" onClick={(e) => { sliderRef.current?.slickPrev(); e.stopPropagation(); }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M10.5999 12.7098C10.5061 12.6169 10.4317 12.5063 10.381 12.3844C10.3302 12.2625 10.3041 12.1318 10.3041 11.9998C10.3041 11.8678 10.3302 11.7371 10.381 11.6152C10.4317 11.4934 10.5061 11.3828 10.5999 11.2898L15.1899 6.70982C15.2836 6.61685 15.358 6.50625 15.4088 6.38439C15.4595 6.26253 15.4857 6.13183 15.4857 5.99982C15.4857 5.8678 15.4595 5.7371 15.4088 5.61524C15.358 5.49338 15.2836 5.38278 15.1899 5.28982C15.0025 5.10356 14.749 4.99902 14.4849 4.99902C14.2207 4.99902 13.9672 5.10356 13.7799 5.28982L9.18986 9.87982C8.62806 10.4423 8.3125 11.2048 8.3125 11.9998C8.3125 12.7948 8.62806 13.5573 9.18986 14.1198L13.7799 18.7098C13.9661 18.8946 14.2175 18.9987 14.4799 18.9998C14.6115 19.0006 14.7419 18.9754 14.8638 18.9256C14.9856 18.8758 15.0964 18.8025 15.1899 18.7098C15.2836 18.6169 15.358 18.5063 15.4088 18.3844C15.4595 18.2625 15.4857 18.1318 15.4857 17.9998C15.4857 17.8678 15.4595 17.7371 15.4088 17.6152C15.358 17.4934 15.2836 17.3828 15.1899 17.2898L10.5999 12.7098Z" fill="white" />
                                            </svg>
                                        </div>
                                        <div className="arrow arrow-right" onClick={(e) => { sliderRef.current?.slickNext(); e.stopPropagation() }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M15.3993 9.87982L10.8093 5.28982C10.622 5.10356 10.3685 4.99902 10.1043 4.99902C9.84013 4.99902 9.58668 5.10356 9.39931 5.28982C9.30559 5.38278 9.23119 5.49338 9.18042 5.61524C9.12965 5.7371 9.10352 5.8678 9.10352 5.99982C9.10352 6.13183 9.12965 6.26253 9.18042 6.38439C9.23119 6.50625 9.30559 6.61685 9.39931 6.70982L13.9993 11.2898C14.093 11.3828 14.1674 11.4934 14.2182 11.6152C14.269 11.7371 14.2951 11.8678 14.2951 11.9998C14.2951 12.1318 14.269 12.2625 14.2182 12.3844C14.1674 12.5063 14.093 12.6169 13.9993 12.7098L9.39931 17.2898C9.21101 17.4768 9.1047 17.7309 9.10376 17.9963C9.10282 18.2616 9.20734 18.5165 9.39431 18.7048C9.58129 18.8931 9.83541 18.9994 10.1008 19.0004C10.3661 19.0013 10.621 18.8968 10.8093 18.7098L15.3993 14.1198C15.9611 13.5573 16.2767 12.7948 16.2767 11.9998C16.2767 11.2048 15.9611 10.4423 15.3993 9.87982Z" fill="white" />
                                            </svg>
                                        </div>
                                    </div>
                                }
                                <div style={{ marginTop: '5px' }} className='img-icons'>

                                    <div style={{ marginRight: '8px' }} className='icon-box-project'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <g clipPath="url(#clip0_4363_368541)">
                                                <path d="M9.5 0H2.5C1.8372 0.000793929 1.20178 0.264441 0.73311 0.73311C0.264441 1.20178 0.000793929 1.8372 0 2.5L0 9.5C0.000793929 10.1628 0.264441 10.7982 0.73311 11.2669C1.20178 11.7356 1.8372 11.9992 2.5 12H9.5C10.1628 11.9992 10.7982 11.7356 11.2669 11.2669C11.7356 10.7982 11.9992 10.1628 12 9.5V2.5C11.9992 1.8372 11.7356 1.20178 11.2669 0.73311C10.7982 0.264441 10.1628 0.000793929 9.5 0V0ZM2.5 1H9.5C9.89782 1 10.2794 1.15804 10.5607 1.43934C10.842 1.72064 11 2.10218 11 2.5V9.5C10.9991 9.72274 10.9479 9.9424 10.85 10.1425L6.2685 5.561C6.03635 5.32878 5.76072 5.14458 5.45736 5.0189C5.154 4.89322 4.82886 4.82853 4.5005 4.82853C4.17214 4.82853 3.847 4.89322 3.54364 5.0189C3.24028 5.14458 2.96466 5.32878 2.7325 5.561L1 7.293V2.5C1 2.10218 1.15804 1.72064 1.43934 1.43934C1.72064 1.15804 2.10218 1 2.5 1ZM2.5 11C2.10218 11 1.72064 10.842 1.43934 10.5607C1.15804 10.2794 1 9.89782 1 9.5V8.707L3.439 6.268C3.5783 6.12861 3.7437 6.01804 3.92575 5.94259C4.1078 5.86715 4.30294 5.82832 4.5 5.82832C4.69706 5.82832 4.8922 5.86715 5.07425 5.94259C5.2563 6.01804 5.4217 6.12861 5.561 6.268L10.1425 10.85C9.9424 10.9479 9.72274 10.9991 9.5 11H2.5Z" fill="#2D2D2D" />
                                                <path d="M8 5.25C8.34612 5.25 8.68446 5.14737 8.97225 4.95507C9.26003 4.76278 9.48434 4.48947 9.61679 4.1697C9.74924 3.84993 9.7839 3.49806 9.71637 3.15859C9.64885 2.81913 9.48218 2.50731 9.23744 2.26256C8.9927 2.01782 8.68087 1.85115 8.34141 1.78363C8.00194 1.7161 7.65007 1.75076 7.3303 1.88321C7.01053 2.01566 6.73722 2.23997 6.54493 2.52775C6.35264 2.81554 6.25 3.15388 6.25 3.5C6.25 3.96413 6.43437 4.40925 6.76256 4.73744C7.09075 5.06563 7.53587 5.25 8 5.25ZM8 2.75C8.14834 2.75 8.29334 2.79399 8.41668 2.8764C8.54001 2.95881 8.63614 3.07594 8.69291 3.21299C8.74968 3.35003 8.76453 3.50083 8.73559 3.64632C8.70665 3.7918 8.63522 3.92544 8.53033 4.03033C8.42544 4.13522 8.2918 4.20665 8.14632 4.23559C8.00083 4.26453 7.85003 4.24968 7.71299 4.19291C7.57594 4.13614 7.45881 4.04002 7.3764 3.91668C7.29399 3.79334 7.25 3.64834 7.25 3.5C7.25 3.30109 7.32902 3.11032 7.46967 2.96967C7.61032 2.82902 7.80109 2.75 8 2.75Z" fill="#2D2D2D" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_4363_368541">
                                                    <rect width="12" height="12" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>{projectData?.images?.length}
                                    </div>
                                    <div style={{ marginRight: '8px' }} className='icon-box-project'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <g clipPath="url(#clip0_4363_368536)">
                                                <path d="M11.45 4.47752C11.1123 4.30637 10.7066 4.34205 10.404 4.56951L9.4875 5.25002C9.35756 3.97333 8.28328 3.00163 7.00001 3.00002H6.95752L4.89652 0.939507C4.61604 0.657062 4.23408 0.498765 3.83602 0.500007H0.499992C0.223852 0.500007 0 0.723882 0 1.00002C0 1.27616 0.223852 1.50002 0.499992 1.50002H3.83599C3.96853 1.50037 4.09556 1.55301 4.1895 1.64652L5.54299 3.00002H2.50001C1.11998 3.00168 0.00166406 4.12 0 5.50002V9.50003C0.00166406 10.88 1.11998 11.9984 2.50001 12H7.00001C8.2833 11.9984 9.35756 11.0267 9.4875 9.75002L10.4025 10.432C10.8443 10.7634 11.4711 10.6739 11.8025 10.232C11.9323 10.0589 12.0025 9.84841 12.0025 9.63203V5.37152C12.0038 4.99255 11.7895 4.64584 11.45 4.47752ZM8.50001 9.50001C8.50001 10.3284 7.82843 11 7.00001 11H2.50001C1.67159 11 1.00001 10.3284 1.00001 9.50001V5.50002C1.00001 4.6716 1.67159 4.00002 2.50001 4.00002H7.00001C7.82843 4.00002 8.50001 4.6716 8.50001 5.50002V9.50001ZM11 9.62852L9.49999 8.51052V6.48953L11 5.37154V9.62852Z" fill="#2D2D2D" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_4363_368536">
                                                    <rect width="12" height="12" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>{projectData?.videos?.length}
                                    </div>
                                    <div className='icon-box-project'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <g clipPath="url(#clip0_4363_368529)">
                                                <path d="M7.9987 4C7.47128 4 6.95571 4.1564 6.51718 4.44941C6.07865 4.74243 5.73685 5.15891 5.53502 5.64618C5.33319 6.13345 5.28038 6.66962 5.38327 7.18691C5.48617 7.70419 5.74014 8.17934 6.11308 8.55228C6.48602 8.92522 6.96118 9.1792 7.47846 9.28209C7.99574 9.38499 8.53192 9.33218 9.01919 9.13035C9.50646 8.92851 9.92293 8.58672 10.216 8.14819C10.509 7.70966 10.6654 7.19408 10.6654 6.66667C10.6654 5.95942 10.3844 5.28115 9.88432 4.78105C9.38422 4.28095 8.70594 4 7.9987 4ZM7.9987 8C7.73499 8 7.4772 7.9218 7.25794 7.77529C7.03867 7.62878 6.86778 7.42055 6.76686 7.17691C6.66594 6.93328 6.63954 6.66519 6.69099 6.40655C6.74243 6.1479 6.86942 5.91033 7.05589 5.72386C7.24236 5.53739 7.47994 5.4104 7.73858 5.35895C7.99722 5.30751 8.26531 5.33391 8.50894 5.43483C8.75258 5.53574 8.96082 5.70664 9.10733 5.92591C9.25383 6.14517 9.33203 6.40296 9.33203 6.66667C9.33203 7.02029 9.19156 7.35943 8.94151 7.60948C8.69146 7.85952 8.35232 8 7.9987 8Z" fill="#2D2D2D" />
                                                <path d="M8.00021 16.0004C7.43884 16.0032 6.88495 15.8716 6.38492 15.6164C5.88489 15.3612 5.45327 14.99 5.12621 14.5337C2.58554 11.029 1.29688 8.39436 1.29688 6.70236C1.29688 4.92452 2.00312 3.2195 3.26024 1.96238C4.51735 0.705266 6.22237 -0.000976562 8.00021 -0.000976562C9.77804 -0.000976562 11.4831 0.705266 12.7402 1.96238C13.9973 3.2195 14.7035 4.92452 14.7035 6.70236C14.7035 8.39436 13.4149 11.029 10.8742 14.5337C10.5471 14.99 10.1155 15.3612 9.6155 15.6164C9.11547 15.8716 8.56158 16.0032 8.00021 16.0004ZM8.00021 1.45436C6.60849 1.45595 5.27422 2.00951 4.29012 2.9936C3.30603 3.9777 2.75246 5.31197 2.75087 6.70369C2.75087 8.04369 4.01287 10.5217 6.30354 13.681C6.498 13.9489 6.75312 14.1669 7.04802 14.3172C7.34291 14.4675 7.66921 14.5459 8.00021 14.5459C8.33121 14.5459 8.6575 14.4675 8.9524 14.3172C9.24729 14.1669 9.50241 13.9489 9.69687 13.681C11.9875 10.5217 13.2495 8.04369 13.2495 6.70369C13.248 5.31197 12.6944 3.9777 11.7103 2.9936C10.7262 2.00951 9.39193 1.45595 8.00021 1.45436Z" fill="#2D2D2D" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_4363_368529">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="project-main-container">
                            <ProjectDetails projectData={projectData} />

                            <div className='mb-2 project-amenities' ref={boxRef}>
                               {
                                aminitiesWithCategory?.length > 0 && aminitiesWithCategory.some(category => 
                                    (category?.data?.length > 0) || (category?.amenities_list?.length > 0)
                                ) && <Amenities profileData={{ amenities: aminitiesWithCategory }} />
                               }
                            </div>
                            {showProperty && <Rsbuttons propertyData={projectData} radio={true} />}
                            <ConstrustionUpdates title={projectData?.project_title} construction_update={projectData?.construction_update} />

                            <div className='mt-2'>
                                <Location location={projectData?.location?.geo_location} />
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-3 col-lg-4 pe-0'>
                        <div className="detail-code-sticky-side">
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
                                <div className='property-up-img'><FallbackImage src={watermark1} alt="" fallbackSrc={watermark1} /></div>
                                <div className='property-center-img'><FallbackImage src={watermark2} alt="" fallbackSrc={watermark2} /></div>
                                <div className='property-last-img'><FallbackImage src={watermark3} alt="" fallbackSrc={watermark3} /></div>
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
                                    <button onClick={() => handleOpenWhatsapp(projectData?.whatsapp)} type="button" className="whatsapp-btn"><span><svg xmlns="http://www.w3.org/2000/svg" width="25" height="30" viewBox="0 0 25 25" fill="none">
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
                                    <div ref={callingRef} style={{ cursor: "not-allowed" }} className='flag'>
                                        <FallbackImage src={selectedCode?.flag} alt='flag' componentName="Projectbanner" />
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
                                                        <FallbackImage src={item.flag} alt='code' componentName="Projectbanner" />
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

                                <div className="radio-group">
                                    <div className="radio-gol">
                                        <div className="radio-pera">
                                            <p style={{ marginTop: '15px' }}>I am a:</p>
                                        </div>
                                        <Radio
                                            {...controlProps('buyer/tenant')}
                                            icon={CustomRadioIcon}
                                            checkedIcon={CustomCheckedIcon}
                                            sx={{
                                                padding: '1px',
                                            }}
                                        />
                                        <label>Buyer/Tenant</label>

                                        <Radio
                                            {...controlProps('agent')}
                                            icon={CustomRadioIcon}
                                            checkedIcon={CustomCheckedIcon}
                                            sx={{
                                                padding: '1px',
                                            }}
                                        />
                                        <label>Agent</label>

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



                                <div className="checkbox-group">
                                    <label className='d-flex align-items-center'>
                                        <input
                                            type="checkbox"
                                            name="keep_informed"
                                            checked={data?.keep_informed}
                                            onChange={handleChange}
                                        />
                                        Keep me informed about similar properties
                                    </label>
                                </div>

                                <div className='email-button2'>
                                    <button type="submit" className="email-btn">
                                        <span className="email-icon-wrapper">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                                                <g clipPath="url(#clip0_2399_51835)">
                                                    <path d="M11.5833 0.583008H3.41667C2.6434 0.583934 1.90208 0.891522 1.3553 1.4383C0.808515 1.98508 0.500926 2.72641 0.5 3.49967L0.5 10.4997C0.500926 11.2729 0.808515 12.0143 1.3553 12.561C1.90208 13.1078 2.6434 13.4154 3.41667 13.4163H11.5833C12.3566 13.4154 13.0979 13.1078 13.6447 12.561C14.1915 12.0143 14.4991 11.2729 14.5 10.4997V3.49967C14.4991 2.72641 14.1915 1.98508 13.6447 1.4383C13.0979 0.891522 12.3566 0.583934 11.5833 0.583008ZM3.41667 1.74967H11.5833C11.9326 1.75036 12.2737 1.85556 12.5627 2.05173C12.8517 2.2479 13.0754 2.52606 13.205 2.85042L8.73783 7.31817C8.40908 7.64561 7.96399 7.82945 7.5 7.82945C7.03601 7.82945 6.59092 7.64561 6.26217 7.31817L1.795 2.85042C1.92459 2.52606 2.14827 2.2479 2.43728 2.05173C2.72628 1.85556 3.06738 1.75036 3.41667 1.74967ZM11.5833 12.2497H3.41667C2.95254 12.2497 2.50742 12.0653 2.17923 11.7371C1.85104 11.4089 1.66667 10.9638 1.66667 10.4997V4.37467L5.43733 8.14301C5.98487 8.68916 6.72665 8.99586 7.5 8.99586C8.27335 8.99586 9.01513 8.68916 9.56267 8.14301L13.3333 4.37467V10.4997C13.3333 10.9638 13.149 11.4089 12.8208 11.7371C12.4926 12.0653 12.0475 12.2497 11.5833 12.2497Z" fill="white" />
                                                </g>
                                            </svg>
                                            <span className="email-label">Email</span>
                                        </span>
                                    </button>
                                </div>
                            </form>
                            <div className='col-12'>
                                <div className='developer_side_detail_page'>
                                    <Link to={`/developer-profile/${projectData?.developer?.slug}`}>
                                        <div style={{ gap: "8px" }} className='d-flex align-items-center'>
                                            <FallbackImage src={projectData?.developer?.logo_url || projectData?.developer?.logo} alt={projectData?.developer_name} componentName="Projectbanner" />
                                            <div style={{ width: "calc( 100% - 88px )" }}>
                                                <h6 className='m-0'>{projectData?.developer?.name}</h6>
                                                <div className='d-flex align-items-start flex-wrap  gap-1'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M13.3346 6.66634C13.3346 9.99501 9.64197 13.4617 8.40197 14.5323C8.28645 14.6192 8.14583 14.6662 8.0013 14.6662C7.85677 14.6662 7.71615 14.6192 7.60064 14.5323C6.36064 13.4617 2.66797 9.99501 2.66797 6.66634C2.66797 5.25185 3.22987 3.8953 4.23007 2.89511C5.23026 1.89491 6.58681 1.33301 8.0013 1.33301C9.41579 1.33301 10.7723 1.89491 11.7725 2.89511C12.7727 3.8953 13.3346 5.25185 13.3346 6.66634Z" stroke="#737678" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M8 8.66699C9.10457 8.66699 10 7.77156 10 6.66699C10 5.56242 9.10457 4.66699 8 4.66699C6.89543 4.66699 6 5.56242 6 6.66699C6 7.77156 6.89543 8.66699 8 8.66699Z" stroke="#737678" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <CustomTooltip title={projectData?.developer?.address + ", " + projectData?.developer?.city?.city} placement="right" >
                                                        <p className='m-0'>{projectData?.developer?.address}, {projectData?.developer?.city?.city}</p>
                                                    </CustomTooltip>
                                                </div>
                                                <span className='link'>View Developer</span>
                                            </div>

                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="project-main-container px-sm-0 mt-4">
                    {projectData?.floor_plan?.some(plan => plan?.attachments || plan?.pdfs ) ? <Plans floor_plans={projectData?.floor_plan} /> : ""}
                    {projectData?.payment_plan?.some(plan => plan?.attachments || plan?.pdfs ) ? <PymentPlans payment_plan={projectData?.payment_plan} /> : ""}
                    <Developer projectData={projectData} />
                    </div>
                    
                </div>
                <Popup profileData={{...projectData,video_links:videos|| []}} open={open} setOpen={setOpen} />
                <CallModal propertyId={projectData?.slug} open={open1} setOpen={setOpen1} contact={projectData?.contacts || projectData?.contact || []} />
            </div>
        </>
    )
}

export default Projectbanner
