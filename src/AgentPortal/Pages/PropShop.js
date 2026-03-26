import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Context/ContextProvider';
import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import notFound from '../Asset/product-not-found.svg'
import Image from 'next/image';
function PropShop() {

    const { getProductList, addToCart, loading, formatPriceWithCommas } =
        useAuth();
    const [list, setList] = useState();
    const [allcartData, setallCartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let result = await getProductList();
                if (result?.success) {
                    setList(result?.data?.data?.products);
                }
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
        fetchData();
        // eslint-disable-next-line
    }, []);

    const handleAddQuantity = (product) => {
        setallCartData((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.product_id === product.id
            );

            if (existingItem) {
                // agar product already cart me hai to uski quantity +1 karo
                return prevCart.map((item) =>
                    item.product_id === product.id
                        ? {
                            ...item,
                            product_quantity: item.product_quantity + 1,
                            product_price: item.product_price + product.price, // total price update
                        }
                        : item
                );
            } else {
                // agar cart me nai hai to naya add karo
                return [
                    ...prevCart,
                    {
                        product_id: product.id,
                        product_quantity: 1,
                        product_price: product.price,
                        price: product.price,
                        product_name: product.name,
                        product_type: product.type
                    },
                ];
            }
        });
    };

    const handleDecreaseQuantity = (product) => {
        setallCartData((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.product_id === product.id
            );

            if (!existingItem) return prevCart; // agar product cart me nahi hai

            // agar quantity 1 se zyada hai → kam karo
            if (existingItem.product_quantity > 1) {
                return prevCart.map((item) =>
                    item.product_id === product.id
                        ? {
                            ...item,
                            product_quantity: item.product_quantity - 1,
                            product_price: item.product_price - product.price,
                        }
                        : item
                );
            }

            // agar quantity 1 thi ya 0 ho gayi → cart se hata do
            return prevCart.filter((item) => item.product_id !== product.id);
        });
    };
    const subTotal = (data) => {

        let amount = 0
        data?.map((item) => {
            amount = amount + item.product_price
        })
        return amount
    }
    const navigate = useNavigate()
    const checkout = async () => {
        try {
            let result = await addToCart({
                cart_key: "sdsa988239832hqudhas",
                products: allcartData
            });
            if (result?.success) {
                navigate('/agent-portal/checkout')
            }
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    }

    return (
        <div className='propshop-main h-100 portal-page-container'>
            <div className='d-flex justify-content-between'>
                <div>
                    <h3 className='page-portal-heading m-0'>PropShop</h3>
                    <p className='portal-breadCrums m-0'>Home - <span>Buy Products</span></p>

                </div>

            </div>
            <div className='propshop_mian row mx-0 mt-3' style={{ gap: "20px 0" }}>
                <div className='col-xl-8 col-lg-7 ps-0 pe-xl-3 pe-lg-2 pe-0 h-lg-100'>
                    <div className='content '>
                        <h4 className='m-0'>Listings</h4>
                        {loading ?
                            <div className='placeholder-glow'>
                                <div className='placeholder w-100 mb-2' style={{ height: "60px" }} />
                                <div className='placeholder w-100 mb-2' style={{ height: "60px" }} />
                                <div className='placeholder w-100 mb-2' style={{ height: "60px" }} />
                            </div> : <>
                                {list?.map((item) => {
                                    if (item?.type === "listings") {
                                        const cartItem = allcartData.find(
                                            (cartItem) => cartItem.product_id === item?.id
                                        );

                                        return (
                                            <div
                                                className="w-100 table_data_item flex-sm-row flex-column" style={{ gap: "20px" }}
                                                key={item?.id}
                                            >
                                                <div style={{ gap: "20px" }} className="data_pro d-flex align-items-sm-center">
                                                    <div className="img">
                                                        <Image src={item?.image} alt="..." />
                                                    </div>
                                                    <div className="d-flex justify-content-center flex-column mx-2 ps-sm-1">
                                                        <h6 className="p-0 m-0">
                                                            {item?.name} ( Rs, {formatPriceWithCommas(item?.price)})
                                                        </h6>
                                                        <span>
                                                            {item?.description}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='btn-container'>
                                                    <button onClick={() => handleDecreaseQuantity(item)} disabled={cartItem?.product_quantity && cartItem?.product_quantity > 0 ? false : true} className={cartItem?.product_quantity && cartItem?.product_quantity > 0 ? "active" : ""}>
                                                        <FaMinus />
                                                    </button>
                                                    <input readOnly value={cartItem?.product_quantity ? cartItem?.product_quantity : 0} />
                                                    <button onClick={() => handleAddQuantity(item)} className='active'>
                                                        <FaPlus />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </>
                        }
                        <h4 style={{ marginTop: "14px" }} className='mb-0'>Credits <span>(Only applicable on already posted listings)</span></h4>
                        {loading ?
                            <div className='placeholder-glow'>
                                <div className='placeholder w-100 mb-2' style={{ height: "60px" }} />
                                <div className='placeholder w-100 mb-2' style={{ height: "60px" }} />
                                <div className='placeholder w-100 mb-2' style={{ height: "60px" }} />
                            </div> : <>
                                {list?.map((item) => {
                                    if (item?.type === "credits") {

                                        const cartItem = allcartData.find(
                                            (cartItem) => cartItem.product_id === item?.id
                                        );

                                        return (
                                            <div
                                                className="w-100 table_data_item flex-sm-row flex-column" style={{ gap: "20px" }}
                                                key={item?.id}
                                            >
                                                <div style={{ gap: "20px" }} className="data_pro d-flex align-items-sm-center">
                                                    <div className="img">
                                                        <Image src={item?.image} alt="..." />
                                                    </div>
                                                    <div className="d-flex justify-content-center flex-column mx-2 ps-sm-1">
                                                        <h6 className="p-0 m-0">
                                                            {item?.name} ( Rs, {formatPriceWithCommas(item?.price)})
                                                        </h6>
                                                        <span>
                                                            {item?.description}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='btn-container'>
                                                    <button onClick={() => handleDecreaseQuantity(item)} disabled={cartItem?.product_quantity && cartItem?.product_quantity > 0 ? false : true} className={cartItem?.product_quantity && cartItem?.product_quantity > 0 ? "active" : ""}>
                                                        <FaMinus />
                                                    </button>
                                                    <input readOnly value={cartItem?.product_quantity ? cartItem?.product_quantity : 0} />
                                                    <button onClick={() => handleAddQuantity(item)} className='active'>
                                                        <FaPlus />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </>}

                    </div>
                </div>
                <div className='col-xl-4 col-lg-5 pe-0 ps-xl-3 ps-lg-2 ps-0 h-lg-100 pb-lg-0 pb-3'>
                    <div className='content '>
                        <h4>Order Summary</h4>
                        {allcartData?.length > 0 ?
                            <>
                                <div className='cart_list_main'>
                                    {allcartData?.map((item) => {
                                        return (
                                            <div
                                                className="w-100 cart_data_item"
                                                key={item?.id}
                                            >
                                                <div style={{ gap: "20px" }} className="data_pro d-flex align-items-center justify-content-between flex-wrap">


                                                    <h6 className="p-0 m-0">
                                                        {item?.product_name}
                                                    </h6>
                                                    <div className='price'>Rs, {formatPriceWithCommas(item?.product_price)}</div>
                                                    <div className='btn-container'>
                                                        <button onClick={() => handleDecreaseQuantity({
                                                            id: item?.product_id,
                                                            name: item?.product_name,
                                                            price: item?.price,
                                                            type: item?.product_type

                                                        })} disabled={item?.product_quantity && item?.product_quantity > 0 ? false : true} className={item?.product_quantity && item?.product_quantity > 0 ? "active" : ""}>
                                                            <FaMinus className='m-0 p-0' />
                                                        </button>
                                                        <input readOnly value={item?.product_quantity ? item?.product_quantity : 0} />
                                                        <button onClick={() => handleAddQuantity({
                                                            id: item?.product_id,
                                                            name: item?.product_name,
                                                            price: item?.price,
                                                            type: item?.product_type

                                                        })} className='active'>
                                                            <FaPlus />
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        )
                                    })}
                                </div>
                                <hr className='m-0' />
                                <div className='sub_total'>
                                    <h5>Subtotal</h5>
                                    <h5>Rs, {formatPriceWithCommas(subTotal(allcartData))}</h5>
                                </div>
                                <div onClick={checkout} className='checkout_btn'>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M2 8.50488H22" stroke="white" strokeWidth="1.5" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M6 16.5049H8" stroke="white" strokeWidth="1.5" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10.5 16.5049H14.5" stroke="white" strokeWidth="1.5" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M6.44 3.50488H17.55C21.11 3.50488 22 4.38488 22 7.89488V16.1049C22 19.6149 21.11 20.4949 17.56 20.4949H6.44C2.89 20.5049 2 19.6249 2 16.1149V7.89488C2 4.38488 2.89 3.50488 6.44 3.50488Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className='checkout'>Checkout</span>
                                    </div>
                                    <h6 className='mb-0'>Rs, {formatPriceWithCommas(subTotal(allcartData))}</h6>
                                </div>
                            </> :
                            <div className='d-flex justify-content-center align-items-center h-75 flex-column'>
                                <Image src={notFound} alt='...' />
                                <p className='mb-0 nor-found'>No Product</p>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default PropShop