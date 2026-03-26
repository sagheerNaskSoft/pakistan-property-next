import React, { useState, useEffect } from 'react'
import './SliderArrows.css'

function SliderArrows({ sliderRef, totalSlides, slidesToShow, uniqueId = 'default', currentSlideIndex = 0 , right , top }) {
    const [canGoPrev, setCanGoPrev] = useState(false);
    const [canGoNext, setCanGoNext] = useState(true);

    useEffect(() => {
        // Hide prev arrow if on first slide (no cards behind)
        setCanGoPrev(currentSlideIndex > 0);
        
        // Hide next arrow if on last slide (no cards ahead)
        // Calculate if we're at the last possible slide
        const maxSlide = Math.max(0, totalSlides - slidesToShow);
        setCanGoNext(currentSlideIndex < maxSlide);
    }, [currentSlideIndex, totalSlides, slidesToShow]);

    const handlePrev = () => {
        if (sliderRef?.current && canGoPrev) {
            sliderRef.current.slickPrev();
        }
    };

    const handleNext = () => {
        if (sliderRef?.current && canGoNext) {
            sliderRef.current.slickNext();
        }
    };

    // Don't render if no slides or all slides are visible
    if (!totalSlides || totalSlides <= slidesToShow) {
        return null;
    }

    return (
        <>
            {canGoPrev && (
                <div className="slider-arrow-box slider-arrow-left" style={{ top: top ? top : "" }} onClick={handlePrev}>
                    <svg style={{ transform: 'rotate(180deg)' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <g clipPath={`url(#clip0_arrow_${uniqueId}_prev)`}>
                            <path d="M4.66663 15.9998C4.57889 16.0003 4.49191 15.9835 4.41069 15.9503C4.32946 15.9171 4.25559 15.8682 4.19329 15.8064C4.13081 15.7445 4.08121 15.6707 4.04737 15.5895C4.01352 15.5083 3.99609 15.4211 3.99609 15.3331C3.99609 15.2451 4.01352 15.158 4.04737 15.0767C4.08121 14.9955 4.13081 14.9218 4.19329 14.8598L9.63996 9.41312C10.0145 9.03812 10.2249 8.52979 10.2249 7.99979C10.2249 7.46979 10.0145 6.96146 9.63996 6.58646L4.19329 1.1398C4.06776 1.01426 3.99723 0.843998 3.99723 0.666464C3.99723 0.48893 4.06776 0.318667 4.19329 0.193131C4.31883 0.0675955 4.48909 -0.00292969 4.66663 -0.00292969C4.84416 -0.00292969 5.01442 0.0675955 5.13996 0.193131L10.5866 5.63979C10.897 5.94943 11.1433 6.31727 11.3114 6.72223C11.4794 7.1272 11.5659 7.56134 11.5659 7.99979C11.5659 8.43824 11.4794 8.87238 11.3114 9.27734C11.1433 9.68231 10.897 10.0501 10.5866 10.3598L5.13996 15.8064C5.07767 15.8682 5.00379 15.9171 4.92256 15.9503C4.84134 15.9835 4.75436 16.0003 4.66663 15.9998Z" fill="#2D2D2D" />
                        </g>
                        <defs>
                            <clipPath id={`clip0_arrow_${uniqueId}_prev`}>
                                <rect width="16" height="16" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            )}
            {canGoNext && (
                <div className="slider-arrow-box slider-arrow-right" style={{ right: right ? right : "" , top: top ? top : "" }} onClick={handleNext}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <g clipPath={`url(#clip0_arrow_${uniqueId}_next)`}>
                            <path d="M4.66663 15.9998C4.57889 16.0003 4.49191 15.9835 4.41069 15.9503C4.32946 15.9171 4.25559 15.8682 4.19329 15.8064C4.13081 15.7445 4.08121 15.6707 4.04737 15.5895C4.01352 15.5083 3.99609 15.4211 3.99609 15.3331C3.99609 15.2451 4.01352 15.158 4.04737 15.0767C4.08121 14.9955 4.13081 14.9218 4.19329 14.8598L9.63996 9.41312C10.0145 9.03812 10.2249 8.52979 10.2249 7.99979C10.2249 7.46979 10.0145 6.96146 9.63996 6.58646L4.19329 1.1398C4.06776 1.01426 3.99723 0.843998 3.99723 0.666464C3.99723 0.48893 4.06776 0.318667 4.19329 0.193131C4.31883 0.0675955 4.48909 -0.00292969 4.66663 -0.00292969C4.84416 -0.00292969 5.01442 0.0675955 5.13996 0.193131L10.5866 5.63979C10.897 5.94943 11.1433 6.31727 11.3114 6.72223C11.4794 7.1272 11.5659 7.56134 11.5659 7.99979C11.5659 8.43824 11.4794 8.87238 11.3114 9.27734C11.1433 9.68231 10.897 10.0501 10.5866 10.3598L5.13996 15.8064C5.07767 15.8682 5.00379 15.9171 4.92256 15.9503C4.84134 15.9835 4.75436 16.0003 4.66663 15.9998Z" fill="#2D2D2D" />
                        </g>
                        <defs>
                            <clipPath id={`clip0_arrow_${uniqueId}_next`}>
                                <rect width="16" height="16" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            )}
        </>
    )
}

export default SliderArrows

