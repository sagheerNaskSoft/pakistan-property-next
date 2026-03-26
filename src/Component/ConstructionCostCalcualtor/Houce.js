import React, { useState } from 'react';
import img from '../../Asset/LoanModel/Frame 2131330783.svg';
import img1 from '../../Asset/LoanModel/Frame 2131330783 (1).svg'
import img2 from '../../Asset/LoanModel/Frame 2131330783 (2).svg'
import img3 from '../../Asset/LoanModel/Frame 2131330783 (3).svg'
import img4 from '../../Asset/LoanModel/Frame 2131330783 (4).svg'
import Image from 'next/image';
function Houce() {
    const [houseTips] = useState([
        {
            id: 1,
            img: img,
            title: 'Labour Quality',
            description: 'Hire skilled and trained labour to ensure a strong and durable structure.'
        },
        {
            id: 2,
            img: img1,
            title: 'Material Quality',
            description: 'Always choose certified and high-quality materials for lasting results'
        },
        {
            id: 2,
            img: img2,
            title: 'Construction Method',
            description: 'Use modern and efficient construction techniques for better cost control.'
        },
        {
            id: 2,
            img: img3,
            title: 'Supervision & Planning',
            description: 'Regularly monitor your project and follow the construction cost plan.'
        },
        {
            id: 2,
            img: img4,
            title: 'Flexible Contracting',
            description: 'Choose adaptable contract terms and payment options that suit your budget and timeline.'
        },
    ]);

    return (
        <div>
            <div className='main-container'>
                <div className='houce-consturction'>
                    <h1>Build Smart, Plan with Confidence</h1>
                    <p>
                        Building a property is a major investment. It’s important to plan every detail carefully. Here are a few key factors to consider when using our Construction Cost Calculator and planning further.
                    </p>

                    {
                        window.innerWidth > 576 ?
                            <div className='row justify-content-center' style={{ gap: "24px 0" }}>
                                {houseTips.map((item) => (
                                    <div className="col-lg-4 col-sm-6 col-10">
                                        <div key={item.id} className='Labour-headings'>
                                            <Image src={item.img} alt={item.title} />
                                            <h3>{item.title}</h3>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            :
                            (
                               <div className="global-scroll-box d-flex align-items-center" style={{ gap: '16px' }}>
                                {
                                     houseTips?.map((item) => (
                                          <div key={item.id} className='Labour-headings' style={{minWidth:'288px' , width:'100%' , height:'246px'}}>
                                             <Image src={item.img} alt={item.title} />
                                             <h3>{item.title}</h3>
                                             <p>{item.description}</p>
                                         </div>
                                     ))
                                }
                               </div>
                            )
                    }
                </div>
            </div>
        </div>
    );
}

export default Houce;
