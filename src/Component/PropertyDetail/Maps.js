import React from 'react';
// import './Maps.css';

function Maps({profileData}) {
  return (
    <>
    <div className='maps-property mb-3 mt-4'>
         <h3>Maps</h3>
    </div>
      <div className="map-box">
        <iframe
        title='map'
          className="map-iframe"
          src={`https://maps.google.com/maps?q=${profileData?.location?.geo_location?.lat},${profileData?.location?.geo_location?.lng}&z=15&output=embed`}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </>
  );
}

export default Maps;
