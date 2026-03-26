import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import img1 from '../../Asset/HomePage/slider/CG.png';
import img2 from '../../Asset/HomePage/slider/KO.png';
import img3 from '../../Asset/HomePage/slider/LMF.png';
import img4 from '../../Asset/HomePage/slider/Logos (2).png';
import img5 from '../../Asset/HomePage/slider/Logos (3).png';
import img6 from '../../Asset/HomePage/slider/Logos.png';
import img7 from '../../Asset/HomePage/slider/Naskstudio Logo.png';
import img8 from '../../Asset/HomePage/slider/WSO.png';


import Image from 'next/image';
const SliderProjects = () => {
  const sliderRef = useRef(null);
  const contentRef = useRef(null);
  const animationRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const items = [img1, img2, img3, img4, img5, img6, img7, img8 , img1, img2, img3, img4, img5, img6, img7, img8]; // Add more if needed

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    const content = contentRef.current;

    if (!slider || !content) return;

    // Kill existing animation if any
    if (animationRef.current) {
      animationRef.current.kill();
    }

    const contentWidth = content.offsetWidth;
    
    // Adjust duration based on screen size
    const duration = windowWidth <= 768 ? 15 : 15;

    animationRef.current = gsap.fromTo(
      slider,
      { x: 0 },
      {
        x: `-${contentWidth}px`, // animate full width
        duration: duration,
        ease: "linear",
        repeat: -1,
      }
    );

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [windowWidth]);

  return (
    <div
      className="slider_project"
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "100%",
      }}
    >
      <div
        ref={sliderRef}
        style={{
          display: "flex",
        }}
      >
        <div
          ref={contentRef}
          style={{
            display: "flex",
          }}
        >
          {items.map((item, index) => (
            <Image
              key={index}
              src={item}
              alt="slide"
              style={{
                width: windowWidth <= 768 ? "80px" : "auto",
                height: windowWidth <= 768 ? "auto" : "auto",
                marginRight: windowWidth <= 768 ? "30px" : "50px",
                objectFit: "contain",
              }}
            />
          ))}
        </div>

        {/* Duplicate for seamless scroll */}
        <div
          style={{
            display: "flex",
          }}
        >
          {items.map((item, index) => (
            <Image
              key={`dup-${index}`}
              src={item}
              alt="slide-dup"
              style={{
                width: windowWidth <= 768 ? "80px" : "100px",
                height: windowWidth <= 768 ? "auto" : "auto",
                marginRight: windowWidth <= 768 ? "30px" : "50px",
                objectFit: "contain",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderProjects;
