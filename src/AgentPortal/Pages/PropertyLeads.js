import React, { useEffect, useState } from 'react';
import { Box, Modal } from '@mui/material';
import { useAuth } from '../../Context/ContextProvider';
import LeadsViewModal from '../Component/Modal/LeadsViewModal';
import { TiEye } from 'react-icons/ti';
import Pagination from '../Component/Pagination/Pagination';

function PropertyLeads() {
    const { loading, getInqueries, getLeadJourney } = useAuth();
    const [listData, setListData] = useState([]);
    const [paginationData, setPaginationData] = useState({
        current_page: 1,
        total_pages: 1,
        perPage: 10,
        total_items: 0,
    });

    const fetchInquires = async (paginationDataParam) => {
        try {
            const paginationToUse = paginationDataParam || paginationData;
            const cityResult = await getInqueries(paginationToUse);
            const inquiriesData = cityResult?.data?.data?.inquiries?.data || cityResult?.data?.data?.inquiries || [];
            setListData(inquiriesData);
            
            // Update pagination data if available
            if (cityResult?.data?.data?.inquiries) {
                const inquiriesResponse = cityResult?.data?.data?.inquiries;
                if (inquiriesResponse?.last_page || inquiriesResponse?.total_pages) {
                    setPaginationData({
                        ...paginationToUse,
                        total_pages: inquiriesResponse?.last_page || inquiriesResponse?.total_pages || 1,
                        current_page: inquiriesResponse?.current_page || 1,
                        total_items: inquiriesResponse?.total || 0,
                    });
                } else if (cityResult?.data?.data?.pagination) {
                    const pagination = cityResult?.data?.data?.pagination;
                    setPaginationData({
                        ...paginationToUse,
                        total_pages: pagination?.last_page || pagination?.total_pages || 1,
                        current_page: pagination?.current_page || 1,
                        total_items: pagination?.total || 0,
                    });
                }
            }
        } catch (error) {
            // Error handled silently
        }
    };

    useEffect(() => {
        fetchInquires(paginationData);
        // eslint-disable-next-line
    }, []);
    const [open, setOpen] = useState(false);
    const [journeyOpen, setJourneyOpen] = useState(false);
    const [leadData, setLeadData] = useState({});
    const [journeyLoadingId, setJourneyLoadingId] = useState(null);

    const AiIcon = ({ className = '' }) => (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="4" y="8" width="16" height="12" rx="2" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            <circle cx="9" cy="13" r="1.5" fill="currentColor" />
            <circle cx="15" cy="13" r="1.5" fill="currentColor" />
            <path d="M9 17h6" />
        </svg>
    );

    const handleJourneyClick = async (item) => {
        const inquiryId = item?.id ?? item?.inquiry_id;
        // const inquiryId = 59;
        if (inquiryId == null) return;
        setJourneyLoadingId(inquiryId);
        try {
            const res = await getLeadJourney(inquiryId);
            if (res?.success && res?.data) {
                setLeadData({ ...item, journey: res?.data?.data });
                setJourneyOpen(true);
            }
        } finally {
            setJourneyLoadingId(null);
        }
    };

    return (
        <div className='propshop-main h-100 portal-page-container leads-page-container'>
            <div className='d-flex justify-content-between'>
                <div>
                    <h3 className='page-portal-heading m-0'>Property Leads</h3>
                    <p className='portal-breadCrums m-0'>Home - <span>Property Leads</span></p>
                </div>
            </div>
            <div className='qouta-table-main order-table-main'  style={{position:'relative'}}>
                <div className="table_box_quota">
                    <table className='w-100' style={{ minWidth: '1200px' }}>
                        <thead>
                            <tr>
                            <th className='d-sm-none d-flex'>Actions</th>
                                <th>Property ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>User Type</th>
                                <th>Message</th>
                                <th className='d-sm-flex d-none'>Action</th>
                            </tr>
                        </thead>

                        {loading ? (
                            <tbody>
                                <tr>
                                    <td colSpan={7}>
                                        <div className='placeholder-glow'>
                                            <div className='placeholder w-100 mb-2' style={{ height: "60px" }} />
                                            <div className='placeholder w-100 mb-2' style={{ height: "60px" }} />
                                            <div className='placeholder w-100 mb-2' style={{ height: "60px" }} />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ) : listData?.length ? (
                            <tbody>
                                {listData.map((item, i) => (
                                    <tr key={i} className={i % 2 === 1 ? 'active' : ''}>
                                        <td className='d-sm-none d-flex' style={{ gap: '8px' }}>
                                            <div className='border' style={{ borderRadius: '50%', padding: '4px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => { setLeadData(item); setOpen(true); }}><TiEye /></div>
                                            <button type="button" className={`journey-ai-btn-circle ${journeyLoadingId === (item?.id ?? item?.inquiry_id) ? 'journey-ai-btn-loading' : ''}`} disabled={journeyLoadingId === (item?.id ?? item?.inquiry_id)} onClick={() => handleJourneyClick(item)} title="Ask AI for Journey">
                                                <span className="journey-ai-icon"><AiIcon /></span>
                                            </button>
                                        </td>
                                        <td>{item?.property_id}</td>
                                        <td style={{textTransform: 'capitalize'}}>{item?.name}</td>
                                        <td>{item?.email}</td>
                                        <td>{item?.contact_number}</td>
                                        <td style={{textTransform: 'capitalize'}}>{item?.type}</td>
                                        <td className='message-text'>{item?.message}</td>
                                        <td className='d-sm-flex d-none'>
                                            <div className="view-btn"  onClick={() => { setLeadData(item); setOpen(true); }} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                                <button>View</button>
                                            </div>
                                            <div className="view-btn" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }} onClick={() => handleJourneyClick(item)}>
                                                <button type="button" className={`journey-ai-btn ${journeyLoadingId === (item?.id ?? item?.inquiry_id) ? 'journey-ai-btn-loading' : ''}`} disabled={journeyLoadingId === (item?.id ?? item?.inquiry_id)}  title="Ask AI for Journey">
                                                    <span className="journey-ai-icon"><AiIcon /></span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan={7} className='text-center'>No Record Found</td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                    
                    <LeadsViewModal open={open} setOpen={setOpen} data={leadData} />
                    <Modal
                        open={journeyOpen}
                        onClose={() => setJourneyOpen(false)}
                        aria-labelledby="journey-modal-title"
                        BackdropProps={{ className: 'global-modal-background-color' }}
                    >
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 535, boxShadow: 8 }} className="leads-view-modal">
                            <div className="apply_quota_modal leads_modal px-0 pb-0 global-modal-base-color">
                                <div className="global-modal-paddingBox">
                                    <div className="header_modal global-mobile-menu-header">
                                        <h5 className="heading mb-0 pb-0 d-sm-none d-flex" style={{ borderImage: 'unset', border: 'none' }}>AI lead Analysis</h5>
                                        <div className="close-button" style={{ position: window.innerWidth <= 576 ? 'unset' : '' }} onClick={() => setJourneyOpen(false)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M15.9999 8.00012C15.8124 7.81265 15.5581 7.70734 15.2929 7.70734C15.0277 7.70734 14.7734 7.81265 14.5859 8.00012L11.9999 10.5861L9.41392 8.00012C9.22531 7.81796 8.97271 7.71717 8.71052 7.71945C8.44832 7.72173 8.19751 7.8269 8.0121 8.0123C7.82669 8.19771 7.72152 8.44853 7.71925 8.71072C7.71697 8.97292 7.81776 9.22552 7.99992 9.41412L10.5859 12.0001L7.99992 14.5861C7.81776 14.7747 7.71697 15.0273 7.71925 15.2895C7.72152 15.5517 7.82669 15.8025 8.0121 15.9879C8.19751 16.1733 8.44832 16.2785 8.71052 16.2808C8.97271 16.2831 9.22531 16.1823 9.41392 16.0001L11.9999 13.4141L14.5859 16.0001C14.7745 16.1823 15.0271 16.2831 15.2893 16.2808C15.5515 16.2785 15.8023 16.1733 15.9877 15.9879C16.1731 15.8025 16.2783 15.5517 16.2806 15.2895C16.2829 15.0273 16.1821 14.7747 15.9999 14.5861L13.4139 12.0001L15.9999 9.41412C16.1874 9.22659 16.2927 8.97229 16.2927 8.70712C16.2927 8.44196 16.1874 8.18765 15.9999 8.00012Z" fill="#2D2D2D" />
                                                <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                                            </svg>
                                        </div>
                                        <h5 className="d-sm-flex d-none mb-0">AI lead Analysis</h5>
                                    </div>
                                    <div className="lead_content">
                                        <div className="col-12 px-0 d-flex flex-column py-2" style={{ gap: '8px' }}>
                                            <h6 className='mb-0'>Description</h6>
                                            <p className="message-text">{leadData?.description ?? leadData?.journey?.description ?? '—'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal_footer global-modal-footer d-sm-flex d-none">
                                    <button onClick={() => setJourneyOpen(false)} className="cancel_btn">Close</button>
                                </div>
                            </div>
                        </Box>
                    </Modal>
                </div>
                {/* {paginationData?.total_pages > 1 ? ( */}
                <div className='table-footer global-table-footer'>
                            <div className='pagination w-100'>
                                <Pagination
                                    fetchData={fetchInquires}
                                    paginationData={paginationData}
                                    setPaginationData={setPaginationData}
                                />
                            </div>
                        </div>
                    {/* ) : ""} */}
            </div>
        </div>
    );
}

export default PropertyLeads;
