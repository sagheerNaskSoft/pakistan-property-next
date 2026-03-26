import React, { useEffect, useState, useRef } from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import InputSection from '../Component/ConstructionDetailpage/InputSection'
import Percentage from '../Component/ConstructionDetailpage/Percentage'
import ConstrustionCategories from '../Component/ConstructionDetailpage/ConstrustionCategories'
import Footer from '../Component/NavBarFooter/Footer'
import Banner from '../Component/ConstructionDetailpage/Banner'
import PdfTemplate from '../Component/ConstructionDetailpage/PdfTemplate'
import { useAuth } from '../Context/ContextProvider'
import { useLocation } from 'react-router-dom'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import watermarkUrl from '../AgentPortal/Asset/PP-Watermark.png';
import { Helmet } from 'react-helmet'
import PageLoaderInside from '../Component/Metiral/PageLoaderInside'

const getFadedWatermarkImage = (img, width, height, fade = 0.3) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  ctx.globalAlpha = fade;
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/png');
};

function ConstructionDetailpage() {
  const [open, setOpen] = useState(false);
  const { parseQueryParams, citiesList, areaUnit, constructionCalulation, loading } = useAuth()
  const location = useLocation()
  const [data, setData] = useState()
  const [parsedData, setParsedData] = useState()
  const [filterData, setFilterData] = useState({
    city: { app_code: "PP016", city: "Lahore" },
    area_size: "",
    area_unit: {
      id: 4,
      name: "Marla",
      code: "marla"
    },
    coverd_area: "",
    construction_type: "complete",
    construction_mode: "without_mterial",
    drowing_rooms: "1",
    living_rooms: "2",
    kitchens: "2",
    bathrooms: "4",
    bedrooms: "3",

  });
  const [allCategoriesOpen, setAllCategoriesOpen] = useState(false);
  const [forceAllCategoriesOpen, setForceAllCategoriesOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const percentageRef = React.useRef(null);
  const categoriesRef = React.useRef(null);
  const contentRef = useRef(null); // wrapper for everything to export
  const pdfTemplateRef = useRef(null); // ref for PDF template


  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    setForceAllCategoriesOpen(true);
    
    try {
      // Wait a bit for the template to render
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if template ref exists
      if (!pdfTemplateRef.current) {
        console.error('PDF template ref is not available');
        alert('PDF template is not ready. Please try again.');
        setPdfLoading(false);
        setForceAllCategoriesOpen(false);
        return;
      }

      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Watermark image preload
      const watermarkImg = new window.Image();
      watermarkImg.crossOrigin = 'anonymous';
      watermarkImg.src = watermarkUrl;
      await new Promise((resolve, reject) => {
        watermarkImg.onload = resolve;
        watermarkImg.onerror = reject;
        setTimeout(() => reject(new Error('Watermark image load timeout')), 5000);
      });
      const fadedWatermark = getFadedWatermarkImage(watermarkImg, pdfWidth * 0.6, pdfHeight / 4, 0.1);
      
  
      // Helper function to add watermark to a page
      const addWatermarkToPage = (pdfDoc, pageNum = null) => {
        try {
          // Save current graphics state
          pdfDoc.saveGraphicsState();
          
          // Set blend mode for watermark (if supported)
          pdfDoc.addImage(
            fadedWatermark,
            'PNG',
            pdfWidth * 0.2,
            pdfHeight / 4,
            pdfWidth * 0.6,
            pdfHeight / 2.5,
            undefined,
            'NONE'
          );
          
          // Restore graphics state
          pdfDoc.restoreGraphicsState();
          
        } catch (err) {
          console.error('Error adding watermark:', err);
          // Fallback: try without graphics state
          try {
            pdfDoc.addImage(
              fadedWatermark,
              'PNG',
              pdfWidth * 0.2,
              pdfHeight / 4,
              pdfWidth * 0.6,
              pdfHeight / 2.5
            );
          } catch (e) {
            console.error('Fallback watermark add also failed:', e);
          }
        }
      };
  
      // Capture PDF template
      const canvas = await html2canvas(pdfTemplateRef.current, { 
        scale: 2, 
        backgroundColor: '#ffffff', 
        useCORS: true,
        logging: true,
        windowWidth: pdfTemplateRef.current.scrollWidth,
        windowHeight: pdfTemplateRef.current.scrollHeight,
        allowTaint: false
      });
      
      
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas capture failed - empty canvas');
      }
      
      const imgWidth = pdfWidth - 60; // 30px margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Page settings with proper margins
      const topMargin = 30;
      const bottomMargin = 50; // Space for footer
      const leftMargin = 30;
      const usablePageHeight = pdfHeight - topMargin - bottomMargin;
      
      let sourceY = 0;
      let page = 0;
      
      while (sourceY < imgHeight) {
        if (page > 0) {
          pdf.addPage();
        }
        
        // Calculate how much content fits on this page
        const remainingHeight = imgHeight - sourceY;
        const heightForThisPage = Math.min(remainingHeight, usablePageHeight);
        
        // Create a temporary canvas for this page slice
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = (heightForThisPage / imgHeight) * canvas.height;
        const pageCtx = pageCanvas.getContext('2d');
        
        // Calculate source coordinates
        const sourceY_px = (sourceY / imgHeight) * canvas.height;
        
        // Draw the portion of the image for this page
        pageCtx.drawImage(
          canvas,
          0, sourceY_px, // source x, y
          canvas.width, pageCanvas.height, // source width, height
          0, 0, // destination x, y
          pageCanvas.width, pageCanvas.height // destination width, height
        );
        
        const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
        
        // Add content to PDF page FIRST
        pdf.addImage(
          pageImgData,
          'PNG',
          leftMargin,
          topMargin,
          imgWidth,
          heightForThisPage,
          undefined,
          'FAST'
        );
        
        // Add clickable link on first page (where "Online Report" button is)
        if (page === 0) {
          // Calculate button position in PDF coordinates
          // Button is in header section, right side
          // Template width: 794px, PDF usable width: imgWidth
          const scaleFactor = imgWidth / pdfTemplateRef.current.scrollWidth;
          // Button approximate position: right side of header (around 650-700px from left in template)
          const buttonXTemplate = 650; // Approximate X position in template
          const buttonYTemplate = 120; // Approximate Y position in template (in header area)
          const buttonWidth = 120; // Approximate button width
          const buttonHeight = 35; // Approximate button height
          
          // Convert to PDF coordinates
          const buttonX = leftMargin + (buttonXTemplate * scaleFactor);
          const buttonY = topMargin + (buttonYTemplate * scaleFactor);
          const buttonWidthPDF = buttonWidth * scaleFactor;
          const buttonHeightPDF = buttonHeight * scaleFactor;
          
          // Add clickable link
          const currentUrl = window.location.href;
          pdf.link(
            buttonX,
            buttonY,
            buttonWidthPDF,
            buttonHeightPDF,
            { url: currentUrl }
          );
        }
        
        // Add watermark AFTER content (so it appears on top/visible)
        addWatermarkToPage(pdf, page + 1);
        
        sourceY += usablePageHeight;
        page++;
      }
      
      // Final pass: Ensure watermark is on ALL pages
      const totalPages = pdf.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        // Add watermark again to ensure visibility
        addWatermarkToPage(pdf, p);
      }
      
      pdf.save('Construction-Cost-Details.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF: ' + error.message);
    } finally {
      setPdfLoading(false);
      setForceAllCategoriesOpen(false);
    }
  };
  const conversionRates = {
    "Square Feet ( Sq. Ft.)": 1,
    "Square Yards ( Sq. Yd.)": 9,       // 1 sq yd = 9 sq ft
    "Square Meters ( Sq. M.)": 10.7639, // 1 sq m = 10.7639 sq ft
    Marla: 225,              // 1 Marla = 225 sq ft
    Kanal: 4500,             // 1 Kanal = 4500 sq ft
    Acre: 43560,             // 1 Acre = 43560 sq ft
}
const handleConvert = (inpValue, fromUnitvalue, toUnitvalue) => {
    if (!inpValue || isNaN(inpValue)) {
        return;
    }

    // Step 1: Convert input value → square feet
    const valueInSqft = inpValue * conversionRates[fromUnitvalue];

    // Step 2: Convert sqft → target unit
    const convertedValue = valueInSqft / conversionRates[toUnitvalue];
    let totalArea;
    if(toUnitvalue==="Square Feet ( Sq. Ft.)"){
       totalArea = convertedValue * 2
    }
    else{
        totalArea = convertedValue
    }
    if (totalArea >= 1350 && totalArea <= 2250) {
        let notCoverdArea = totalArea / 100 * 10
        let coveredArea = totalArea - notCoverdArea
        return Math.round(coveredArea)
    }
    if (totalArea >= 2251 && totalArea <= 3600) {
        let notCoverdArea = totalArea / 100 * 15
        let coveredArea = totalArea - notCoverdArea
        return Math.round(coveredArea)
    }
    if (totalArea >= 3601 && totalArea <= 4050) {
        let notCoverdArea = totalArea / 100 * 20
        let coveredArea = totalArea - notCoverdArea
        return Math.round(coveredArea)
    }
    if (totalArea >= 4051 && totalArea <= 6300) {
        let notCoverdArea = totalArea / 100 * 25
        let coveredArea = totalArea - notCoverdArea
        return Math.round(coveredArea)
    }
    if (totalArea >= 6301 && totalArea <= 8415) {
        let notCoverdArea = totalArea / 100 * 29.7
        let coveredArea = totalArea - notCoverdArea
        return Math.round(coveredArea)
    }
    if (totalArea >= 8416) {
        let notCoverdArea = totalArea / 100 * 30
        let coveredArea = totalArea - notCoverdArea
        return Math.round(coveredArea)
    }
    else {
        return totalArea
    }
};

  useEffect(() => {
    if (open) {
      // Store original styles
      const originalHeight = document.body.style.height;
      const originalOverflow = document.body.style.overflow;
      
      // Set new styles
      document.body.style.height = '100dvh';
      document.body.style.overflow = 'hidden';
      
      // Cleanup function to restore original styles
      return () => {
        document.body.style.height = originalHeight;
        document.body.style.overflow = originalOverflow;
      };
    } else {
      // Reset styles when open is false
      document.body.style.height = '';
      document.body.style.overflow = '';
    }
  }, [open]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Wait for citiesList and areaUnit to have values
        if (!citiesList || citiesList.length === 0 || !areaUnit || areaUnit.length === 0) {
          return;
        }

        const parsed = await parseQueryParams(location.search);

        setParsedData(parsed)

        let city = citiesList?.find((item) => {
          if (item?.app_code === parsed?.city_code) {
            return item
          }
          return null
        })
        let areaUnits = areaUnit?.find((item) => {
          if (item?.id === parseInt(parsed?.unit)) {
            return item
          }
          return null
        })
        let construction_type = [{ name: "Complete", value: "complete" }, { name: "Grey Structure", value: "grey_structure" }]?.find((item) => {
          if (item?.value === parsed?.construction_type) {
            return item
          }
          return null
        })
        let construction_mode = [{ value: "with_mterial", name: "With Material" }, { value: "without_mterial", name: "Without Material" }]?.find((item) => {
          if (item?.value === parsed?.construction_mode) {
            return item
          }
          return null
          
        })
        let convertedMarla = handleConvert(parsed?.size, areaUnits?.name, "Marla")
        let dataNew = {}
        if(convertedMarla>1 && convertedMarla<=7){
          dataNew={...dataNew,bedrooms:3,bathrooms:4}
        }
        if(convertedMarla>7 && convertedMarla<=18){
          dataNew={...dataNew,bedrooms:4,bathrooms:5}
        }
        if(convertedMarla>18 ){
          dataNew={...dataNew,bedrooms:5,bathrooms:6}
        }
        setFilterData({
          ...filterData,
          area_size: parsed?.size,
          city: city,
          areaValue: areaUnits,
          coverd_area: parsed?.covered_area,
          construction_mode: construction_mode,
          construction_type: construction_type,
          drowing_rooms: { value: parsed?.drowing_rooms },
          living_rooms: { value: parsed?.living_rooms },
          kitchens: { value: parsed?.kitchens?parsed?.kitchens:dataNew?.kitchens },
          bathrooms: { value: parsed?.bathrooms?parsed?.bathrooms:dataNew?.bathrooms },
          bedrooms: { value: parsed?.bedrooms?parsed?.bedrooms:dataNew?.bedrooms },
          area_unit: {
            id: 4,
            name: "Marla",
            code: "marla"
          }

        })
        let result = await constructionCalulation(parsed)
        if (result?.success) {
          setData(result?.data?.categories)
        }

      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };
    fetchProjects()
    // eslint-disable-next-line
  }, [location.search, citiesList, areaUnit])
  return (
    <div>
        <Helmet>
        <title>Construction Cost Calculator Pakistan - Build Cost</title>
        <meta name="description" content="Use our construction cost calculator to get accurate estimates for building property in Pakistan. Check labour and finish costs to plan your property well."/>
      </Helmet>
      <NavBar />
      <InputSection openSlider={open} setOpenSlider={setOpen}  setFilterData={setFilterData} filterData={filterData} />

      {loading || !data ?
             <div className='main-container'>
        {/* Banner Section */}
        <div className='const-main-b'>
          <div style={{ display: 'flex' }} className='row'>
            <div className='col-12 p-0'>
              {/* Breadcrumb and Title Section */}
              <div className="d-md-flex align-items-center justify-content-between">
                <div className='pakistani-property'>
                  <div className="d-flex flex-wrap align-items-center justify-content-between w-100" style={{ margin: "16px 0 18px", gap: "10px" }}>
                    <div className='placeholder-glow'>
                      <div className='d-flex flex-wrap align-items-center gap-2'>
                        <div className='placeholder' style={{ height: "20px", width: "60px", borderRadius: "4px" }} />
                        <div className='placeholder' style={{ height: "20px", width: "200px", borderRadius: "4px" }} />
                        <div className='placeholder' style={{ height: "20px", width: "150px", borderRadius: "4px" }} />
                      </div>
                    </div>
                    {/* <div className='d-md-none placeholder-glow'>
                      <div className='placeholder' style={{ height: "36px", width: "80px", borderRadius: "4px" }} />
                    </div> */}
                  </div>
                  
                  {/* Title and Share buttons */}
                  <div className="d-flex justify-content-between w-100 align-items-center" style={{ gap: "10px" }}>
                    <div className='placeholder-glow flex-grow-1'>
                      <div className='placeholder mb-2' style={{ height: "32px", width: "85%", borderRadius: "4px" }} />
                      <div className='placeholder' style={{ height: "32px", width: "70%", borderRadius: "4px" }} />
                    </div>
                    <div className='d-md-none d-flex align-items-center gap-2'>
                      <div className='placeholder' style={{ height: "36px", width: "36px", borderRadius: "4px" }} />
                      <div className='placeholder' style={{ height: "36px", width: "36px", borderRadius: "4px" }} />
                    </div>
                  </div>
                </div>
                <div className='d-md-flex d-none align-items-center gap-2'>
                  <div className='placeholder' style={{ height: "36px", width: "36px", borderRadius: "4px" }} />
                  <div className='placeholder' style={{ height: "36px", width: "36px", borderRadius: "4px" }} />
                </div>
              </div>
            </div>
            
            {/* Cost Summary Section */}
            <div className='col-12 p-0'>
              <div className='construction-lower-box placeholder-glow'>
                <div className="cost-summary d-flex">
                  <div className="cost-item">
                    <div className='placeholder mb-2' style={{ height: "16px", width: "120px", borderRadius: "4px" }} />
                    <div className='placeholder' style={{ height: "24px", width: "100px", borderRadius: "4px" }} />
                  </div>
                  <div className="line"></div>
                  <div className="cost-item">
                    <div className='placeholder mb-2' style={{ height: "16px", width: "80px", borderRadius: "4px" }} />
                    <div className='placeholder' style={{ height: "24px", width: "90px", borderRadius: "4px" }} />
                  </div>
                  <div className="line"></div>
                  <div className="cost-item border-left">
                    <div className='placeholder mb-2' style={{ height: "16px", width: "100px", borderRadius: "4px" }} />
                    <div className='placeholder' style={{ height: "24px", width: "80px", borderRadius: "4px" }} />
                  </div>
                  <div className="line"></div>
                  <div className="cost-item total">
                    <div className='placeholder mb-2' style={{ height: "16px", width: "70px", borderRadius: "4px" }} />
                    <div className='placeholder' style={{ height: "28px", width: "120px", borderRadius: "4px" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Circle Chart Section */}
        <div className='secondary-color mt-4'>
          <div className='main-container'>
            <div className='row m-0'>
              <div className='col-12 mb-4'>
                <div className='placeholder-glow'>
                  <div className='placeholder' style={{ height: "28px", width: "250px", borderRadius: "4px" }} />
                </div>
              </div>
              
              {/* Chart section - responsive layout */}
              <div className='col-12'>
                <div className='d-flex flex-column flex-md-row align-items-center justify-content-center gap-4'>
                  {/* Circular chart placeholder */}
                  <div className='placeholder-glow'>
                    <div className='placeholder d-md-none' style={{ 
                      height: "200px", 
                      width: "200px", 
                      borderRadius: "50%" 
                    }} />
                    <div className='placeholder d-none d-md-block' style={{ 
                      height: "300px", 
                      width: "300px", 
                      borderRadius: "50%" 
                    }} />
                  </div>
                  
                  {/* Legend/Details */}
                  <div className='placeholder-glow w-100 w-md-auto' style={{ 
                    maxWidth: "100%"
                  }}>
                    <div className='placeholder mb-2' style={{ height: "24px", width: "100%", maxWidth: "300px", borderRadius: "4px" }} />
                    <div className='placeholder mb-2' style={{ height: "24px", width: "90%", maxWidth: "270px", borderRadius: "4px" }} />
                    <div className='placeholder mb-2' style={{ height: "24px", width: "95%", maxWidth: "285px", borderRadius: "4px" }} />
                    <div className='placeholder mb-2' style={{ height: "24px", width: "85%", maxWidth: "255px", borderRadius: "4px" }} />
                    <div className='placeholder' style={{ height: "24px", width: "80%", maxWidth: "240px", borderRadius: "4px" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        : <div className='secondary-color'>
          <div className='main-container'>
            <Banner categories={data} parsedData={parsedData} data={data} filterData={filterData} 
                    onPdfDownload={handleDownloadPdf} pdfLoading={pdfLoading} setOpenSlider={setOpen} />
          </div>
          <div ref={contentRef}>
            <Percentage construction_type={parsedData?.construction_type} categories={data}/>
            <ConstrustionCategories
              categories={data}
              onAllCategoryOpenChange={setAllCategoriesOpen}
              forceAllOpen={forceAllCategoriesOpen}
            />
          </div>
          {/* Hidden PDF Template for export */}
          <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '794px' }}>
            <div ref={pdfTemplateRef} style={{ width: '100%' }}>
              <PdfTemplate 
                categories={data} 
                filterData={filterData} 
                parsedData={parsedData}
              />
            </div>
          </div>
        
          {pdfLoading ?<div style={{ position: 'absolute', left: '0', top: '100px', width: '100%', height: '100%', zIndex: 9999999 }}>
            <PageLoaderInside/>
          </div>:null}
          {/* <div className='mt-3'>
            <Disclamier />
          </div> */}
          {/* <Cost /> */}
          {/* <Popular /> */}
        </div>}


      <div className="main-container">
        <Footer />
      </div>
    </div>
  )
}

export default ConstructionDetailpage
