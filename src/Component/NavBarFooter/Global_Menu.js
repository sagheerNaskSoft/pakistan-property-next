import { useState, useEffect } from 'react';
import currency from '../../Asset/HomePage/currency.svg';
import active_currency from '../../Asset/HomePage/active_Currency.svg';
import area from '../../Asset/HomePage/area.svg';
import active_area from '../../Asset/HomePage/active_Area.svg';
import language from '../../Asset/HomePage/language.svg';
import active_langauge from '../../Asset/HomePage/active_langauge.svg';
import dollar from '../../Asset/modal_icon/dollar.svg';
import riyal from '../../Asset/modal_icon/reyal.svg';
import rupee from '../../Asset/modal_icon/rupee.svg';
import euro from '../../Asset/modal_icon/euro.svg';
import united_dollar from '../../Asset/modal_icon/united_Dollar.svg';
import pound from '../../Asset/modal_icon/pound.svg';
import kanal from '../../Asset/modal_icon/k.svg';
import squareYaad from '../../Asset/modal_icon/sy.svg';
import squareMeter from '../../Asset/modal_icon/sm.svg';
import marla from '../../Asset/modal_icon/m.svg';
import squareFeet from '../../Asset/modal_icon/sf.svg';
import pakistan from '../../Asset/modal_icon/pakistan.png';
import unitedState from '../../Asset/modal_icon/unitedState.png';
import { IoMdClose } from 'react-icons/io';

import Image from 'next/image';
function Global_Menu({ globalMenu, global_Menu, setGlobalMenu }) {
    // Prevent body scroll when Global_Menu is open
    useEffect(() => {
        if (globalMenu && window.innerWidth < 576) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [globalMenu]);

    const handleClose = () => {
        if (setGlobalMenu && typeof setGlobalMenu === 'function') {
            setGlobalMenu(false);
        }
    };
    const tabData = [
        // { svg: currency, activeSvg: active_currency, title: 'Currency' },
        // { svg: area, activeSvg: active_area, title: 'Area Unit' },
        { svg: language, activeSvg: active_langauge, title: 'Language' },
    ];

    const menuDataMap = {
        // 'Currency': [
        //     { svg: dollar, title: 'United State Dollars', para: 'USD - $' },
        //     { svg: riyal, title: 'Saudi Riyal', para: 'SAR - ﷼' },
        //     { svg: rupee, title: 'Pakistani Rupee', para: 'PKR - Rs' },
        //     { svg: euro, title: 'Euro', para: 'EUR - €' },
        //     { svg: united_dollar, title: 'United Arab Emirates Dirham', para: 'AED - د.إ' },
        //     { svg: pound, title: 'Great British Pound', para: 'GBP - £' },
        // ],
        // 'Area Unit': [
        //     { svg: kanal, title: 'Kanal', para: 'Kanal' },
        //     { svg: squareYaad, title: 'Square yards', para: 'sq yd' },
        //     { svg: squareMeter, title: 'Square meter', para: 'm²' },
        //     { svg: marla, title: 'Marla', para: 'Marla' },
        //     { svg: squareFeet, title: 'Square feet', para: 'sq ft' },
        // ],
        'Language': [
            { svg: pakistan, title: 'اردو', para: 'PAK' },
            { svg: unitedState, title: 'English', para: 'US' },
        ]
    };

    const [active, setActive] = useState('Language');
    const [selectedItems, setSelectedItems] = useState("English");

    const handleSelect = (tab, itemTitle) => {
        setSelectedItems(prev => ({
            ...prev,
            [tab]: itemTitle
        }));
    };

    return (
        <>
            {globalMenu && (
                <div 
                    className="global-menu-backdrop d-sm-none d-block" 
                    onClick={handleClose}
                ></div>
            )}
            <div 
                className={globalMenu ? 'search-menu' : 'd-none'} 
                ref={global_Menu}
                onClick={(e) => e.stopPropagation()}
            >
                {/* <button className='close_btn d-flex justify-content-end align-items-center' onClick={handleClose}>
                    <IoMdClose />
                </button> */}
            <div className="arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="32" viewBox="0 0 44 32" fill="none">
                    <g filter="url(#filter0_d_53270_27745)">
                        <path d="M22 18L34 30L10 30L22 18Z" fill="white" />
                    </g>
                    <defs>
                        <filter id="filter0_d_53270_27745" x="0" y="0" width="44" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset dy="-8" />
                            <feGaussianBlur stdDeviation="5" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_53270_27745" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_53270_27745" result="shape" />
                        </filter>
                    </defs>
                </svg>
            </div>
            <div className="tab-box-search">
                
                {tabData.map((data) => (
                    <div
                        key={data.title}
                        className={active === data.title ? "tab active" : "tab"}
                        onClick={() => setActive(data.title)}
                    >
                        <div
                            className="svg"
                            style={active === data.title && data.activeSvg ? { marginTop: "1px" } : {}}
                        >
                            <Image src={active === data.title ? data.activeSvg : data.svg} alt={data.title} />
                        </div>
                        <div className="text">{data.title}</div>
                    </div>
                ))}
            </div>
            <div className="menu-data-search">
                {/* {(menuDataMap[active] || []).map((data, index) => (
                    <div
                        className={`menu ${selectedItems != 'English'? '' : 'selected'}`}
                        key={index}
                        // onClick={() => handleSelect(active, data.title)}
                    >
                        <div className="img">
                            <Image src={data.svg} alt={data.title} />
                        </div>
                        <div className="text-box">
                            <div className="title">{data.title}</div>
                            <div className="para">{data.para}</div>
                        </div>
                    </div>
                ))} */}
                <div
                        className='menu'
                        // onClick={() => handleSelect(active, data.title)}
                    >
                        <div className="img">
                            <Image src={pakistan}   alt="" />
                        </div>
                        <div className="text-box">
                            <div>
                            <div className="title">اردو</div>
                            <div className="para">PAK</div>
                            </div>
                            <div className="coming-soon-tag">Coming Soon</div>
                        </div>
                    </div>
                    <div
                        className='menu selected'
                        // onClick={() => handleSelect(active, data.title)}
                    >
                        <div className="img">
                            <Image src={unitedState}   alt="" />
                        </div>
                        <div className="text-box">
                          <div>
                          <div className="title">English</div>
                          <div className="para">US</div>
                          </div>
                        </div>
                    </div>
            </div>
        </div>
        </>
    );
}

export default Global_Menu;
