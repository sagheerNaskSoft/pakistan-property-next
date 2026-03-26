import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FaPlay } from "react-icons/fa6";
import img from '../../Asset/Projects/image-picture-svgrepo-com 1.svg';
import img1 from '../../Asset/Projects/Group 1312316357.svg';
import img2 from '../../Asset/Projects/Group 1312316358.svg';
import img3 from '../../Asset/Projects/fi-rr-search.svg';
import img4 from '../../Asset/Projects/Whatsapp.svg';
import img5 from '../../Asset/Projects/fi-rr-cross-circle.svg';
import img7 from '../../Asset/Projects/big-pix.svg';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useAuth } from '../../Context/ContextProvider';
import { useParams } from 'react-router-dom';
import defaultImage from '../../Asset/HomePage/no_image_larger.svg'
import defaultVideo from '../../Asset/HomePage/no_video_large.svg'
import { FallbackImage } from './FallbackImage'
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";
import CallModal from './CallModal';
import { buildPropertyWhatsappMessage, getPropertyDetailUrl } from '../../utils/propertyWhatsappMessage';
import Image from 'next/image';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'fit-content',
  // height: 675,
  // bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  outline: 'none'
  // p: 4,
};

function Popup({ open, setOpen, profileData }) {
  const handleClose = () => setOpen(false);
  const [view, setView] = useState("Images");
  const sliderRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // const middleIndex = Math.floor(visibleDots / 2);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const mainVideoRef = useRef < HTMLVideoElement | null > (null);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const videoList = profileData?.video_links || [];

  // Helper function to check if URL is YouTube and extract video ID
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Check if URL is YouTube
  const isYouTubeUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  };

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return defaultVideo;
  };

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: selectedIndex, // only for first render
    asNavFor: null,
    beforeChange: (oldIndex, newIndex) => {
      setSelectedIndex(newIndex);
    },
  };

  const settings1 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    beforeChange: (oldIndex, newIndex) => {
      setSelectedVideoIndex(newIndex);
    },
    adaptiveHeight: true,
  };



  const goNext = () => {
    setCurrentIndex((prev) => prev - 1);
  };
  const goPrev = () => {
    setCurrentIndex((prev) => prev + 1);
  };


  useEffect(() => {
    if (view === "Images" && sliderRef.current?.slickGoTo) {
      sliderRef.current.slickGoTo(selectedIndex);
    }
  }, [selectedIndex, view]);

  useEffect(() => {
    // Only update video src if it's not a YouTube URL
    if (mainVideoRef.current && videoList[selectedVideoIndex]) {
      const currentVideoUrl = videoList[selectedVideoIndex];
      if (!isYouTubeUrl(currentVideoUrl)) {
        mainVideoRef.current.pause();
        mainVideoRef.current.src = currentVideoUrl;
        mainVideoRef.current.load();
        // optional: autoplay when switching
        // mainVideoRef.current.play();
      }
    }
  }, [selectedVideoIndex, videoList]);
  useEffect(() => {
    if (view === "Video" && sliderRef.current?.slickGoTo) {
      sliderRef.current.slickGoTo(selectedVideoIndex);
    }
  }, [selectedVideoIndex, view]);
  const { handleOpenWhatsapp, whatsappImpretion, loginData } = useAuth()
  const parms = useParams()

  // Handle call button click - always show modal
  const handleCallClick = () => {
    const contacts = profileData?.contact || [];
    const contactArray = Array.isArray(contacts) ? contacts : (contacts ? [contacts] : []);
    
    if (contactArray.length > 0) {
      setCallModalOpen(true);
    }
  };

  // Handle WhatsApp click - open chat
  const handleWhatsAppClick = () => {
    const phoneNumber = profileData?.contact?.[0] || profileData?.contact;
    if (phoneNumber) {
      const cleanNumber = phoneNumber.toString().replace(/\s+/g, '').replace(/\D/g, '');
      const userName = loginData?.data?.user?.name;
      const cityLine = [profileData?.location?.name, profileData?.city].filter(Boolean).join(', ');
      const msg = buildPropertyWhatsappMessage({
        userName: (userName && String(userName).trim()) || 'there',
        propertyTitle: profileData?.title,
        city: cityLine,
        propertyUrl: getPropertyDetailUrl(parms?.slug),
      });
      handleOpenWhatsapp(cleanNumber, msg);
      whatsappImpretion("whatsapp", parms?.slug);
    }
  };

  // Detect screen size for mobile photo viewer
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle keyboard navigation for modal
  const handleModalKeyDown = (event) => {
    // Prevent keyboard navigation if user is typing in an input field
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT')) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (view === 'Images' && sliderRef.current) {
        sliderRef.current.slickPrev();
      } else if (view === 'Video' && videoList.length > 1) {
        const newIndex = selectedVideoIndex > 0 ? selectedVideoIndex - 1 : videoList.length - 1;
        setSelectedVideoIndex(newIndex);
      }
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (view === 'Images' && sliderRef.current) {
        sliderRef.current.slickNext();
      } else if (view === 'Video' && videoList.length > 1) {
        const newIndex = selectedVideoIndex < videoList.length - 1 ? selectedVideoIndex + 1 : 0;
        setSelectedVideoIndex(newIndex);
      }
    }
  };

  // Prepare slides for lightbox
  const lightboxSlides = profileData?.images?.map((img) => ({
    src: img.url,
    alt: `Property image`
  })) || [];
  const [images, setImages] = useState([]);
  useEffect(() => {
    if (profileData?.project_cover_image) {
      setImages([{url:profileData?.project_cover_image},...profileData?.images]);
    }
    else {
      setImages(profileData?.images);
    }
  }, [profileData]);
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        onKeyDown={handleModalKeyDown}
        BackdropProps={{
          className: 'global-modal-background-color'
        }}
      >
        <Box className="modal-box" sx={style}>
          <div className='popup-model global-modal-base-color'>
          <div className='cross-button d-md-flex d-none' onClick={handleClose} style={{ cursor: 'pointer', marginBottom: '5px' }}>
                <Image src={img5} alt='close-button' />
              </div>
            <div className="d-md-none d-flex align-items-center justify-content-between flex-row-reverse" style={{ gap: "16px" , padding: "0 16px" }}>
              <div className='cross-button d-md-none d-flex' onClick={handleClose} style={{ cursor: 'pointer', marginBottom: '5px' }}>
                <Image src={img5} alt='close-button' />
              </div>
              <div className='uper-tabs d-md-none d-flex' style={{ borderColor: "#737678", maxWidth:"400px"}}>
                <div
                  className={`img-tab ${view === "Images" ? 'active-tab' : ''}`}
                  onClick={() => setView("Images")}
                >
                  <Image
                    src={img}
                    alt="Images Tab"
                    style={{ filter: view === "Images" ? 'brightness(0) invert(1)' : 'none' }}
                  />
                  <h5 style={{ marginTop: '7px', color: view === "Images" ? '#fff' : 'inherit' }}>
                    Images
                  </h5>
                </div>


                <div
                  className={`img-tab ${view === "Video" ? 'active-tab' : ''}`}
                  onClick={() => setView("Video")}
                >
                  <Image
                    src={img1}
                    alt='Videos Tab'
                    style={{ filter: view === "Video" ? 'brightness(0) invert(1)' : 'none' }}
                  />
                  <h5 style={{ marginTop: '7px', color: view === "Video" ? '#fff' : 'inherit' }}>
                    Videos
                  </h5>
                </div>


                <div
                  className={`img-tab ${view === "Map" ? 'active-tab' : ''}`}
                  onClick={() => setView("Map")}
                >
                  <Image
                    src={img2}
                    alt='Map Tab'
                    style={{ filter: view === "Map" ? 'brightness(0) invert(1)' : 'none' }}
                  />
                  <h5 style={{ marginTop: '7px', color: view === "Map" ? '#fff' : 'inherit' }}>
                    Map
                  </h5>
                </div>
              </div>
            </div>

            {/* also copied down in the code */}
            <div className='modal_popup_box'>
              {/* <div style={{marginBottom:"20px"}} className='d-flex image_popup-model align-items-center gap-2'>
            <div className='profile_image_popup-model'>
              <Image src={profileData?.user?.agency?.agency_profile?.agency_image || profileData?.user?.avatar}  alt="" />
            </div>
            <div>
              <h6 className='m-0'>High Rise Project</h6>
              <p className='m-0'><svg className='me-1' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3346 6.66634C13.3346 9.99501 9.64197 13.4617 8.40197 14.5323C8.28645 14.6192 8.14583 14.6662 8.0013 14.6662C7.85677 14.6662 7.71615 14.6192 7.60064 14.5323C6.36064 13.4617 2.66797 9.99501 2.66797 6.66634C2.66797 5.25185 3.22987 3.8953 4.23007 2.89511C5.23026 1.89491 6.58681 1.33301 8.0013 1.33301C9.41579 1.33301 10.7723 1.89491 11.7725 2.89511C12.7727 3.8953 13.3346 5.25185 13.3346 6.66634Z" stroke="#737678" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 8.66699C9.10457 8.66699 10 7.77156 10 6.66699C10 5.56242 9.10457 4.66699 8 4.66699C6.89543 4.66699 6 5.56242 6 6.66699C6 7.77156 6.89543 8.66699 8 8.66699Z" stroke="#737678" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              </svg> DHA Phase 6 Lahore</p>
            </div>
          </div> */}
              {/* Tabs */}

              <div className='model-uper-section'>
                <div className='row m-0 w-100 align-items-center justify-content-between'>
                  <div className='col-xl-9 col-lg-8 col-md-6 order-md-first order-last p-0'>
                    <div className='uper-tabs d-md-flex d-none' style={{ borderColor: "#737678" }}>
                      <div
                        className={`img-tab ${view === "Images" ? 'active-tab' : ''}`}
                        onClick={() => setView("Images")}
                      >
                        <Image
                          src={img}
                          alt="Images Tab"
                          style={{ filter: view === "Images" ? 'brightness(0) invert(1)' : 'none' }}
                        />
                        <h5 style={{ marginTop: '7px', color: view === "Images" ? '#fff' : 'inherit' }}>
                          Images
                        </h5>
                      </div>


                      <div
                        className={`img-tab ${view === "Video" ? 'active-tab' : ''}`}
                        onClick={() => setView("Video")}
                      >
                        <Image
                          src={img1}
                          alt='Videos Tab'
                          style={{ filter: view === "Video" ? 'brightness(0) invert(1)' : 'none' }}
                        />
                        <h5 style={{ marginTop: '7px', color: view === "Video" ? '#fff' : 'inherit' }}>
                          Videos
                        </h5>
                      </div>


                      <div
                        className={`img-tab ${view === "Map" ? 'active-tab' : ''}`}
                        onClick={() => setView("Map")}
                      >
                        <Image
                          src={img2}
                          alt='Map Tab'
                          style={{ filter: view === "Map" ? 'brightness(0) invert(1)' : 'none' }}
                        />
                        <h5 style={{ marginTop: '7px', color: view === "Map" ? '#fff' : 'inherit' }}>
                          Map
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-3 col-lg-4 col-md-6 col-12  ps-lg-4 ps-md-2 ps-0 mb-md-0 mb-4 pe-0'>
                    {/* Action Buttons */}
                    <div className='popuo-button justify-content-lg-start justify-content-md-end justify-content-between align-items-center'>
                      <div className='action-buttons' style={{ bottom: "calc(0px + env(safe-area-inset-bottom))" }}>
                        <div className='green-button' onClick={handleCallClick} style={{ cursor: 'pointer' }}>
                          <Image src={img3} alt='call-icon' />
                          <h5>Call</h5>
                        </div>
                        <div onClick={handleWhatsAppClick} className='whatspp-button' style={{ cursor: 'pointer' }}>
                          <Image src={img4} alt='whatsapp-icon' />
                          <h5>WhatsApp</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Lower Section */}
              <div className='lower-section mt-md-3 mt-1 pt-md-2 pt-0'>
                <div className='row w-100 m-0'>
                  <div className={view === "Map" ? 'col-lg-12 ps-0 h-100 pe-md-3 px-0' : 'col-xl-9 col-lg-8 col-md-10 px-lg-0 ps-md-0 pe-md-1 px-0 h-100'}>
                    <div style={{ background: "lightgray" }} className='lower-imges global-border-radius-stroke'>
                      {view === "Images" && (
                        images?.length > 0 ?
                          <Slider ref={sliderRef} {...settings}>
                            {images?.map((data, index) => (
                              <div
                                key={index}
                                className=''
                                onClick={() => {
                                  if (isMobile) {
                                    setLightboxIndex(index);
                                    setLightboxOpen(true);
                                  }
                                }}
                                style={{
                                  cursor: isMobile ? 'pointer' : 'default',
                                  position: 'relative',
                                  width: '100%',
                                  height: '100%'
                                }}
                              >
                                <Image
                                  src={data.url}
                                  alt="Main"
                                  className="img-fluid w-100 h-100"
                                  style={{ objectFit: "contain" }}
                                />
                                {isMobile && (
                                  <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    pointerEvents: 'none'
                                  }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                      <path d="M15 3H9C7.9 3 7 3.9 7 5V19C7 20.1 7.9 21 9 21H15C16.1 21 17 20.1 17 19V5C17 3.9 16.1 3 15 3ZM15 19H9V5H15V19ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z" fill="white" />
                                      <path d="M12 14.5C12.83 14.5 13.5 15.17 13.5 16C13.5 16.83 12.83 17.5 12 17.5C11.17 17.5 10.5 16.83 10.5 16C10.5 15.17 11.17 14.5 12 14.5Z" fill="white" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            ))}
                          </Slider>
                          :
                          <div className='w-100 h-100 d-flex align-items-center justify-content-center'>
                            <FallbackImage src={''} alt="" style={{ objectFit: "cover" }} className="img-fluid w-100 h-100" pageName="PropertyDetail" />
                          </div>
                      )}
                      {
                        view === "Map" ? '' :
                          (
                            (view === "Images" && profileData?.images?.length > 1) || (view === "Video" && profileData?.video_links?.length > 1) ?
                              <div className="arrow-box">
                                <div className="arrow arrow-left" onClick={() => {
                                  sliderRef.current?.slickPrev();
                                  goNext();
                                }}

                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M10.5999 12.7098C10.5061 12.6169 10.4317 12.5063 10.381 12.3844C10.3302 12.2625 10.3041 12.1318 10.3041 11.9998C10.3041 11.8678 10.3302 11.7371 10.381 11.6152C10.4317 11.4934 10.5061 11.3828 10.5999 11.2898L15.1899 6.70982C15.2836 6.61685 15.358 6.50625 15.4088 6.38439C15.4595 6.26253 15.4857 6.13183 15.4857 5.99982C15.4857 5.8678 15.4595 5.7371 15.4088 5.61524C15.358 5.49338 15.2836 5.38278 15.1899 5.28982C15.0025 5.10356 14.749 4.99902 14.4849 4.99902C14.2207 4.99902 13.9672 5.10356 13.7799 5.28982L9.18986 9.87982C8.62806 10.4423 8.3125 11.2048 8.3125 11.9998C8.3125 12.7948 8.62806 13.5573 9.18986 14.1198L13.7799 18.7098C13.9661 18.8946 14.2175 18.9987 14.4799 18.9998C14.6115 19.0006 14.7419 18.9754 14.8638 18.9256C14.9856 18.8758 15.0964 18.8025 15.1899 18.7098C15.2836 18.6169 15.358 18.5063 15.4088 18.3844C15.4595 18.2625 15.4857 18.1318 15.4857 17.9998C15.4857 17.8678 15.4595 17.7371 15.4088 17.6152C15.358 17.4934 15.2836 17.3828 15.1899 17.2898L10.5999 12.7098Z" fill="white" />
                                  </svg>
                                </div>
                                <div className="arrow arrow-right" onClick={() => {
                                  sliderRef.current?.slickNext();
                                  goPrev()
                                }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15.3993 9.87982L10.8093 5.28982C10.622 5.10356 10.3685 4.99902 10.1043 4.99902C9.84013 4.99902 9.58668 5.10356 9.39931 5.28982C9.30559 5.38278 9.23119 5.49338 9.18042 5.61524C9.12965 5.7371 9.10352 5.8678 9.10352 5.99982C9.10352 6.13183 9.12965 6.26253 9.18042 6.38439C9.23119 6.50625 9.30559 6.61685 9.39931 6.70982L13.9993 11.2898C14.093 11.3828 14.1674 11.4934 14.2182 11.6152C14.269 11.7371 14.2951 11.8678 14.2951 11.9998C14.2951 12.1318 14.269 12.2625 14.2182 12.3844C14.1674 12.5063 14.093 12.6169 13.9993 12.7098L9.39931 17.2898C9.21101 17.4768 9.1047 17.7309 9.10376 17.9963C9.10282 18.2616 9.20734 18.5165 9.39431 18.7048C9.58129 18.8931 9.83541 18.9994 10.1008 19.0004C10.3661 19.0013 10.621 18.8968 10.8093 18.7098L15.3993 14.1198C15.9611 13.5573 16.2767 12.7948 16.2767 11.9998C16.2767 11.2048 15.9611 10.4423 15.3993 9.87982Z" fill="white" />
                                  </svg>
                                </div>
                              </div>
                              : ""
                          )
                      }

                      {view === "Video" && (
                        <Slider ref={sliderRef} {...settings1}>
                          {
                            profileData?.video_links?.length > 0 ?
                              videoList.map((videoUrl, index) => (
                                <div key={index} className="video-container">
                                  {isYouTubeUrl(videoUrl) ? (
                                    <iframe
                                      width="100%"
                                      height="535px"
                                      src={getYouTubeEmbedUrl(videoUrl)}
                                      title="YouTube video player"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                      style={{
                                        borderRadius: '4px'
                                      }}
                                    />
                                  ) : (
                                    <video
                                      className="img-fluid w-100"
                                      controls
                                      // poster={img6}
                                      style={{
                                        width: '100%',
                                        height: '535px', // Increase height here
                                        objectFit: 'cover',
                                        borderRadius: '4px'
                                      }}
                                    >
                                      <source src={videoUrl} type="video/mp4" />
                                    </video>
                                  )}
                                </div>
                              ))
                              :
                              <div className='w-100 h-100 d-flex align-items-center justify-content-center'>
                                <Image src={defaultVideo} alt="" style={{ objectFit: "cover" }} className="img-fluid w-100" />
                              </div>
                          }
                        </Slider>
                      )}

                      <div className='h-100'>
                        {view === "Map" && (
                          <iframe
                            title="Google Map"
                            src={`https://maps.google.com/maps?q=${profileData?.location?.geo_location?.lat},${profileData?.location?.geo_location?.lng}&z=15&output=embed`}
                            width="100%"
                            height="100%"
                            style={{ border: 0, borderRadius: '8px' }}
                            allowFullScreen=""
                            loading="lazy"
                            className='detail-map'
                          ></iframe>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side Thumbnails */}
                  <div className={view === "Map" ? 'd-none' : 'col-xl-3 col-lg-4 col-md-2 ps-lg-4 ps-md-1 ps-0 pe-0 mt-lg-0 mt-lg-2 d-sm-inline d-none h-100'}>
                    {view === "Images" && (
                      <div className="lower-side-section">
                        <div className="image-box-container">
                          {
                            images?.length > 0 ?
                              images?.map((data, index) => (
                                <div
                                  key={index}
                                  className={`lower-side-imges ${selectedIndex === index ? "active" : ""}`}
                                  onClick={() => {
                                    if (isMobile) {
                                      setLightboxIndex(index);
                                      setLightboxOpen(true);
                                    } else {
                                      setSelectedIndex(index);
                                    }
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <Image src={data.url} alt={`thumb-${index}`} className="img-fluid" />
                                </div>
                              ))
                              :
                              <div className="text">No Image Found</div>
                          }
                        </div>
                      </div>
                    )}

                    {view === "Video" && (
                      <div className='lower-side-section'>
                        <div className='image-box-container'>
                          {
                            profileData?.video_links?.length > 0 ?
                              videoList.map((videoUrl, index) => (
                                <div
                                  key={index}
                                  className={`lower-side-imges ${selectedVideoIndex === index ? "active" : ""}`}
                                  onClick={() => setSelectedVideoIndex(index)}
                                  style={{ cursor: "pointer", position: "relative", flex: "0 0 100px" }}
                                >
                                  {isYouTubeUrl(videoUrl) ? (
                                    <Image
                                      src={getYouTubeThumbnail(videoUrl)}
                                      alt="YouTube thumbnail"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "5px",
                                      }}
                                      onError={(e) => {
                                        e.target.src = defaultVideo;
                                      }}
                                    />
                                  ) : (
                                    <video
                                      src={videoUrl || defaultVideo}
                                      poster={img7}
                                      muted
                                      preload="metadata"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "5px",
                                      }}
                                    />
                                  )}
                                  <div
                                    className="video-icon"
                                    style={{
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    <FaPlay style={{ marginLeft: "2px" }} />
                                  </div>
                                </div>
                              ))
                              :
                              <div className="text">No Video Found</div>
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Box>
      </Modal>
      {/* Mobile Photo Viewer with Zoom (≤992px) - Rendered outside Modal */}
      {/* {isMobile && view === "Images" && lightboxSlides.length > 0 && (
      <Lightbox
        plugins={[Zoom, Counter]}
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
        styles={{
          container: { zIndex: 10000000 },
          root: { zIndex: 10000000 }
        }}
      />
    )} */}
      {/* Call Modal */}
      <CallModal 
        open={callModalOpen} 
        setOpen={setCallModalOpen} 
        contact={profileData?.contact} 
        propertyId={parms?.slug}
      />
    </>
  );
}

export default Popup;
