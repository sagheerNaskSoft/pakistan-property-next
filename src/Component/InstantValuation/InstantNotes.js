import React from "react";

// ✅ Your icons
const secure = (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M23.3332 15.1666C23.3332 21 19.2498 23.9166 14.3965 25.6083C14.1424 25.6944 13.8663 25.6903 13.6148 25.5966C8.74984 23.9166 4.6665 21 4.6665 15.1666V6.99995C4.6665 6.69054 4.78942 6.39379 5.00821 6.175C5.22701 5.9562 5.52375 5.83329 5.83317 5.83329C8.1665 5.83329 11.0832 4.43329 13.1132 2.65995C13.3603 2.44879 13.6747 2.33276 13.9998 2.33276C14.3249 2.33276 14.6393 2.44879 14.8865 2.65995C16.9282 4.44495 19.8332 5.83329 22.1665 5.83329C22.4759 5.83329 22.7727 5.9562 22.9915 6.175C23.2103 6.39379 23.3332 6.69054 23.3332 6.99995V15.1666Z" stroke="#2D2D2D" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const results = (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 7V14L18.6667 16.3333" stroke="#2D2D2D" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.0002 25.6666C20.4435 25.6666 25.6668 20.4432 25.6668 13.9999C25.6668 7.5566 20.4435 2.33325 14.0002 2.33325C7.55684 2.33325 2.3335 7.5566 2.3335 13.9999C2.3335 20.4432 7.55684 25.6666 14.0002 25.6666Z" stroke="#2D2D2D" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const verified = (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M18.0567 15.0383L19.8242 24.9853C19.844 25.1025 19.8276 25.2228 19.7771 25.3304C19.7266 25.4379 19.6445 25.5275 19.5418 25.5871C19.439 25.6467 19.3205 25.6735 19.2021 25.664C19.0837 25.6544 18.9711 25.609 18.8792 25.5337L14.7025 22.3988C14.5009 22.2482 14.256 22.1668 14.0043 22.1668C13.7526 22.1668 13.5077 22.2482 13.306 22.3988L9.12236 25.5325C9.03057 25.6077 8.91804 25.6531 8.79978 25.6626C8.68151 25.6722 8.56315 25.6455 8.46047 25.586C8.35779 25.5266 8.27569 25.4372 8.2251 25.3299C8.17452 25.2226 8.15787 25.1024 8.17736 24.9853L9.9437 15.0383" stroke="#2D2D2D" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 16.3333C17.866 16.3333 21 13.1992 21 9.33325C21 5.46726 17.866 2.33325 14 2.33325C10.134 2.33325 7 5.46726 7 9.33325C7 13.1992 10.134 16.3333 14 16.3333Z" stroke="#2D2D2D" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const accurate = (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14.0002 25.6666C20.4435 25.6666 25.6668 20.4432 25.6668 13.9999C25.6668 7.5566 20.4435 2.33325 14.0002 2.33325C7.55684 2.33325 2.3335 7.5566 2.3335 13.9999C2.3335 20.4432 7.55684 25.6666 14.0002 25.6666Z" stroke="#2D2D2D" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 21C17.866 21 21 17.866 21 14C21 10.134 17.866 7 14 7C10.134 7 7 10.134 7 14C7 17.866 10.134 21 14 21Z" stroke="#2D2D2D" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.9998 16.3334C15.2885 16.3334 16.3332 15.2887 16.3332 14.0001C16.3332 12.7114 15.2885 11.6667 13.9998 11.6667C12.7112 11.6667 11.6665 12.7114 11.6665 14.0001C11.6665 15.2887 12.7112 16.3334 13.9998 16.3334Z" stroke="#2D2D2D" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// ✅ Data array for mapping
const notesData = [
    {
        icon: secure,
        title: "Privacy Assured",
        para: "Clients’ property data stays secure.",
    },
    {
        icon: results,
        title: "Fast Results",
        para: "Get a detailed valuations Quickly.",
    },
    {
        icon: verified,
        title: "Verified Insights",
        para: "Experts tested & verified results.",
    },
    {
        icon: accurate,
        title: "Accurate Estimates",
        para: "98% align with market trends.",
    },
];

function InstantNotes() {
    return (
        <div className="instant-notes d-flex justify-content-between align-items-center gap-4 flex-wrap">
            <div className="main-container">
                <div className="box-container">
                    {notesData.map((data, index) => (
                        <div className="box d-flex" key={index}>
                            <div className="img-box">{data.icon}</div>
                            <div>
                                <div className="title fw-bold">{data.title}</div>
                                <div className="para text-muted small">{data.para}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default InstantNotes;
