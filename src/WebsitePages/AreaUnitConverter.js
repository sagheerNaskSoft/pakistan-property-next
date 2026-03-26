import React from "react";
import NavBar from "../Component/NavBarFooter/UpdatedNavbar";
import Bannner from "../Component/AreaUnitConverter/Bannner";
import Footer from "../Component/NavBarFooter/Footer";
import { Helmet } from "react-helmet";

const AreaUnitConverter = () => {


    return (
        <>
        <Helmet>
            <title>Pakistan Area Converter - Marla, Kanal, Sq Ft, Sq M</title>
            <meta name="description" content="Convert Marla, Kanal, Square Feet and Square Meters quickly with our accurate property area unit converter. Simple fast and ideal for buyers and investors."/>
        </Helmet>
            <NavBar />
           <div className="secondary-color pb-5">
           <Bannner />
           </div>
            <div className="main-container">

            <Footer/>
            </div>

        </>
    );
};

export default AreaUnitConverter;
