import React from 'react'

function ListingCardLoading() {
  return (
   <div className='border rounded d-flex gap-3 mt-3' style={{height:"212px"}}>
    <div className='h-100' style={{width:"288px"}}>
        <div className='placeholder-glow h-100'>
            <div className='placeholder w-100 h-100'/>
        </div>
    </div>
     <div className='h-100 ' style={{width:"60%"}}>
        <div className='placeholder-glow d-flex flex-column'>
            <div className='placeholder mt-2' style={{width:"200px",height:"30px"}}/>
            <div className='placeholder mt-2' style={{width:"250px",height:"30px"}}/>
            <div className='placeholder mt-2' style={{width:"250px",height:"30px"}}/>
            <div className='d-flex gap-2'>
            <div className='placeholder mt-2' style={{width:"50px",height:"40px"}}/>
            <div className='placeholder mt-2' style={{width:"50px",height:"40px"}}/>
            <div className='placeholder mt-2' style={{width:"50px",height:"40px"}}/>
            </div>
            <div className='d-flex gap-2'>
            <div className='placeholder mt-2' style={{width:"150px",height:"30px"}}/>
            <div className='placeholder mt-2' style={{width:"150px",height:"30px"}}/>
            <div className='placeholder mt-2' style={{width:"150px",height:"30px"}}/>
            </div>
        </div>
    </div>
   </div>
  )
}

export default ListingCardLoading