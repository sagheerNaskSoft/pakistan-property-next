import React from 'react';
// import './Location.css';

function Location({location}) {
    return (
        <>
            <div id='location-sectios' className='construction-location mt-4'>
                <h3>Location</h3>
                <div className="map-box mt-3">
                    <iframe
                        title='map'
                        className="map-iframe"
                        src={`https://maps.google.com/maps?q=${location?.lat},${location?.lng}&z=15&output=embed`}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </>
    );
}

export default Location;
