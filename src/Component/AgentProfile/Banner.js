import Breadcrumb from '../Metiral/BreadCrumb'
import agentImg from '../../Asset/Agencylisting/agentImg.png'
import PrimaryBorderButton from '../Metiral/Button/PrimaryBorderButton'
import WhatsAppButton from '../Metiral/Button/WhatsAppButton'
import logo from '../../Asset/Agencylisting/web-logo.svg'
import ShareModal from '../Metiral/ShareModal'
import { useState, useCallback, useRef, useEffect } from 'react'
import ReviewModal from './ReviewModal'
import { FallbackImage } from '../Metiral/FallbackImage'
import AgentReviewCardView from './AgentReviewCardView'
import AgentReviewCardViewModal from './AgentReviewCardViewModal'
import { Link } from 'react-router-dom'
import CallModal from '../Metiral/CallModal'
import { useAuth } from '../../Context/ContextProvider'
import LoginModal from '../NavBarFooter/LoginModal'
import CustomTooltip from '../Metiral/CustomTooltip'

const call = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M13.988 1.18004V3.51337C13.988 3.66808 13.9265 3.81645 13.8171 3.92585C13.7077 4.03525 13.5594 4.0967 13.4047 4.0967C13.2499 4.0967 13.1016 4.03525 12.9922 3.92585C12.8828 3.81645 12.8213 3.66808 12.8213 3.51337V2.01829L9.72965 5.09362C9.61934 5.19961 9.47181 5.25802 9.31884 5.25628C9.16588 5.25454 9.01971 5.19277 8.91185 5.0843C8.80398 4.97582 8.74305 4.82931 8.74217 4.67634C8.74129 4.52336 8.80054 4.37616 8.90715 4.26645L12.0105 1.18004H10.488C10.3333 1.18004 10.1849 1.11858 10.0755 1.00918C9.96611 0.899787 9.90465 0.751414 9.90465 0.596704C9.90465 0.441994 9.96611 0.293621 10.0755 0.184225C10.1849 0.0748288 10.3333 0.0133706 10.488 0.0133706H12.8213C13.1307 0.0133706 13.4275 0.136287 13.6463 0.355079C13.8651 0.573872 13.988 0.870618 13.988 1.18004ZM13.4601 9.77779C13.7981 10.1168 13.988 10.576 13.988 11.0547C13.988 11.5334 13.7981 11.9926 13.4601 12.3316L12.9281 12.9441C8.14998 17.5163 -3.47527 5.89454 1.02807 1.10245L1.69832 0.519121C2.03787 0.19057 2.49302 0.00873948 2.96548 0.0128868C3.43795 0.0170341 3.88983 0.206827 4.22357 0.541287C4.24107 0.559371 5.32198 1.96404 5.32198 1.96404C5.64262 2.30088 5.82117 2.74831 5.82051 3.21336C5.81986 3.67842 5.64007 4.12534 5.31848 4.46129L4.6424 5.3112C5.01623 6.21952 5.56585 7.04501 6.2597 7.74026C6.95354 8.4355 7.77793 8.98679 8.68548 9.36245L9.54007 8.68287C9.87598 8.36146 10.3228 8.18177 10.7877 8.18112C11.2526 8.18047 11.6999 8.3589 12.0367 8.67937C12.0367 8.67937 13.442 9.76029 13.4601 9.77779ZM12.658 10.626C12.658 10.626 11.2621 9.55145 11.244 9.53395C11.1238 9.4148 10.9614 9.34794 10.7922 9.34794C10.623 9.34794 10.4606 9.4148 10.3404 9.53395C10.3247 9.54912 9.14807 10.4871 9.14807 10.4871C9.06878 10.5502 8.97442 10.5916 8.87428 10.6071C8.77414 10.6227 8.67168 10.6119 8.57698 10.5758C7.40052 10.1383 6.33196 9.45282 5.44381 8.56589C4.55567 7.67895 3.86874 6.61132 3.42965 5.43545C3.39124 5.33986 3.37883 5.23579 3.39369 5.13384C3.40854 5.03189 3.45014 4.9357 3.51423 4.85504C3.51423 4.85504 4.45165 3.67845 4.4674 3.6627C4.58656 3.54253 4.65341 3.38015 4.65341 3.21091C4.65341 3.04168 4.58656 2.8793 4.4674 2.75912C4.4499 2.74162 3.3754 1.34512 3.3754 1.34512C3.2535 1.23567 3.09435 1.177 2.93058 1.18112C2.7668 1.18524 2.61081 1.25185 2.49457 1.36729L1.82432 1.95062C-1.46802 5.90679 8.6079 15.4245 12.0747 12.1485L12.6067 11.536C12.7321 11.4209 12.8076 11.2613 12.8172 11.0914C12.8268 10.9214 12.7697 10.7544 12.658 10.626Z" fill="white" />
</svg>

const whatsapp = <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M12.4977 4.5C8.08742 4.5 4.5 8.08842 4.5 12.4999C4.5 14.2495 5.06421 15.872 6.02334 17.189L5.02653 20.1613L8.10148 19.1785C9.3662 20.0157 10.8755 20.5 12.5023 20.5C16.9126 20.5 20.5 16.9114 20.5 12.5001C20.5 8.08857 16.9126 4.50013 12.5023 4.50013L12.4977 4.5ZM10.2643 8.56361C10.1092 8.19209 9.9916 8.17802 9.75659 8.16847C9.67658 8.16382 9.5874 8.15918 9.48855 8.15918C9.18282 8.15918 8.86316 8.24851 8.67035 8.44601C8.43535 8.68586 7.85227 9.24546 7.85227 10.3931C7.85227 11.5407 8.68919 12.6506 8.80198 12.8059C8.91955 12.9609 10.4336 15.3501 12.7844 16.3238C14.6228 17.0857 15.1683 17.0151 15.5867 16.9258C16.1979 16.7941 16.9643 16.3424 17.1571 15.797C17.35 15.2514 17.3499 14.7857 17.2934 14.687C17.237 14.5882 17.0818 14.5319 16.8468 14.4142C16.6118 14.2966 15.4691 13.7322 15.2528 13.657C15.0412 13.5771 14.8391 13.6053 14.6793 13.8311C14.4536 14.1462 14.2327 14.4661 14.0539 14.6588C13.9129 14.8094 13.6824 14.8282 13.4897 14.7482C13.2311 14.6401 12.5071 14.3859 11.6137 13.5911C10.9225 12.9751 10.4523 12.2086 10.316 11.9782C10.1796 11.7431 10.302 11.6065 10.41 11.4796C10.5275 11.3337 10.6403 11.2303 10.7579 11.0939C10.8755 10.9576 10.9413 10.887 11.0165 10.727C11.0966 10.5719 11.04 10.4119 10.9836 10.2943C10.9272 10.1767 10.4571 9.0291 10.2643 8.56361Z" fill="#20A853" />
</svg>

const phone = <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <g clipPath="url(#clip0_8049_124044)">
        <path d="M10.374 12.426C10.5289 12.4971 10.7034 12.5134 10.8688 12.4721C11.0341 12.4308 11.1805 12.3344 11.2837 12.1987L11.55 11.85C11.6897 11.6637 11.8709 11.5125 12.0792 11.4084C12.2875 11.3042 12.5171 11.25 12.75 11.25H15C15.3978 11.25 15.7794 11.408 16.0607 11.6893C16.342 11.9706 16.5 12.3522 16.5 12.75V15C16.5 15.3978 16.342 15.7794 16.0607 16.0607C15.7794 16.342 15.3978 16.5 15 16.5C11.4196 16.5 7.9858 15.0777 5.45406 12.5459C2.92232 10.0142 1.5 6.58042 1.5 3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H5.25C5.64782 1.5 6.02935 1.65804 6.31066 1.93934C6.59196 2.22064 6.75 2.60218 6.75 3V5.25C6.75 5.48287 6.69578 5.71254 6.59164 5.92082C6.4875 6.1291 6.33629 6.31028 6.15 6.45L5.799 6.71325C5.66131 6.81838 5.56426 6.96794 5.52434 7.13651C5.48442 7.30509 5.50409 7.48228 5.58 7.638C6.60501 9.7199 8.29082 11.4036 10.374 12.426Z" stroke="#447158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
        <clipPath id="clip0_8049_124044">
            <rect width="18" height="18" fill="white" />
        </clipPath>
    </defs>
</svg>

const email = <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M16.5 5.25L9.75675 9.54525C9.52792 9.67816 9.268 9.74817 9.00337 9.74817C8.73875 9.74817 8.47883 9.67816 8.25 9.54525L1.5 5.25" stroke="#447158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 3H3C2.17157 3 1.5 3.67157 1.5 4.5V13.5C1.5 14.3284 2.17157 15 3 15H15C15.8284 15 16.5 14.3284 16.5 13.5V4.5C16.5 3.67157 15.8284 3 15 3Z" stroke="#447158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>

const license = <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M11.6076 9.66751L12.7438 16.062C12.7565 16.1373 12.746 16.2147 12.7135 16.2838C12.6811 16.353 12.6283 16.4105 12.5623 16.4489C12.4962 16.4872 12.42 16.5044 12.3439 16.4983C12.2678 16.4922 12.1954 16.4629 12.1363 16.4145L9.45131 14.3993C9.32169 14.3024 9.16424 14.2501 9.00244 14.2501C8.84064 14.2501 8.68318 14.3024 8.55356 14.3993L5.86406 16.4138C5.80505 16.4621 5.73271 16.4913 5.65669 16.4974C5.58066 16.5036 5.50457 16.4864 5.43856 16.4482C5.37255 16.4099 5.31977 16.3525 5.28725 16.2835C5.25473 16.2145 5.24403 16.1372 5.25656 16.062L6.39206 9.66751" stroke="#447158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 10.5C11.4853 10.5 13.5 8.48528 13.5 6C13.5 3.51472 11.4853 1.5 9 1.5C6.51472 1.5 4.5 3.51472 4.5 6C4.5 8.48528 6.51472 10.5 9 10.5Z" stroke="#447158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>

const location = <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M15 7.5C15 11.2448 10.8457 15.1447 9.45075 16.3492C9.32079 16.447 9.1626 16.4998 9 16.4998C8.8374 16.4998 8.67921 16.447 8.54925 16.3492C7.15425 15.1447 3 11.2448 3 7.5C3 5.9087 3.63214 4.38258 4.75736 3.25736C5.88258 2.13214 7.4087 1.5 9 1.5C10.5913 1.5 12.1174 2.13214 13.2426 3.25736C14.3679 4.38258 15 5.9087 15 7.5Z" stroke="#447158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z" stroke="#447158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
const fullStar = <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.0177 0.863252C7.04692 0.804226 7.09205 0.754541 7.14801 0.719802C7.20396 0.685064 7.26851 0.666656 7.33437 0.666656C7.40023 0.666656 7.46478 0.685064 7.52073 0.719802C7.57669 0.754541 7.62182 0.804226 7.65104 0.863252L9.19104 3.98259C9.29249 4.1879 9.44224 4.36552 9.62745 4.50022C9.81266 4.63492 10.0278 4.72266 10.2544 4.75592L13.6984 5.25992C13.7636 5.26937 13.8249 5.2969 13.8754 5.33939C13.9258 5.38187 13.9633 5.43762 13.9837 5.50032C14.0041 5.56303 14.0065 5.63019 13.9908 5.69421C13.975 5.75823 13.9416 5.81655 13.8944 5.86259L11.4037 8.28792C11.2394 8.44799 11.1166 8.64557 11.0456 8.86367C10.9746 9.08177 10.9577 9.31385 10.9964 9.53992L11.5844 12.9666C11.5959 13.0318 11.5888 13.099 11.564 13.1604C11.5392 13.2218 11.4977 13.275 11.4441 13.3139C11.3905 13.3528 11.327 13.3759 11.2609 13.3805C11.1949 13.3851 11.1288 13.371 11.0704 13.3399L7.9917 11.7213C7.78885 11.6147 7.56316 11.5591 7.33404 11.5591C7.10492 11.5591 6.87922 11.6147 6.67637 11.7213L3.59837 13.3399C3.53992 13.3709 3.47397 13.3848 3.408 13.3801C3.34204 13.3754 3.27872 13.3523 3.22523 13.3134C3.17175 13.2745 3.13026 13.2214 3.10547 13.1601C3.08069 13.0988 3.07361 13.0317 3.08504 12.9666L3.67237 9.54059C3.71117 9.31441 3.69436 9.08218 3.6234 8.86395C3.55243 8.64572 3.42944 8.44802 3.26504 8.28792L0.77437 5.86325C0.726766 5.81727 0.693033 5.75885 0.677012 5.69464C0.660991 5.63042 0.663328 5.563 0.683756 5.50005C0.704184 5.4371 0.741882 5.38115 0.792555 5.33857C0.843228 5.296 0.904839 5.26852 0.97037 5.25925L4.4137 4.75592C4.64054 4.72292 4.85596 4.63529 5.04143 4.50058C5.22689 4.36586 5.37684 4.1881 5.47837 3.98259L7.0177 0.863252Z" fill="#FFB900" stroke="#FFB900" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
</svg>
const emptyStar = <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.0177 0.863252C7.04692 0.804226 7.09205 0.754541 7.14801 0.719802C7.20396 0.685064 7.26851 0.666656 7.33437 0.666656C7.40023 0.666656 7.46478 0.685064 7.52073 0.719802C7.57669 0.754541 7.62182 0.804226 7.65104 0.863252L9.19104 3.98259C9.29249 4.1879 9.44224 4.36552 9.62745 4.50022C9.81266 4.63492 10.0278 4.72266 10.2544 4.75592L13.6984 5.25992C13.7636 5.26937 13.8249 5.2969 13.8754 5.33939C13.9258 5.38187 13.9633 5.43762 13.9837 5.50032C14.0041 5.56303 14.0065 5.63019 13.9908 5.69421C13.975 5.75823 13.9416 5.81655 13.8944 5.86259L11.4037 8.28792C11.2394 8.44799 11.1166 8.64557 11.0456 8.86367C10.9746 9.08177 10.9577 9.31385 10.9964 9.53992L11.5844 12.9666C11.5959 13.0318 11.5888 13.099 11.564 13.1604C11.5392 13.2218 11.4977 13.275 11.4441 13.3139C11.3905 13.3528 11.327 13.3759 11.2609 13.3805C11.1949 13.3851 11.1288 13.371 11.0704 13.3399L7.9917 11.7213C7.78885 11.6147 7.56316 11.5591 7.33404 11.5591C7.10492 11.5591 6.87922 11.6147 6.67637 11.7213L3.59837 13.3399C3.53992 13.3709 3.47397 13.3848 3.408 13.3801C3.34204 13.3754 3.27872 13.3523 3.22523 13.3134C3.17175 13.2745 3.13026 13.2214 3.10547 13.1601C3.08069 13.0988 3.07361 13.0317 3.08504 12.9666L3.67237 9.54059C3.71117 9.31441 3.69436 9.08218 3.6234 8.86395C3.55243 8.64572 3.42944 8.44802 3.26504 8.28792L0.77437 5.86325C0.726766 5.81727 0.693033 5.75885 0.677012 5.69464C0.660991 5.63042 0.663328 5.563 0.683756 5.50005C0.704184 5.4371 0.741882 5.38115 0.792555 5.33857C0.843228 5.296 0.904839 5.26852 0.97037 5.25925L4.4137 4.75592C4.64054 4.72292 4.85596 4.63529 5.04143 4.50058C5.22689 4.36586 5.37684 4.1881 5.47837 3.98259L7.0177 0.863252Z" stroke="#ffffffff" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
</svg>
const halfStar = <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
    <defs>
        <linearGradient id="halfGradient">
            <stop offset="50%" stopColor="#FFB900" />
            <stop offset="50%" stopColor="transparent" />
        </linearGradient>
    </defs>
    <path fill="url(#halfGradient)" stroke="#FFB900" strokeWidth="1"
        d="M12 .587l3.668 7.568L24 9.748l-6 5.848 1.416 8.268L12 19.771l-7.416 4.093L6 15.596 0 9.748l8.332-1.593z"
    />
</svg>
function Banner({ userData, agencyData, rating, refetchAgentData, propertiesCount }) {

    const { loginData, setOpenLoanModal } = useAuth()
    const [openReview, setOpenReview] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [open, setOpen] = useState(false)
    const [pendingReview, setPendingReview] = useState(false)
    const [gradient, setGradient] = useState('linear-gradient(135deg, #1c705b 0%, #002C22 100%)')
    const rafRef = useRef()
    const latestAngle = useRef(135)
    const reviewModalRef = useRef(null)

    const animateGradient = useCallback(() => {
        setGradient(`linear-gradient(${latestAngle.current}deg, #1c705b 0%, #002C22 100%)`)
        rafRef.current = null
    }, [])

    const handleMouseMove = useCallback((e) => {
        const banner = e.currentTarget;
        const rect = banner.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 180;
        latestAngle.current = angle;
        if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(animateGradient)
        }
    }, [animateGradient])

    const handleMouseLeave = useCallback(() => {
        setGradient('linear-gradient(135deg, #002C22 0%, #1c705b 100%)');
    }, [])
    const avg = Number(rating?.average_rating) || 0;

    const full = Math.floor(avg);          // full stars
    const half = avg % 1 >= 0.5 ? 1 : 0;   // half star
    const empty = 5 - (full + half);       // remaining
    const [openCall, setOpenCall] = useState(false)

    // Handle opening review modal - check if user is logged in first
    const handleGiveRating = () => {
        if (!loginData) {
            // User is not logged in, open login modal and set flag to open review after login
            setPendingReview(true)
            setOpenLoanModal(true)
        } else {
            // User is logged in, open review modal directly
            setOpenReview(true)
        }
    }

    // Watch for login changes - if user just logged in and we have pending review, open review modal
    useEffect(() => {
        if (loginData && pendingReview) {
            setPendingReview(false)
            setOpenReview(true)
        }
    }, [loginData, pendingReview])

    return (
        <>
            <div
                className="agent-profile-banner"
                style={{ background: gradient, transition: 'background 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <div className="main-container">
                    <Breadcrumb items={["Home", "Agents", userData?.name]} paths={["/", "/agencies", userData?.name]} modified={true} />
                    <div className="row" style={{ margin: window.innerWidth <= 576 ? "0" : "" }}>
                        <div className="col-3 d-xl-inline d-none">
                            <div className="agent-img">
                                <FallbackImage src={userData?.image} alt={userData?.name} pageName={window.innerWidth > 576 ? "NewAgentProfile" : "AgentSmallProfile"} />
                            </div>
                        </div>
                        <div className={
                            `${agencyData?.agency?.agency_profile ? 'col-xl-6' : 'col-xl-9'} col-lg-9 col-12 px-xl-3 ps-sm-1 px-0 ` + (agencyData?.agency?.agency_profile ? 'pe-sm-2' : 'pb-9')
                        } style={{ flexDirection: "column", gap: "16px" }}>
                            <div className="detail-box">

                                <div className="d-xl-inline d-flex flex-sm-row flex-column align-item-center agent-detail-new-box" style={{ gap: "10px" }}>
                                    <div className="agent-img d-xl-none d-inline">
                                        <FallbackImage src={userData?.image} alt={userData?.name} pageName={window.innerWidth > 576 ? "NewAgentProfile" : "AgentSmallProfile"} />
                                    </div>
                                    <div className="top">
                                        <div className="d-flex align-items-center flex-sm-row flex-column-reverse justify-content-between w-100">
                                            <div className="d-flex flex-column align-items-center" style={{ gap: '4px' }}>
                                                <div className=" d-sm-inline-block d-flex flex-column align-items-center" style={{ gap: '8px' }}>
                                                    <div className="name text-sm-start text-center">{userData?.name} {userData?.designation === "CEO" ? <span className='ceo-designation'>(CEO)</span> : ""}</div>
                                                    <div className="info-box d-sm-none d-flex justify-content-center">

                                                        <div className="box justify-content-sm-start justify-content-center">

                                                            <div className="text">

                                                                <div className="d-flex align-items-center" style={{ gap: '4px' }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                        <path d="M18.3307 5.83301L10.8382 10.6055C10.584 10.7532 10.2952 10.831 10.0011 10.831C9.70712 10.831 9.41832 10.7532 9.16406 10.6055L1.66406 5.83301" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M16.6641 3.33301H3.33073C2.41025 3.33301 1.66406 4.0792 1.66406 4.99967V14.9997C1.66406 15.9201 2.41025 16.6663 3.33073 16.6663H16.6641C17.5845 16.6663 18.3307 15.9201 18.3307 14.9997V4.99967C18.3307 4.0792 17.5845 3.33301 16.6641 3.33301Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                    <CustomTooltip placement="top" title={userData?.email || "-"}>
                                                                        <div className="para text-sm-start text-center">{userData?.email || "-"}</div>

                                                                    </CustomTooltip>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="box justify-content-sm-start justify-content-center">
                                                            <div className="text ">
                                                                <CustomTooltip placement="top" title={userData?.address || userData?.city?.city ? userData?.address + (userData?.city?.city && userData?.address ? ", " : '') + userData?.city?.city : "-"} >
                                                                    <div className="d-flex align-items-center" style={{ gap: '4px' }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                            <path d="M13.3346 6.66634C13.3346 9.99501 9.64197 13.4617 8.40197 14.5323C8.28645 14.6192 8.14583 14.6662 8.0013 14.6662C7.85677 14.6662 7.71615 14.6192 7.60064 14.5323C6.36064 13.4617 2.66797 9.99501 2.66797 6.66634C2.66797 5.25185 3.22987 3.8953 4.23007 2.89511C5.23026 1.89491 6.58681 1.33301 8.0013 1.33301C9.41579 1.33301 10.7723 1.89491 11.7725 2.89511C12.7727 3.8953 13.3346 5.25185 13.3346 6.66634Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                            <path d="M8 8.66699C9.10457 8.66699 10 7.77156 10 6.66699C10 5.56242 9.10457 4.66699 8 4.66699C6.89543 4.66699 6 5.56242 6 6.66699C6 7.77156 6.89543 8.66699 8 8.66699Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                        <div className="para text-sm-start text-center">
                                                                            {userData?.address || userData?.city?.city ? userData?.address + (userData?.city?.city && userData?.address ? ", " : '') + userData?.city?.city : "-"}
                                                                        </div>
                                                                    </div>
                                                                </CustomTooltip>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="d-sm-none d-flex align-items-center" style={{ gap: '8px' }}>
                                                    <div className="agency-box">
                                                        <div className="agency-img">
                                                            <FallbackImage src={agencyData?.agency?.agency_profile?.agency_image} alt="" pageName="AgencyDefault" />
                                                        </div>
                                                    </div>
                                                    <Link to={`/agency-detail/${agencyData?.agency?.id || agencyData?.agency_id}`} style={{ textDecoration: "none" }}>
                                                        <div className="text d-sm-none d-block text-center text-light" style={{ fontSize: "14px", fontWeight: "400", lineHeight: "20px", textDecoration: 'underline', cursor: 'pointer' }}>{agencyData?.agency?.agency_profile?.agency_name}</div>
                                                    </Link>
                                                </div> */}
                                            </div>
                                            <div className="share-btn" onClick={() => setOpen(true)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M18.1008 14.2205C17.4714 14.221 16.8517 14.3747 16.2949 14.6682C15.7382 14.9617 15.2613 15.3863 14.9053 15.9052L9.48734 13.4589C9.87216 12.5296 9.87365 11.4859 9.4915 10.5555L14.902 8.0967C15.4296 8.85979 16.2132 9.4085 17.1108 9.6433C18.0083 9.8781 18.9602 9.78343 19.7939 9.37648C20.6277 8.96953 21.2879 8.27724 21.6549 7.42519C22.0219 6.57314 22.0714 5.61777 21.7943 4.73237C21.5173 3.84697 20.9321 3.09019 20.1449 2.5993C19.3577 2.10842 18.4206 1.91594 17.5036 2.05678C16.5866 2.19762 15.7505 2.66245 15.1469 3.36696C14.5433 4.07147 14.2121 4.96899 14.2136 5.89672C14.2171 6.11631 14.2394 6.33518 14.2802 6.55097L8.52844 9.16464C7.97602 8.64708 7.28446 8.30216 6.5387 8.17225C5.79295 8.04233 5.02548 8.13309 4.3306 8.43336C3.63571 8.73363 3.04367 9.23035 2.62721 9.86247C2.21075 10.4946 1.988 11.2346 1.98634 11.9916C1.98467 12.7486 2.20417 13.4896 2.61785 14.1235C3.03153 14.7575 3.62138 15.2568 4.31494 15.5601C5.0085 15.8634 5.77556 15.9576 6.52187 15.8309C7.26819 15.7043 7.96127 15.3624 8.51595 14.8473L14.2827 17.451C14.2426 17.6666 14.2206 17.8851 14.2169 18.1044C14.2167 18.8728 14.4445 19.624 14.8713 20.2629C15.298 20.9019 15.9047 21.3999 16.6146 21.6941C17.3245 21.9882 18.1056 22.0652 18.8593 21.9153C19.6129 21.7655 20.3052 21.3955 20.8485 20.8521C21.3919 20.3088 21.7619 19.6165 21.9117 18.8629C22.0616 18.1092 21.9846 17.3281 21.6905 16.6182C21.3963 15.9083 20.8983 15.3016 20.2593 14.8748C19.6204 14.4481 18.8692 14.2203 18.1008 14.2205ZM18.1008 3.67677C18.5399 3.67661 18.9692 3.80667 19.3344 4.0505C19.6995 4.29433 19.9842 4.64098 20.1523 5.04661C20.3205 5.45224 20.3646 5.89862 20.279 6.32931C20.1935 6.75999 19.9821 7.15562 19.6717 7.46617C19.3612 7.77672 18.9657 7.98823 18.535 8.07396C18.1044 8.15968 17.658 8.11577 17.2523 7.94777C16.8466 7.77977 16.4998 7.49524 16.2559 7.13015C16.0119 6.76506 15.8817 6.33582 15.8817 5.89672C15.8821 5.30824 16.116 4.74396 16.5321 4.32776C16.9481 3.91156 17.5123 3.67743 18.1008 3.67677ZM5.89313 14.2205C5.45403 14.2207 5.02474 14.0906 4.65956 13.8468C4.29439 13.6029 4.00972 13.2563 3.84157 12.8507C3.67342 12.445 3.62934 11.9987 3.7149 11.568C3.80046 11.1373 4.01183 10.7417 4.32226 10.4311C4.63269 10.1206 5.02825 9.90904 5.4589 9.82332C5.88955 9.73759 6.33595 9.78151 6.74164 9.9495C7.14734 10.1175 7.49409 10.402 7.73806 10.7671C7.98203 11.1322 8.11225 11.5615 8.11225 12.0006C8.11159 12.589 7.8776 13.1531 7.46161 13.5693C7.04561 13.9854 6.48155 14.2196 5.89313 14.2205ZM18.1008 20.3243C17.6617 20.3243 17.2325 20.1941 16.8674 19.9502C16.5024 19.7063 16.2178 19.3596 16.0498 18.9539C15.8818 18.5483 15.8378 18.1019 15.9235 17.6713C16.0091 17.2407 16.2206 16.8451 16.531 16.5346C16.8415 16.2242 17.2371 16.0127 17.6677 15.9271C18.0983 15.8414 18.5447 15.8854 18.9503 16.0534C19.356 16.2214 19.7027 16.506 19.9466 16.871C20.1905 17.2361 20.3207 17.6653 20.3207 18.1044C20.3203 18.693 20.0863 19.2574 19.67 19.6736C19.2538 20.0899 18.6894 20.3239 18.1008 20.3243Z" fill="white" />
                                                </svg>

                                                <div className="share-tooltip">
                                                    Share
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rating-box flex-wrap flex-sm-row flex-column">
                                            <div className="d-flex align-items-center" onClick={() => setOpenModal(true)} style={{ gap: '4px' }}>
                                                <div className="text">{avg?.toFixed(1)}</div>
                                                <div
                                                    className="position-relative star-box-parent"
                                                    onClick={() => {
                                                        if (window.innerWidth <= 992 && reviewModalRef.current) {
                                                            reviewModalRef.current();
                                                        }
                                                    }}
                                                    style={{ cursor: window.innerWidth <= 992 ? 'pointer' : 'default' }}
                                                >
                                                    <div className="star-box d-flex">

                                                        {[...Array(full)].map((_, i) => <span style={{ height: "15px", display: "flex", alignItems: 'center', justifyContent: 'center' }} key={i}>{fullStar}</span>)}
                                                        {half === 1 && <span style={{ height: "15px", display: "flex", alignItems: 'center', justifyContent: 'center' }}>{halfStar}</span>}
                                                        {[...Array(empty)].map((_, i) => <span style={{ height: "15px", display: "flex", alignItems: 'center', justifyContent: 'center' }} key={i + 10}>{emptyStar}</span>)}

                                                    </div>
                                                    {
                                                        window?.innerWidth > 992 &&
                                                        <AgentReviewCardView rating={rating} data={userData} onOpenModal={reviewModalRef} />

                                                    }
                                                </div>
                                                <div className="text">({rating?.total_reviews || 0})</div>
                                            </div>
                                            {loginData?.data?.user?.id !== userData?.id ? <div className="box-link" onClick={handleGiveRating}>Give Ratings </div> : ""}
                                        </div>
                                        <div className="info-box d-sm-flex d-none justify-content-center">
                                            <div className="box d-sm-flex d-none">
                                                <div className="icon">{phone}</div>
                                                <div className="text">
                                                    <div className="title">Mobile</div>
                                                    <div className="para">{userData?.mobile || "-"}</div>
                                                </div>
                                            </div>
                                            <div className="box justify-content-sm-start justify-content-center">
                                                <div className="icon d-sm-flex d-none">{email}</div>
                                                <div className="text">
                                                    <div className="title d-sm-inline d-none">Email</div>
                                                    <div className="d-flex align-items-center" style={{ gap: '4px' }}>
                                                        <svg className='d-sm-none' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <path d="M18.3307 5.83301L10.8382 10.6055C10.584 10.7532 10.2952 10.831 10.0011 10.831C9.70712 10.831 9.41832 10.7532 9.16406 10.6055L1.66406 5.83301" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M16.6641 3.33301H3.33073C2.41025 3.33301 1.66406 4.0792 1.66406 4.99967V14.9997C1.66406 15.9201 2.41025 16.6663 3.33073 16.6663H16.6641C17.5845 16.6663 18.3307 15.9201 18.3307 14.9997V4.99967C18.3307 4.0792 17.5845 3.33301 16.6641 3.33301Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <CustomTooltip placement="top" title={userData?.email || "-"}>
                                                            <div className="para text-sm-start text-center email">{userData?.email || "-"}</div>

                                                        </CustomTooltip>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box d-sm-flex d-none">
                                                <div className="icon ">{license}</div>
                                                <div className="text">
                                                    <div className="title">License</div>
                                                    <div className="para">{userData?.agent_id || "-"}</div>
                                                </div>
                                            </div>
                                            <div className="box justify-content-sm-start justify-content-center">
                                                <div className="icon d-sm-flex d-none">{location}</div>
                                                <div className="text ">
                                                    <div className="title d-sm-inline d-none">Location</div>
                                                    <CustomTooltip placement="top" title={userData?.address || userData?.city?.city ? userData?.address + (userData?.city?.city && userData?.address ? ", " : '') + userData?.city?.city : "-"} >
                                                        <div className="d-flex align-items-center" style={{ gap: '4px' }}>
                                                            <svg className='d-sm-none' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                <path d="M13.3346 6.66634C13.3346 9.99501 9.64197 13.4617 8.40197 14.5323C8.28645 14.6192 8.14583 14.6662 8.0013 14.6662C7.85677 14.6662 7.71615 14.6192 7.60064 14.5323C6.36064 13.4617 2.66797 9.99501 2.66797 6.66634C2.66797 5.25185 3.22987 3.8953 4.23007 2.89511C5.23026 1.89491 6.58681 1.33301 8.0013 1.33301C9.41579 1.33301 10.7723 1.89491 11.7725 2.89511C12.7727 3.8953 13.3346 5.25185 13.3346 6.66634Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M8 8.66699C9.10457 8.66699 10 7.77156 10 6.66699C10 5.56242 9.10457 4.66699 8 4.66699C6.89543 4.66699 6 5.56242 6 6.66699C6 7.77156 6.89543 8.66699 8 8.66699Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            <div className="para text-sm-start text-center">
                                                                {userData?.address || userData?.city?.city ? userData?.address + (userData?.city?.city && userData?.address ? ", " : '') + userData?.city?.city : "-"}
                                                            </div>
                                                        </div>
                                                    </CustomTooltip>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="button-box">
                                            <PrimaryBorderButton onFunction={() => setOpenCall(true)} modified={true} maxWidth={"100%"} width={true} height={'40px'} icon={call} text={"Call"} />
                                            <WhatsAppButton contactNumber={userData?.whatsapp_number || userData?.phone_number || userData?.mobile} modified={true} maxWidth={"100%"} width={true} height={'40px'} icon={whatsapp} text={"WhatsApp"} />
                                            {/* <PrimaryBorderButton 
                                                onFunction={() => {
                                                    const emailAddr = userData?.email || '';
                                                    const subject = encodeURIComponent('Property Inquiry');
                                                    const body = encodeURIComponent('Hi, I am interested in your profile on Pakistan-Property. Please provide more details.');
                                                    window.open(`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${emailAddr}&su=${subject}&body=${body}&tf=1`, '_blank');
                                                }}
                                                modified={true}
                                                maxWidth={"100%"}
                                                width={true}
                                                height={'40px'}
                                                icon={email}
                                                text={"Email"}
                                            /> */}
                                        </div>
                                    </div>
                                </div>
                                {/* <div className=" d-sm-none d-flex" style={{ gap: "10px" }}>
                                    <div className="bottom">
                                        <div className="property-info-box">
                                            <div className="number">{propertiesCount?.total > 100 ? "100+" : (propertiesCount?.total || 0)}</div>
                                            <div className="text">Total Property Listing</div>
                                        </div>
                                        <div className="line" />
                                        <div className="property-info-box">
                                            <div className="number">{propertiesCount?.sold > 100 ? "100+" : (propertiesCount?.sold || 0)}</div>
                                            <div className="text">Sold</div>
                                        </div>
                                        <div className="line" />
                                        <div className="property-info-box">
                                            <div className="number">{propertiesCount?.rent > 100 ? "100+" : (propertiesCount?.rent || 0)}</div>
                                            <div className="text">Rent</div>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="d-lg-inline d-sm-flex" style={{ gap: "10px" }}>
                                    <div className="bottom">
                                        <div className="property-info-box">
                                            <div className="number">{propertiesCount?.total > 100 ? "100+" : (propertiesCount?.total || 0)}</div>
                                            <div className="text">Total Property Listing</div>
                                        </div>
                                        <div className="line" />
                                        <div className="property-info-box">
                                            <div className="number">{propertiesCount?.sold > 100 ? "100+" : (propertiesCount?.sold || 0)}</div>
                                            <div className="text">Sold</div>
                                        </div>
                                        <div className="line" />
                                        <div className="property-info-box">
                                            <div className="number">{propertiesCount?.rent > 100 ? "100+" : (propertiesCount?.rent || 0)}</div>
                                            <div className="text">Rent</div>
                                        </div>
                                    </div>
                                    <div className="agency-box d-lg-none d-sm-inline d-none">
                                        <div className="agency-img">
                                            <FallbackImage src={agencyData?.agency?.agency_profile?.agency_image} alt="" pageName="AgencyDefault" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {agencyData?.agency?.agency_profile ? <div className="col-sm-3 col-12 px-xl-3 ps-sm-2 pe-sm-1 px-0 d-lg-inline d-sm-none" style={{ marginTop: window.innerWidth <= 576 ? '12px' : '0px' }}>
                            <div className="agency-box">
                                <div className="title d-sm-inline d-none">Property Consultancy</div>
                                <div className="agency-img">
                                    <FallbackImage src={agencyData?.agency?.agency_profile?.agency_image} alt="" pageName="AgencyDefault" />
                                </div>
                                <div>
                                    <Link to={window?.innerWidth <= 576 ? `/agency-detail/${agencyData?.agency?.id || agencyData?.agency?.agency_id}` : `/agency-detail/${agencyData?.agency?.id || agencyData?.agency?.agency_id}`} style={{ textDecoration: "none" }}>
                                        <div className="agency-name">{agencyData?.agency?.agency_profile?.agency_name || agencyData?.name}</div>
                                        <div className="agent-profile-box d-sm-none d-block">
                                            <div className="detail-box">
                                                <div className="top">
                                                    <div className="info-box">
                                                        <div className="box" style={{ padding: '0px 10px' }}>
                                                            <div className="text ">
                                                                <CustomTooltip className="d-sm-inline d-none" placement="top" title={userData?.address || userData?.city?.city ? userData?.address + (userData?.city?.city && userData?.address ? ", " : '') + userData?.city?.city : "-"} >
                                                                    <div className="d-flex align-items-center" style={{ gap: '4px' }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                            <path d="M13.3346 6.66634C13.3346 9.99501 9.64197 13.4617 8.40197 14.5323C8.28645 14.6192 8.14583 14.6662 8.0013 14.6662C7.85677 14.6662 7.71615 14.6192 7.60064 14.5323C6.36064 13.4617 2.66797 9.99501 2.66797 6.66634C2.66797 5.25185 3.22987 3.8953 4.23007 2.89511C5.23026 1.89491 6.58681 1.33301 8.0013 1.33301C9.41579 1.33301 10.7723 1.89491 11.7725 2.89511C12.7727 3.8953 13.3346 5.25185 13.3346 6.66634Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                            <path d="M8 8.66699C9.10457 8.66699 10 7.77156 10 6.66699C10 5.56242 9.10457 4.66699 8 4.66699C6.89543 4.66699 6 5.56242 6 6.66699C6 7.77156 6.89543 8.66699 8 8.66699Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                        <div className="para text-sm-start text-center">
                                                                            {userData?.address || userData?.city?.city ? userData?.address + (userData?.city?.city && userData?.address ? ", " : '') + userData?.city?.city : "-"}
                                                                        </div>
                                                                    </div>
                                                                </CustomTooltip>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </Link>
                                </div>

                                <Link className=' d-sm-inline d-none' to={`/agency-detail/${agencyData?.agency?.id || agencyData?.agency?.agency_id}`} style={{ textDecoration: "none" }}>
                                    <div className="agency-link">View Company</div>
                                </Link>
                            </div>
                        </div> : null}
                    </div>
                </div>
            </div>
            <ShareModal open={open} setOpen={setOpen} />
            <ReviewModal agentId={userData?.id} open={openReview} setOpen={setOpenReview} data={userData} refetchAgentData={refetchAgentData} />
            <CallModal open={openCall} setOpen={setOpenCall} contact={[userData?.mobile] || userData?.phone_number || userData?.whatsapp_number} />
            <LoginModal openDashboard={true} />
            {window?.innerWidth <= 992 && <AgentReviewCardViewModal open={openModal} setOpen={setOpenModal} rating={rating} data={userData} onOpenModal={reviewModalRef} />}
        </>
    )
}

export default Banner
