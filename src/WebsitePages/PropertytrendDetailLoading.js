import React from 'react';

function PropertytrendDetailLoading() {
    return (
        <div>
            {/* NavBar skeleton - just space for it */}
            <div style={{ height: '60px' }} />

            {/* Banner skeleton */}
            <div className="property-index-deatail property-index-detail-banner">
                <div className="placeholder-glow" style={{ padding: '40px 0', background: 'var(--secondary-color)' }}>
                    <div className="main-container">
                        <div className="d-flex flex-column flex-md-row gap-3 align-items-stretch">
                            {/* Filter inputs skeleton */}
                            <div className="input-box d-flex flex-column flex-md-row gap-3 w-100">
                                <div className="input placeholder-glow flex-fill">
                                    <div className='placeholder' style={{ width: '100%', height: '48px', borderRadius: '4px' }} />
                                </div>
                                <div className="input placeholder-glow flex-fill">
                                    <div className='placeholder' style={{ width: '100%', height: '48px', borderRadius: '4px' }} />
                                </div>
                                <div className="input placeholder-glow flex-fill">
                                    <div className='placeholder' style={{ width: '100%', height: '48px', borderRadius: '4px' }} />
                                </div>
                                <div className="input placeholder-glow">
                                    <div className='placeholder' style={{ width: '140px', height: '48px', borderRadius: '4px' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="secondary-color secondary-trend-box" style={{ paddingTop: "60px" }}>
                <div className="main-container" style={{ marginBottom: '32px' }}>
                    {/* Breadcrumb and filter button skeleton */}
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="placeholder-glow d-flex align-items-center gap-2">
                            <div className='placeholder' style={{ width: '60px', height: '20px' }} />
                            <div className='placeholder' style={{ width: '120px', height: '20px' }} />
                            <div className='placeholder' style={{ width: '100px', height: '20px' }} />
                            <div className='placeholder' style={{ width: '150px', height: '20px' }} />
                        </div>
                        <div className="filter d-sm-none d-flex align-items-center gap-2 ms-auto placeholder-glow">
                            <div className='placeholder' style={{ width: '60px', height: '32px', borderRadius: '4px' }} />
                        </div>
                    </div>
                </div>

                {/* SearchedTrend skeleton (most searched properties) */}
                <div className="main-container mb-5">
                    <div className="placeholder-glow">
                        {/* Heading */}
                        <div className='placeholder mb-4' style={{ width: '300px', height: '32px' }} />
                        
                        {/* Cards grid skeleton */}
                        <div className="row m-0" style={{ gap: '20px 0' }}>
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className="col-lg-3 col-md-6 col-sm-12">
                                    <div className="placeholder placeholder-glow" style={{ width: '100%', height: '106px', borderRadius: '8px' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SearchChart skeleton (table/chart section) */}
                <div className="main-container mb-5">
                    <div className="placeholder-glow">
                        {/* Heading */}
                        <div className='placeholder mb-4' style={{ width: '250px', height: '32px' }} />
                        
                        {/* Tabs skeleton */}
                        {/* <div className="d-flex gap-2 mb-4">
                            <div className='placeholder' style={{ width: '100px', height: '48px', borderRadius: '4px' }} />
                            <div className='placeholder' style={{ width: '100px', height: '48px', borderRadius: '4px' }} />
                            <div className='placeholder' style={{ width: '120px', height: '48px', borderRadius: '4px' }} />
                        </div> */}

                        {/* Chart/Graph skeleton */}
                        <div className='placeholder mb-4' style={{ width: '100%', height: '400px', borderRadius: '8px' }} />

                        {/* Table skeleton */}
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        {[...Array(5)].map((_, index) => (
                                            <th key={index} className="placeholder-glow">
                                                <div className='placeholder' style={{ width: '100px', height: '20px' }} />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(8)].map((_, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {[...Array(5)].map((_, colIndex) => (
                                                <td key={colIndex} className="placeholder-glow">
                                                    <div className='placeholder' style={{ width: '80px', height: '20px' }} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* FAQ skeleton */}
                <div className="main-container mb-5">
                    <div className="placeholder-glow">
                        {/* Heading */}
                        <div className='placeholder mb-3' style={{ width: '200px', height: '32px' }} />
                        {/* Description */}
                        <div className='placeholder mb-4' style={{ width: '100%', height: '20px' }} />
                        <div className='placeholder mb-4' style={{ width: '90%', height: '20px' }} />
                        
                        {/* FAQ items skeleton */}
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="border rounded p-3 mb-3" style={{ borderRadius: '8px' }}>
                                <div className="placeholder-glow">
                                    <div className='placeholder mb-2' style={{ width: '80%', height: '24px' }} />
                                    <div className='placeholder mb-1' style={{ width: '100%', height: '18px' }} />
                                    <div className='placeholder' style={{ width: '95%', height: '18px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PreLocation and PreProperty skeleton */}
                <div className="main-container">
                    <div className="placeholder-glow mb-4">
                        <div className='placeholder mb-3' style={{ width: '100%', height: '300px', borderRadius: '8px' }} />
                    </div>
                    <div className="placeholder-glow">
                        <div className='placeholder' style={{ width: '100%', height: '300px', borderRadius: '8px' }} />
                    </div>
                </div>
            </div>

            {/* Footer skeleton */}
            <div className="main-container">
                <div className="placeholder-glow" style={{ padding: '40px 0' }}>
                    <div className='placeholder mb-3' style={{ width: '100%', height: '200px', borderRadius: '8px' }} />
                </div>
            </div>
        </div>
    );
}

export default PropertytrendDetailLoading;
