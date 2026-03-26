import { useEffect, useState } from 'react'
import Card from '../../Component/Metiral/Card'

function AgencyListedProperties({ property_types }) {
    const [data, setData] = useState([])
    useEffect(() => {
        if (property_types?.length > 0) {
            const allProperties = property_types.flatMap(item => item?.properties || []);
            setData(prev => {
                const isSame =
                    JSON.stringify(prev) === JSON.stringify(allProperties);
                return isSame ? prev : allProperties;
            });
        }
    }, [property_types]);

    return (
        <div className='agency-listed-properties'>
            <div className="top d-flex justify-content-between align-items-center">
                <div className="heading">
                    Properties Listed by this Agency
                </div>
                <div className="view-more">
                    <span>View All</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="14" viewBox="0 0 7 14" fill="none">
                        <path d="M0.288658 0.290761C0.197192 0.383714 0.124593 0.494301 0.0750502 0.616147C0.025507 0.737992 0 0.868683 0 1.00068C0 1.13268 0.025507 1.26337 0.0750502 1.38521C0.124593 1.50706 0.197192 1.61765 0.288658 1.7106L4.7581 6.29008C4.84956 6.38303 4.92216 6.49362 4.9717 6.61547C5.02125 6.73731 5.04676 6.868 5.04676 7C5.04676 7.132 5.02125 7.26269 4.9717 7.38453C4.92216 7.50638 4.84956 7.61697 4.7581 7.70992L0.288658 12.2894C0.197192 12.3824 0.124593 12.4929 0.0750502 12.6148C0.025507 12.7366 0 12.8673 0 12.9993C0 13.1313 0.025507 13.262 0.0750502 13.3839C0.124593 13.5057 0.197192 13.6163 0.288658 13.7092C0.471497 13.8955 0.718831 14 0.976639 14C1.23445 14 1.48178 13.8955 1.66462 13.7092L6.14382 9.11976C6.69206 8.55732 7 7.79491 7 7C7 6.20509 6.69206 5.44268 6.14382 4.88024L1.66462 0.290761C1.48178 0.104531 1.23445 0 0.976639 0C0.718831 0 0.471497 0.104531 0.288658 0.290761Z" fill="#2D2D2D" />
                    </svg>
                </div>
            </div>
            <div className='grid card_main_home mt-0' style={{ gap: '16px 24px' }}>
                {data?.map((item) => {
                    return (
                        <Card data={item} />
                    )
                })}

            </div>
        </div>
    )
}

export default AgencyListedProperties
