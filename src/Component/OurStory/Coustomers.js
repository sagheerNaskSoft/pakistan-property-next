import React from "react";

const CUSTOMERS_DATA = [
    { count: "2M+", label: "Active Listings" },
    { count: "500K+", label: "Satisfied Clients" },
    { count: "15+", label: " Cities Connected" },
    { count: "10K+", label: "Trusted Agents" },
];

function Coustomers() {
    return (
        <>
            <div className="happy-coustomers">
                <div className="main-container">
                    <div className="coustomer-row">
                        {CUSTOMERS_DATA.map((item, index) => (
                            <div className="coustomer-card" key={index}>
                                <h2>{item.count}</h2>
                                <h4>{item.label}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Coustomers;
