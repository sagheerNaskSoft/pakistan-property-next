import React from 'react'
import './Process.css'
import Image from 'next/image';
// import start from '../../../Asset/Buy_Rent_Lease/start.png'
// import mid from '../../../Asset/Buy_Rent_Lease/mid.png'
// import end from '../../../Asset/Buy_Rent_Lease/end.png'


function Process({ processData , data }) {


  return (
    <div className='property-process'>
      <div className='heading'>
      {processData?.heading}
      </div>
      <div className='para'>
       {processData?.para}
      </div>
      <div className='process-box'>
        {data.map((data, index) => (
          <div className='process-card' key={index}>
            <div className='img'>
              {/* <Image src={data.img}  alt="" /> */}
              {data.img}
            </div>
            <div className='backNumber'>{data.backNumber}</div>
            <div className='process-card-text'>
              <div className='heading'>{data.heading}</div>
              <div className='para'>{data.para}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Process