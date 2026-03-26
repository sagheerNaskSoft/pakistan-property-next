import React, { useEffect } from 'react'
import { FallbackImage } from '../Metiral/FallbackImage'
import img1 from '../../Asset/HomePage/cfb294a9efed934a17fef46b1219960604422f0a.png'
import img2 from '../../Asset/HomePage/image 10.png'
import img3 from '../../Asset/HomePage/image 9.png'
import img4 from '../../Asset/HomePage/image 8.png'
import img5 from '../../Asset/HomePage/image 7.png'
import img6 from '../../Asset/HomePage/image 6.png'
import img7 from '../../Asset/HomePage/image-1.png'
import img8 from '../../Asset/HomePage/image.png'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/ContextProvider'
function TrustedAgencies() {
    const {getTrustedAgency,trustedAgnecyList}=useAuth()
    useEffect(()=>{
        if(!trustedAgnecyList?.length){
            getTrustedAgency()
        }
    },[])
    const naviage = useNavigate()
    
    return (
        <div className='trusted_agencies'>
            <div className='d-flex justify-content-between align-items-center'>
                <h2 className='section_title m-0'>Trusted Agencies</h2>
                <h6 className='m-0'><Link className='links m-0' to='/agency-listing'>View All <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9.28866 5.29076C9.19719 5.38371 9.12459 5.4943 9.07505 5.61615C9.02551 5.73799 9 5.86868 9 6.00068C9 6.13268 9.02551 6.26337 9.07505 6.38521C9.12459 6.50706 9.19719 6.61765 9.28866 6.7106L13.7581 11.2901C13.8496 11.383 13.9222 11.4936 13.9717 11.6155C14.0212 11.7373 14.0468 11.868 14.0468 12C14.0468 12.132 14.0212 12.2627 13.9717 12.3845C13.9222 12.5064 13.8496 12.617 13.7581 12.7099L9.28866 17.2894C9.19719 17.3824 9.12459 17.4929 9.07505 17.6148C9.02551 17.7366 9 17.8673 9 17.9993C9 18.1313 9.02551 18.262 9.07505 18.3839C9.12459 18.5057 9.19719 18.6163 9.28866 18.7092C9.4715 18.8955 9.71883 19 9.97664 19C10.2344 19 10.4818 18.8955 10.6646 18.7092L15.1438 14.1198C15.6921 13.5573 16 12.7949 16 12C16 11.2051 15.6921 10.4427 15.1438 9.88024L10.6646 5.29076C10.4818 5.10453 10.2344 5 9.97664 5C9.71883 5 9.4715 5.10453 9.28866 5.29076Z" fill="#2D2D2D" />
                </svg></Link></h6>
            </div>
            <div className='grid list_agencies'>
                {trustedAgnecyList?.map((items, index) => {
                    return (
                        <div key={items?.agency_profile?.agency_id || items?.agency_profile?.agency_profile_id || items?.user?.id || index} onClick={() => naviage(`/agency-detail/${items?.agency_profile?.agency_id || items?.agency_profile?.agency_profile_id || items?.user?.id}`)} className='agency_card'>
                            <div className='agency_img'>
                                <FallbackImage src={items?.agency_profile?.agency_image} alt={items?.agency_profile?.agency_name || items?.name } className={"img"} componentName="TrustedAgencies" />
                                
                            </div>
                            <h5 className='mb-0'>{items?.agency_profile?.agency_name || items?.name }</h5>
                            <div style={{width:"100%"}} className='d-flex align-items-start justify-content-center'>
                            
                            <p className='m-0'><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                <path d="M8.50065 14.5C10.834 12.1 13.1673 9.95093 13.1673 7.3C13.1673 4.64903 11.078 2.5 8.50065 2.5C5.92332 2.5 3.83398 4.64903 3.83398 7.3C3.83398 9.95093 6.16732 12.1 8.50065 14.5Z" stroke="#737678" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.5 9.16699C9.6046 9.16699 10.5 8.27159 10.5 7.16699C10.5 6.06243 9.6046 5.16699 8.5 5.16699C7.3954 5.16699 6.5 6.06243 6.5 7.16699C6.5 8.27159 7.3954 9.16699 8.5 9.16699Z" stroke="#737678" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </svg> {items?.agency_profile?.address}, {items?.agency_profile?.city?.name}</p>
                            </div>
                        </div>
                    )
                })}
                
            </div>
        </div>
    )
}

export default TrustedAgencies