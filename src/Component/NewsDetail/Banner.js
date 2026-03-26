import React, { useEffect, useState, useRef, useMemo } from 'react'
import BreadCrumb from '../Metiral/BreadCrumb'
import { Helmet } from 'react-helmet';
import { FallbackImage } from '../Metiral/FallbackImage';
import { useNavigate, useParams } from 'react-router-dom';
import ShareModal from '../Metiral/ShareModal';
import { useAuth } from '../../Context/ContextProvider';
import CustomTooltip from '../Metiral/CustomTooltip';
function Banner({ blogData, categoryList, blogSlider, setBlogSlider }) {
    const [active, setActive] = useState("All");
    const [open, setOpen] = useState(false);
    const params = useParams();
    const activeTabRef = useRef(null);
    const { objectToQueryString, getAd, setAdData, addData, adsClick, adsImpression } = useAuth()
    const [deviceType, setDeviceType] = useState('desktop'); // 'mobile', 'tablet', 'desktop'
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const trackedImpressionsRef = useRef(new Set()); // Track which ad IDs have already been tracked

    // Get and decode the slug from URL
    const getDecodedSlug = () => {
        if (params?.slug) {
            try {
                const decoded = decodeURIComponent(params.slug);
                // Format: replace hyphens with spaces and capitalize first letter of each word
                return decoded
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
            } catch (e) {
                return params.slug;
            }
        }
        return '';
    };

    const decodedSlug = getDecodedSlug();

    const navigate = useNavigate()

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-UK', options);
    }
    useEffect(() => {
        if (blogData?.category) {
            setActive(blogData?.category)
        } else {
            setActive("All")
        }
    }, [blogData?.category])

    useEffect(() => {
        if (activeTabRef.current) {
            activeTabRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [active])
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
            if (!addData?.length) {
                const result = await getAd()
                if (result?.success) {
                    setAdData(result?.data?.data);
                }
            }
        }
        fetchAds()
    }, [addData, getAd, setAdData])

    // Filter ads based on device type and ad type, sorted by priority
    const getFilteredAds = useMemo(() => {
        if (!addData || addData.length === 0) return { vertical: [], horizontal: [] };

        const filtered = addData.filter(ad => {
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
    }, [addData, deviceType]);

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

    // Insert horizontal ads in news content
    const getContentWithAds = useMemo(() => {
        if (!blogData?.content) return '';

        const horizontalAds = getFilteredAds.horizontal;
        if (horizontalAds.length === 0) return blogData.content;

        // Create a temporary div to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = blogData.content;

        // Get all paragraphs
        const paragraphs = Array.from(tempDiv.querySelectorAll('p'));

        if (paragraphs.length === 0) return blogData.content;

        let adIndex = 0;
        const adInsertionPoints = [];

        // Calculate insertion points: after 2nd, 5th paragraph, then every 5 paragraphs
        paragraphs.forEach((p, index) => {
            if (adIndex < horizontalAds.length) {
                const shouldInsert = index === 1 || index === 4 || (index > 4 && (index - 4) % 5 === 0);
                if (shouldInsert) {
                    adInsertionPoints.push({ paragraph: p, ad: horizontalAds[adIndex] });
                    adIndex++;
                }
            }
        });

        // Insert ads after paragraphs
        adInsertionPoints.forEach(({ paragraph, ad }) => {
            const adDiv = document.createElement('div');
            adDiv.className = 'blog-horizontal-ad';
            adDiv.style.cssText = 'margin: 20px 0; text-align: center;';
            const adLink = document.createElement('a');
            adLink.href = ad.url;
            adLink.onclick = (e) => {
                e.preventDefault();
                handleAdClick(ad.id, ad.url);
            };
            adLink.style.display = 'block';
            const adImg = document.createElement('img');
            adImg.src = ad.image;
            adImg.alt = ad.title || 'Advertisement';
            adImg.style.cssText = 'width: 100%; height: auto; border-radius: 4px;';
            adLink.appendChild(adImg);
            adDiv.appendChild(adLink);
            if (paragraph.nextSibling) {
                paragraph.parentNode.insertBefore(adDiv, paragraph.nextSibling);
            } else {
                paragraph.parentNode.appendChild(adDiv);
            }
        });

        return tempDiv.innerHTML;
    }, [blogData?.content, getFilteredAds.horizontal]);
    return (
        <>
            <Helmet>
                {blogData?.meta_title && <title>{blogData?.meta_title}</title>}
                {blogData?.meta_description && <meta name="description" content={blogData?.meta_description} />}
            </Helmet>
            <div style={{ marginBottom: '17px' }} className={`all-blog-li ${blogSlider ? "blog-slider-li" : ""}`}>
                <div className="d-flex align-items-center justify-content-between global-input-section-header">
                    <h4 className='global-input-section-title mb-sm-2 mb-0 d-sm-none d-block'>Categories</h4>
                    <div onClick={() => setBlogSlider(false)} className="input-section-close-btn d-sm-none d-flex justify-content-center align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15.9999 8.00031C15.8124 7.81284 15.5581 7.70752 15.2929 7.70752C15.0278 7.70752 14.7735 7.81284 14.5859 8.00031L11.9999 10.5863L9.41395 8.00031C9.22534 7.81815 8.97274 7.71735 8.71055 7.71963C8.44835 7.72191 8.19754 7.82708 8.01213 8.01249C7.82672 8.1979 7.72155 8.44871 7.71928 8.7109C7.717 8.9731 7.81779 9.2257 7.99995 9.41431L10.5859 12.0003L7.99995 14.5863C7.81779 14.7749 7.717 15.0275 7.71928 15.2897C7.72155 15.5519 7.82672 15.8027 8.01213 15.9881C8.19754 16.1735 8.44835 16.2787 8.71055 16.281C8.97274 16.2833 9.22534 16.1825 9.41395 16.0003L11.9999 13.4143L14.5859 16.0003C14.7745 16.1825 15.0271 16.2833 15.2893 16.281C15.5515 16.2787 15.8023 16.1735 15.9878 15.9881C16.1732 15.8027 16.2783 15.5519 16.2806 15.2897C16.2829 15.0275 16.1821 14.7749 15.9999 14.5863L13.4139 12.0003L15.9999 9.41431C16.1874 9.22678 16.2927 8.97247 16.2927 8.70731C16.2927 8.44214 16.1874 8.18783 15.9999 8.00031Z" fill="#2D2D2D"></path><path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D"></path></svg></div>
                </div>
                <ul>
                    <li
                        // key={cat?.id}
                        className={active === "All" ? "active" : ""}
                        onClick={() => {
                            navigate("/all-news");
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
                                    className={active === cat?.slug || blogData?.category === cat?.name ? "active" : ""}
                                    onClick={() => {
                                        const queryString = objectToQueryString({ category: cat?.slug });
                                        navigate(`/all-news?${queryString}`);
                                        setBlogSlider(false);
                                    }}
                                >
                                    <span>{cat?.name}</span>
                                    <span className='count'>{cat?.news_count}</span>
                                </li>
                            ))
                        : ""}

                </ul>
            </div>
            <div className='blog-detail-container main-container'>
                <span className='d-sm-block d-none'>
                    <BreadCrumb items={['Home', "News", "News Details", decodedSlug]} paths={["/", "/news"]} />
                </span>
                <div className='blog-detail-headings d-sm-flex d-none'>
                    <h1>{blogData?.title}</h1>
                   <CustomTooltip title="Share" placement="top">
                   <div className="share-btn" onClick={() => setOpen(true)}>
                        <div className="share-tooltip">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18.1008 14.2205C17.4714 14.221 16.8517 14.3747 16.2949 14.6682C15.7382 14.9617 15.2613 15.3863 14.9053 15.9052L9.48734 13.4589C9.87216 12.5296 9.87365 11.4859 9.4915 10.5555L14.902 8.0967C15.4296 8.85979 16.2132 9.4085 17.1108 9.6433C18.0083 9.8781 18.9602 9.78343 19.7939 9.37648C20.6277 8.96953 21.2879 8.27724 21.6549 7.42519C22.0219 6.57314 22.0714 5.61777 21.7943 4.73237C21.5173 3.84697 20.9321 3.09019 20.1449 2.5993C19.3577 2.10842 18.4206 1.91594 17.5036 2.05678C16.5866 2.19762 15.7505 2.66245 15.1469 3.36696C14.5433 4.07147 14.2121 4.96899 14.2136 5.89672C14.2171 6.11631 14.2394 6.33518 14.2802 6.55097L8.52844 9.16464C7.97602 8.64708 7.28446 8.30216 6.5387 8.17225C5.79295 8.04233 5.02548 8.13309 4.3306 8.43336C3.63571 8.73363 3.04367 9.23035 2.62721 9.86247C2.21075 10.4946 1.988 11.2346 1.98634 11.9916C1.98467 12.7486 2.20417 13.4896 2.61785 14.1235C3.03153 14.7575 3.62138 15.2568 4.31494 15.5601C5.0085 15.8634 5.77556 15.9576 6.52187 15.8309C7.26819 15.7043 7.96127 15.3624 8.51595 14.8473L14.2827 17.451C14.2426 17.6666 14.2206 17.8851 14.2169 18.1044C14.2167 18.8728 14.4445 19.624 14.8713 20.2629C15.298 20.9019 15.9047 21.3999 16.6146 21.6941C17.3245 21.9882 18.1056 22.0652 18.8593 21.9153C19.6129 21.7655 20.3052 21.3955 20.8485 20.8521C21.3919 20.3088 21.7619 19.6165 21.9117 18.8629C22.0616 18.1092 21.9846 17.3281 21.6905 16.6182C21.3963 15.9083 20.8983 15.3016 20.2593 14.8748C19.6204 14.4481 18.8692 14.2203 18.1008 14.2205ZM18.1008 3.67677C18.5399 3.67661 18.9692 3.80667 19.3344 4.0505C19.6995 4.29433 19.9842 4.64098 20.1523 5.04661C20.3205 5.45224 20.3646 5.89862 20.279 6.32931C20.1935 6.75999 19.9821 7.15562 19.6717 7.46617C19.3612 7.77672 18.9657 7.98823 18.535 8.07396C18.1044 8.15968 17.658 8.11577 17.2523 7.94777C16.8466 7.77977 16.4998 7.49524 16.2559 7.13015C16.0119 6.76506 15.8817 6.33582 15.8817 5.89672C15.8821 5.30824 16.116 4.74396 16.5321 4.32776C16.9481 3.91156 17.5123 3.67743 18.1008 3.67677ZM5.89313 14.2205C5.45403 14.2207 5.02474 14.0906 4.65956 13.8468C4.29439 13.6029 4.00972 13.2563 3.84157 12.8507C3.67342 12.445 3.62934 11.9987 3.7149 11.568C3.80046 11.1373 4.01183 10.7417 4.32226 10.4311C4.63269 10.1206 5.02825 9.90904 5.4589 9.82332C5.88955 9.73759 6.33595 9.78151 6.74164 9.9495C7.14734 10.1175 7.49409 10.402 7.73806 10.7671C7.98203 11.1322 8.11225 11.5615 8.11225 12.0006C8.11159 12.589 7.8776 13.1531 7.46161 13.5693C7.04561 13.9854 6.48155 14.2196 5.89313 14.2205ZM18.1008 20.3243C17.6617 20.3243 17.2325 20.1941 16.8674 19.9502C16.5024 19.7063 16.2178 19.3596 16.0498 18.9539C15.8818 18.5483 15.8378 18.1019 15.9235 17.6713C16.0091 17.2407 16.2206 16.8451 16.531 16.5346C16.8415 16.2242 17.2371 16.0127 17.6677 15.9271C18.0983 15.8414 18.5447 15.8854 18.9503 16.0534C19.356 16.2214 19.7027 16.506 19.9466 16.871C20.1905 17.2361 20.3207 17.6653 20.3207 18.1044C20.3203 18.693 20.0863 19.2574 19.67 19.6736C19.2538 20.0899 18.6894 20.3239 18.1008 20.3243Z" fill="#2D2D2D" />
                            </svg>
                        </div>
                    </div>
                   </CustomTooltip>
                </div>
                <div className='blog--detail-img'>
                    <FallbackImage src={blogData?.featured_image_url} alt={blogData?.featured_image_alt} componentName="NewsDetail" />
                </div>
                <div className="align-items-baseline justify-content-between  d-sm-none d-flex" style={{gap:'10px' , padding:"0 16px"}}>
                <div className="global-after-img-title mb-3">{blogData?.title}</div>
                <div className="share-btn" onClick={() => setOpen(true)}>
                        <div className="share-tooltip">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18.1008 14.2205C17.4714 14.221 16.8517 14.3747 16.2949 14.6682C15.7382 14.9617 15.2613 15.3863 14.9053 15.9052L9.48734 13.4589C9.87216 12.5296 9.87365 11.4859 9.4915 10.5555L14.902 8.0967C15.4296 8.85979 16.2132 9.4085 17.1108 9.6433C18.0083 9.8781 18.9602 9.78343 19.7939 9.37648C20.6277 8.96953 21.2879 8.27724 21.6549 7.42519C22.0219 6.57314 22.0714 5.61777 21.7943 4.73237C21.5173 3.84697 20.9321 3.09019 20.1449 2.5993C19.3577 2.10842 18.4206 1.91594 17.5036 2.05678C16.5866 2.19762 15.7505 2.66245 15.1469 3.36696C14.5433 4.07147 14.2121 4.96899 14.2136 5.89672C14.2171 6.11631 14.2394 6.33518 14.2802 6.55097L8.52844 9.16464C7.97602 8.64708 7.28446 8.30216 6.5387 8.17225C5.79295 8.04233 5.02548 8.13309 4.3306 8.43336C3.63571 8.73363 3.04367 9.23035 2.62721 9.86247C2.21075 10.4946 1.988 11.2346 1.98634 11.9916C1.98467 12.7486 2.20417 13.4896 2.61785 14.1235C3.03153 14.7575 3.62138 15.2568 4.31494 15.5601C5.0085 15.8634 5.77556 15.9576 6.52187 15.8309C7.26819 15.7043 7.96127 15.3624 8.51595 14.8473L14.2827 17.451C14.2426 17.6666 14.2206 17.8851 14.2169 18.1044C14.2167 18.8728 14.4445 19.624 14.8713 20.2629C15.298 20.9019 15.9047 21.3999 16.6146 21.6941C17.3245 21.9882 18.1056 22.0652 18.8593 21.9153C19.6129 21.7655 20.3052 21.3955 20.8485 20.8521C21.3919 20.3088 21.7619 19.6165 21.9117 18.8629C22.0616 18.1092 21.9846 17.3281 21.6905 16.6182C21.3963 15.9083 20.8983 15.3016 20.2593 14.8748C19.6204 14.4481 18.8692 14.2203 18.1008 14.2205ZM18.1008 3.67677C18.5399 3.67661 18.9692 3.80667 19.3344 4.0505C19.6995 4.29433 19.9842 4.64098 20.1523 5.04661C20.3205 5.45224 20.3646 5.89862 20.279 6.32931C20.1935 6.75999 19.9821 7.15562 19.6717 7.46617C19.3612 7.77672 18.9657 7.98823 18.535 8.07396C18.1044 8.15968 17.658 8.11577 17.2523 7.94777C16.8466 7.77977 16.4998 7.49524 16.2559 7.13015C16.0119 6.76506 15.8817 6.33582 15.8817 5.89672C15.8821 5.30824 16.116 4.74396 16.5321 4.32776C16.9481 3.91156 17.5123 3.67743 18.1008 3.67677ZM5.89313 14.2205C5.45403 14.2207 5.02474 14.0906 4.65956 13.8468C4.29439 13.6029 4.00972 13.2563 3.84157 12.8507C3.67342 12.445 3.62934 11.9987 3.7149 11.568C3.80046 11.1373 4.01183 10.7417 4.32226 10.4311C4.63269 10.1206 5.02825 9.90904 5.4589 9.82332C5.88955 9.73759 6.33595 9.78151 6.74164 9.9495C7.14734 10.1175 7.49409 10.402 7.73806 10.7671C7.98203 11.1322 8.11225 11.5615 8.11225 12.0006C8.11159 12.589 7.8776 13.1531 7.46161 13.5693C7.04561 13.9854 6.48155 14.2196 5.89313 14.2205ZM18.1008 20.3243C17.6617 20.3243 17.2325 20.1941 16.8674 19.9502C16.5024 19.7063 16.2178 19.3596 16.0498 18.9539C15.8818 18.5483 15.8378 18.1019 15.9235 17.6713C16.0091 17.2407 16.2206 16.8451 16.531 16.5346C16.8415 16.2242 17.2371 16.0127 17.6677 15.9271C18.0983 15.8414 18.5447 15.8854 18.9503 16.0534C19.356 16.2214 19.7027 16.506 19.9466 16.871C20.1905 17.2361 20.3207 17.6653 20.3207 18.1044C20.3203 18.693 20.0863 19.2574 19.67 19.6736C19.2538 20.0899 18.6894 20.3239 18.1008 20.3243Z" fill="#2D2D2D" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className={window?.innerWidth >= 992 ? "row" : "row m-0"}>
                    <div className='col-lg-9'>
                    <div className='blog-detail-lower-heading'>
                    <div className='blo d-sm-block d-none' >
                        <div className="d-flex">
                            <h5 className='d-sm-none d-block'>News Type:</h5><h5>{blogData?.category}</h5>
                        </div>
                        <h6 className='d-sm-block d-none'>{formatDate(blogData?.published_at)}</h6>
                    </div>
                    <div className='blo'>
                        <h5>Posted By:</h5>
                        <span className='d-sm-block d-none'><svg style={{ cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z" fill="#2D2D2D" />
                            <path d="M14.0809 14.1489C11.2909 12.2889 6.74094 12.2889 3.93094 14.1489C2.66094 14.9989 1.96094 16.1489 1.96094 17.3789C1.96094 18.6089 2.66094 19.7489 3.92094 20.5889C5.32094 21.5289 7.16094 21.9989 9.00094 21.9989C10.8409 21.9989 12.6809 21.5289 14.0809 20.5889C15.3409 19.7389 16.0409 18.5989 16.0409 17.3589C16.0309 16.1289 15.3409 14.9889 14.0809 14.1489Z" fill="#2D2D2D" />
                            <path d="M19.9894 7.33815C20.1494 9.27815 18.7694 10.9781 16.8594 11.2081C16.8494 11.2081 16.8494 11.2081 16.8394 11.2081H16.8094C16.7494 11.2081 16.6894 11.2081 16.6394 11.2281C15.6694 11.2781 14.7794 10.9681 14.1094 10.3981C15.1394 9.47815 15.7294 8.09815 15.6094 6.59815C15.5394 5.78815 15.2594 5.04815 14.8394 4.41815C15.2194 4.22815 15.6594 4.10815 16.1094 4.06815C18.0694 3.89815 19.8194 5.35815 19.9894 7.33815Z" fill="#2D2D2D" />
                            <path d="M21.9883 16.5904C21.9083 17.5604 21.2883 18.4004 20.2483 18.9704C19.2483 19.5204 17.9883 19.7804 16.7383 19.7504C17.4583 19.1004 17.8783 18.2904 17.9583 17.4304C18.0583 16.1904 17.4683 15.0004 16.2883 14.0504C15.6183 13.5204 14.8383 13.1004 13.9883 12.7904C16.1983 12.1504 18.9783 12.5804 20.6883 13.9604C21.6083 14.7004 22.0783 15.6304 21.9883 16.5904Z" fill="#2D2D2D" />
                        </svg></span>
                        <h5>Pakistan Property</h5>
                    </div>
                    <div className='blo d-sm-none d-block' >
                        <div className="d-flex">
                            <h5 className='d-sm-none d-block'>News Type:</h5><h5>{blogData?.category}</h5>
                        </div>
                    </div>
                    <div className="blo d-sm-none d-flex">
                        <div className="d-sm-none d-flex">
                            <h5>Published On:</h5>
                            <h6>{formatDate(blogData?.published_at)}</h6>
                        </div>
                    </div>
                </div>
                        <div className='blog_content' dangerouslySetInnerHTML={{ __html: getContentWithAds }} />
                    </div>
                    <div className='col-lg-3 d-sm-block d-none'>
                        {getFilteredAds.vertical.map((item) => (
                            <a 
                                key={item.id} 
                                href={item?.url} 
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAdClick(item?.id, item?.url);
                                }}
                                className="d-block mb-3"
                            >
                                <img className='w-100 rounded' style={{ objectFit: 'cover' }} src={item?.image} alt={item?.title || 'Advertisement'} />
                            </a>
                        ))}
                    </div>
                </div>
                {/* <div className='blog_content' dangerouslySetInnerHTML={{ __html: blogData?.content }} /> */}

            </div>
            <ShareModal open={open} setOpen={setOpen} />
        </>
    )
}

export default Banner
