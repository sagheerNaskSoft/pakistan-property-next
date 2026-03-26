// Restore to original animated state
import { useMemo, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FallbackImage } from '../Metiral/FallbackImage';
import img from '../../Asset/Projects/Infographics.svg';
import img1 from '../../Asset/Projects/parallax1.svg';
import img2 from '../../Asset/Projects/Image card (1).svg';
import img3 from '../../Asset/Projects/Image card (3).svg';
import img4 from '../../Asset/Projects/Image card (4).svg';
import img5 from '../../Asset/Projects/Image card (5).svg';
// import './TrustedProjects.css';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_DATA = [
    { title: 'Verified Documentation', description: 'Every trusted project shares transparent title, land and approval documentation that is independently verified by Pakistan Property.' },
    { title: 'Financial Accountability', description: 'Developer escrow accounts, clearly defined instalment schedules and milestone-based utilisation keep investments safe and predictable.' },
    { title: 'On-Ground Progress', description: 'Construction progress is tracked with regular site audits, drone footage and photographic evidence so buyers always know what\'s happening.' },
    { title: 'Customer Support', description: 'Dedicated relationship managers, dispute resolution mechanisms and SLA-backed responses ensure buyers are heard and assisted quickly.' },
    { title: 'Digital Transparency', description: 'Live dashboards, automated reminders and digital paperwork empower clients with end-to-end clarity from booking to possession.' }
];
const IMAGE_SEQUENCE = [img1, img2, img3, img4, img5];

function TrustedProjects({ data, arrayData }) {
    const items = useMemo(() => (arrayData?.length ? arrayData : FALLBACK_DATA), [arrayData]);
    // refs
    const containerRef = useRef(null);
    const slidesRef = useRef([]);
    const backgroundsRef = useRef([]);
    const numbersRef = useRef([]);
    const titlesRef = useRef([]);
    const descriptionsRef = useRef([]);
    const listsRef = useRef([]);
    const imagesRef = useRef([]);
    // nav height (to preserve top offset if you have sticky navbar)
    const [navbarHeight, setNavbarHeight] = useState(0);
    useEffect(() => {
        const calcNavbar = () => {
            const nav = document.querySelector('.navBar');
            setNavbarHeight(nav ? nav.offsetHeight : 0);
        };
        calcNavbar();
        // recalc after small timeout and on resize
        const t = setTimeout(calcNavbar, 120);
        window.addEventListener('resize', calcNavbar);
        return () => {
            clearTimeout(t);
            window.removeEventListener('resize', calcNavbar);
        };
    }, []);
    useEffect(() => {
        if (!containerRef.current || items.length === 0) return;
        
        // Only run on desktop (same condition as render)
        const isDesktop = window.innerWidth > 576;
        if (!isDesktop) return;
        
        const pinContainer = containerRef.current;
        const slides = slidesRef.current;
        
        // Store ScrollTrigger instance for cleanup
        let scrollTriggerInstance = null;
        let resizeTimeout = null;
        
        // Ensure arrays length
        slidesRef.current = slidesRef.current.slice(0, items.length);
        backgroundsRef.current = backgroundsRef.current.slice(0, items.length);
        numbersRef.current = numbersRef.current.slice(0, items.length);
        titlesRef.current = titlesRef.current.slice(0, items.length);
        descriptionsRef.current = descriptionsRef.current.slice(0, items.length);
        listsRef.current = listsRef.current.slice(0, items.length);
        imagesRef.current = imagesRef.current.slice(0, items.length);
        
        // Main timeline that drives the whole pinned scene
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinContainer,
                start: `top top+=${navbarHeight}`,
                end: () => {
                    const viewportHeight = window.innerHeight - navbarHeight;
                    return `+=${(items.length) * viewportHeight}`;
                },
                scrub: 1,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                markers: false, // Set to true for debugging
                refreshPriority: -1, // Lower priority to avoid conflicts
            }
        });
        
        // Store the ScrollTrigger instance for cleanup
        scrollTriggerInstance = tl.scrollTrigger;
        // For each slide, create a 1 viewport segment in the timeline
        items.forEach((_, i) => {
            const slide = slidesRef.current[i];
            const bg = backgroundsRef.current[i];
            const num = numbersRef.current[i];
            const title = titlesRef.current[i];
            const description = descriptionsRef.current[i];
            const listEl = listsRef.current[i];
            const imgEl = imagesRef.current[i];
            // Safety checks
            if (!slide) return;
            gsap.set(slide, { zIndex: items.length - i });
            if (i === 0) {
                tl.set(slide, { autoAlpha: 1 });
                if (bg) gsap.set(bg, { yPercent: 0 });
                if (num) gsap.set(num, { y: 0, autoAlpha: 0.25 });
                if (title) gsap.set(title, { y: 0, autoAlpha: 1 });
                if (description) gsap.set(description, { filter: 'blur(0px)', scale: 1, rotation: 0, autoAlpha: 1 });
                if (listEl) gsap.set(listEl, { filter: 'blur(0px)', scale: 1, rotation: 0, autoAlpha: 1 });
                if (imgEl) gsap.set(imgEl, { y: 0, scale: 1 });
            } else {
                tl.set(slide, { autoAlpha: 0 });
            }
            tl.addLabel(`slide-${i}`);
            if (i === 0) {
                tl.to({}, { duration: 0.1 }, `slide-${i}`);
            } else {
                tl.to(slide, { autoAlpha: 1, duration: 0.6 }, `slide-${i}`);
                const prevSlide = slidesRef.current[i - 1];
                tl.to(prevSlide, { autoAlpha: 0, duration: 0.6 }, `slide-${i}`);
                if (bg) tl.fromTo(bg, { yPercent: -12 }, { yPercent: 12, ease: 'none', duration: 1 }, `slide-${i}`);
                if (num) {
                    gsap.set(num, { willChange: 'transform' });
                    tl.fromTo(num, { y: -200, autoAlpha: 0.15 }, { y: 0, autoAlpha: 0.25, duration: 1, ease: 'none' }, `slide-${i}`);
                }
                if (title) {
                    gsap.set(title, { willChange: 'transform, opacity' });
                    tl.fromTo(title, { y: 40, autoAlpha: 0 }, { y: -20, autoAlpha: 1, duration: 0.9, ease: 'power1.out' }, `slide-${i}+=0.05`);
                }
                if (description) {
                    gsap.set(description, { willChange: 'transform, filter, opacity' });
                    tl.fromTo(
                        description,
                        { filter: 'blur(10px)', scale: 0.85, rotation: -2, autoAlpha: 0 },
                        { filter: 'blur(0px)', scale: 1, rotation: 0, autoAlpha: 1, duration: 1.2, ease: 'power2.out' },
                        `slide-${i}+=0.15`
                    );
                }
                if (listEl) {
                    gsap.set(listEl, { willChange: 'transform, filter, opacity' });
                    tl.fromTo(
                        listEl,
                        { filter: 'blur(10px)', scale: 0.85, rotation: -2, autoAlpha: 0 },
                        { filter: 'blur(0px)', scale: 1, rotation: 0, autoAlpha: 1, duration: 1.2, ease: 'power2.out' },
                        `slide-${i}+=0.2`
                    );
                }
                if (imgEl) {
                    gsap.set(imgEl, { willChange: 'transform' });
                    tl.fromTo(imgEl, { y: 80, scale: 0.98 }, { y: 0, scale: 1.02, duration: 1.0, ease: 'none' }, `slide-${i}`);
                }
            }
            tl.to({}, { duration: 0.06 });
        });
        
        // Store the ScrollTrigger instance
        scrollTriggerInstance = tl.scrollTrigger;
        
        // Handle resize with debounce
        const handleResize = () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (scrollTriggerInstance) {
                    scrollTriggerInstance.refresh();
                }
            }, 150);
        };
        
        window.addEventListener('resize', handleResize);
        
        ScrollTrigger.refresh();
        
        return () => {
            // Clear resize timeout
            if (resizeTimeout) clearTimeout(resizeTimeout);
            window.removeEventListener('resize', handleResize);
            
            // Cleanup: only kill this component's ScrollTrigger and timeline
            if (scrollTriggerInstance) {
                scrollTriggerInstance.kill();
                scrollTriggerInstance = null;
            }
            if (tl) {
                tl.kill();
            }
            // Kill any tweens on the refs
            slidesRef.current.forEach(slide => {
                if (slide) gsap.killTweensOf(slide);
            });
            backgroundsRef.current.forEach(bg => {
                if (bg) gsap.killTweensOf(bg);
            });
            numbersRef.current.forEach(num => {
                if (num) gsap.killTweensOf(num);
            });
            titlesRef.current.forEach(title => {
                if (title) gsap.killTweensOf(title);
            });
            descriptionsRef.current.forEach(desc => {
                if (desc) gsap.killTweensOf(desc);
            });
            listsRef.current.forEach(list => {
                if (list) gsap.killTweensOf(list);
            });
            imagesRef.current.forEach(img => {
                if (img) gsap.killTweensOf(img);
            });
        };
    }, [items, navbarHeight]);
    return (
        <>
            {
                window.innerWidth > 576 ?
                    <div style={{ margin: '40px 0', width: '100%', position: 'relative' }}>
                        <section
                            className="trusted-projects"
                            ref={containerRef}
                            style={{
                                width: '100%',
                                maxWidth: '100%',
                                height: navbarHeight > 0 ? `calc(100vh - ${navbarHeight + "80"}px)` : '100vh',
                                minHeight: navbarHeight > 0 ? `calc(100vh - ${navbarHeight + "80"}px)` : '100vh',
                                paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : undefined,
                                margin: 0,
                                boxSizing: 'border-box',
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            <div className="main-container" style={{ position: 'absolute', top: '116px', left: 0, right: 0, zIndex: 10, pointerEvents: 'none' }}>
                                <div
                                    className="heading"
                                    style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto'  }}
                                >
                                    {data ? data : 'What Makes a Project Trusted on Pakistan Property'}
                                </div>
                            </div>
                            {/* Slides wrapper */}
                            <div
                                className="trusted-projects-scroll-area"
                                aria-hidden="false"
                                style={{
                                    position: 'absolute',
                                    top: '158px',
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    width: '100%',
                                    maxWidth: '100%',
                                    height: 'calc(100% - 160px)',
                                    overflow: 'hidden',
                                    boxSizing: 'border-box',        
                                }}
                            >
                                {items.map((item, index) => {
                                    const isEven = index % 2 === 0;
                                    return (
                                        <div
                                            key={index}
                                            ref={(el) => (slidesRef.current[index] = el)}
                                            className={`info-card parallax-card trusted-projects-single-card ${index === 0 ? 'first-card' : ''}`}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                width: '100%',
                                                maxWidth: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                padding: 0,
                                                margin: 0,
                                                boxSizing: 'border-box',
                                            }}
                                        >
                                            {/* Background layer (full cover) */}
                                            {/* <div
                                                className="background"
                                                ref={(el) => (backgroundsRef.current[index] = el)}
                                                style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    zIndex: 0,
                                                    pointerEvents: 'none',
                                                    opacity: 0.6,
                                                }}
                                            >
                                                <FallbackImage
                                                    src={item.img || IMAGE_SEQUENCE[index % IMAGE_SEQUENCE.length]}
                                                    alt="Background"
                                                    componentName="TrustedProjects"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div> */}
                                            {/* Content layer */}
                                            <div
                                                className="main-container"
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    zIndex: 5,
                                                    width: '100%',
                                                    maxWidth: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '40px 20px',
                                                    overflow: 'hidden',
                                                    boxSizing: 'border-box',
                                                }}
                                            >
                                                <div className={`info-card-box ${isEven ? 'text-left' : 'text-right'}`} style={{ 
                                                    width: '100%', 
                                                    maxWidth: '1200px', 
                                                    display: 'flex', 
                                                    flexDirection: isEven ? 'row' : 'row-reverse',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '32px',
                                                    margin: '0 auto', 
                                                    boxSizing: 'border-box',
                                                    overflow: 'hidden',
                                                    maxHeight: '100%',
                                                    height: '100%'
                                                }}>
                                                    {/* Text column */}
                                                    <div style={{ 
                                                        flex: '0 0 58.33%',
                                                        width: 'auto',
                                                        padding: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: isEven ? 'flex-start' : 'flex-end',
                                                    }}>
                                                        <div className="text-box animated-content" style={{ position: 'relative', width: '100%' }}>
                                                            <div className="back-number d-sm-flex d-none" ref={(el) => (numbersRef.current[index] = el)} style={{ position:'unset', fontSize: '180px', fontWeight: 600, opacity: 0.2, pointerEvents: 'none' ,  lineHeight: '134px' }}>
                                                                {String(index + 1).padStart(2, '0')}
                                                            </div>
                                                            <div className="title" ref={(el) => (titlesRef.current[index] = el)} style={{ color: 'var(--neutral-white)', fontSize: '34px', fontWeight: 600, lineHeight: '38px', width: 'fit-content', marginBottom: '14px', position: 'absolute', top: index == 0 ? "86px" : '106px', left: '0' }}>
                                                                <span className='d-sm-none d-flex'>{`0${String(index + 1)}. `}</span>
                                                                {item.title}
                                                            </div>
                                                            <div className="para" ref={(el) => (descriptionsRef.current[index] = el)} style={{ color: 'var(--neutral-white)', fontSize: '16px', maxWidth: '100%', width: '100%' }}>
                                                                {item.description}
                                                            </div>
                                                            {item.list && item.list.length > 0 && (
                                                                <ul ref={(el) => (listsRef.current[index] = el)} style={{ marginTop: '12px' }}>
                                                                    {item.list.map((listItem, liIdx) => (
                                                                        <li key={liIdx} style={{ color: 'var(--neutral-white)', fontWeight: 600 }}>{listItem}</li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* Image column */}
                                                    <div style={{ 
                                                        flex: '0 0 41.67%',
                                                        maxWidth: '456px',
                                                        width: '100%',
                                                        padding: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        overflow: 'hidden',
                                                        height:'100%',
                                                        maxHeight: '456px',
                                                        position: 'relative',
                                                        height: '100%',
                                                    }}>
                                                        <div className="img animated-content" ref={(el) => (imagesRef.current[index] = el)} style={{ width: '100%', maxWidth: '456px', maxHeight: '438px', height: '100%', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', margin: '0 auto', display: 'block', position: 'relative', objectFit: 'contain' }}>
                                                            <FallbackImage src={item.img || IMAGE_SEQUENCE[index % IMAGE_SEQUENCE.length]} alt={item.title || 'Trusted project illustration'} componentName="TrustedProjects" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                    :
                    <>
                        <div style={{ margin: '40px 0', width: '100%' }}>
                            <section className="trusted-projects">
                                <div className="main-container">
                                    <div className="heading ms-0">
                                        {data ? data : 'What Makes a Project Trusted on Pakistan Property'}
                                    </div>
                                </div>

                                {/* Slides wrapper */}
                                <div aria-hidden="false">
                                    {items.map((item, index) => {
                                        // const isEven = index % 2 === 0;

                                        return (
                                            <div
                                                key={index}
                                                className={`info-card parallax-card trusted-projects-single-card ${index === 0 ? 'first-card' : ''}`}
                                            >

                                                {/* Content layer */}
                                                <div className="main-container">
                                                    <div className="info-card-box" style={{ 
                                                        width: '100%', 
                                                        display: 'flex', 
                                                        flexDirection: 'column',
                                                        gap: '20px',
                                                        padding: 0,
                                                        margin: 0,
                                                        boxSizing: 'border-box'
                                                    }}>
                                                        {/* Text column */}
                                                        <div style={{ 
                                                            width: '100%',
                                                            padding: 0
                                                        }}>
                                                            <div className="text-box animated-content">
                                                                <div className="back-number d-sm-flex d-none">
                                                                    {String(index + 1).padStart(2, '0')}
                                                                </div>

                                                                <div className="title">
                                                                    <span className="d-sm-none d-flex">
                                                                        {`0${String(index + 1)}. `}
                                                                    </span>
                                                                    {item.title}
                                                                </div>

                                                                <div
                                                                    className="para"
                                                                >
                                                                    {item.description}
                                                                </div>

                                                                {item.list && item.list.length > 0 && (
                                                                    <ul>
                                                                        {item.list.map((listItem, liIdx) => (
                                                                            <li key={liIdx}>{listItem}</li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        </div>


                                                        {/* Image column */}
                                                        <div style={{ 
                                                            width: '100%',
                                                            padding: 0
                                                        }}>
                                                            <div className="img animated-content" style={{position:"unset " , opacity:1}}>
                                                                <FallbackImage
                                                                    src={item.img || IMAGE_SEQUENCE[index % IMAGE_SEQUENCE.length]}
                                                                    alt={item.title || 'Trusted project illustration'}
                                                                    componentName="TrustedProjects"
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>
                    </>

            }
        </>
    );
}
export default TrustedProjects;
