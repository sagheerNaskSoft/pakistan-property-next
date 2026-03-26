import React from 'react'
import img from '../../Asset/PropertyListing/Group 1000001765.svg'
import { Link } from 'react-router-dom'
import Image from 'next/image';
function Marketing() {
    return (
        <>
            <span className='deatial-hr-marketing'>
                <hr style={{ marginBottom: '25px' }} />
            </span>
            <div className='marketing-property'>
                <div className='img-marketing'>
                    <div className='img-marke'>
                        <Image src={img} alt='.../' />
                    </div>
                    <div className='marketing-heading'>
                        <h3>Rauf Real Estate Marketing</h3>
                        <h6>DHA phase 9 town Lahore, Pakistan</h6>
                    </div>
                </div>
                <p>Your trusted partner for buying, selling, and renting properties in Lahore’s top locations. With years of experience and verified listings, we make your real estate journey
                    smooth, secure, and successful.</p>
                <div className='marketing-button'>
                    <button>View agency Profile</button>
                </div>
                <div className='d-flex align-items-baseline justify-content-between'>
                    <div className='property-rent-rent'>
                        <h5><span>See</span> 100+ properties for rent <span>by this agency</span></h5>

                    </div>
                    <h5 className='m-0'>
                        <Link className='links'>View All <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9.28866 5.29076C9.19719 5.38371 9.12459 5.4943 9.07505 5.61615C9.02551 5.73799 9 5.86868 9 6.00068C9 6.13268 9.02551 6.26337 9.07505 6.38521C9.12459 6.50706 9.19719 6.61765 9.28866 6.7106L13.7581 11.2901C13.8496 11.383 13.9222 11.4936 13.9717 11.6155C14.0212 11.7373 14.0468 11.868 14.0468 12C14.0468 12.132 14.0212 12.2627 13.9717 12.3845C13.9222 12.5064 13.8496 12.617 13.7581 12.7099L9.28866 17.2894C9.19719 17.3824 9.12459 17.4929 9.07505 17.6148C9.02551 17.7366 9 17.8673 9 17.9993C9 18.1313 9.02551 18.262 9.07505 18.3839C9.12459 18.5057 9.19719 18.6163 9.28866 18.7092C9.4715 18.8955 9.71883 19 9.97664 19C10.2344 19 10.4818 18.8955 10.6646 18.7092L15.1438 14.1198C15.6921 13.5573 16 12.7949 16 12C16 11.2051 15.6921 10.4427 15.1438 9.88024L10.6646 5.29076C10.4818 5.10453 10.2344 5 9.97664 5C9.71883 5 9.4715 5.10453 9.28866 5.29076Z" fill="#2D2D2D" />
                        </svg></Link>

                    </h5>
                </div>
            </div>
        </>
    )
}

export default Marketing
