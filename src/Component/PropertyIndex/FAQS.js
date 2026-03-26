import React, { useState } from "react";

function FAQS({ faqData, para }) {

    // First FAQ open by default
    const [activeIndex, setActiveIndex] = useState(0);

    const toggleFAQ = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    return (
        <div className="property-index-faqs">
            <div className="main-container">
                <div className="title">Frequently asked questions</div>
                <div className="para">
                    {
                        para ? para :
                            " Find quick answers to common questions about listings, pricing, and property searches on our platform. <br /> Your go-to guide for understanding how to explore and manage properties with ease."
                    }
                </div>

                <div className="faq-container">
                    {faqData?.map((data, index) => (
                        <div
                            className={`faq-box ${activeIndex === index ? "active" : ""}`}
                            key={index}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className="question">{data.question}</div>

                            {activeIndex === index && (
                                <div className="answer">{data.answer}</div>
                            )}

                            <div className="icon">
                                {activeIndex === index ? (
                                    // Minus icon
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="2"
                                        viewBox="0 0 32 2"
                                        fill="none"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M0 0H32V2H0V0Z"
                                            fill="#3D3D3D"
                                        />
                                    </svg>
                                ) : (
                                    // Plus icon
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 32 32"
                                        fill="none"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M15 0H17V15H32V17H17V32H15V17H0V15H15V0Z"
                                            fill="#3D3D3D"
                                        />
                                    </svg>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FAQS;
