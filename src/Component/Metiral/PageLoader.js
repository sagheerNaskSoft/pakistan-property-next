import logo from '../../Asset/logo_pp.svg'
import background from '../../Asset/BG_123.webp'
import background1 from '../../Asset/BG_123.webp'

import Image from 'next/image';
function PageLoader() {
    return (
        <div className='loadder_main'>
            <Image src={background} className='background_loader background_loader_1'  alt="" />
            {/* <Image src={background1} className='background_loader background_loader_2'  alt="" /> */}
            
            <div className="page-loader-section">

                <div className="img">
                    {/* <div className="border-loader"></div> */}
                        <Image src={logo} alt="" />
                </div>
            </div>
        </div>
//         <div className="waveWrapper waveAnimation border border-danger">
//   <div className="waveWrapperInner bgTop">
//     <div className="wave waveTop" style={{backgroundImage: 'url("http://front-end-noobs.com/jecko/img/wave-top.png")'}} />
//   </div>
//   <div className="waveWrapperInner bgMiddle">
//     <div className="wave waveMiddle" style={{backgroundImage: 'url("http://front-end-noobs.com/jecko/img/wave-mid.png")'}} />
//   </div>
//   <div className="waveWrapperInner bgBottom">
//     <div className="wave waveBottom" style={{backgroundImage: 'url("http://front-end-noobs.com/jecko/img/wave-bot.png")'}} />
//   </div>
//   <div className='page-loader-section'>
//     <div className="img">
//                     {/* <div className="border-loader"></div> */}
//                         <Image src={logo} alt="" />
//                 </div>
//   </div>
// </div>


    )
}

export default PageLoader