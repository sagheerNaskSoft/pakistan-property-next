import React from "react";
import Image from 'next/image';
import img1 from "../../Asset/HomePage/Illustration.svg";
import img2 from "../../Asset/HomePage/Illustration (1).svg";
import img3 from "../../Asset/HomePage/Illustration (2).svg";
import img4 from "../../Asset/HomePage/Illustration (3).svg";
import img5 from "../../Asset/HomePage/Illustration (4).svg";
import img6 from "../../Asset/HomePage/Illustration (5).svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/ContextProvider";
function OurService() {
  const { userData ,currentCity} = useAuth()
  const recentSearch = localStorage.getItem('recent-property-searches') || [];
  const services = [
    {
      id: 1,
      img: img1,
      title: "Property Trends",
      desc: <>Check <b>latest property prices</b> & market changes.</>,
      cardClass: "card_1",
      colClass: "col-lg-3 col-sm-6 col-4 p-0",
      link: "/property-trend"
    },
    {
      id: 2,
      img: img2,
      title: "Area Unit Converter",
      desc: <>Convert property units in seconds</>,
      cardClass: "card_2",
      link: "/area-unit-converter"
    },
    {
      id: 3,
      img: img3,
      title: "Property Index",
      desc: <>View real-time insights by location.</>,
      cardClass: "card_3",
      link: "/property-index"
    },
    {
      id: 4,
      img: img4,
      title: "New Properties",
      desc: <>Find <b>new listings</b> and <b>verified projects.</b> </>,
      cardClass: "card_4",
      link: `/properties/new?property_type_id=1&&city_code=${currentCity?.app_code}`
    },
    {
      id: 5,
      img: img5,
      title: "Cost Calculator",
      desc: <>Estimate property or construction costs.</>,
      cardClass: "card_5",
      link: "/construction-cost-calculator"
    },
    {
      id: 6,
      img: img6,
      title: "Loan Calculator",
      desc: <>Calculate <b>home financing options</b> easily.</>,
      cardClass: "card_6",
      link: "/loan-calculator"
    },
  ];

  const navigate = useNavigate()

  return (
    <div className="service_section" style={{ paddingTop: recentSearch?.length > 0 ? "" : "36px" }}>
      <h2 className="section_title">Our Services</h2>
    <div className="global-scroll-box">
    <div className="row service-row m-0 justify-content-sm-start justify-content-between" style={{ gap: '12px 0' }}>
        {services.map((service) => (
          <div
            key={service.id}
            className="services-card-col col-lg-3 col-md-6 col-4 p-sm-0 ps-0"
            style={{ marginBottom: "24px" }}
          >
            <div className={`service_card ${service.cardClass} row m-0`} style={{width: window?.innerWidth <= 576 ? "288px" : "100%"}}
              onClick={async () => {
                if (service?.link) {
                  navigate(service?.link)
                }

              }}>
              <div className="col-lg-5 col-md-4 col-sm-5 col-6  p-0">
                <div className="img_card">
                  <Image src={service.img} alt={service.title} />
                </div>
              </div>
              <div className="col-sm-7 col-6  d-flex align-items-center px-sm-3 pe-0 ps-2 mt-sm-0 mt-2">
                <div className="w-100">
                  <h3 className="m-0">{service.title}</h3>
                  <p>{service.desc}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default OurService;
