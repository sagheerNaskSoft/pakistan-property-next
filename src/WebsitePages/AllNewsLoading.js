import React from 'react';

function AllNewsLoading() {
    return (
        <>
            {/* NavBar space */}
            <div style={{ height: '60px' }} />

            {/* Categories filter skeleton */}
            <div className="all-blogs-section">
                <div className="all-blog-li">
                    <ul>
                        {[...Array(9)].map((_, index) => (
                            <li key={index} className="placeholder-glow" style={{ padding: "0", margin: "0", whiteSpace: "nowrap" }}>
                                <div className="placeholder" style={{ 
                                    height: "22px", 
                                    width: index === 0 ? "40px" : index === 1 ? "100px" : index === 2 ? "120px" : index === 3 ? "140px" : index === 4 ? "100px" : index === 5 ? "110px" : index === 6 ? "130px" : index === 7 ? "120px" : "100px",
                                    borderRadius: "0" 
                                }} />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="main-container">
                    {/* Banner skeleton */}
                    <div className="all-blogs-banner-details">
                        <span className="d-sm-block d-none placeholder-glow" style={{ display: "block", marginBottom: "10px", textAlign: window?.innerWidth <= 576 ? 'left' : 'center' }}>
                            <div className="placeholder" style={{ height: "20px", width: "200px", margin: "0 auto", borderRadius: "4px" }} />
                        </span>
                        <div className="placeholder-glow" style={{ textAlign: window?.innerWidth <= 576 ? 'left' : 'center' }}>
                            <div className="placeholder" style={{ height: "22px", width: "120px", margin: "10px auto 28px", borderRadius: "4px" }} />
                            <div className="placeholder" style={{ height: "48px", width: "520px", maxWidth: "90%", margin: "0 auto 28px", borderRadius: "4px" }} />
                            <div className="placeholder" style={{ height: "22px", width: "650px", maxWidth: "90%", margin: "0 auto 4px", borderRadius: "4px" }} />
                            <div className="placeholder" style={{ height: "22px", width: "600px", maxWidth: "85%", margin: "0 auto", borderRadius: "4px" }} />
                        </div>
                    </div>

                    {/* Heading skeleton */}
                    <h6 className="placeholder-glow" style={{ marginBottom: "24px" }}>
                        <div className="placeholder" style={{ height: "24px", width: "100px", borderRadius: "4px" }} />
                    </h6>

                    {/* News grid skeleton */}
                    <div className='blog-grid'>
                        {[...Array(9)].map((_, index) => (
                            <div key={index} className='blog-card placeholder-glow' style={{ border: "1px solid #BBB", borderRadius: "8px", overflow: "hidden", background: "#FFF", display: "flex", flexDirection: "column", height: "100%" }}>
                                <div className='blog-img' style={{ position: "relative", height: "224px", width: "100%", padding: "12px", borderRadius: "8px 8px 0 0" }}>
                                    <div className='placeholder w-100 h-100' style={{ position: "absolute", top: "0", left: "0", borderRadius: "8px 8px 0 0", minHeight: "224px" }} />
                                    <div className='placeholder' style={{ 
                                        height: "18px", 
                                        width: "80px", 
                                        position: "absolute", 
                                        bottom: "12px", 
                                        left: "12px", 
                                        borderRadius: "20px",
                                        background: "rgba(255,255,255,0.9)"
                                    }} />
                                </div>
                                <div className='blog-heading' style={{ padding: "12px", display: "flex", flexDirection: "column", flex: "1" }}>
                                    <div className="placeholder mb-2" style={{ height: "22px", width: "95%", borderRadius: "4px" }} />
                                    <div className="placeholder mb-2" style={{ height: "22px", width: "85%", borderRadius: "4px" }} />
                                    <div className="placeholder mb-2" style={{ height: "20px", width: "100%", borderRadius: "4px" }} />
                                    <div className="placeholder mb-2" style={{ height: "20px", width: "90%", borderRadius: "4px" }} />
                                    <div className="placeholder mb-2" style={{ height: "20px", width: "75%", borderRadius: "4px" }} />
                                    <div className='bog-lowe-heading d-flex justify-content-between align-items-center' style={{ marginTop: "auto", paddingTop: "8px", borderTop: "1px solid #BBB", height: "37px" }}>
                                        <div className="placeholder" style={{ height: "20px", width: "110px", borderRadius: "4px" }} />
                                        <div className="placeholder" style={{ height: "20px", width: "85px", borderRadius: "4px" }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination skeleton */}
                    <div className="card-section placeholder-glow" style={{ background: "none", borderBottom: "1px solid", paddingBottom: "30px" }}>
                        <div className="col-12 mt-4">
                            <div className="row w-100 m-0 align-items-center">
                                <div className="col-md-6 col-sm-6 col-12 order-sm-first order-last p-0">
                                    <div className="d-flex gap-2 align-items-center">
                                        <div className="placeholder" style={{ height: "40px", width: "80px", borderRadius: "4px" }} />
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="placeholder" style={{ height: "40px", width: "40px", borderRadius: "4px" }} />
                                        ))}
                                        <div className="placeholder" style={{ height: "40px", width: "80px", borderRadius: "4px" }} />
                                    </div>
                                </div>
                                <div className="col-md-6 col-4 p-0">
                                    <div className="placeholder" style={{ height: "40px", width: "150px", borderRadius: "4px", marginLeft: "auto" }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter/Insights section skeleton */}
                    <div className="insights-all-blog placeholder-glow" style={{ padding: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #002C22 0%, #004F3B 50%, #006045 100%)", marginTop: "40px", marginBottom: "17px" }}>
                        <div className="iab-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px", width: "100%", flexDirection: window.innerWidth <= 992 ? 'column' : 'row' }}>
                            <div className="iab-left" style={{ flex: "1", width: '100%' }}>
                                <div className="placeholder mb-3" style={{ height: "38px", width: "178px", borderRadius: "100px", padding: "9px 16px" }} />
                                <div className="placeholder mb-2" style={{ height: "34px", width: "450px", maxWidth: "100%", borderRadius: "4px" }} />
                                <div className="placeholder mb-2" style={{ height: "34px", width: "400px", maxWidth: "90%", borderRadius: "4px" }} />
                                <div className="placeholder mb-3" style={{ height: "22px", width: "500px", maxWidth: "100%", borderRadius: "4px" }} />
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="d-flex align-items-center" style={{ gap: "12px", marginBottom: "14px" }}>
                                        <div className="placeholder" style={{ height: "24px", width: "24px", borderRadius: "50%", flexShrink: "0" }} />
                                        <div className="placeholder" style={{ height: "22px", width: "280px", maxWidth: "100%", borderRadius: "4px" }} />
                                    </div>
                                ))}
                            </div>
                            <div className="iab-right" style={{ flex: "0 0 auto", width: window.innerWidth <= 992 ? '100%' : '551px' }}>
                                <div className="iab-card" style={{ padding: "32px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", width: "100%", maxWidth: "100%" }}>
                                    <div className="placeholder mb-3" style={{ height: "22px", width: "130px", borderRadius: "4px" }} />
                                    <div className="placeholder mb-3" style={{ height: "40px", width: "100%", borderRadius: "4px" }} />
                                    <div className="placeholder mb-3" style={{ height: "22px", width: "140px", borderRadius: "4px" }} />
                                    <div className="d-flex flex-wrap" style={{ gap: "10px 12px", marginBottom: "24px" }}>
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="placeholder" style={{ height: "38px", width: i === 0 ? "110px" : i === 1 ? "90px" : i === 2 ? "100px" : "120px", borderRadius: "100px" }} />
                                        ))}
                                    </div>
                                    <div className="placeholder mb-2" style={{ height: "44px", width: "100%", borderRadius: "4px" }} />
                                    <div className="placeholder" style={{ height: "18px", width: "250px", maxWidth: "100%", borderRadius: "4px" }} />
                                </div>
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
        </>
    );
}

export default AllNewsLoading;
