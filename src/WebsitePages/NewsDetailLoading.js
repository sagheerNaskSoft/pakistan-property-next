import React from 'react';

function NewsDetailLoading() {
    return (
        <div>
            {/* NavBar space */}
            <div style={{ height: '60px' }} />

            {/* Banner/Detail skeleton */}
            <div className="placeholder-glow" style={{ padding: '40px 0', background: 'var(--secondary-color)' }}>
                <div className={window?.innerWidth <= 576 ? 'mx-0 mb-0' : 'main-container'}>
                    {/* Breadcrumb skeleton */}
                    <div className="d-sm-flex d-none align-items-center gap-2 mb-4">
                        <div className='placeholder' style={{ width: '60px', height: '20px', borderRadius: '4px' }} />
                        <div className='placeholder' style={{ width: '100px', height: '20px', borderRadius: '4px' }} />
                        <div className='placeholder' style={{ width: '150px', height: '20px', borderRadius: '4px' }} />
                    </div>

                    {/* Featured image skeleton */}
                    <div className='placeholder mb-4' style={{ width: '100%', height: '400px', borderRadius: '8px' }} />

                    {/* Title skeleton */}
                   <div className={window?.innerWidth <= 576 ? 'px-3' : ''}>
                   <div className='placeholder mb-3' style={{ width: '90%', height: '48px', borderRadius: '4px' }} />
                    <div className='placeholder mb-4' style={{ width: '85%', height: '48px', borderRadius: '4px' }} />

                    {/* Meta info skeleton */}
                    <div className='d-flex gap-4 mb-4 flex-wrap'>
                        <div className='placeholder' style={{ width: '120px', height: '24px', borderRadius: '4px' }} />
                        <div className='placeholder' style={{ width: '100px', height: '24px', borderRadius: '4px' }} />
                        <div className='placeholder' style={{ width: '80px', height: '24px', borderRadius: '4px' }} />
                    </div>

                    {/* Content skeleton */}
                    <div className='mb-4'>
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className='placeholder mb-3' style={{ width: index % 3 === 0 ? '100%' : index % 3 === 1 ? '95%' : '90%', height: '20px', borderRadius: '4px' }} />
                        ))}
                    </div>

                    {/* Image placeholder in content */}
                    <div className='placeholder mb-4' style={{ width: '100%', height: '300px', borderRadius: '8px' }} />

                    {/* More content skeleton */}
                    <div className='mb-4'>
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className='placeholder mb-3' style={{ width: index % 2 === 0 ? '100%' : '95%', height: '20px', borderRadius: '4px' }} />
                        ))}
                    </div>

                    {/* Share and tags skeleton */}
                    <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap'>
                        <div className='d-flex gap-2'>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className='placeholder' style={{ width: '80px', height: '32px', borderRadius: '20px' }} />
                            ))}
                        </div>
                        <div className='placeholder' style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    </div>

                    {/* Related news skeleton */}
                    <div className='mt-5'>
                        <div className='placeholder mb-4' style={{ width: '200px', height: '32px', borderRadius: '4px' }} />
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
                   </div>
                </div>
            </div>

            {/* PreLocation and PreProperty skeleton */}
            <div className='main-container'>
                <div className="placeholder-glow mb-4">
                    <div className='placeholder mb-3' style={{ width: '100%', height: '300px', borderRadius: '8px' }} />
                </div>
                <div className="placeholder-glow">
                    <div className='placeholder' style={{ width: '100%', height: '300px', borderRadius: '8px' }} />
                </div>
                {/* Footer skeleton */}
                <div className="placeholder-glow" style={{ padding: '40px 0' }}>
                    <div className='placeholder' style={{ width: '100%', height: '200px', borderRadius: '8px' }} />
                </div>
            </div>
        </div>
    );
}

export default NewsDetailLoading;
