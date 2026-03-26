import React, { useEffect, useState, useRef } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { useAuth } from '../../Context/ContextProvider'
import { Link } from 'react-router-dom';
import Pagination from '../Component/Pagination/Pagination';
import { BsCalendar } from 'react-icons/bs';
function QuotaCredit() {
  const { getQoutaLogs, getProductList, getQoutaState, loginData } = useAuth();
  const [header, setHeader] = useState([]);
  const [header1, setHeader1] = useState([]);
  const [data, setData] = useState([]);
  const [logs, setlogs] = useState([]);
  const [productLogs, setproductLogs] = useState([]);
  const [paginationData, setPaginationData] = useState({
    current_page: 1,
    total_pages: 1,
    perPage: 10,
    total_items: 0,
  });
  const processLogs = (logs, headers) => {
    return logs.map((log) => {
      const processedData = {};

      headers.forEach((header) => {
        const matchingQuota =
          log.quota?.filter((q) => q.offer_slug === header.offer_slug) || [];
        const matchingCredits =
          log.credits?.filter((c) => c.offer_slug === header.offer_slug) || [];

        // Combine both quota and credits under the same header
        if (matchingQuota.length > 0 || matchingCredits.length > 0) {
          processedData[header.offer_slug] = [
            ...matchingQuota,
            ...matchingCredits,
          ];
        }
      });

      return processedData;
    });
  };
  const fetchData = async (paginationDataParam, creditsHeaders, listingsHeaders) => {
    try {
      // Use provided pagination data or current state
      const paginationToUse = paginationDataParam || paginationData;
      let result = await getQoutaLogs(null, paginationToUse);

      if (result?.success) {
        const logsData = result?.data?.data?.logs?.data || result?.data?.data?.logs || [];
        const organizedLogs = processLogs(logsData, [
          ...listingsHeaders,
          ...creditsHeaders,
        ]);
        setData(organizedLogs);
        setlogs(logsData);

        // Update pagination data if available
        if (result?.data?.data?.logs) {
          const logsResponse = result?.data?.data?.logs;
          if (logsResponse?.last_page || logsResponse?.total_pages) {
            setPaginationData({
              ...paginationToUse,
              total_pages: logsResponse?.last_page || logsResponse?.total_pages || 1,
              current_page: logsResponse?.current_page || 1,
              total_items: logsResponse?.total || 0,
            });
          } else if (result?.data?.data?.pagination) {
            const pagination = result?.data?.data?.pagination;
            setPaginationData({
              ...paginationToUse,
              total_pages: pagination?.last_page || pagination?.total_pages || 1,
              current_page: pagination?.current_page || 1,
              total_items: pagination?.total || 0,
            });
          }
        }
      }
    } catch (error) {
      // Error handled silently
    }
  };

  useEffect(() => {
    const fetchqouta = async () => {
      try {
        let result = await getQoutaState();

        if (result?.success) {
          setproductLogs(result?.data?.data?.offer_logs);
        }
      } catch (error) {
        // Error handled silently
      }
    };
    const fetchProduct = async () => {
      try {
        let result = await getProductList();
        if (result?.success) {
          let product = result?.data?.data?.products;
          const listingsHeaders = product.filter(
            (header) => header.type === "listings"
          );
          const creditsHeaders = product.filter(
            (header) => header.type === "credits"
          );
          setHeader(listingsHeaders);
          setHeader1(creditsHeaders);

          fetchData(paginationData, creditsHeaders, listingsHeaders);
        }
      } catch (error) {
        // Error handled silently
      }
    };
    fetchProduct();
    fetchqouta();
    // eslint-disable-next-line
  }, []);
  const products = [...header, ...header1];

  const role = loginData?.data?.role
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef(null);
  const iconRef = useRef(null);

  // Handle click outside to close picker on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is inside the icon
      if (iconRef.current && iconRef.current.contains(event.target)) {
        return; // Don't close if clicking the icon
      }

      // Check if click is inside the picker ref
      if (pickerRef.current && pickerRef.current.contains(event.target)) {
        return; // Don't close if clicking inside picker container
      }

      // Check if click is inside MUI calendar dialog/popup (rendered in portal)
      const muiDialog = event.target.closest('.MuiPickersPopper-root, .MuiPaper-root, .MuiDialog-root, .MuiPopover-root, [role="dialog"]');
      if (muiDialog) {
        return; // Don't close if clicking inside MUI calendar popup
      }

      // Check if click is inside any MUI calendar element
      const muiCalendarElement = event.target.closest('.MuiDateCalendar-root, .MuiPickersCalendar-root, .MuiDayCalendar-root, .MuiPickersDay-root');
      if (muiCalendarElement) {
        return; // Don't close if clicking on calendar elements
      }

      // If none of the above, it's an outside click - close the picker
      setIsPickerOpen(false);
    };

    if (isPickerOpen) {
      // Use both mousedown and touchstart for better mobile support
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isPickerOpen]);

  return (
    <div className='h-100 qouta_credit portal-page-container'>
      <div className='d-flex justify-content-between flex-wrap' style={{ gap: "12px" }}>
        <div>
          <h3 className='page-portal-heading m-0'>Quota & Credits</h3>
          <p className='portal-breadCrums m-0'>Home - <span>Quota & Credits</span></p>

        </div>

        <Link to={`/${role}-portal/products`} style={{ textDecoration: "none" }}><button className='buy_btn'>Buy Quota & Credits</button></Link>

      </div>
      <div className='listing-header'>
        {products.map((product) => {
          const log = productLogs?.find(
            (log) => log.offer_slug === product.offer_slug
          );
          return (
            <div className={`card_quota ${product?.offer_slug}`}>
              <div className='d-flex justify-content-between w-100 align-items-center'>
                <img src={product?.image} alt='...' />
                <h5 className='m-0 total'>{log?.total || 0}</h5>
              </div>
              <div className='w-100'>
                <h5 className='productName'>{product?.name}</h5>
                <div className='data_qouta d-flex justify-content-between w-100 align-items-center'>
                  <div className='border_gr d-flex justify-content-between w-50 align-items-center pe-md-2' style={{ gap: "10px" }}>
                    <h5>Available</h5>
                    <h6>{log?.available || 0}</h6>
                  </div>
                  <div className="seperator"></div>
                  <div className='d-flex justify-content-between w-50 align-items-center ps-md-2'>
                    <h5>Used</h5>
                    <h6>{log?.used || 0}</h6>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className='qouta-table-main' style={{ overflow: "hidden", position: "relative", border: window?.innerWidth <= 576 ? 'unset' : '' }}>
        <div className='d-flex justify-content-between align-items-center mb-sm-0 mb-3' style={{ gap: "12px", flexWrap: window?.innerWidth <= 576 ? "nowrap" : 'wrap' }}>
          <div className='table_title'>
            <h4 className='m-0'>Total Breakdown of your Quota</h4>
            <p className='m-0'>Check your overall consumption and remaining quota</p>
          </div>
          <div className='celender_section' style={{ position: 'relative' , width: window?.innerWidth <= 576 ? 'unset' : '' }}>
            {/* Calendar Icon for Mobile (≤576px) */}
            <div 
              ref={iconRef}
              className='d-sm-none' 
              onClick={() => setIsPickerOpen(true)}
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                // borderRadius: '8px',
                // border: '1px solid #BBBBBB',
                // backgroundColor: 'white',
                // boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <BsCalendar style={{ fontSize: '20px', color: '#447158' }} />
            </div>

            {/* DateRangePicker - Hidden on mobile, shown on desktop */}
            <div className='d-none d-sm-block celender_section_popup'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateRangePicker']}>
                  <DateRangePicker />
                </DemoContainer>
              </LocalizationProvider>
            </div>

            {/* Hidden DateRangePicker for Mobile - Opens calendar popup directly */}
            <div 
              ref={pickerRef}
              className='d-sm-none'
              style={{ 
                position: 'absolute',
                top: '0',
                right: '0',
                opacity: 0,
                pointerEvents: 'none',
                width: '1px',
                height: '1px',
                overflow: 'hidden'
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateRangePicker']}>
                  <DateRangePicker 
                    open={isPickerOpen}
                    onClose={() => setIsPickerOpen(false)}
                    onOpen={() => setIsPickerOpen(true)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
        </div>
        <div className="table_box_quota" style={{ overflow: "scroll", paddingBottom: paginationData?.total_pages > 1 ? "100px" : "60px" }}>
          <table className='w-100' style={{ minWidth: "1200px" , border: window?.innerWidth <= 576 ? '1px solid #BBBBBB' : ''  }}>
            <thead>
              <tr>
                <th>Purchase Date</th>
                {header?.map((item) => {
                  return (
                    <th>{item?.name}</th>
                  )
                })}
                <th>Expiry Date</th>
                {header1?.map((item) => {
                  return (
                    <th>{item?.name}</th>
                  )
                })}
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.length ? (
                <>
                  {data?.map((log, index) => {
                    return (
                      <tr key={index}>
                        <td className={index % 2 !== 0 ? "active" : ""}  >{logs[index]?.purchase_date}</td>

                        {header?.map((header) => (
                          <td className={header.offer_slug + index % 2} key={header.name}>
                            {log[header.offer_slug]
                              ? log[header.offer_slug].map((item) => (
                                <div key={item.product_id}>
                                  {item.quantity}
                                </div>
                              ))
                              : "-"}
                          </td>
                        ))}
                        <td className={index % 2 !== 0 ? "active" : ""}>
                          {header?.find((header) => log[header.offer_slug])
                            ?.offer_slug &&
                            log[
                              header?.find((header) => log[header.offer_slug])
                                ?.offer_slug
                            ]?.[0]?.expiry_date
                            ? log[
                              header?.find(
                                (header) => log[header.offer_slug]
                              )?.offer_slug
                            ]?.[0]?.expiry_date
                            : "-"}
                        </td>
                        {header1?.map((header) => (
                          <td className={index % 2 !== 0 ? "refresh-credits1" : "refresh-credits"} key={header.offer_slug}>
                            {log[header.offer_slug]
                              ? log[header.offer_slug].map((item) => (
                                <div key={item.product_id}>
                                  {item.quantity}
                                </div>
                              ))
                              : "-"}
                          </td>
                        ))}

                        <td className={index % 2 !== 0 ? "active" : ""}>
                          {header1?.find((header) => log[header.offer_slug])
                            ?.offer_slug &&
                            log[
                              header1?.find((header) => log[header.offer_slug])
                                ?.offer_slug
                            ]?.[0]?.expiry_date
                            ? log[
                              header1?.find(
                                (header) => log[header.offer_slug]
                              )?.offer_slug
                            ]?.[0]?.expiry_date
                            : "-"}
                        </td>


                      </tr>
                    );
                  })}
                </>
              ) : (
                <tr>
                  <td className="text-center p-4" colSpan={12}>
                    <span>Data Not Found !</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>



        </div>
        {paginationData?.total_pages > 1 ? (
          <div className='table-footer global-table-footer'>
            <div className='pagination w-100'>
              <Pagination
                fetchData={(paginationDataParam) => {
                  const listingsHeaders = header;
                  const creditsHeaders = header1;
                  fetchData(paginationDataParam, creditsHeaders, listingsHeaders);
                }}
                paginationData={paginationData}
                setPaginationData={setPaginationData}
              />
            </div>
          </div>
        ) : ""}
      </div>
    </div>
  )
}

export default QuotaCredit