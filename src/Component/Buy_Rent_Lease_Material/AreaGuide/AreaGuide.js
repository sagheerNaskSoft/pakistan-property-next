import React from 'react'
import img from '../../../Asset/Buy_Rent_Lease/Frame 1984078105.svg'
import './AreaGuide.css'
import PrimaryBorderButton from '../../Metiral/Button/PrimaryBorderButton.js'
import { Link } from 'react-router-dom'

import Image from 'next/image';
function AreaGuide({exploreTitle , guide}) {
    return (
        <div className='area-guide'>
            <div className='row m-0 justify-content-between' style={{ gap: '96px' }}>
                <div className='col-lg-6 col-12 p-0'>
                    <div className='textbox'>
                        <div className='heading'>{guide?.heading}</div>
                        <div className='para pb-3'>{guide?.para}</div>
                        <div className="para pt-0 pb-1">{guide?.List?.ul}</div>
                       <span className=' d-flex justify-content-between' style={{gap:'0 30px'}}>
                         <span>
                            <div className='ul-box ps-0'>
                              <ul>
                                {
                                    guide?.List?.li?.map((li, index) => (
                                        <li className='li' key={index}>{li}</li>
                                    ))
                                }
                              </ul>

                            </div>
                           <Link to="/area-unit-converter" style={{textDecoration: 'none'}}>
                           <div className="buttn">
                           <PrimaryBorderButton text={"Use Area Converter"} />
                           </div></Link>
                        </span>
                        <div className='img-box d-lg-none d-inline'>
                            <Image src={img}  alt="" />
                        </div>
                       </span>
                    </div>
                </div>
                <div className='col-4  p-0 d-lg-inline d-none'>
                    <div className='img-box'>
                        <Image src={img}  alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AreaGuide