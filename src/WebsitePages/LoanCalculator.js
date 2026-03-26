import React from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Banner from '../Component/LoanCaluculator/HomePage/Banner'
import Footer from '../Component/NavBarFooter/Footer'
import Details from '../Component/LoanCaluculator/HomePage/Details'
import FAQ from '../Component/PropertyIndex/FAQS'
import { Helmet } from 'react-helmet'

function LoanCalculator() {

    const faqData = [
        {
            question: "How can I calculate my monthly home loan payments?",
            answer:
                "You can easily calculate your monthly installments by entering your loan amount, repayment period, and interest rate in the Loan Calculator. The tool instantly shows your estimated monthly payment and total loan cost."
        },
        {
            question: "How does the Loan Calculator work?",
            answer:
                "The Pakistan Property Loan Calculator estimates your monthly property loan installments based on the loan amount, repayment period, and applicable interest rate. It helps you compare options from different banks and choose a plan that fits your budget."
        },
        {
            question: "What factors affect property loan approval?",
            answer:
                "Banks in Pakistan evaluate income, job stability, credit history, and debt-to-equity ratio before approving a loan. Maintaining a steady income and good repayment record can increase your chances of qualifying for a property loan."
        },
    ];

    const para = "Find quick answers to loan and financing questions. Learn how the Loan Calculator works, understand loan terms, and get insights on eligibility and repayment before applying."



    return (
        <>
        <Helmet>
            <title>Property Loan Calculator Pakistan - Installment Check</title>
            <meta name="description" content="Use our loan calculator to check monthly installments, total loan cost and repayment plans. Compare property financing options from banks in Pakistan now!"/>
        </Helmet>
            <NavBar />
            <Banner />
            <div className="secondary-color">
                <div className="main-container">
                    <Details />
                </div>
                <FAQ faqData={faqData} para={para} />
            </div>
            <div className="main-container">
                <Footer />
            </div>
        </>
    )
}

export default LoanCalculator
