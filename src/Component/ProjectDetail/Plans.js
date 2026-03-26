import React, { useEffect, useState, useMemo } from 'react';
import image from '../../Asset/Projects/gray-structer.png'
import image1 from '../../Asset/Projects/consturction-img.avif'
import image2 from '../../Asset/Projects/gray-structer.png'
import image3 from '../../Asset/Projects/consturction-img.avif'
import image4 from '../../Asset/Projects/consturction-img.avif'
import Lightbox from 'yet-another-react-lightbox';
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";



function Plans({floor_plans, buttonPadding = "7px 16px"}) {
  const [activeTab, setActiveTab] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Filter floor plans to only show those with images
  const floorPlansWithImages = useMemo(() => {
    return floor_plans?.filter(plan => plan?.attachments || plan?.pdfs ) || [];
  }, [floor_plans]);

  useEffect(()=>{
    setActiveTab(floorPlansWithImages?.length ? floorPlansWithImages[0] : '')
  },[floorPlansWithImages])

  // Preload all images aggressively for instant switching
  useEffect(() => {
    if (floorPlansWithImages && floorPlansWithImages.length > 0) {
      floorPlansWithImages.forEach((plan) => {
        if (plan?.attachments) {
          const img = new window.Image();
          img.src = plan.attachments;
          // Force browser to decode and cache the image
          img.decode && img.decode().catch(() => {});
        }
        if (plan?.pdf_thumbnail) {
          const img = new window.Image();
          img.src = plan.pdf_thumbnail;
          // Force browser to decode and cache the image
          img.decode && img.decode().catch(() => {});
        }
      });
    }
  }, [floorPlansWithImages]);

  // Memoize slides to update when activeTab changes
  const slides = useMemo(() => {
    if (!activeTab) return [];
    
    const imageUrl = activeTab?.has_thumbnail ? activeTab?.pdf_thumbnail : activeTab?.attachments;
    
    if (!imageUrl) return [];

    return [{
      src: imageUrl,
      title: activeTab?.name || `Floor Plan 1`,
      downloadUrl: imageUrl,
    }];
  }, [activeTab]);
  return (
    <>
      <div id='plans-sections' className='plans-projects  pt-2 mb-4 ps-0'>
        <h3>Floor Plans</h3>
        <h4>
          A floor plan is a scaled diagram of a room or building viewed from
          above, showing the layout of spaces, walls, doors, and windows. It's
          used to visualize how people will move through the space and helps in
          planning design and construction.
        </h4>

        <div className='plans-tabs mt-4' style={{overflow:"hidden"}}>
         <div className='plans-enetr-tabs responsive-tabs d-flex align-items-center' style={{justifyContent: "center"}}>
            <div className="d-flex align-items-center plans-enetr-tabs-inner" style={{width:"fit-content" , margin:"0 auto"}}>
            {floorPlansWithImages.map((floor, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(floor)}
                className={activeTab?.id === floor?.id ? 'active-tab' : ''}
                style={{padding: buttonPadding, flexShrink: 0}}
              >
                {floor?.name}
              </button>
            ))}
            </div>
          </div>

          <div className='gray-structure' style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {floorPlansWithImages.map((plan, index) => {
              const isActive = activeTab?.id === plan?.id;
              const hasPdf = plan?.has_thumbnail;
              // const hasAttachment = plan?.attachments && plan.attachments.length > 0 ? true : false;
              if (hasPdf) {
                return (
                  <div
                    key={plan?.id || index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      visibility: isActive ? 'visible' : 'hidden',
                      opacity: isActive ? 1 : 0,
                      pointerEvents: isActive ? 'auto' : 'none',
                      transition: 'opacity 0.05s linear'
                    }}
                  >
                    {hasPdf ? (
                      <a 
                        href={plan?.pdf_thumbnail} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                          textDecoration: 'none'
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          if (activeTab?.id !== plan?.id) {
                            setActiveTab(plan);
                          }
                          setPhotoIndex(0);
                          setIsOpen(true);
                        }}
                      >
                        <img 
                          src={plan?.pdf_thumbnail} 
                          alt={plan?.name} 
                          loading="eager"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain', 
                            borderRadius: '0px', 
                            background: 'none', 
                            cursor: 'pointer',
                            display: 'block'
                          }}
                        />
                      </a>
                    ) : (
                      <div style={{ height: '400px', backgroundColor: '#eee' }}></div>
                    )}
                  </div>
                );
              } else if (!hasPdf) {
                return (
                  <div
                    key={plan?.id || index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      visibility: isActive ? 'visible' : 'hidden',
                      opacity: isActive ? 1 : 0,
                      pointerEvents: isActive ? 'auto' : 'none',
                      transition: 'opacity 0.05s linear'
                    }}
                  >
                    <img 
                      src={plan.attachments} 
                      alt={plan?.name} 
                      loading="eager"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain', 
                        borderRadius: '0px', 
                        background: 'none', 
                        cursor: 'pointer',
                        display: 'block'
                      }}
                      onClick={() => {
                        if (activeTab?.id !== plan?.id) {
                          setActiveTab(plan);
                        }
                        setPhotoIndex(0);
                        setIsOpen(true);
                      }}
                    />
                  </div>
                );
              }
              return null;
            })}
            {(!activeTab || (!activeTab?.attachments && (!activeTab?.pdfs || !activeTab.pdfs[0]))) && (
              <div style={{ height: '400px', backgroundColor: '#eee' }}></div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Component */}
      {isOpen && slides.length > 0 && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={slides}
          index={photoIndex}
          plugins={[Fullscreen, Slideshow, Thumbnails, Zoom, Download, Counter]}
          counter={{ container: { style: { top: "20px" } } }}
        />
      )}
    </>
  );
}

export default Plans;
