import banner from '../../../Asset/Property Index/loanProgram.jpg'
import bank from '../../../Asset/Property Index/bank-img.svg'
import BreadCrumb from '../../Metiral/BreadCrumb';
import Image from 'next/image';
function Details() {

    const imgArray = [bank];

    return (
        <>
            <div className="loan-detail-side">
            <div className="d-sm-block d-none">
            <BreadCrumb items={["Home", "Loan Calculator"]} paths={["/"]} />
            </div>
                <div className="loan-banner">
                    <Image src={banner} alt="" />
                </div>
                <div className="banking-partners">
                    <div className="title">
                        Banking Partners
                    </div>
                    <div className="bank-img-container">
                        {imgArray?.map((item) => (
                            <div className="img"><Image src={item} alt="" /></div>
                        ))}
                    </div>
                </div>
                <div className="about-box">
                    <div className="title">About Loan Calculator</div>
                    <div className="para">Owning a property in Pakistan is a dream for many people. Buying property requires careful planning, savings, and the right information; that’s where our Loan Calculator helps. <br /> <br />
                        At Pakistan Property, we make it simple for you to understand your property financing options. Whether you are buying your first property or investing in a new one, our easy-to-use tool helps you calculate your loan amount, monthly installment, and repayment plan in just a minute. <br /> <br />
                        There are several property loan options in Pakistan offered by top banks, and choosing the right one can be confusing. With our loan calculator, you can compare different loan plans, check your loan eligibility, and estimate how much you can afford before applying for a property loan. <br /> <br />
                        When applying for property financing, banks usually review your income, job stability, credit history, and repayment capacity. Having a clear idea of your budget helps you apply confidently and plan better for the future. <br /> <br />
                        Use the Pakistan Property Loan Calculator to manage your loan planning wisely, apply with confidence, and move one step closer to owning your dream property with ease and peace of mind. <br /> <br />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Details
