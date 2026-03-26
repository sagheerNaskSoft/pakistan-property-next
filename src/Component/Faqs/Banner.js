import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { RxMagnifyingGlass } from 'react-icons/rx';

export default function Banner() {
    const [openIndex, setOpenIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const faqData = [
        {
            faq: [
                {
                    question: "What types of properties can I find on PakistanProperty.com?",
                    answer: "You can find all kinds of properties, including residential homes, plots, apartments, commercial spaces, and rental listings. Our platform connects verified agents and owners with buyers and tenants across Pakistan.",
                },
                {
                    question: "How do I search for properties in a specific city or area?",
                    answer: "Use the search bar at the top of the page. Enter the city, area, or type of property you’re looking for, then apply filters such as price range, size, or purpose (buy or rent) to narrow your results.",
                },
                {
                    question: "Can I list my property for sale or rent on PakistanProperty.com?",
                    answer: `Yes. You can add your property by creating an account and selecting “Add Property”. Fill in the required details and photos, and our team will review your listing before it goes live.`,
                },
                {
                    question: "Are the property listings verified?",
                    answer: `Yes. We verify listings through our approval process to ensure the information provided is correct and reliable. Only approved properties appear on the website.`,
                },
                {
                    question: "How can I contact the property owner or agent?",
                    answer: `Each listing includes a contact form and phone number. You can call directly or send a message through the platform to get more information.`,
                },
                {
                    question: "How do I schedule a visit to a property I’m interested in?",
                    answer: `After contacting the agent or owner, you can arrange a suitable time for a visit. PakistanProperty.com makes it easy to connect with the agents, but visits are managed directly between the buyer and seller or agent.`
                }, {
                    question: "How can I register as an agent or agency?",
                    answer: "To sign up as an agent, open the “Create Account” form and enter your details. If you’re registering your agency, check the “Register as an Agency” box before clicking Sign Up. Once submitted, your account is created, and agency profiles may require verification before listing properties.",
                },
                {
                    question: "What is required for agency registration?",
                    answer: "You’ll need to provide your CNIC, business or agency name, contact details, and verification documents. Once your information is reviewed and approved, you can start listing properties under your agency profile.",
                },
            ]
            , name: "General FAQs",
            id: 1
        },
        {
            faq: [

                {
                    question: "What is the process for adding a property?",
                    answer: `Log in to your account and click “Add Property.” Provide accurate details such as property type, price, location, and upload clear photos. After submission, our team reviews it before making it visible on the site.`,
                },
                {
                    question: "What happens if I add a property but don’t have an ad quota?",
                    answer: `If your package or quota is used up, you can’t post a new listing until you upgrade your plan or purchase more ad credits.`,
                },
                {
                    question: "What is the process for property approval and listing?",
                    answer: `Every property is reviewed by our moderation team to ensure it meets our quality and accuracy standards. Once approved, your property becomes visible to buyers and renters."`,
                },
                {
                    question: "What happens when a property’s duration expires or is deleted?",
                    answer: `When a listing expires, it becomes inactive and stops appearing in search results. You can renew or relist it anytime by logging in to your account."`,
                },
            ]
            , name: "Property Management FAQs",
            id: 1
        },
        {
            faq: [
                {
                    question: "What is the difference between Listing Services and Credit-Based Services?",
                    answer: "Listing Services allow you to post properties directly within your plan limits. Credit-Based Services give you flexibility to boost visibility, promote listings, or renew ads using purchased credits.",
                },
                {
                    question: "How long does a property stay visible with an ad slot?",
                    answer: "Each listing remains active for the duration specified in your plan. You can check expiry dates in your dashboard and renew them when needed.",
                },
                {
                    question: "3. What does a Super-Hot Listing mean?",
                    answer: `A Super-Hot Listing prominently displays your property at the top of search results, guaranteeing maximum exposure.`,
                },
                {
                    question: "What does a “Super-Hot Listing” mean?",
                    answer: `A “Super-Hot Listing” highlights your property at the top of search results for better visibility. It helps attract more buyers or tenants faster.`,
                },
                {
                    question: "How do Refresh Credits work?",
                    answer: `Refresh Credits allow you to renew your listing’s posting date. This moves it higher in search results, helping it reach more viewers without re-posting.`,
                },
                {
                    question: "Can I use credit-based services for new listings?",
                    answer: `Yes. You can use your credits to activate new listings, upgrade existing ones, or make them more visible to potential buyers and renters.`,
                },

            ]
            , name: "Features and Services FAQs",
            id: 2
        }
    ];
    const [active, setActive] = useState(faqData[0].name);
    const [activeData, setActiveData] = useState(faqData[0].faq);
    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredFAQs = activeData.filter((faq) => {
        const questionMatch = faq.question.toLowerCase().includes(searchQuery);
        const answerMatch = faq.answer.toLowerCase().includes(searchQuery);
        return questionMatch || answerMatch;
    });

    return (
        <>
            <div className="faqas_mianbox py-4">
                <div className="row m-0 mian-faqa p-0">
                    <div className="row m-0 p-0">
                        <div className="col-lg-4 col-md-4 col-12 m-0 p-0">
                            <div className="item-box my-sm-4 mt-4 mb-0 mx-0">
                                <div className="faqs-heading">
                                    <h2 >Frequently Asked Questions</h2>
                                </div>
                            </div>
                            <div className="item-box my-md-4 my-1 mx-0" style={{ gap: "12px 0" }} >
                                {/* <div className="first-item mb-2 me-2"></div> */}
                                {faqData?.map((item) => {
                                    return (
                                        <>
                                            {active === item?.name ? (
                                                <div
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        setActive(item?.name);
                                                        setActiveData(item?.faq);
                                                    }}
                                                    className="second-item px-2 mb-md-3 mb-2 me-md-2"
                                                >
                                                    <span className="item-line"></span> {item?.name}
                                                </div>
                                            ) : (
                                                <div
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        setActive(item?.name);
                                                        setActiveData(item?.faq);
                                                    }}
                                                    className="first-item my-md-2"
                                                >
                                                    {item?.name}
                                                </div>
                                            )}
                                        </>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-lg-8 col-md-8 col-12 p-0 my-3">
                            <div className="faq-mian-box">
                                <div className="faq-input">
                                    <input
                                        type="text"
                                        placeholder="Write your question here"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />
                                    <span>
                                        <RxMagnifyingGlass />
                                    </span>
                                </div>
                                <div className="fa-mian-services">
                                    {filteredFAQs.length > 0 ? (
                                        filteredFAQs.map((faq, index) => (
                                            <div
                                                key={index}
                                                className={`faq-services my-3 ${openIndex === index ? 'active' : ''}`}
                                            >
                                                <span
                                                    className="d-flex justify-content-between"
                                                    onClick={() => toggleFAQ(index)}
                                                >
                                                    <h3>{faq.question}</h3>
                                                    <span style={{ color: '#31b153ff' }}>
                                                        {openIndex === index ? <AiOutlineMinus /> : <AiOutlinePlus />}
                                                    </span>
                                                </span>
                                                {openIndex === index && (
                                                    <p style={{ marginTop: '10px' }}>{faq.answer}</p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No matching words found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
