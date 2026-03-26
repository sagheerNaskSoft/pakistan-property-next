import { useEffect, useRef, useState } from 'react';
import BreadCrumb from '../Metiral/BreadCrumb'
import { LuFilter } from 'react-icons/lu'

function IndexDetail({ data,setGraphData,parsedData , setOpen, activePeriod, selectedMonth, setSelectedMonth}) {
    
    const inputRef = useRef(null)
    const monthRef = useRef(null)
    const [tabData, setTabData] = useState([])
    const [activeTab, setActiveTab] = useState("Average Price")
    const [propertyFilterText, setPropertyFilterText] = useState("Duration")
    const [order, setOrder] = useState(false)
    const [monthFilterText, setMonthFilterText] = useState("Month")
    const [monthOrder, setMonthOrder] = useState(false)

    // Generate months based on active period
    const getMonths = () => {
        const months = [];
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        // Determine how many years to show based on active period
        let yearsToShow = 1;
        if (activePeriod === 'year3_trend') yearsToShow = 3;
        else if (activePeriod === 'year5_trend' || activePeriod === 'max_year_trend') yearsToShow = 5;
        
        // Generate months for the specified number of years
        for (let y = 0; y < yearsToShow; y++) {
            const year = currentYear - y;
            for (let m = 1; m <= 12; m++) {
                const monthStr = `${year}-${String(m).padStart(2, '0')}`;
                months.push({
                    label: `${monthNames[m - 1]} ${year}`,
                    value: monthStr,
                    month: m
                });
            }
        }
        
        // Reverse to show oldest first, then sort by month number for each year
        return months.reverse();
    };

    const months = getMonths();

    // Reset month filter text when selectedMonth is null
    useEffect(() => {
        if (selectedMonth === null) {
            setMonthFilterText("Month");
        }
    }, [selectedMonth]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const refs = [
                inputRef.current,
                monthRef.current,
            ];
            const clickedInside = refs.some(ref => ref && ref.contains(event.target));
            if (!clickedInside) {
                setOrder(false)
                setMonthOrder(false)
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    useEffect(() => {
       setTabData([
        {
            name: "Average Price",
            value: data?.avg_price_trends,
        },
        {
            name: "Price per Sq. Ft.",
            value: data?.avg_price_per_sqft_trends,
        },
        {
            name: "Price Index",
            value: data?.price_trends,
        }
       ])
       setGraphData({name:"Price per Sq. Ft.",
        value:data?.avg_price_trends
       })
    }, [data]);
    return (
        <>
            <div className='main-container'>
                <div className='main-index-detail mt-sm-5 pt-sm-3'>
                    <div className='index-detail'>
                       <div className="d-flex justify-content-between align-items-center">
                       <BreadCrumb items={['Home', "Property Index", `${parsedData?.city?.city}`]} />
                        <div className="filter d-sm-none d-flex align-items-center gap-2 ms-auto" onClick={() => setOpen(true)}>
                            Filter <LuFilter />
                        </div>
                       </div>
                       <div className="d-flex align-items-center justify-content-between" style={{gap:'16px'}}>
                       {parsedData?.category?.name?<h2>Price trends for {parsedData?.propertyType?.name==="Sell"?"Buy":parsedData?.propertyType?.name} {parsedData?.category?.name} in {parsedData?.location?.name} {parsedData?.city?.city}</h2>:
                        <h2>Price trends for {parsedData?.propertyType?.name==="Sell"?"Buy":parsedData?.propertyType?.name}  in {parsedData?.location?.name} {parsedData?.city?.city}</h2>
                        }
                               <div style={{ gap: '12px' ,maxWidth:"170px" }} className='d-sm-none d-flex index-detail-buttons w-100'>
                            <div className="card-order w-100" ref={monthRef} style={{minWidth:"unset"}}>
                                <div className="input" onClick={() => setMonthOrder(!monthOrder)}>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M6.66667 4.16699C6.66667 3.89085 6.89052 3.66699 7.16667 3.66699H12.8333C13.1095 3.66699 13.3333 3.89085 13.3333 4.16699V5.83366C13.3333 6.1098 13.1095 6.33366 12.8333 6.33366H7.16667C6.89052 6.33366 6.66667 6.1098 6.66667 5.83366V4.16699Z" fill="#737678" />
                                            <path d="M6.66667 8.33301C6.66667 8.05687 6.89052 7.83301 7.16667 7.83301H12.8333C13.1095 7.83301 13.3333 8.05687 13.3333 8.33301V9.99967C13.3333 10.2758 13.1095 10.4997 12.8333 10.4997H7.16667C6.89052 10.4997 6.66667 10.2758 6.66667 9.99967V8.33301Z" fill="#737678" />
                                            <path d="M6.66667 12.5C6.66667 12.2239 6.89052 12 7.16667 12H12.8333C13.1095 12 13.3333 12.2239 13.3333 12.5V14.1667C13.3333 14.4428 13.1095 14.6667 12.8333 14.6667H7.16667C6.89052 14.6667 6.66667 14.4428 6.66667 14.1667V12.5Z" fill="#737678" />
                                            <path d="M4.16667 4.16699C4.16667 3.89085 4.39052 3.66699 4.66667 3.66699H5.33333C5.60948 3.66699 5.83333 3.89085 5.83333 4.16699V5.83366C5.83333 6.1098 5.60948 6.33366 5.33333 6.33366H4.66667C4.39052 6.33366 4.16667 6.1098 4.16667 5.83366V4.16699Z" fill="#737678" />
                                            <path d="M4.16667 8.33301C4.16667 8.05687 4.39052 7.83301 4.66667 7.83301H5.33333C5.60948 7.83301 5.83333 8.05687 5.83333 8.33301V9.99967C5.83333 10.2758 5.60948 10.4997 5.33333 10.4997H4.66667C4.39052 10.4997 4.16667 10.2758 4.16667 9.99967V8.33301Z" fill="#737678" />
                                            <path d="M4.16667 12.5C4.16667 12.2239 4.39052 12 4.66667 12H5.33333C5.60948 12 5.83333 12.2239 5.83333 12.5V14.1667C5.83333 14.4428 5.60948 14.6667 5.33333 14.6667H4.66667C4.39052 14.6667 4.16667 14.4428 4.16667 14.1667V12.5Z" fill="#737678" />
                                        </svg>
                                        <span>
                                            {monthFilterText}
                                        </span>
                                    </span>
                                    <span>
                                        {
                                            !monthOrder ?
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path d="M5.71484 7.85742L10.0006 12.1431L14.2863 7.85742" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                                                    <path d="M13.6094 12.1426L9.56673 7.85686L5.52409 12.1426" stroke="#444545" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                        }
                                    </span>
                                </div>
                                {
                                    monthOrder ?
                                        <>
                                            <div className="input-drop-menu" style={{maxHeight:"210px" , overflowY:"scroll"}}>
                                                <div 
                                                    className={monthFilterText === "Month" || selectedMonth === null ? "title active" : "title"} 
                                                    onClick={() => { 
                                                        setMonthFilterText("Month"); 
                                                        setSelectedMonth(null);
                                                        setMonthOrder(false) 
                                                    }}
                                                >
                                                    All Months
                                                </div>
                                                {months.map((month) => (
                                                    <div 
                                                        key={month.value}
                                                        className={monthFilterText === month.label ? "title active" : "title"} 
                                                        onClick={() => { 
                                                            setMonthFilterText(month.label); 
                                                            setSelectedMonth(month.month); // Pass month number (1-12)
                                                            setMonthOrder(false) 
                                                        }}
                                                    >
                                                        {month.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                        :
                                        <></>
                                }
                            </div>
                        </div>
                       </div>
                    </div>
                    <div className='index-detail-buttons mt-3 d-flex align-items-center justify-content-between'>
                        <div style={{ gap: '12px' }} className='d-flex'>
                            {tabData?.map((item) => (
                                <button 
                                    key={item?.name}
                                    className={`Average-Price ${activeTab === item?.name ? "active" : ""}`} 
                                    onClick={() => { setActiveTab(item?.name); setGraphData(item) }}
                                >
                                    {item?.name}
                                </button>
                            ))}
                       
                        </div>
                        <div style={{ gap: '12px' }} className='d-sm-flex d-none'>
                            <div className="card-order" style={{width: "175px"}} ref={monthRef}>
                                <div className="input" onClick={() => setMonthOrder(!monthOrder)}>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M6.66667 4.16699C6.66667 3.89085 6.89052 3.66699 7.16667 3.66699H12.8333C13.1095 3.66699 13.3333 3.89085 13.3333 4.16699V5.83366C13.3333 6.1098 13.1095 6.33366 12.8333 6.33366H7.16667C6.89052 6.33366 6.66667 6.1098 6.66667 5.83366V4.16699Z" fill="#737678" />
                                            <path d="M6.66667 8.33301C6.66667 8.05687 6.89052 7.83301 7.16667 7.83301H12.8333C13.1095 7.83301 13.3333 8.05687 13.3333 8.33301V9.99967C13.3333 10.2758 13.1095 10.4997 12.8333 10.4997H7.16667C6.89052 10.4997 6.66667 10.2758 6.66667 9.99967V8.33301Z" fill="#737678" />
                                            <path d="M6.66667 12.5C6.66667 12.2239 6.89052 12 7.16667 12H12.8333C13.1095 12 13.3333 12.2239 13.3333 12.5V14.1667C13.3333 14.4428 13.1095 14.6667 12.8333 14.6667H7.16667C6.89052 14.6667 6.66667 14.4428 6.66667 14.1667V12.5Z" fill="#737678" />
                                            <path d="M4.16667 4.16699C4.16667 3.89085 4.39052 3.66699 4.66667 3.66699H5.33333C5.60948 3.66699 5.83333 3.89085 5.83333 4.16699V5.83366C5.83333 6.1098 5.60948 6.33366 5.33333 6.33366H4.66667C4.39052 6.33366 4.16667 6.1098 4.16667 5.83366V4.16699Z" fill="#737678" />
                                            <path d="M4.16667 8.33301C4.16667 8.05687 4.39052 7.83301 4.66667 7.83301H5.33333C5.60948 7.83301 5.83333 8.05687 5.83333 8.33301V9.99967C5.83333 10.2758 5.60948 10.4997 5.33333 10.4997H4.66667C4.39052 10.4997 4.16667 10.2758 4.16667 9.99967V8.33301Z" fill="#737678" />
                                            <path d="M4.16667 12.5C4.16667 12.2239 4.39052 12 4.66667 12H5.33333C5.60948 12 5.83333 12.2239 5.83333 12.5V14.1667C5.83333 14.4428 5.60948 14.6667 5.33333 14.6667H4.66667C4.39052 14.6667 4.16667 14.4428 4.16667 14.1667V12.5Z" fill="#737678" />
                                        </svg>
                                        <span>
                                            {monthFilterText}
                                        </span>
                                    </span>
                                    <span>
                                        {
                                            !monthOrder ?
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path d="M5.71484 7.85742L10.0006 12.1431L14.2863 7.85742" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                                                    <path d="M13.6094 12.1426L9.56673 7.85686L5.52409 12.1426" stroke="#444545" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                        }
                                    </span>
                                </div>
                                {
                                    monthOrder ?
                                        <>
                                            <div className="input-drop-menu" style={{maxHeight:"210px" , overflowY:"scroll"}}>
                                                <div 
                                                    className={monthFilterText === "Month" || selectedMonth === null ? "title active" : "title"} 
                                                    onClick={() => { 
                                                        setMonthFilterText("Month"); 
                                                        setSelectedMonth(null);
                                                        setMonthOrder(false) 
                                                    }}
                                                >
                                                    All Months
                                                </div>
                                                {months.map((month) => (
                                                    <div 
                                                        key={month.value}
                                                        className={monthFilterText === month.label ? "title active" : "title"} 
                                                        onClick={() => { 
                                                            setMonthFilterText(month.label); 
                                                            setSelectedMonth(month.month); // Pass month number (1-12)
                                                            setMonthOrder(false) 
                                                        }}
                                                    >
                                                        {month.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                        :
                                        <></>
                                }
                            </div>
                            {/* <div className="card-order" ref={inputRef}>
                                <div className="input" onClick={() => setOrder(!order)}>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M8.66667 6.16699H17.3333C17.5101 6.16699 17.6797 6.08797 17.8047 5.94732C17.9298 5.80667 18 5.6159 18 5.41699C18 5.21808 17.9298 5.02731 17.8047 4.88666C17.6797 4.74601 17.5101 4.66699 17.3333 4.66699H8.66667C8.48986 4.66699 8.32029 4.74601 8.19526 4.88666C8.07024 5.02731 8 5.21808 8 5.41699C8 5.6159 8.07024 5.80667 8.19526 5.94732C8.32029 6.08797 8.48986 6.16699 8.66667 6.16699Z" fill="#737678" />
                                            <path d="M17.3333 9.33301H8.66667C8.48986 9.33301 8.32029 9.41203 8.19526 9.55268C8.07024 9.69333 8 9.8841 8 10.083C8 10.2819 8.07024 10.4727 8.19526 10.6133C8.32029 10.754 8.48986 10.833 8.66667 10.833H17.3333C17.5101 10.833 17.6797 10.754 17.8047 10.6133C17.9298 10.4727 18 10.2819 18 10.083C18 9.8841 17.9298 9.69333 17.8047 9.55268C17.6797 9.41203 17.5101 9.33301 17.3333 9.33301Z" fill="#737678" />
                                            <path d="M17.3333 14H8.66667C8.48986 14 8.32029 14.079 8.19526 14.2197C8.07024 14.3603 8 14.5511 8 14.75C8 14.9489 8.07024 15.1397 8.19526 15.2803C8.32029 15.421 8.48986 15.5 8.66667 15.5H17.3333C17.5101 15.5 17.6797 15.421 17.8047 15.2803C17.9298 15.1397 18 14.9489 18 14.75C18 14.5511 17.9298 14.3603 17.8047 14.2197C17.6797 14.079 17.5101 14 17.3333 14Z" fill="#737678" />
                                            <path d="M5.69647 6.24444C5.75654 6.24443 5.81526 6.22604 5.86519 6.19161C5.91513 6.15718 5.95403 6.10826 5.97698 6.05103C5.99992 5.9938 6.00589 5.93084 5.99411 5.87011C5.98233 5.80939 5.95334 5.75363 5.91081 5.7099L4.42928 4.18326C4.31542 4.06592 4.161 4 4 4C3.839 4 3.68459 4.06592 3.57072 4.18326L2.0898 5.7099C2.04727 5.75363 2.01828 5.80939 2.0065 5.87011C1.99472 5.93084 2.00068 5.9938 2.02363 6.05103C2.04658 6.10826 2.08548 6.15718 2.13541 6.19161C2.18535 6.22604 2.24406 6.24443 2.30414 6.24444H3.39342V13.7556H2.30414C2.24401 13.7554 2.18521 13.7737 2.13518 13.8081C2.08516 13.8425 2.04616 13.8914 2.02314 13.9487C2.00012 14.0059 1.9941 14.069 2.00586 14.1297C2.01762 14.1905 2.04662 14.2463 2.08919 14.2901L3.57072 15.8167C3.68459 15.9341 3.839 16 4 16C4.161 16 4.31542 15.9341 4.42928 15.8167L5.91081 14.2901C5.95334 14.2464 5.98233 14.1906 5.99411 14.1299C6.00589 14.0692 5.99992 14.0062 5.97698 13.949C5.95403 13.8917 5.91513 13.8428 5.86519 13.8084C5.81526 13.774 5.75654 13.7556 5.69647 13.7556H4.60779V6.24444H5.69647Z" fill="#737678" />
                                        </svg>
                                        <span>
                                            {propertyFilterText}
                                        </span>
                                    </span>
                                    <span>
                                        {
                                            !order ?
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path d="M5.71484 7.85742L10.0006 12.1431L14.2863 7.85742" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                                                    <path d="M13.6094 12.1426L9.56673 7.85686L5.52409 12.1426" stroke="#444545" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                        }
                                    </span>
                                </div>
                                {
                                    order ?
                                        <>
                                            <div className="input-drop-menu">
                                                <div className={propertyFilterText === "Popular" ? "title active" : "title"} onClick={() => { setPropertyFilterText("Popular"); setOrder(false) }}>Popular</div>
                                                <div className={propertyFilterText === "Low Price" ? "title active" : "title"} onClick={() => { setPropertyFilterText("Low Price"); setOrder(false) }}>Low Price</div>
                                                <div className={propertyFilterText === "High Price" ? "title active" : "title"} onClick={() => { setPropertyFilterText("High Price"); setOrder(false) }}>High Price</div>
                                            </div>
                                        </>
                                        :
                                        <></>
                                }
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default IndexDetail
