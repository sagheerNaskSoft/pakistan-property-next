import { Box, Modal } from '@mui/material'
import React, { useState, useEffect, useRef } from 'react'
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";

import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import './PropertyView.css'
import { useAuth } from '../../../Context/ContextProvider';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    // bgcolor: 'background.paper',
    // border: '1px solid #BBB',
    // boxShadow: 24,
    // borderRadius: "12px",
};
function PropertyView({ open, setOpen, data }) {
    const handleClose = () => setOpen(false);
    const { formatPriceWithCommas, propertyType } = useAuth()
    const count = data?.images?.length;
    const remaining = count - 4;
    // const mergedData = data?.amenities?.length ? data?.amenities?.flatMap(item => item.data) : [];
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const scrollRef = useRef(null);
    const slides = data?.images?.map((img) => ({
        src: img.url,
        downloadUrl: img.url, // optional for Download plugin
    }));

    const purposeName = propertyType.find(i => i.id === data?.property_type_id)?.name || "Null";

    const categoryName =
        propertyType.find(p => p.id === data?.property_type_id)
            ?.categories?.find(c => c.id === data?.category_id)?.name || "Null";

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

        let scrollTimeout;

        const handleScroll = () => {
            scrollElement.classList.add('show-scroll');
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                scrollElement.classList.remove('show-scroll');
            }, 1000);
        };

        scrollElement.addEventListener('scroll', handleScroll);
        
        return () => {
            scrollElement.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [open]);

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                BackdropProps={{
                    className: 'global-modal-background-color'
                }}
            >
                <Box sx={style} className="property-view-mui-modal">
                    <div className='property_view global-modal-base-color' style={{padding:'16px'}}>
                        <div className='header_property_view d-flex justify-content-end'>
                            <button onClick={handleClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <g clipPath="url(#clip0_1205_9878)">
                                        <path d="M15.9999 8.00031C15.8124 7.81284 15.5581 7.70752 15.2929 7.70752C15.0278 7.70752 14.7735 7.81284 14.5859 8.00031L11.9999 10.5863L9.41395 8.00031C9.22534 7.81815 8.97274 7.71735 8.71055 7.71963C8.44835 7.72191 8.19754 7.82708 8.01213 8.01249C7.82672 8.1979 7.72155 8.44871 7.71928 8.7109C7.717 8.9731 7.81779 9.2257 7.99995 9.41431L10.5859 12.0003L7.99995 14.5863C7.81779 14.7749 7.717 15.0275 7.71928 15.2897C7.72155 15.5519 7.82672 15.8027 8.01213 15.9881C8.19754 16.1735 8.44835 16.2787 8.71055 16.281C8.97274 16.2833 9.22534 16.1825 9.41395 16.0003L11.9999 13.4143L14.5859 16.0003C14.7745 16.1825 15.0271 16.2833 15.2893 16.281C15.5515 16.2787 15.8023 16.1735 15.9878 15.9881C16.1732 15.8027 16.2783 15.5519 16.2806 15.2897C16.2829 15.0275 16.1821 14.7749 15.9999 14.5863L13.4139 12.0003L15.9999 9.41431C16.1874 9.22678 16.2927 8.97247 16.2927 8.70731C16.2927 8.44214 16.1874 8.18783 15.9999 8.00031Z" fill="#2D2D2D" />
                                        <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1205_9878">
                                            <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </div>
                        <div ref={scrollRef} className='property_view_content custom-scroll-bar w-100'>
                            <h1>{data?.title} <span>({data?.property_number})</span></h1>
                            <p>{data?.plot_number} {data?.location?.name} {data?.city?.name}</p>
                            <div className="fb-gallery row g-2 m-0">
                                {/* ----- 1 IMAGE ----- */}
                                {count === 1 && (
                                    <div className="img-box col-120" onClick={() => { setIsOpen(true); setPhotoIndex(0); }}>
                                        <img src={data?.images[0].url} alt="" className="gallery-img full" />
                                    </div>
                                )}

                                {/* ----- 2 IMAGES ----- */}
                                {count === 2 && (
                                    <>
                                        {data?.images.slice(0, 2).map((img, i) => (
                                            <div key={i} className="img-box col-6" onClick={() => { setIsOpen(true); setPhotoIndex(i); }}>
                                                <img src={img.url} alt="" className="gallery-img half" />
                                            </div>
                                        ))}
                                    </>
                                )}

                                {/* ----- 3 IMAGES ----- */}
                                {count === 3 && (
                                    <>
                                        <div className="col-9" onClick={() => { setIsOpen(true); setPhotoIndex(0); }}>
                                            <div className='img-box h-100'>

                                                <img src={data?.images[0].url} alt="" className="gallery-img main" />
                                            </div>
                                        </div>
                                        <div className="col-3 d-flex flex-column gap-2">
                                            {data?.images.slice(1, 3).map((img, i) => (
                                                <div className='img-box' onClick={() => { setIsOpen(true); setPhotoIndex(i + 1); }}>
                                                    <img key={i} src={img.url} alt="" className="gallery-img half" />
                                                </div>
                                            ))}

                                        </div>
                                    </>
                                )}

                                {/* ----- 4 IMAGES ----- */}
                                {count === 4 && (
                                    <>
                                        <div className="img-box col-9" onClick={() => { setIsOpen(true); setPhotoIndex(0); }}>
                                            <img src={data?.images[0].url} alt="" className="gallery-img main" />
                                        </div>
                                        <div className="col-3 d-flex flex-column gap-2">
                                            {data?.images.slice(1, 4).map((img, i) => (
                                                <div
                                                    key={i}
                                                    className="img-box"
                                                    onClick={() => { setIsOpen(true); setPhotoIndex(i + 1); }}
                                                >
                                                    <img src={img.url} alt="" className="gallery-img side" />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* ----- MORE THAN 4 IMAGES ----- */}
                                {count > 4 && (
                                    <>
                                        <div className="col-9">
                                            <div className='full img-box' onClick={() => { setIsOpen(true); setPhotoIndex(0); }}>
                                                <img src={data?.images[0].url} alt="" className="gallery-img main" />
                                            </div>
                                        </div>
                                        <div className="col-3 d-flex flex-column gap-2">
                                            {data?.images.slice(1, 4).map((img, i) => (
                                                <div key={i} className="position-relative img-box" onClick={() => { setIsOpen(true); setPhotoIndex(i + 1); }}>
                                                    <img src={img.url} alt="" className="gallery-img side" />
                                                    {i === 2 && (
                                                        <div className="overlay">+{remaining}</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className='d-flex justify-content-between body_data' style={{ flexWrap: "wrap-reverse", gap: "12px" }}>
                                <h2 className='price m-0'><span>{data?.currency}</span> {formatPriceWithCommas(data?.price)}</h2>
                                <p className='posted_by m-0'>Posted by:{data?.user?.name ? data?.user?.name : "Pakistan Property"}</p>
                            </div>
                            <div className='detail_icons mt-2'>
                                <div className='svg-first'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M3.43584 7.77058L5.01254 6.19305L8.08846 9.26815C8.24555 9.41987 8.45595 9.50382 8.67433 9.50192C8.89272 9.50002 9.10162 9.41243 9.25605 9.258C9.41047 9.10357 9.49807 8.89467 9.49997 8.67628C9.50187 8.4579 9.41791 8.2475 9.26619 8.09042L6.1911 5.01449L7.76863 3.4378C7.88518 3.32121 7.96451 3.17267 7.99658 3.01097C8.02865 2.84927 8.01201 2.68169 7.94878 2.52945C7.88555 2.37721 7.77856 2.24715 7.64137 2.15576C7.50417 2.06436 7.34295 2.01573 7.1781 2.01603H3.21013C2.89291 2.01603 2.58869 2.14204 2.36439 2.36634C2.14009 2.59065 2.01407 2.89487 2.01407 3.21208V7.18005C2.01378 7.3449 2.06241 7.50613 2.1538 7.64332C2.2452 7.78051 2.37525 7.8875 2.52749 7.95073C2.67973 8.01397 2.84731 8.0306 3.00901 7.99853C3.17071 7.96646 3.31926 7.88713 3.43584 7.77058Z" fill="#2D2D2D" />
                                        <path d="M17.8073 19.0074L16.2298 20.5849C16.1136 20.7015 16.0345 20.85 16.0026 21.0116C15.9707 21.1731 15.9874 21.3405 16.0506 21.4926C16.1138 21.6447 16.2206 21.7746 16.3576 21.8659C16.4947 21.9573 16.6557 22.006 16.8204 22.0059H20.7883C21.1055 22.0059 21.4098 21.8798 21.6341 21.6555C21.8584 21.4312 21.9844 21.127 21.9844 20.8098V16.8418C21.9845 16.6771 21.9358 16.5159 21.8443 16.3789C21.7528 16.2418 21.6228 16.135 21.4706 16.0718C21.3184 16.0087 21.1509 15.9921 20.9892 16.0242C20.8276 16.0563 20.6791 16.1356 20.5626 16.2521L18.9859 17.8288L15.9108 14.7537C15.7537 14.602 15.5433 14.5181 15.325 14.52C15.1066 14.5219 14.8977 14.6095 14.7432 14.7639C14.5888 14.9183 14.5012 15.1272 14.4993 15.3456C14.4974 15.564 14.5814 15.7744 14.7331 15.9315L17.8073 19.0074Z" fill="#2D2D2D" />
                                        <path d="M20.7981 2.00653H16.8301C16.6654 2.0064 16.5042 2.05515 16.3672 2.14661C16.2301 2.23807 16.1233 2.36813 16.0601 2.52033C15.997 2.67254 15.9804 2.84005 16.0125 3.00167C16.0446 3.1633 16.1239 3.31177 16.2404 3.4283L17.8171 5.00499L14.742 8.08008C14.5858 8.23626 14.4979 8.44813 14.4978 8.66907C14.4978 8.89002 14.5854 9.10194 14.7416 9.25823C14.8978 9.41452 15.1097 9.50236 15.3306 9.50244C15.5516 9.50252 15.7635 9.41482 15.9198 9.25865L18.9957 6.18356L20.5724 7.76108C20.689 7.87763 20.8375 7.95696 20.9992 7.98903C21.1609 8.0211 21.3285 8.00447 21.4807 7.94124C21.633 7.878 21.763 7.77102 21.8544 7.63382C21.9458 7.49663 21.9944 7.3354 21.9941 7.17055V3.20258C21.9941 2.88537 21.8681 2.58115 21.6438 2.35684C21.4195 2.13254 21.1153 2.00653 20.7981 2.00653Z" fill="#2D2D2D" />
                                        <path d="M3.18966 22.0059H7.15763C7.3224 22.006 7.48352 21.9572 7.62058 21.8658C7.75765 21.7743 7.86451 21.6443 7.92764 21.4921C7.99077 21.3398 8.00733 21.1723 7.97523 21.0107C7.94314 20.8491 7.86382 20.7006 7.74732 20.5841L6.17063 19.0074L9.24572 15.9315C9.32527 15.8547 9.38873 15.7627 9.43238 15.6611C9.47603 15.5595 9.49901 15.4502 9.49997 15.3396C9.50093 15.229 9.47986 15.1194 9.43798 15.017C9.3961 14.9146 9.33425 14.8216 9.25605 14.7434C9.17784 14.6652 9.08485 14.6034 8.98249 14.5615C8.88013 14.5196 8.77045 14.4986 8.65986 14.4995C8.54926 14.5005 8.43997 14.5235 8.33835 14.5671C8.23673 14.6108 8.14483 14.6742 8.06799 14.7538L4.99207 17.8288L3.41454 16.2513C3.29792 16.1351 3.14944 16.056 2.98788 16.0241C2.82633 15.9922 2.65893 16.0089 2.50687 16.0721C2.3548 16.1353 2.22488 16.2421 2.13352 16.3791C2.04216 16.5162 1.99347 16.6772 1.9936 16.8419V20.8098C1.9936 21.127 2.11962 21.4312 2.34392 21.6555C2.56822 21.8798 2.87244 22.0059 3.18966 22.0059Z" fill="#2D2D2D" />
                                    </svg>
                                    <div className='svg-head'>
                                        <h4 className='mb-0'>{data?.area_size}</h4>
                                        <h5 className='mb-0'>{data?.unit_area || data?.area_unit}</h5>
                                    </div>
                                </div>
                                <div className='svg-first'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M19 6H13C12.0868 6.00335 11.1921 6.25737 10.4134 6.73437C9.63465 7.21136 9.00186 7.89302 8.584 8.705C7.9844 8.24979 7.25282 8.0023 6.5 8C5.57174 8 4.6815 8.36875 4.02513 9.02513C3.36875 9.6815 3 10.5717 3 11.5C3.00293 12.02 3.12289 12.5327 3.351 13H2V3C2 2.73478 1.89464 2.48043 1.70711 2.29289C1.51957 2.10536 1.26522 2 1 2C0.734784 2 0.48043 2.10536 0.292893 2.29289C0.105357 2.48043 0 2.73478 0 3L0 21C0 21.2652 0.105357 21.5196 0.292893 21.7071C0.48043 21.8946 0.734784 22 1 22C1.26522 22 1.51957 21.8946 1.70711 21.7071C1.89464 21.5196 2 21.2652 2 21V19H22V21C22 21.2652 22.1054 21.5196 22.2929 21.7071C22.4804 21.8946 22.7348 22 23 22C23.2652 22 23.5196 21.8946 23.7071 21.7071C23.8946 21.5196 24 21.2652 24 21V11C23.9984 9.67441 23.4711 8.40356 22.5338 7.46622C21.5964 6.52888 20.3256 6.00159 19 6ZM10 11C10 10.2044 10.3161 9.44129 10.8787 8.87868C11.4413 8.31607 12.2044 8 13 8H19C19.7956 8 20.5587 8.31607 21.1213 8.87868C21.6839 9.44129 22 10.2044 22 11V13H10V11ZM5 11.5C5 11.2033 5.08797 10.9133 5.2528 10.6666C5.41762 10.42 5.65189 10.2277 5.92597 10.1142C6.20006 10.0007 6.50166 9.97094 6.79264 10.0288C7.08361 10.0867 7.35088 10.2296 7.56066 10.4393C7.77044 10.6491 7.9133 10.9164 7.97118 11.2074C8.02906 11.4983 7.99935 11.7999 7.88582 12.074C7.77229 12.3481 7.58003 12.5824 7.33336 12.7472C7.08668 12.912 6.79667 13 6.5 13C6.10218 13 5.72064 12.842 5.43934 12.5607C5.15804 12.2794 5 11.8978 5 11.5ZM2 17V15H22V17H2Z" fill="#2D2D2D" />
                                    </svg>
                                    <div className='svg-head'>
                                        <h4 className='mb-0'>{data?.bedrooms}</h4>
                                        <h5 className='mb-0'>Bedrooms</h5>
                                    </div>
                                </div>
                                <div className='svg-first'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14 5.06657V3.73324C14 2.99657 13.4033 2.3999 12.6667 2.3999H5.33333C4.59667 2.3999 4 2.99657 4 3.73324V21.7332" stroke="#2D2D2D" strokeWidth="2.5" />
                                        <path d="M18 5.06641H10V7.73307H18V5.06641Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinejoin="round" />
                                        <path d="M8 7.7334H20" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinejoin="round" />
                                        <path d="M14 9.7334C13.632 9.7334 13.3333 10.0321 13.3333 10.4001C13.3333 10.7681 13.632 11.0667 14 11.0667C14.368 11.0667 14.6667 10.7681 14.6667 10.4001C14.6667 10.0321 14.368 9.7334 14 9.7334ZM10.6667 9.7334C10.2987 9.7334 10 10.0321 10 10.4001C10 10.7681 10.2987 11.0667 10.6667 11.0667C11.0347 11.0667 11.3333 10.7681 11.3333 10.4001C11.3333 10.0321 11.0347 9.7334 10.6667 9.7334ZM17.3333 9.7334C16.9653 9.7334 16.6667 10.0321 16.6667 10.4001C16.6667 10.7681 16.9653 11.0667 17.3333 11.0667C17.7013 11.0667 18 10.7681 18 10.4001C18 10.0321 17.7013 9.7334 17.3333 9.7334ZM14 12.4001C13.632 12.4001 13.3333 12.6987 13.3333 13.0667C13.3333 13.4347 13.632 13.7334 14 13.7334C14.368 13.7334 14.6667 13.4347 14.6667 13.0667C14.6667 12.6987 14.368 12.4001 14 12.4001ZM17.3333 12.4001C16.9653 12.4001 16.6667 12.6987 16.6667 13.0667C16.6667 13.4347 16.9653 13.7334 17.3333 13.7334C17.7013 13.7334 18 13.4347 18 13.0667C18 12.6987 17.7013 12.4001 17.3333 12.4001ZM10.6667 12.4001C10.2987 12.4001 10 12.6987 10 13.0667C10 13.4347 10.2987 13.7334 10.6667 13.7334C11.0347 13.7334 11.3333 13.4347 11.3333 13.0667C11.3333 12.6987 11.0347 12.4001 10.6667 12.4001ZM14 15.0667C13.632 15.0667 13.3333 15.3654 13.3333 15.7334C13.3333 16.1014 13.632 16.4001 14 16.4001C14.368 16.4001 14.6667 16.1014 14.6667 15.7334C14.6667 15.3654 14.368 15.0667 14 15.0667ZM17.3333 15.0667C16.9653 15.0667 16.6667 15.3654 16.6667 15.7334C16.6667 16.1014 16.9653 16.4001 17.3333 16.4001C17.7013 16.4001 18 16.1014 18 15.7334C18 15.3654 17.7013 15.0667 17.3333 15.0667ZM10.6667 15.0667C10.2987 15.0667 10 15.3654 10 15.7334C10 16.1014 10.2987 16.4001 10.6667 16.4001C11.0347 16.4001 11.3333 16.1014 11.3333 15.7334C11.3333 15.3654 11.0347 15.0667 10.6667 15.0667ZM14 17.7334C13.632 17.7334 13.3333 18.0321 13.3333 18.4001C13.3333 18.7681 13.632 19.0667 14 19.0667C14.368 19.0667 14.6667 18.7681 14.6667 18.4001C14.6667 18.0321 14.368 17.7334 14 17.7334ZM17.3333 17.7334C16.9653 17.7334 16.6667 18.0321 16.6667 18.4001C16.6667 18.7681 16.9653 19.0667 17.3333 19.0667C17.7013 19.0667 18 18.7681 18 18.4001C18 18.0321 17.7013 17.7334 17.3333 17.7334ZM10.6667 17.7334C10.2987 17.7334 10 18.0321 10 18.4001C10 18.7681 10.2987 19.0667 10.6667 19.0667C11.0347 19.0667 11.3333 18.7681 11.3333 18.4001C11.3333 18.0321 11.0347 17.7334 10.6667 17.7334ZM14 20.4001C13.632 20.4001 13.3333 20.6987 13.3333 21.0667C13.3333 21.4347 13.632 21.7334 14 21.7334C14.368 21.7334 14.6667 21.4347 14.6667 21.0667C14.6667 20.6987 14.368 20.4001 14 20.4001ZM17.3333 20.4001C16.9653 20.4001 16.6667 20.6987 16.6667 21.0667C16.6667 21.4347 16.9653 21.7334 17.3333 21.7334C17.7013 21.7334 18 21.4347 18 21.0667C18 20.6987 17.7013 20.4001 17.3333 20.4001ZM10.6667 20.4001C10.2987 20.4001 10 20.6987 10 21.0667C10 21.4347 10.2987 21.7334 10.6667 21.7334C11.0347 21.7334 11.3333 21.4347 11.3333 21.0667C11.3333 20.6987 11.0347 20.4001 10.6667 20.4001Z" fill="#2D2D2D" />
                                        <path d="M17.3457 9.7334C16.9777 9.7334 16.679 10.0321 16.679 10.4001C16.679 10.7681 16.9777 11.0667 17.3457 11.0667C17.7137 11.0667 18.0124 10.7681 18.0124 10.4001C18.0124 10.0321 17.7137 9.7334 17.3457 9.7334ZM14.0124 9.7334C13.6444 9.7334 13.3457 10.0321 13.3457 10.4001C13.3457 10.7681 13.6444 11.0667 14.0124 11.0667C14.3804 11.0667 14.679 10.7681 14.679 10.4001C14.679 10.0321 14.3804 9.7334 14.0124 9.7334ZM17.3457 12.4001C16.9777 12.4001 16.679 12.6987 16.679 13.0667C16.679 13.4347 16.9777 13.7334 17.3457 13.7334C17.7137 13.7334 18.0124 13.4347 18.0124 13.0667C18.0124 12.6987 17.7137 12.4001 17.3457 12.4001ZM14.0124 12.4001C13.6444 12.4001 13.3457 12.6987 13.3457 13.0667C13.3457 13.4347 13.6444 13.7334 14.0124 13.7334C14.3804 13.7334 14.679 13.4347 14.679 13.0667C14.679 12.6987 14.3804 12.4001 14.0124 12.4001ZM17.3457 15.0667C16.9777 15.0667 16.679 15.3654 16.679 15.7334C16.679 16.1014 16.9777 16.4001 17.3457 16.4001C17.7137 16.4001 18.0124 16.1014 18.0124 15.7334C18.0124 15.3654 17.7137 15.0667 17.3457 15.0667ZM14.0124 15.0667C13.6444 15.0667 13.3457 15.3654 13.3457 15.7334C13.3457 16.1014 13.6444 16.4001 14.0124 16.4001C14.3804 16.4001 14.679 16.1014 14.679 15.7334C14.679 15.3654 14.3804 15.0667 14.0124 15.0667ZM17.3457 17.7334C16.9777 17.7334 16.679 18.0321 16.679 18.4001C16.679 18.7681 16.9777 19.0667 17.3457 19.0667C17.7137 19.0667 18.0124 18.7681 18.0124 18.4001C18.0124 18.0321 17.7137 17.7334 17.3457 17.7334ZM14.0124 17.7334C13.6444 17.7334 13.3457 18.0321 13.3457 18.4001C13.3457 18.7681 13.6444 19.0667 14.0124 19.0667C14.3804 19.0667 14.679 18.7681 14.679 18.4001C14.679 18.0321 14.3804 17.7334 14.0124 17.7334ZM17.3457 20.4001C16.9777 20.4001 16.679 20.6987 16.679 21.0667C16.679 21.4347 16.9777 21.7334 17.3457 21.7334C17.7137 21.7334 18.0124 21.4347 18.0124 21.0667C18.0124 20.6987 17.7137 20.4001 17.3457 20.4001ZM14.0124 20.4001C13.6444 20.4001 13.3457 20.6987 13.3457 21.0667C13.3457 21.4347 13.6444 21.7334 14.0124 21.7334C14.3804 21.7334 14.679 21.4347 14.679 21.0667C14.679 20.6987 14.3804 20.4001 14.0124 20.4001Z" fill="#2D2D2D" />
                                    </svg>
                                    <div className='svg-head'>
                                        <h4 className='mb-0'>{data?.bathrooms}</h4>
                                        <h5 className='mb-0'>Bathrooms</h5>
                                    </div>
                                </div>
                            </div>
                            <hr style={{ marginTop: "29px", marginBottom: "20px" }} />
                            <div className='information_section'>
                                <h4>Information</h4>
                                <div className='row m-0'>
                                    <div className='col-6 px-0'>
                                        <h5 className="m-0">Purpose:</h5>
                                    </div>
                                    <div className='col-6 px-0'>
                                        <p className='m-0'>{purposeName}</p>
                                    </div>
                                    <div className='col-6 px-0'>
                                        <h5 className="m-0">Property Type:</h5>
                                    </div>
                                    <div className='col-6 px-0'>
                                        <p className='m-0'>{categoryName}</p>
                                    </div>
                                    <div className='col-6 px-0'>
                                        <h5 className="m-0">City:</h5>
                                    </div>
                                    <div className='col-6 px-0'>
                                        <p className='m-0'>{data?.city?.name}</p>
                                    </div>
                                    <div className='col-6 px-0'>
                                        <h5 className="m-0">Location:</h5>
                                    </div>
                                    <div className='col-6 px-0'>
                                        <p className='m-0'>{data?.location?.name}</p>
                                    </div>
                                </div>
                            </div>
                            <hr style={{ marginTop: "29px", marginBottom: "20px" }} />
                            <div className='information_section'>
                                <h4>Description</h4>
                                <p>{data?.description}</p>
                            </div>
                            <hr style={{ marginTop: "29px", marginBottom: "20px" }} />
                            <div className='amenities information_section'>
                                <h4>Amenities</h4>
                                <div className='main_amenity'>
                                    {
                                        data?.amenities?.length > 0 ?
                                            data?.amenities?.map((item) => (
                                                <div className='amenity'>
                                                    <span>{item?.label}
                                                        {/* {item?.type === "checkbox" ? "" : ":" + item?.selected_options} */}
                                                        </span>
                                                </div>
                                            ))
                                            :
                                            <p>No Amenities Found!</p>
                                    }

                                </div>


                            </div>
                            {isOpen && (
                                <Lightbox
                                    open={isOpen}
                                    close={() => setIsOpen(false)}
                                    slides={slides}
                                    index={photoIndex}
                                    plugins={[Fullscreen, Slideshow, Thumbnails, Zoom, Download, Counter]}
                                    counter={{ container: { style: { top: "20px" } } }}
                                />
                            )}
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default PropertyView