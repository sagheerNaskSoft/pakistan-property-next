import React from 'react';

function NewsPageLoading() {
    return (
        <div>
            {/* NavBar space */}
            <div style={{ height: '60px' }} />

            {/* Banner skeleton - Slider */}
            <div className='blog-banner-slider placeholder-glow' style={{ height: '500px', position: 'relative', overflow: 'hidden' }}>
                <div className='placeholder w-100 h-100' style={{ borderRadius: '0' }} />
                <div className='main-container' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%' }}>
                    <div className='blog-inner-card' style={{ width: window?.innerWidth >= 992 ? "65%" : '100%' }}>
                        <div className='blog-inner placeholder-glow'>
                            <div className='placeholder mb-3' style={{ width: '200px', height: '20px', borderRadius: '4px' }} />
                            <div className='placeholder mb-3' style={{ width: '90%', height: '40px', borderRadius: '4px' }} />
                            <div className='placeholder mb-3' style={{ width: '85%', height: '32px', borderRadius: '4px' }} />
                            <div className='d-flex gap-3 mb-3'>
                                <div className='placeholder' style={{ width: '120px', height: '20px', borderRadius: '4px' }} />
                                <div className='placeholder' style={{ width: '100px', height: '20px', borderRadius: '4px' }} />
                            </div>
                            <div className='placeholder' style={{ width: '140px', height: '40px', borderRadius: '4px' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* News listing skeleton */}
            <div className='secondary-color'>
                <div className='main-container'>
                    <div className="placeholder-glow">
                        {/* Popular news section */}
                        <div className='mb-5'>
                            <div className='placeholder mb-4' style={{ width: '200px', height: '32px' }} />
                            <div className="row m-0" style={{ gap: '20px 0' }}>
                                {[...Array(3)].map((_, index) => (
                                    <div key={index} className="col-lg-4 col-md-6 col-12">
                                        <div className='blog-card placeholder-glow border rounded' style={{ borderRadius: '8px', overflow: 'hidden', background: '#FFF', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                            <div className='blog-img' style={{ position: 'relative', height: '224px', width: '100%' }}>
                                                <div className='placeholder w-100 h-100' style={{ borderRadius: '8px 8px 0 0' }} />
                                            </div>
                                            <div className='blog-heading' style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: '1' }}>
                                                <div className="placeholder mb-2" style={{ height: '22px', width: '95%', borderRadius: '4px' }} />
                                                <div className="placeholder mb-2" style={{ height: '22px', width: '85%', borderRadius: '4px' }} />
                                                <div className="placeholder mb-2" style={{ height: '20px', width: '100%', borderRadius: '4px' }} />
                                                <div className='bog-lowe-heading d-flex justify-content-between align-items-center' style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #BBB', height: '37px' }}>
                                                    <div className="placeholder" style={{ height: '20px', width: '110px', borderRadius: '4px' }} />
                                                    <div className="placeholder" style={{ height: '20px', width: '85px', borderRadius: '4px' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* All news grid */}
                        <div className='mb-5'>
                            <div className='placeholder mb-4' style={{ width: '150px', height: '32px' }} />
                            <div className='blog-grid'>
                                {[...Array(9)].map((_, index) => (
                                    <div key={index} className='blog-card placeholder-glow border rounded' style={{ borderRadius: '8px', overflow: 'hidden', background: '#FFF', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <div className='blog-img' style={{ position: 'relative', height: '224px', width: '100%' }}>
                                            <div className='placeholder w-100 h-100' style={{ borderRadius: '8px 8px 0 0' }} />
                                        </div>
                                        <div className='blog-heading' style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: '1' }}>
                                            <div className="placeholder mb-2" style={{ height: '22px', width: '95%', borderRadius: '4px' }} />
                                            <div className="placeholder mb-2" style={{ height: '22px', width: '85%', borderRadius: '4px' }} />
                                            <div className="placeholder mb-2" style={{ height: '20px', width: '100%', borderRadius: '4px' }} />
                                            <div className="placeholder mb-2" style={{ height: '20px', width: '90%', borderRadius: '4px' }} />
                                            <div className="placeholder mb-2" style={{ height: '20px', width: '75%', borderRadius: '4px' }} />
                                            <div className='bog-lowe-heading d-flex justify-content-between align-items-center' style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #BBB', height: '37px' }}>
                                                <div className="placeholder" style={{ height: '20px', width: '110px', borderRadius: '4px' }} />
                                                <div className="placeholder" style={{ height: '20px', width: '85px', borderRadius: '4px' }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* PreLocation and PreProperty skeleton */}
                    <div className="placeholder-glow mb-4">
                        <div className='placeholder mb-3' style={{ width: '100%', height: '300px', borderRadius: '8px' }} />
                    </div>
                    <div className="placeholder-glow">
                        <div className='placeholder' style={{ width: '100%', height: '300px', borderRadius: '8px' }} />
                    </div>
                </div>
            </div>

            {/* Footer skeleton */}
            <div className='main-container'>
                <div className="placeholder-glow" style={{ padding: '40px 0' }}>
                    <div className='placeholder' style={{ width: '100%', height: '200px', borderRadius: '8px' }} />
                </div>
            </div>
        </div>
    );
}

export default NewsPageLoading;
