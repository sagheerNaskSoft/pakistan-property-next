import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/ContextProvider";

/* -------- Helpers -------- */

export default function ConstructionCategoriesCustom({ categories, onAllCategoryOpenChange, forceAllOpen }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [openSubcategory, setOpenSubcategory] = useState({});
  const {formatPriceWithCommas} = useAuth();

  useEffect(() => {
    if (forceAllOpen && Array.isArray(categories)) {
      setOpenCategory('all');
    } else if (!forceAllOpen && openCategory === 'all') {
      setOpenCategory(null);
    }
  }, [forceAllOpen, categories]);

  useEffect(() => {
    if (onAllCategoryOpenChange) {
      // Set true if all open, else false
      onAllCategoryOpenChange(openCategory === 'all');
    }
  }, [openCategory, onAllCategoryOpenChange]);

  const toggleCategory = (i) => {
    if (forceAllOpen) return; // Prevent toggle if force all open
    setOpenCategory((curr) => (curr === i ? null : i));
  };

  const toggleSubcategory = (catIndex, subIndex) => {
    setOpenSubcategory((prev) => ({
      ...prev,
      [catIndex]: prev[catIndex] === subIndex ? null : subIndex,
    }));
  };

  return (
    <div className="calculator-detail-section pb-5">
      <div className="main-container">
        <div className="plumbing-card-title">Detailed Cost Breakdown</div>
        <div className="plumbing-card-para">
          Comprehensive itemized costs for each construction category
        </div>

       <div className="d" style={{display:"flex", flexDirection:"column", gap:"12px"}}>
       {categories?.map((category, catIndex) => {
          const subcategoryTotals = category.subcategories.map((sub) =>
            sub.items.reduce((sum, item) => sum + (item.total_cost || 0), 0)
          );
          const grandTotal = subcategoryTotals.reduce((sum, sub) => sum + sub, 0);
          if(grandTotal===0){
            return null;
          }
          const isOpen = openCategory === 'all' || openCategory === catIndex;
          const iconBgColor = category?.icon_background_color || '#059669';
          
          return (
            <div className="plumbing-card" key={catIndex}>
              {/* Header strip (Category level accordion) */}
              <div
                className="header-strip"
                onClick={() => toggleCategory(catIndex)}
                style={{ 
                  cursor: "pointer",
                  border: isOpen ? `1px solid ${iconBgColor}` : '',
                }}
              >
                <div className="header-left d-flex align-items-center">
                  <div className="header-icon" aria-hidden>
                    {category?.icon ? (
                      <img src={category?.icon} alt={category?.name} />
                    ) : (
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M14 2H6C5.47 2 4.96 2.21 4.59 2.59C4.21 2.96 4 3.47 4 4V20C4 20.53 4.21 21.04 4.59 21.41C4.96 21.79 5.47 22 6 22H18C18.53 22 19.04 21.79 19.41 21.41C19.79 21.04 20 20.53 20 20V8L14 2Z"
                          fill="#059669"
                        />
                        <path
                          d="M14 2V8H20"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 12H15M9 16H15"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="header-text d-flex flex-column justify-content-center">
                    <h3 className="header-title">{category.name}</h3>
                    {category?.description && (
                      <p className="header-sub">{category.description}</p>
                    )}
                  </div>
                </div>
                <div className="right d-flex align-items-center gap-2">
                  <div className="header-total">
                    PKR {formatPriceWithCommas(grandTotal?.toFixed(0))}
                  </div>
                  <svg
                    className={`chev ${openCategory === catIndex ? "open" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M6.85791 9.42859L12.0008 14.5714L17.1436 9.42859"
                      stroke="#2D2D2D"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Subcategories Accordion */}
          {/* Subcategories Accordion */}
<div className={`rows-wrap${(openCategory === 'all' || openCategory === catIndex) ? ' expanded' : ' collapsed'}`}
     style={{ display: (openCategory === 'all' || openCategory === catIndex) ? 'block' : 'none' }}>

  {(() => {
    // Step 1: Reorder Subcategories
    const sortedSubcategories =
      category?.subcategories
        ?.filter(sub => sub?.name !== "Labor Cost") // Remove Labor Cost temporarily
        ?.concat(category?.subcategories?.filter(sub => sub?.name === "Labor Cost")); // Add at bottom

    // Step 2: Render sorted subcategories
    return sortedSubcategories?.map((sub, subIndex) => {
      const total = sub?.items?.reduce(
        (sum, item) => sum + (item.total_cost || 0),
        0
      );
      const isOpen = openSubcategory[catIndex] === subIndex;

      return (
        <div className="acc-item mt-2" key={subIndex}>
          <div
            className="acc-summary"
            onClick={() => { if (!forceAllOpen) toggleSubcategory(catIndex, subIndex); }}
          >
            <span className={`${sub?.name==="Labor Cost" ? "row-title-labor" : "row-title"}`}>{sub.name}</span>
            <span className="row-right d-flex align-items-center gap-2">
              <div className="row-amount">
                PKR {formatPriceWithCommas(total?.toFixed(0))}
              </div>
              <svg
                className={`chev ${(forceAllOpen || isOpen) ? '' : 'open'}`}
                xmlns="http://www.w3.org/2000/svg"
                width="20" height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6.85742 14.5714L12.0003 9.42855L17.1431 14.5714"
                  stroke="#2D2D2D"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          {(forceAllOpen || isOpen) && (
            <div className="acc-details show">
              <div className="details-table">
               <div className="scroll-box-new">
               <div className="thead">
                  <div>ITEM</div>
                  <div>RATE</div>
                  <div>QUANTITY</div>
                  <div>COST</div>
                </div>
                <div className="tbody">
                  {sub?.items?.map((d, idx) => (
                    <div className="tr" key={idx}>
                      <div className="td item">{d.name || "—"}</div>
                      <div className="td rate">
                        {d.rate}/{d?.uom}
                      </div>
                      <div className="td qty">
                        {parseInt(d?.total_qty)?.toFixed(2) ?? "—"}
                      </div>
                      <div className="td cost">
                        PKR {formatPriceWithCommas(parseInt(d?.total_cost)?.toFixed(0))}
                      </div>
                    </div>
                  ))}
                </div>
               </div>
              </div>
            </div>
          )}

          {subIndex !== sortedSubcategories?.length - 1 && <div className="divider" />}
        </div>
      );
    });
  })()}
</div>

   
            </div>
          );
        })} 
       </div>
      </div>
    </div>
  );
}
