import React from 'react'

function PageLoading() {
    return (
        <>
            {/* Desktop Layout - Above 576px */}
            <div className='row m-0 mt-3 d-none d-sm-flex'>
                <div className="placeholder-glow d-flex p-0">
                    <div className='placeholder me-3' style={{height:"54px",width:"54px"}}/>
                    <div style={{width:"200px"}}>
                        <span className="placeholder w-100" style={{height:"20px"}}/>
                        <span className="placeholder w-75" style={{height:"20px"}}/>
                    </div>
                </div>
                <div className='col-lg-9 ps-0'>
                    <div className="placeholder-glow d-flex flex-column">
                        <div className='placeholder w-100' style={{height:"400px"}}/>
                        <div className='placeholder mt-3' style={{height:"25px",width:"300px"}}/>
                        <div className='placeholder mt-3' style={{height:"25px",width:"200px"}}/>
                    </div>
                </div>
                <div className='col-lg-3 pe-0'>
                    <div className='placeholder-glow border rounded w-100 p-2'>
                        <span className="placeholder w-100 mb-2" style={{height:"40px"}}/>
                        <span className="placeholder w-100 mb-2" style={{height:"40px"}}/>
                        <span className="placeholder w-100 mb-2" style={{height:"40px"}}/>
                        <span className="placeholder w-100 mb-2" style={{height:"40px"}}/>
                        <span className="placeholder w-100 mb-2" style={{height:"150px"}}/>
                        <span className="placeholder w-100" style={{height:"40px"}}/>
                    </div>
                </div>
            </div>

            {/* Mobile Layout - 576px and below */}
            <div className='d-block d-sm-none mx-0 mb-0'>
                {/* Image Slider */}
                <div className="placeholder-glow mb-0" style={{marginLeft:"0", marginRight:"0", paddingLeft:"0", paddingRight:"0"}}>
                    <div className='placeholder w-100' style={{height:"460px", borderRadius:"0"}}/>
                </div>

                {/* Detail Section */}
               <div className="mx-3">
               <div className="placeholder-glow d-flex flex-column mt-3 mb-0">
                    <div className='placeholder mb-2' style={{height:"24px",width:"80%"}}/>
                    <div className='placeholder mb-2' style={{height:"20px",width:"100%"}}/>
                    <div className='placeholder mb-2' style={{height:"20px",width:"90%"}}/>
                    <div className='placeholder mb-2' style={{height:"20px",width:"70%"}}/>
                </div>

                {/* Amenities Section */}
                <div className="placeholder-glow d-flex flex-column mt-3 mb-0">
                    <div className='placeholder mb-2' style={{height:"20px",width:"120px"}}/>
                    <div className='d-flex gap-2 flex-wrap'>
                        <div className='placeholder' style={{height:"30px",width:"80px"}}/>
                        <div className='placeholder' style={{height:"30px",width:"80px"}}/>
                        <div className='placeholder' style={{height:"30px",width:"80px"}}/>
                        <div className='placeholder' style={{height:"30px",width:"80px"}}/>
                    </div>
                </div>

                {/* Finance Section */}
                <div className="placeholder-glow d-flex flex-column mt-3 mb-0">
                    <div className='placeholder mb-2' style={{height:"20px",width:"100px"}}/>
                    <div className='placeholder' style={{height:"100px",width:"100%"}}/>
                </div>

                {/* Agent Card Section */}
                <div className='mt-3'>
                    <div className="placeholder-glow d-flex flex-column mb-0">
                        <div className='placeholder mb-3' style={{height:"20px",width:"120px"}}/>
                    </div>
                    <div className='border rounded p-3'>
                        <div className="placeholder-glow d-flex align-items-center gap-3 mb-0">
                            <div className='placeholder' style={{height:"60px",width:"60px", borderRadius:"8px"}}/>
                            <div className='flex-grow-1'>
                                <p className="placeholder-glow d-flex flex-column mb-0">
                                    <span className="placeholder mb-2" style={{height:"18px",width:"70%"}}/>
                                    <span className="placeholder mb-1" style={{height:"16px",width:"50%"}}/>
                                    <span className="placeholder" style={{height:"16px",width:"40%"}}/>
                                </p>
                            </div>
                        </div>
                        <div className="placeholder-glow d-flex flex-column mt-3 mb-0">
                            <span className="placeholder mb-2" style={{height:"16px",width:"100%"}}/>
                            <span className="placeholder mb-2" style={{height:"16px",width:"80%"}}/>
                            <span className="placeholder" style={{height:"16px",width:"60%"}}/>
                        </div>
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className='mt-3'>
                    <div className='placeholder-glow border rounded w-100 p-3'>
                        <span className="placeholder w-100 mb-2" style={{height:"40px"}}/>
                        <span className="placeholder w-100 mb-2" style={{height:"40px"}}/>
                        <span className="placeholder w-100 mb-2" style={{height:"40px"}}/>
                        <span className="placeholder w-100 mb-2" style={{height:"100px"}}/>
                        <span className="placeholder w-100" style={{height:"40px"}}/>
                    </div>
                </div>
               </div>
            </div>
        </>
    )
}

export default PageLoading