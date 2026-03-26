import React from 'react'

function HorizontalCardMobileLoading() {
  return (
    <div className="horizontal-card mobile mt-lg-3 mt-4">
      <div className="property-card">
        <div className="card-img">
          <div className="card-img-box">
            <p className="placeholder-glow mb-0 h-100">
              <span className="placeholder w-100 h-100" style={{ borderRadius: '8px' }}></span>
            </p>
          </div>
        </div>
        <div className="card-details-container w-100">
          <div className="card-details">
            <div className="head flex-column">
              <p className="placeholder-glow d-flex flex-column mb-0">
                <span className="placeholder mb-2" style={{ width: '120px', height: '16px' }}></span>
                <span className="placeholder mb-2" style={{ width: '150px', height: '24px' }}></span>
                <span className="placeholder mb-2" style={{ width: '100%', height: '20px' }}></span>
                <span className="placeholder mb-2" style={{ width: '80%', height: '16px' }}></span>
              </p>
            </div>
            <div className="bottom">
              <p className="placeholder-glow d-flex gap-2 mb-0">
                <span className="placeholder" style={{ width: '40px', height: '20px' }}></span>
                <span className="placeholder" style={{ width: '40px', height: '20px' }}></span>
                <span className="placeholder" style={{ width: '50px', height: '20px' }}></span>
              </p>
              <p className="placeholder-glow d-flex gap-2 mt-2 mb-0">
                <span className="placeholder" style={{ width: '60px', height: '32px', borderRadius: '4px' }}></span>
                <span className="placeholder" style={{ width: '60px', height: '32px', borderRadius: '4px' }}></span>
                <span className="placeholder" style={{ width: '40px', height: '32px', borderRadius: '4px' }}></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HorizontalCardMobileLoading
