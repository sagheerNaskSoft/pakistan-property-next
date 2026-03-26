import React from 'react';
import { useAuth } from '../../Context/ContextProvider';
const PdfTemplate = ({ categories, filterData, parsedData }) => {
    const { formatPriceWithCommas } = useAuth();

    const formatNumber = (num) => {
        if (num >= 1_00_00_00_000) {
            return `${(num / 1_00_00_000).toFixed(2)} Billion`;
        } else if (num >= 1_00_00_000) {
            return `${(num / 1_00_00_000).toFixed(2)} Crore`;
        } else if (num >= 1_00_000) {
            return `${(num / 1_00_000).toFixed(2)} Lakh`;
        } else if (num >= 1_000) {
            return `${(num / 1_000).toFixed(2)} K`;
        } else if (num >= 1_00) {
            return `${(num / 1_00).toFixed(2)} Hundred`;
        }
        return num.toString();
    };

    // Calculate totals
    const calculateTotals = () => {
        let totalCost = 0;
        let greyTotalCost = 0;

        categories?.forEach(category => {
            category.subcategories.forEach(sub => {
                sub.items.forEach(item => {
                    const cost = item.total_cost || 0;
                    totalCost += cost;
                    if (item?.construction_type?.includes("grey_structure")) {
                        greyTotalCost += cost;
                    }
                });
            });
        });

        return { totalCost, greyTotalCost };
    };

    const { totalCost, greyTotalCost } = calculateTotals();
    const area = parseFloat(filterData?.coverd_area) || 0;
    const costPerSqft = area > 0 ? totalCost / area : 0;

    // Calculate percentage data
    const getPercentageData = () => {
        const filteredCategories = categories?.filter(category =>
            category.subcategories.some(sub => sub.items.length > 0)
        );

        return filteredCategories?.map((category) => {
            const grandTotal = category.subcategories.reduce((catSum, sub) => {
                return catSum + sub.items.reduce((sum, item) => sum + (item.total_cost || 0), 0);
            }, 0);

            return {
                id: category.id,
                label: category.name,
                value: grandTotal,
                percentage: totalCost > 0 ? ((grandTotal / totalCost) * 100).toFixed(2) : 0,
            };
        });
    };

    const percentageData = getPercentageData();

    const COLORS = {
        "Plumbing Works": "#F59E0B",
        "Electrical Works\r\n": "#A78BFA",
        "Wood, Metal and Tile Works": "#0EA5E9",
        "Fittings & Fixtures": "#EF4444",
        "Foundation & Structure": "#3DCAD4",
    };

    return (
        <div style={{
            padding: '50px 40px 60px 40px',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: 'none',
            color: '#000',
            maxWidth: '100%',
            minHeight: '100vh',
            boxSizing: 'border-box'
        }} id="pdf-template">
            {/* Header */}
            <div style={{ marginBottom: '30px', borderBottom: '2px solid #447158', paddingBottom: '20px' }}>
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    margin: '0 0 10px 0',
                    color: '#447158'
                }}>
                    Construction Cost Report
                </h1>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                    <div><strong>Property Details:</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <div>Area: {filterData?.area_size} {filterData?.areaValue?.name}</div>
                            <div>Covered Area: {filterData?.coverd_area} Sq. Ft.</div>
                            <div>City: {filterData?.city?.city || 'N/A'}</div>
                            <div>Construction Type: {filterData?.construction_type?.name || parsedData?.construction_type || 'N/A'}</div>
                            <div>Construction Mode: {filterData?.construction_mode?.name || parsedData?.construction_mode || 'N/A'}</div>
                        </div>
                        <div style={{display:"flex", alignItems:"center", gap:"10px",flexDirection:"column"}}>
                            <a  href={window.location.href} target='_blank' >
                            <button style={{background:"none", border:"none", cursor:"pointer",fontSize:"16px",padding:"0",color:"#447158",border:"1px solid #447158",borderRadius:"8px",padding:"5px 10px"}}
                            
                            >Online Report</button>
                            </a>
                        <svg xmlns="http://www.w3.org/2000/svg" width="149" height="38" viewBox="0 0 149 38" fill="none">
                                    <path d="M42.5996 29.1875H45.8996C46.8996 29.1875 48.0996 29.7875 48.0996 31.3875C48.0996 33.2875 46.8996 33.7875 45.9996 33.7875H43.1996V36.1875H42.5996V29.1875ZM43.1996 29.6875V33.1875H45.8996C46.5996 33.1875 47.4996 32.8875 47.4996 31.3875C47.4996 29.9875 46.6996 29.6875 45.8996 29.6875H43.1996Z" fill="black" />
                                    <path d="M56 33.4881C56.5 33.8881 56.8 34.6881 57.1 35.4881L57.4 36.1881H56.8L56.4 35.0881C56 33.9881 55.5 33.5881 54.7 33.5881H52.6V36.2881H52V29.2881H55.3C56.4 29.2881 57.5 29.7881 57.5 31.3881C57.5 31.7881 57.4 33.1881 56 33.4881ZM55.2 32.9881C56 32.9881 56.8 32.9881 56.8 31.2881C56.8 29.8881 56 29.6881 55.2 29.6881H52.6V32.9881H55.2Z" fill="black" />
                                    <path d="M61.1992 32.4879C61.1992 29.9879 63.0992 29.0879 64.6992 29.0879C66.2992 29.0879 68.0992 29.9879 68.0992 32.4879C68.0992 35.5879 65.9992 36.1879 64.6992 36.1879C63.2992 36.2879 61.1992 35.5879 61.1992 32.4879ZM67.4992 32.5879C67.4992 30.3879 66.0992 29.6879 64.6992 29.6879C63.2992 29.6879 61.7992 30.3879 61.7992 32.5879C61.7992 35.1879 63.4992 35.6879 64.6992 35.6879C65.7992 35.6879 67.4992 35.1879 67.4992 32.5879Z" fill="black" />
                                    <path d="M72.1992 29.1875H75.4992C76.4992 29.1875 77.6992 29.7875 77.6992 31.3875C77.6992 33.2875 76.4992 33.7875 75.5992 33.7875H72.7992V36.1875H72.1992V29.1875ZM72.7992 29.6875V33.1875H75.4992C76.1992 33.1875 77.0992 32.8875 77.0992 31.3875C77.0992 29.9875 76.2992 29.6875 75.4992 29.6875H72.7992Z" fill="black" />
                                    <path d="M82.1996 29.6875V32.2875H85.5996V32.8875H82.1996V35.5875H86.3996V36.1875H81.5996V29.1875H86.3996V29.7875H82.1996V29.6875Z" fill="black" />
                                    <path d="M94.5996 33.4881C95.0996 33.8881 95.3996 34.6881 95.6996 35.4881L95.9996 36.1881H95.3996L94.9996 35.0881C94.5996 33.9881 94.0996 33.5881 93.2996 33.5881H91.1996V36.2881H90.5996V29.2881H93.8996C94.9996 29.2881 96.0996 29.7881 96.0996 31.3881C96.0996 31.7881 95.9996 33.1881 94.5996 33.4881ZM93.8996 32.9881C94.6996 32.9881 95.4996 32.9881 95.4996 31.2881C95.4996 29.8881 94.6996 29.6881 93.8996 29.6881H91.2996V32.9881H93.8996Z" fill="black" />
                                    <path d="M99.5996 29.1875H105V29.7875H102.6V36.2875H102V29.7875H99.5996V29.1875Z" fill="black" />
                                    <path d="M113.9 29.1875H114.6L111.9 33.7875V36.1875H111.3V33.7875L108.6 29.1875H109.3L111.7 33.1875L113.9 29.1875Z" fill="black" />
                                    <path d="M116.9 35.5879H117.5V36.1879H116.9V35.5879Z" fill="black" />
                                    <path d="M122.2 32.5879C122.2 35.1879 123.9 35.6879 125.2 35.6879C125.8 35.6879 126.4 35.5879 127 35.2879L127.3 35.6879C126.7 36.0879 125.9 36.1879 125.3 36.1879C124 36.1879 121.6 35.5879 121.6 32.4879C121.6 29.8879 123.4 29.0879 125.3 29.0879C126 29.0879 126.7 29.2879 127.3 29.5879L127 29.9879C126.4 29.6879 125.8 29.5879 125.3 29.5879C123.8 29.6879 122.2 30.1879 122.2 32.5879Z" fill="black" />
                                    <path d="M130.9 32.4879C130.9 29.9879 132.8 29.0879 134.4 29.0879C136 29.0879 137.8 29.9879 137.8 32.4879C137.8 35.5879 135.7 36.1879 134.4 36.1879C133 36.2879 130.9 35.5879 130.9 32.4879ZM137.2 32.5879C137.2 30.3879 135.8 29.6879 134.4 29.6879C133 29.6879 131.5 30.3879 131.5 32.5879C131.5 35.1879 133.2 35.6879 134.4 35.6879C135.5 35.6879 137.2 35.1879 137.2 32.5879Z" fill="black" />
                                    <path d="M145.1 34.4875L142.5 30.5875V36.1875H141.9V29.1875H142.3L145.3 33.8875L148.3 29.1875H148.7V36.1875H148.1V30.5875L145.6 34.4875H145.1Z" fill="black" />
                                    <path d="M49.4004 10.8877C50.2004 10.8877 50.9004 10.9877 51.6004 11.2877C52.3004 11.5877 52.9004 11.9877 53.4004 12.4877C53.9004 12.9877 54.3004 13.5877 54.6004 14.2877C54.9004 14.9877 55.0004 15.6877 55.0004 16.4877C55.0004 17.2877 54.9004 17.9877 54.6004 18.5877C54.3004 19.2877 54.0004 19.7877 53.5004 20.2877C53.0004 20.7877 52.4004 21.1877 51.6004 21.4877C50.8004 21.7877 50.0004 21.8877 48.9004 21.8877H45.4004V26.5877H42.4004V10.8877H49.4004ZM49.4004 19.1877C49.8004 19.1877 50.2004 19.0877 50.6004 18.9877C50.9004 18.7877 51.2004 18.5877 51.4004 18.3877C51.6004 18.0877 51.8004 17.8877 51.9004 17.4877C52.0004 17.1877 52.1004 16.7877 52.1004 16.4877C52.1004 16.0877 52.0004 15.7877 51.9004 15.3877C51.8004 14.9877 51.6004 14.6877 51.3004 14.4877C51.1004 14.1877 50.8004 13.9877 50.4004 13.7877C50.0004 13.5877 49.6004 13.4877 49.2004 13.4877H45.4004V19.1877H49.4004Z" fill="black" />
                                    <path d="M53.2012 26.5877L61.2012 10.8877H61.5012L69.5012 26.5877H66.2012L65.0012 24.0877H57.6012L56.4012 26.5877H53.2012ZM59.1012 21.4877H63.6012L61.4012 16.7877L59.1012 21.4877Z" fill="black" />
                                    <path d="M81.0004 26.5877L74.4004 19.4877V26.5877H71.4004V10.8877H74.4004V18.8877L80.6004 10.8877H84.3004L77.8004 18.9877L84.9004 26.5877H81.0004Z" fill="black" />
                                    <path d="M90.5996 26.5877H87.5996V10.8877H90.5996V26.5877Z" fill="black" />
                                    <path d="M93.8008 24.4881L95.4008 22.0881C96.2008 22.5881 97.0008 23.0881 97.8008 23.4881C98.6008 23.8881 99.5008 24.0881 100.401 24.0881C100.901 24.0881 101.301 23.9881 101.701 23.8881C102.101 23.7881 102.401 23.5881 102.601 23.3881C102.901 23.1881 103.101 22.9881 103.201 22.6881C103.301 22.4881 103.401 22.1881 103.401 21.9881C103.401 21.6881 103.301 21.3881 103.101 21.1881C102.901 20.9881 102.601 20.7881 102.301 20.6881C102.001 20.5881 101.601 20.3881 101.201 20.2881C100.801 20.1881 100.301 20.0881 99.8008 19.9881C99.5008 19.8881 99.1008 19.8881 98.7008 19.7881C98.3008 19.6881 97.9008 19.5881 97.4008 19.4881C97.0008 19.3881 96.5008 19.1881 96.1008 18.9881C95.7008 18.7881 95.3008 18.4881 94.9008 18.1881C94.6008 17.8881 94.3008 17.4881 94.1008 16.9881C93.9008 16.4881 93.8008 15.9881 93.8008 15.3881C93.8008 14.4881 94.0008 13.6881 94.4008 13.0881C94.8008 12.4881 95.2008 11.9881 95.8008 11.6881C96.4008 11.2881 97.0008 11.0881 97.7008 10.9881C98.4008 10.8881 99.1008 10.7881 99.7008 10.7881C100.401 10.7881 100.901 10.7881 101.501 10.8881C102.001 10.9881 102.501 11.0881 102.901 11.2881C103.301 11.4881 103.801 11.6881 104.201 11.8881C104.601 12.1881 105.101 12.3881 105.601 12.7881L103.901 15.1881C103.201 14.6881 102.401 14.2881 101.801 13.9881C101.101 13.6881 100.401 13.5881 99.6008 13.5881C99.3008 13.5881 99.1008 13.5881 98.7008 13.6881C98.4008 13.7881 98.1008 13.8881 97.8008 13.9881C97.5008 14.0881 97.3008 14.2881 97.1008 14.4881C96.9008 14.6881 96.8008 14.9881 96.8008 15.2881C96.8008 15.5881 96.9008 15.8881 97.1008 16.0881C97.3008 16.2881 97.6008 16.4881 98.0008 16.5881C98.4008 16.6881 98.8008 16.8881 99.2008 16.9881C99.6008 17.0881 100.001 17.1881 100.401 17.2881C100.701 17.3881 101.101 17.3881 101.501 17.4881C101.901 17.5881 102.301 17.6881 102.801 17.7881C103.201 17.8881 103.701 18.0881 104.101 18.2881C104.501 18.4881 104.901 18.7881 105.201 19.0881C105.501 19.3881 105.801 19.8881 106.001 20.2881C106.201 20.6881 106.301 21.3881 106.301 22.0881C106.301 22.8881 106.201 23.5881 105.901 24.1881C105.601 24.7881 105.201 25.2881 104.701 25.6881C104.201 26.0881 103.501 26.3881 102.801 26.5881C102.101 26.7881 101.301 26.8881 100.401 26.8881C99.6008 26.8881 98.9008 26.7881 98.2008 26.6881C97.6008 26.5881 97.0008 26.3881 96.5008 26.1881C96.0008 25.9881 95.5008 25.6881 95.0008 25.4881C94.8008 25.1881 94.3008 24.8881 93.8008 24.4881Z" fill="black" />
                                    <path d="M119 13.4881H114.5V26.4881H111.5V13.4881H107V10.7881H119V13.4881Z" fill="black" />
                                    <path d="M117 26.5877L125 10.8877H125.3L133.3 26.5877H130L128.8 24.0877H121.4L120.2 26.5877H117ZM122.9 21.4877H127.4L125.2 16.7877L122.9 21.4877Z" fill="black" />
                                    <path d="M148.501 26.5877L138.201 17.2877V26.5877H135.201V10.8877H135.501L145.801 20.3877V10.8877H148.801V26.5877H148.501Z" fill="black" />
                                    <path d="M1 10.0881L5.1 7.18809C5.3 7.08809 5.4 6.88809 5.4 6.68809V5.18809C5.4 4.08809 4.5 3.28809 3.5 3.28809H1.9C0.8 3.28809 0 4.18809 0 5.18809V9.68809C0 10.0881 0.6 10.3881 1 10.0881Z" fill="#1B573E" />
                                    <path d="M32.9 36.2884C34.6 36.2884 35.9 34.9884 35.9 33.2884V13.0884C35.9 12.0884 35.4 11.0884 34.5 10.5884L18.9 0.488412C17.9 -0.211588 16.5 -0.111588 15.5 0.588412L1.3 10.6884C0.499999 11.2884 0 12.1884 0 13.0884V33.1884C0 34.8884 1.3 36.1884 3 36.1884L32.9 36.2884Z" fill="#1B573E" />
                                    <path d="M12.5004 19.6889H14.2004V10.9889H19.4004C19.4004 10.9889 25.2004 11.7889 25.4004 18.0889C25.4004 18.0889 25.5004 23.9889 19.4004 25.0889H12.4004V37.8889H14.2004V26.9889L18.9004 27.0889C18.9004 27.0889 26.6004 26.6889 27.2004 17.9889C27.2004 17.9889 27.4004 10.9889 19.8004 9.08887H12.4004V19.6889H12.5004Z" fill="white" />
                                    <path d="M16.1008 12.6885H19.2008C19.2008 12.6885 23.5008 13.7885 23.6008 17.5885C23.6008 17.5885 24.3008 22.2885 19.0008 23.3885H10.7008V37.9885H8.80078V12.6885H16.1008Z" fill="white" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M20.7002 19.6891C20.1002 20.2891 19.1002 20.8891 17.8002 20.7891C14.8002 20.6891 13.1002 17.3891 14.6002 14.8891C14.7002 14.6891 14.9002 14.4891 15.0002 14.2891C15.2002 14.0891 15.3002 13.9891 15.5002 13.7891C15.2002 13.7891 14.8002 14.0891 14.6002 14.1891C13.8002 14.6891 13.1002 15.5891 12.8002 16.4891C11.5002 20.4891 16.3002 23.6891 19.5002 21.0891C19.9002 20.9891 20.6002 20.1891 20.7002 19.6891Z" fill="#1B573E" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M17.7008 15.9893L16.3008 16.5893L17.7008 16.8893L17.9008 18.4893L18.7008 17.1893L20.2008 17.4893L19.2008 16.3893L20.0008 14.9893L18.5008 15.5893L17.5008 14.4893L17.7008 15.9893Z" fill="#1B573E" />
                                </svg>
                        </div>
                    </div>

                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e0e0e0' }}>
                        <strong>Room Details:</strong>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px', marginTop: '5px' }}>
                            <div>Bedrooms: {filterData?.bedrooms?.value || parsedData?.bedrooms || 'N/A'}</div>
                            <div>Bathrooms: {filterData?.bathrooms?.value || parsedData?.bathrooms || 'N/A'}</div>
                            <div>Kitchens: {filterData?.kitchens?.value || parsedData?.kitchens || 'N/A'}</div>
                            <div>Drawing Rooms: {filterData?.drowing_rooms?.value || parsedData?.drowing_rooms || 'N/A'}</div>
                            <div>Living Rooms: {filterData?.living_rooms?.value || parsedData?.living_rooms || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cost Summary */}
            <div style={{
                backgroundColor: 'none',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Grey Structure Material Cost</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#447158' }}>
                        {formatNumber(greyTotalCost)}
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Price Per Sq Ft</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#447158' }}>
                        {formatNumber(costPerSqft)}
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Total Cost</div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#447158' }}>
                        {formatNumber(totalCost)}
                    </div>
                </div>
            </div>

            {/* Percentage Breakdown */}
            {percentageData && percentageData.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        color: '#2D2D2D',
                        borderBottom: '1px solid #ddd',
                        paddingBottom: '10px'
                    }}>
                        Breakdown of Overall Construction Cost By Percentage
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {percentageData.map((item) => (
                            <div key={item.id} style={{ marginBottom: '10px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '5px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            backgroundColor:'none'
                                        }}></div>
                                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.percentage}%</span>
                                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                            PKR {formatPriceWithCommas(Math.round(item.value))}
                                        </span>
                                    </div>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    backgroundColor: 'none',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${item.percentage}%`,
                                        height: '100%',
                                        backgroundColor: "none",
                                        borderRadius: '4px'
                                    }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Detailed Cost Breakdown */}
            <div style={{ marginTop: '40px' }}>
                <h2 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    color: '#2D2D2D',
                    borderBottom: '1px solid #ddd',
                    paddingBottom: '10px'
                }}>
                    Detailed Cost Breakdown
                </h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                    Comprehensive itemized costs for each construction category
                </p>

                {categories?.map((category, catIndex) => {
                    const subcategoryTotals = category.subcategories.map((sub) =>
                        sub.items.reduce((sum, item) => sum + (item.total_cost || 0), 0)
                    );
                    const grandTotal = subcategoryTotals.reduce((sum, sub) => sum + sub, 0);

                    if (grandTotal === 0) return null;

                    return (
                        <div key={catIndex} style={{
                            marginBottom: '30px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            {/* Category Header */}
                            <div style={{
                                backgroundColor: 'none',
                                padding: '15px 20px',
                                borderBottom: '1px solid #e0e0e0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h3 style={{
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        margin: '0 0 5px 0',
                                        color: '#2D2D2D'
                                    }}>
                                        {category.name}
                                    </h3>
                                    {category?.description && (
                                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                                            {category.description}
                                        </p>
                                    )}
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#447158' }}>
                                    PKR {formatPriceWithCommas(grandTotal?.toFixed(0))}
                                </div>
                            </div>

                            {/* Subcategories */}
                            <div style={{ padding: '15px 20px' }}>
                                {(() => {
                                    const sortedSubcategories =
                                        category?.subcategories
                                            ?.filter(sub => sub?.name !== "Labor Cost")
                                            ?.concat(category?.subcategories?.filter(sub => sub?.name === "Labor Cost"));

                                    return sortedSubcategories?.map((sub, subIndex) => {
                                        const total = sub?.items?.reduce(
                                            (sum, item) => sum + (item.total_cost || 0),
                                            0
                                        );

                                        if (total === 0) return null;

                                        return (
                                            <div key={subIndex} style={{ marginBottom: '20px' }}>
                                                {/* Subcategory Header */}
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '10px',
                                                    paddingBottom: '8px',
                                                    borderBottom: '1px solid #f0f0f0'
                                                }}>
                                                    <span style={{
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        color: sub?.name === "Labor Cost" ? '#447158' : '#2D2D2D'
                                                    }}>
                                                        {sub.name}
                                                    </span>
                                                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#447158' }}>
                                                        PKR {formatPriceWithCommas(total?.toFixed(0))}
                                                    </span>
                                                </div>

                                                {/* Items Table */}
                                                <table style={{
                                                    width: '100%',
                                                    borderCollapse: 'collapse',
                                                    fontSize: '12px'
                                                }}>
                                                    <thead>
                                                        <tr style={{ backgroundColor: 'none' }}>
                                                            <th style={{
                                                                padding: '8px',
                                                                textAlign: 'left',
                                                                borderBottom: '2px solid #ddd',
                                                                fontWeight: '600'
                                                            }}>ITEM</th>
                                                            <th style={{
                                                                padding: '8px',
                                                                textAlign: 'right',
                                                                borderBottom: '2px solid #ddd',
                                                                fontWeight: '600'
                                                            }}>RATE</th>
                                                            <th style={{
                                                                padding: '8px',
                                                                textAlign: 'right',
                                                                borderBottom: '2px solid #ddd',
                                                                fontWeight: '600'
                                                            }}>QUANTITY</th>
                                                            <th style={{
                                                                padding: '8px',
                                                                textAlign: 'right',
                                                                borderBottom: '2px solid #ddd',
                                                                fontWeight: '600'
                                                            }}>COST</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sub?.items?.map((item, idx) => (
                                                            <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                                <td style={{ padding: '8px' }}>{item.name || "—"}</td>
                                                                <td style={{ padding: '8px', textAlign: 'right' }}>
                                                                    {item.rate}/{item?.uom}
                                                                </td>
                                                                <td style={{ padding: '8px', textAlign: 'right' }}>
                                                                    {parseInt(item?.total_qty)?.toFixed(2) ?? "—"}
                                                                </td>
                                                                <td style={{ padding: '8px', textAlign: 'right', fontWeight: '500' }}>
                                                                    PKR {formatPriceWithCommas(parseInt(item?.total_cost)?.toFixed(0))}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div style={{
                marginTop: '40px',
                paddingTop: '20px',
                borderTop: '2px solid #447158',
                textAlign: 'center',
                fontSize: '12px',
                color: '#666'
            }}>
                <div>Generated by Pakistan Property</div>
                <div style={{ marginTop: '5px' }}>
                    {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>
        </div>
    );
};

export default PdfTemplate;

