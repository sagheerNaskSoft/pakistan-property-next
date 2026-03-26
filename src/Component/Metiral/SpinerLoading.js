import React from 'react'

function SpinerLoading() {
  return (
    <div className='d-flex justify-content-center align-items-center' style={{ height: "200px" }}>
      <div className='spinner-border text-success' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>

  )
}

export default SpinerLoading