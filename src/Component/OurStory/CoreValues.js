import React from "react";

function IconTrust() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
                d="M40 25.9999C40 35.9999 33 40.9999 24.68 43.8999C24.2443 44.0476 23.7711 44.0405 23.34 43.8799C15 40.9999 8 35.9999 8 25.9999V11.9999C8 11.4695 8.21071 10.9608 8.58579 10.5857C8.96086 10.2106 9.46957 9.99992 10 9.99992C14 9.99992 19 7.59992 22.48 4.55992C22.9037 4.19792 23.4427 3.99902 24 3.99902C24.5573 3.99902 25.0963 4.19792 25.52 4.55992C29.02 7.61992 34 9.99992 38 9.99992C38.5304 9.99992 39.0391 10.2106 39.4142 10.5857C39.7893 10.9608 40 11.4695 40 11.9999V25.9999Z"
                stroke="#F54900" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
            />
        </svg>
    );
}

// A few simple inline icons to use for other cards (colors can be adjusted)
const IconIntegrity = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="18" stroke="#10B981" strokeWidth="4" />
        <path d="M16 24l6 6 10-12" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconInnovation = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M30 28C30.4 26 31.4 24.6 33 23C35 21.2 36 18.6 36 16C36 12.8174 34.7357 9.76516 32.4853 7.51472C30.2348 5.26428 27.1826 4 24 4C20.8174 4 17.7652 5.26428 15.5147 7.51472C13.2643 9.76516 12 12.8174 12 16C12 18 12.4 20.4 15 23C16.4 24.4 17.6 26 18 28" stroke="#009689" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 36H30" stroke="#009689" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 44H28" stroke="#009689" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconCustomer = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="18" r="8" stroke="#F59E0B" strokeWidth="4" />
        <path d="M10 40c2.5-6 8-10 14-10s11.5 4 14 10" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
    </svg>
);
const IconExcellence = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 6l4.5 10 11 1.5-8 7.5 2 11-9.5-5.5L14.5 36l2-11-8-7.5 11-1.5L24 6z" stroke="#8B5CF6" strokeWidth="4" strokeLinejoin="round" />
    </svg>
);
const IconCollab = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M4 19.0001C4.00004 16.7745 4.67519 14.6012 5.93627 12.7674C7.19735 10.9336 8.98503 9.5254 11.0632 8.72888C13.1414 7.93236 15.4123 7.78497 17.576 8.30617C19.7397 8.82737 21.6944 9.99264 23.182 11.6481C23.2868 11.7601 23.4134 11.8494 23.5542 11.9105C23.6949 11.9715 23.8466 12.003 24 12.003C24.1534 12.003 24.3051 11.9715 24.4458 11.9105C24.5866 11.8494 24.7132 11.7601 24.818 11.6481C26.3009 9.98188 28.256 8.80682 30.4233 8.27928C32.5905 7.75175 34.867 7.89677 36.9497 8.69505C39.0325 9.49332 40.8228 10.907 42.0822 12.7479C43.3417 14.5888 44.0106 16.7696 44 19.0001C44 23.5801 41 27.0001 38 30.0001L27.016 40.6261C26.6433 41.0541 26.1839 41.3979 25.6681 41.6347C25.1523 41.8715 24.5921 41.9958 24.0246 41.9994C23.4571 42.003 22.8953 41.8858 22.3766 41.6555C21.8579 41.4253 21.3941 41.0873 21.016 40.6641L10 30.0001C7 27.0001 4 23.6001 4 19.0001Z" stroke="#F54900" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CORE_VALUES = [
    {
        title: "Building Trust",
        desc: "We believe strong relationships are built on honesty and reliability.",
        Icon: IconTrust,
    },
    {
        title: "Practicing Integrity",
        desc: "We stay true to our words and maintain fairness through every deal.",
        Icon: IconIntegrity,
    },
    {
        title: "Digital Progress",
        desc: "We constantly improve tools and ideas to make real estate smarter and simpler.",
        Icon: IconInnovation,
    },
];

export default function CoreValues() {
    return (
        <>
            <div className="core-values">
                <div className="main-container">
                    <h1>Core Values</h1>
                    <h4>
                    Focused on trust, integrity, and progress to deliver a smarter property solutions.
                    </h4>

                    <div className="row">
                        {CORE_VALUES.map(({ title, desc, Icon }, idx) => (
                            <div className="col-lg-4" key={idx}>
                                <div className="core-cards">
                                    <div className="core-svg">
                                        <Icon />
                                    </div>
                                    <div className="core-svg-heading">
                                        <h3>{title}</h3>
                                        <h4>
                                            {desc.split("<br/>").map((line, i) => (
                                                <React.Fragment key={i}>
                                                    {line}
                                                    {i < desc.split("<br/>").length - 1 && <br />}
                                                </React.Fragment>
                                            ))}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    );
}
