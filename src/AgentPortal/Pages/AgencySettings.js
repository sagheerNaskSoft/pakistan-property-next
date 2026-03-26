import React, { useEffect, useState } from 'react'
import AgencyProfile from '../Component/AgencySetting/AgencyProfile'
import AgencyOwnerProfile from '../Component/AgencySetting/AgencyOwnerProfile'
import { useAuth } from '../../Context/ContextProvider'
import { useLocation } from 'react-router-dom';

function AgencySettings() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(1)
    const { getagency, formatPakistaniPhoneNumber, loginData } = useAuth()
    const [data, setData] = useState({
        name: "",
        email: "",
        whatsapp: "",
        landline: "",
        mobile: "",
        city: "",
        address: "",
        agency_image: "",
        description: "",
    });
    const [data1, setData1] = useState({
        ceo_full_name: "",
        designation: "",
        ceo_desc: "",
        ceo_image: "",
    });
    useEffect(() => {
        // Always reset the tab to 1 when route changes to /agency-setting
        if (location.pathname.endsWith('/agency-setting')) setActiveTab(1);
        const userLOcalData = loginData?.data?.user;
        const fetchAgency = async () => {
            try {
                let result = await getagency();
                if (result?.success) {
                    let profileData = result?.data?.data;
                    
                    // Helper function to format phone number for display (ensures exactly 10 digits)
                    const formatPhoneForDisplay = (phone) => {
                        if (!phone || phone === "") return "";
                        // Remove all non-digits
                        let cleaned = phone.replace(/\D/g, "");
                        
                        // Remove country code if present (+92 or 92)
                        if (cleaned.startsWith("92")) {
                            cleaned = cleaned.slice(2);
                        }
                        
                        // Remove leading 0 if present (to normalize to 10 digits)
                        if (cleaned.startsWith("0")) {
                            cleaned = cleaned.slice(1);
                        }
                        
                        // Take only first 10 digits
                        cleaned = cleaned.slice(0, 10);
                        
                        // Return exactly 10 digits (user can type leading 0 if needed)
                        return cleaned;
                    };
                    
                    setData({
                        ...data,
                        name: profileData?.agency_name ? profileData?.agency_name : userLOcalData?.name,
                        mobile: profileData?.phone_number
                            ? formatPhoneForDisplay(profileData?.phone_number)
                            : userLOcalData?.phone_number ? formatPhoneForDisplay(userLOcalData?.phone_number) : "",
                        whatsapp: profileData?.whatsapp_number
                            ? formatPhoneForDisplay(profileData?.whatsapp_number)
                            : userLOcalData?.phone_number ? formatPhoneForDisplay(userLOcalData?.phone_number) : "",
                        landline: profileData?.landline
                            ? formatPhoneForDisplay(profileData?.landline)
                            : '',
                        email: profileData?.email ? profileData?.email : userLOcalData?.email,
                        city: profileData?.city_code
                            ? profileData?.city_code
                            : userLOcalData?.currentCity?.app_code,
                        address: profileData?.address ? profileData?.address : userLOcalData?.address,
                        agency_image: profileData?.agency_image ? profileData?.agency_image : "",
                        description: profileData?.description ? profileData?.description : "",
                    });
                    setData1({
                        ceo_full_name: profileData?.ceo_full_name,
                        designation: profileData?.designation,
                        ceo_desc: profileData?.ceo_desc,
                        ceo_image: profileData?.ceo_image,
                    });
                }
            } catch (error) {
                // Error handled silently
            }
        };
        fetchAgency();
        // eslint-disable-next-line
    }, []);
    return (
        <div className='setting propshop-main h-100 portal-page-container'>
            <div className='d-flex justify-content-between'>
                <div>
                    <h3 className='page-portal-heading m-0'>Agency Settings</h3>
                    <p className='portal-breadCrums m-0'>Home - Settings - Agency Settings - <span>Agency {activeTab === 2 ? "Owner" : ""} Profile</span></p>
                </div>
            </div>
            <div className='row mx-0 main_box' style={{gap: "12px 0"}}>
                <div className='col-lg-3 h-lg-100 ps-0 pe-lg-3 pe-lg-1 pe-0'>
                    <div className='boxes d-lg-block d-flex align-items-center'>
                        <div className={`${activeTab === 1 ? "active" : ""} tab_box`} onClick={() => setActiveTab(1)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M22 21.0107H2C1.586 21.0107 1.25 21.3477 1.25 21.7607C1.25 22.1747 1.586 22.5107 2 22.5107H22C22.414 22.5107 22.75 22.1747 22.75 21.7607C22.75 21.3477 22.414 21.0107 22 21.0107Z" fill="#2D2D2D" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M14.75 21.7607V3.23769C14.75 2.65769 14.462 2.11469 13.981 1.78869C13.5 1.46369 12.889 1.39769 12.35 1.61369L4.35 4.81369C3.686 5.07869 3.25 5.72269 3.25 6.43869V21.7607C3.25 22.1757 3.586 22.5107 4 22.5107H14C14.414 22.5107 14.75 22.1757 14.75 21.7607ZM7 19.5107H11C11.414 19.5107 11.75 19.1747 11.75 18.7607C11.75 18.3477 11.414 18.0107 11 18.0107H7C6.586 18.0107 6.25 18.3477 6.25 18.7607C6.25 19.1747 6.586 19.5107 7 19.5107ZM7 16.0107H11C11.414 16.0107 11.75 15.6747 11.75 15.2607C11.75 14.8477 11.414 14.5107 11 14.5107H7C6.586 14.5107 6.25 14.8477 6.25 15.2607C6.25 15.6747 6.586 16.0107 7 16.0107ZM7 12.5107H11C11.414 12.5107 11.75 12.1747 11.75 11.7607C11.75 11.3477 11.414 11.0107 11 11.0107H7C6.586 11.0107 6.25 11.3477 6.25 11.7607C6.25 12.1747 6.586 12.5107 7 12.5107ZM7 9.01069H11C11.414 9.01069 11.75 8.67469 11.75 8.26069C11.75 7.84769 11.414 7.51069 11 7.51069H7C6.586 7.51069 6.25 7.84769 6.25 8.26069C6.25 8.67469 6.586 9.01069 7 9.01069Z" fill="#2D2D2D" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M15.75 7.01074V21.7607C15.75 22.0297 15.69 22.2837 15.582 22.5107H20C20.414 22.5107 20.75 22.1757 20.75 21.7607V8.76074C20.75 7.79474 19.966 7.01074 19 7.01074H15.75Z" fill="#2D2D2D" />
                        </svg><p className='m-0'>Agency Profile</p></div>
                        <div className={`${activeTab === 2 ? "active" : ""} tab_box`} onClick={() => setActiveTab(2)}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 12.25C15.0376 12.25 17.5 9.78757 17.5 6.75C17.5 3.71243 15.0376 1.25 12 1.25C8.96243 1.25 6.5 3.71243 6.5 6.75C6.5 9.78757 8.96243 12.25 12 12.25Z" fill="#2D2D2D" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M12.75 18.5V14C12.75 13.586 12.414 13.25 12 13.25C11.586 13.25 11.25 13.586 11.25 14V18.5C11.25 18.914 11.586 19.25 12 19.25C12.414 19.25 12.75 18.914 12.75 18.5Z" fill="#2D2D2D" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M21.75 19.0002C21.75 15.4892 19.415 12.5242 16.214 11.5712C15.877 11.4712 15.515 11.6182 15.344 11.9262L12 17.9542L8.656 11.9262C8.485 11.6182 8.123 11.4712 7.786 11.5712C4.585 12.5242 2.25 15.4892 2.25 19.0002V21.0002C2.25 21.4642 2.434 21.9092 2.763 22.2372C3.091 22.5662 3.536 22.7502 4 22.7502H20C20.464 22.7502 20.909 22.5662 21.237 22.2372C21.566 21.9092 21.75 21.4642 21.75 21.0002V19.0002ZM16 18.7502H18C18.414 18.7502 18.75 18.4142 18.75 18.0002C18.75 17.5862 18.414 17.2502 18 17.2502H16C15.586 17.2502 15.25 17.5862 15.25 18.0002C15.25 18.4142 15.586 18.7502 16 18.7502Z" fill="#2D2D2D" />
                        </svg><p className='m-0'>{window.innerWidth <= 576 ? "Owner" : "Agency Owner"} Profile</p></div>
                    </div>
                </div>
                <div className='col-lg-9 h-lg-100 pe-0 ps-lg-3 ps-lg-1 ps-0'>

                    {activeTab === 1 && <AgencyProfile data={data} setData={setData} />}
                    {activeTab === 2 && <AgencyOwnerProfile data={data1} setData={setData1} />}



                </div>
            </div>
        </div>
    )
}

export default AgencySettings