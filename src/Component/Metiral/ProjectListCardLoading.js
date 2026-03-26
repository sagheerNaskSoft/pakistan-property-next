import React from 'react'
import './ListCard.css'

function ProjectListCardLoading() {
  return (
    <div className='list_card mt-lg-3 mt-4'>
      {/* Image Section */}
      <div className='card_img_list'>
        <div className='placeholder-glow h-100 w-100'>
          <div className='placeholder w-100 h-100' style={{ borderRadius: '0' }} />
        </div>
        
        {/* Marketed by badge placeholder */}
        <div className='market_by'>
          <div className='placeholder-glow'>
            <div className='placeholder' style={{ width: '80px', height: '22px' }} />
          </div>
        </div>
        
        {/* Verify icon placeholder */}
        <div className='verify'>
          <div className='placeholder-glow'>
            <div className='placeholder' style={{ width: '32px', height: '32px', borderRadius: '5.333px' }} />
          </div>
        </div>
        
        {/* Share icon placeholder */}
        <div className='share' style={{width:32, height:32}}>
        </div>
        
        {/* Area section placeholder */}
        <div className='area_sextion'>
          <div className='boxs'>
            <div className='placeholder-glow'>
              <div className='placeholder' style={{ width: '50px', height: '20px', borderRadius: '16px' }} />
            </div>
          </div>
          <div className='boxs'>
            <div className='placeholder-glow'>
              <div className='placeholder' style={{ width: '50px', height: '20px', borderRadius: '16px' }} />
            </div>
          </div>
          <div className='boxs'>
            <div className='placeholder-glow'>
              <div className='placeholder' style={{ width: '70px', height: '20px', borderRadius: '16px' }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Body Section */}
      <div className='card_body'>
        <div className='row m-0'>
          {/* Left Column */}
          <div className='col-6 p-0'>
            <div className='placeholder-glow d-flex flex-column'>
              {/* Project title placeholder */}
              <div className='placeholder mb-2' style={{ width: '70%', height: '26px' }} />
              {/* Location placeholder */}
              <div className='placeholder mb-2' style={{ width: '60%', height: '14px' }} />
              {/* Price placeholder */}
              <div className='d-flex align-items-center'>
                <div className='placeholder' style={{ width: '200px', height: '20px' }} />
                <div className='placeholder ms-2 mt-2' style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
              </div>
            </div>
          </div>
          
          {/* Right Column - Contact buttons */}
          <div className='col-6 p-0 d-flex align-items-end justify-content-end'>
            <div className='placeholder-glow d-flex gap-2'>
              <div className='placeholder' style={{ width: '110px', height: '40px', borderRadius: '8px' }} />
              <div className='placeholder' style={{ width: '110px', height: '40px', borderRadius: '8px' }} />
              <div className='placeholder' style={{ width: '110px', height: '40px', borderRadius: '8px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectListCardLoading
