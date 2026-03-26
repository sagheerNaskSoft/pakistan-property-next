import { useEffect, useRef, useState } from "react";
import './CitiesProperties.css';
import Card from '../../Metiral/Card';
import CardLoding from '../../Metiral/CardLoding';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NoResultFound from '../../Metiral/NoResultFound';
import SliderArrows from '../../Metiral/SliderArrows';

function CitiesProperties({ heading, tabMenu, propertyData, loading ,title , unDisablePropertyCardTag , modify}) {

    const [activeTab, setActiveTab] = useState(tabMenu?.length ? tabMenu[0] : "ALL");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const sliderRef = useRef(null);

    /* -------------------- CATEGORY HELPERS -------------------- */

    const getCategoryIdFromTab = (tabName) => {
        const tabNameLower = tabName?.toLowerCase() || '';

        if (tabNameLower.includes('residential')) return 1;
        if (tabNameLower === 'plots' || (tabNameLower.includes('plot') && !tabNameLower.includes('residential'))) return 2;
        if (tabNameLower.includes('commercial')) return 3;

        return null;
    };

    const filterByCategoryId = (data, categoryId) => {
        if (categoryId === null) return data || [];
        return data?.filter(p => p?.category_id === categoryId) || [];
    };

    const tabHasData = (tabName) => {
        const categoryId = getCategoryIdFromTab(tabName);
        const filtered = filterByCategoryId(propertyData, categoryId);
        return filtered.length > 0;
    };

    /* -------------------- EFFECTS -------------------- */

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setCurrentSlideIndex(0);
    }, [activeTab]);

    useEffect(() => {
        if (!loading && propertyData?.length && tabMenu?.length) {
            for (const tab of tabMenu) {
                if (tabHasData(tab)) {
                    setActiveTab(tab);
                    break;
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propertyData, loading]);

    /* -------------------- RESPONSIVE -------------------- */

    const isMobile = windowWidth <= 576;

    const getCardsToShow = () => {
        if (windowWidth >= 1200) return 4;
        if (windowWidth >= 992) return 3;
        if (windowWidth >= 768) return 3;
        if (windowWidth >= 576) return 2;
        return 1;
    };

    const cardsToShow = getCardsToShow();

    const filteredPropertyData = filterByCategoryId(
        propertyData,
        getCategoryIdFromTab(activeTab)
    );

    const shouldShowSlider = windowWidth <= 992 && filteredPropertyData?.length >= 4 ;
    const shouldShowArrows = filteredPropertyData?.length > cardsToShow;
    const shouldUseCarousel = shouldShowSlider || shouldShowArrows;

    /* -------------------- SLIDER SETTINGS -------------------- */

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: cardsToShow,
        slidesToScroll: 1,
        arrows: false,
        afterChange: setCurrentSlideIndex,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 3 } },
            { breakpoint: 992, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 576, settings: { slidesToShow: 1 } }
        ]
    };

    /* -------------------- JSX -------------------- */

    return (
        <div className="cities-properties">
            <div className="heading">{title ? title : `Properties for ${heading}`}</div>

            {/* -------------------- TABS -------------------- */}
            {
                !unDisablePropertyCardTag ?
            (loading ? (
                    <div className="tab-box">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="tab placeholder-glow">
                                <div className="placeholder" style={{ width: windowWidth > 576 ? 120 : '100%', height: 20 }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="tab-box">
                        {tabMenu?.map((tab, index) => {
                            const hasData = tabHasData(tab);
                            const isDisabled = isMobile && !hasData;
    
                            return (
                                <div
                                    key={index}
                                    className={`tab 
                                        ${activeTab === tab ? 'active' : ''} 
                                        ${isDisabled ? 'disabled' : ''}
                                    `}
                                    onClick={() => {
                                        if (!isDisabled) setActiveTab(tab);
                                    }}
                                >
                                    {tab}
                                </div>
                            );
                        })}
                    </div>
                )):''
            }

            {/* -------------------- CONTENT -------------------- */}
            {loading && !unDisablePropertyCardTag ? (
                <div className={`grid global-scroll-box d-flex ${unDisablePropertyCardTag ? '' : 'mt-3'}`} style={{ gap: 24 }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ width: '288px', flexShrink: 0 }}>
                            <CardLoding />
                        </div>
                    ))}
                </div>
            ) : filteredPropertyData?.length ? (
                windowWidth > 768 ? (
                    <div className="position-relative">
                        <div style={{ maxWidth: '1220px' }}>
                            {shouldUseCarousel ? (
                                <div style={{ height: '342.6px' }}>
                                    <Slider ref={sliderRef} {...sliderSettings} style={{ height: '342.6px' }}>
                                        {filteredPropertyData.map((card, i) => (
                                            <div key={i} style={{ width:'fit-content', padding: '0 12px' }}>
                                                <Card modify={modify} cardTypeDisabled={!unDisablePropertyCardTag ? true : false} data={card} width newWidth={true} />
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            ) : (
                                <div className={`grid ${unDisablePropertyCardTag ? '' : ''}`}>
                                    {filteredPropertyData.map((card, i) => (
                                        <Card key={card?.id || i} newWidth={true} cardTypeDisabled={!unDisablePropertyCardTag ? true : false} data={card} width />
                                    ))}
                                </div>
                            )}
                        </div>

                        {shouldUseCarousel && shouldShowArrows && (
                            <SliderArrows
                                sliderRef={sliderRef}
                                totalSlides={filteredPropertyData.length}
                                slidesToShow={cardsToShow}
                                uniqueId="cities-properties"
                                currentSlideIndex={currentSlideIndex}
                            />
                        )}
                    </div>
                ) : (
                    <div className="grid global-scroll-box d-flex" style={{ gap: 24 }}>
                        {filteredPropertyData.map((card, i) => (
                            <Card cardTypeDisabled={!unDisablePropertyCardTag ? true : false} key={i} data={card} width gridNumber />
                        ))}
                    </div>
                )
            ) : (
                <NoResultFound height={342.6} />
            )}
        </div>
    );
}

export default CitiesProperties;
