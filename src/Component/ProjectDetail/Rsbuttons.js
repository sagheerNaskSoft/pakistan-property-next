import React, { useState, useEffect, useRef } from 'react'
import { VscCallIncoming } from 'react-icons/vsc'
import CardContactModal from '../Metiral/CardContactModal';

function Rsbuttons({subject , radio, handleOpen, whatsapp , propertyData, whatsappPrefillText}) {

    const [open, setOpen] = useState(false);
    const [bottomOffset, setBottomOffset] = useState(0);
    const containerRef = useRef(null);

    // Handle iOS Safari viewport changes when browser bar hides/shows
    useEffect(() => {
        const updateBottomOffset = () => {
            // Use visualViewport if available (iOS Safari)
            if (window.visualViewport) {
                const viewportHeight = window.visualViewport.height;
                const windowHeight = window.innerHeight;
                // Calculate offset when browser bar is visible
                const offset = Math.max(0, windowHeight - viewportHeight);
                setBottomOffset(offset);
            } else {
                // Fallback for browsers without visualViewport
                setBottomOffset(0);
            }
        };

        // Initial check
        updateBottomOffset();

        // Listen for viewport changes
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', updateBottomOffset);
            window.visualViewport.addEventListener('scroll', updateBottomOffset);
        }

        // Fallback for older iOS versions
        window.addEventListener('resize', updateBottomOffset);
        
        // Use a debounced scroll handler
        let scrollTimeout;
        const handleScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateBottomOffset, 100);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', updateBottomOffset);
                window.visualViewport.removeEventListener('scroll', updateBottomOffset);
            }
            window.removeEventListener('resize', updateBottomOffset);
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);



    return (
        <>
            <div 
                ref={containerRef}
                className='new-transpernt-section d-lg-none d-inline-block' 
                style={{ 
                    position: 'fixed', 
                    bottom: `${bottomOffset}px`, 
                    zIndex: "9", 
                    left: '0', 
                    right: '0',
                    paddingBottom: '10px',
                    transition: 'bottom 0.2s ease-out'
                }}
            >
                <div style={{ justifyContent: 'center' }} className='new-all-buttons d-lg-none d-flex d-flex mb-2'>

                    <button onClick={handleOpen} className='new-whstapp-button' ><VscCallIncoming />Call</button>
                    <a href={(() => {
                        const clean = String(whatsapp || '').replace(/\D/g, '');
                        if (!clean) return '#';
                        const base = `https://wa.me/${clean}`;
                        return whatsappPrefillText
                            ? `${base}?text=${encodeURIComponent(whatsappPrefillText)}`
                            : base;
                    })()} target='_blank' rel='noopener noreferrer'>
                   
                    <button className='new-call-button'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.4977 4.5C8.08742 4.5 4.5 8.08842 4.5 12.4999C4.5 14.2495 5.06421 15.872 6.02334 17.189L5.02653 20.1613L8.10148 19.1785C9.3662 20.0157 10.8755 20.5 12.5023 20.5C16.9126 20.5 20.5 16.9114 20.5 12.5001C20.5 8.08857 16.9126 4.50013 12.5023 4.50013L12.4977 4.5ZM10.2643 8.56361C10.1092 8.19209 9.9916 8.17802 9.75659 8.16847C9.67658 8.16382 9.5874 8.15918 9.48855 8.15918C9.18282 8.15918 8.86316 8.24851 8.67035 8.44601C8.43535 8.68586 7.85227 9.24546 7.85227 10.3931C7.85227 11.5407 8.68919 12.6506 8.80198 12.8059C8.91955 12.9609 10.4336 15.3501 12.7844 16.3238C14.6228 17.0857 15.1683 17.0151 15.5867 16.9258C16.1979 16.7941 16.9643 16.3424 17.1571 15.797C17.35 15.2514 17.3499 14.7857 17.2934 14.687C17.237 14.5882 17.0818 14.5319 16.8468 14.4142C16.6118 14.2966 15.4691 13.7322 15.2528 13.657C15.0412 13.5771 14.8391 13.6053 14.6793 13.8311C14.4536 14.1462 14.2327 14.4661 14.0539 14.6588C13.9129 14.8094 13.6824 14.8282 13.4897 14.7482C13.2311 14.6401 12.5071 14.3859 11.6137 13.5911C10.9225 12.9751 10.4523 12.2086 10.316 11.9782C10.1796 11.7431 10.302 11.6065 10.41 11.4796C10.5275 11.3337 10.6403 11.2303 10.7579 11.0939C10.8755 10.9576 10.9413 10.887 11.0165 10.727C11.0966 10.5719 11.04 10.4119 10.9836 10.2943C10.9272 10.1767 10.4571 9.0291 10.2643 8.56361Z" fill="#20A853" />
                    </svg>WhatsApp</button>
                    </a>

                    <button className='new-email-button' onClick={e => { e.stopPropagation(); setOpen(true); }}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                        <g clipPath="url(#clip0_6492_3244)">
                            <path d="M11.5833 0.583008H3.41667C2.6434 0.583934 1.90208 0.891522 1.3553 1.4383C0.808515 1.98508 0.500926 2.72641 0.5 3.49967L0.5 10.4997C0.500926 11.2729 0.808515 12.0143 1.3553 12.561C1.90208 13.1078 2.6434 13.4154 3.41667 13.4163H11.5833C12.3566 13.4154 13.0979 13.1078 13.6447 12.561C14.1915 12.0143 14.4991 11.2729 14.5 10.4997V3.49967C14.4991 2.72641 14.1915 1.98508 13.6447 1.4383C13.0979 0.891522 12.3566 0.583934 11.5833 0.583008ZM3.41667 1.74967H11.5833C11.9326 1.75036 12.2737 1.85556 12.5627 2.05173C12.8517 2.2479 13.0754 2.52606 13.205 2.85042L8.73783 7.31817C8.40908 7.64561 7.96399 7.82945 7.5 7.82945C7.03601 7.82945 6.59092 7.64561 6.26217 7.31817L1.795 2.85042C1.92459 2.52606 2.14827 2.2479 2.43728 2.05173C2.72628 1.85556 3.06738 1.75036 3.41667 1.74967ZM11.5833 12.2497H3.41667C2.95254 12.2497 2.50742 12.0653 2.17923 11.7371C1.85104 11.4089 1.66667 10.9638 1.66667 10.4997V4.37467L5.43733 8.14301C5.98487 8.68916 6.72665 8.99586 7.5 8.99586C8.27335 8.99586 9.01513 8.68916 9.56267 8.14301L13.3333 4.37467V10.4997C13.3333 10.9638 13.149 11.4089 12.8208 11.7371C12.4926 12.0653 12.0475 12.2497 11.5833 12.2497Z" fill="white" />
                        </g>
                        <defs>
                            <clipPath id="clip0_6492_3244">
                                <rect width="14" height="14" fill="white" transform="translate(0.5)" />
                            </clipPath>
                        </defs>
                    </svg>Email</button>

                </div>
            </div>
            <CardContactModal propertyData={propertyData} modal={true} open={open} setOpen={setOpen} subject={subject} radio={radio} />
        </>
    )
}

export default Rsbuttons
