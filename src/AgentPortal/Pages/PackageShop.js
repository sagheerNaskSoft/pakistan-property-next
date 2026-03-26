import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Context/ContextProvider';
import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import notFound from '../Asset/product-not-found.svg'
import defaultPackageImage from '../Asset/pricing.svg'
import Image from 'next/image';
function PackageShop() {

    const { getPackagesAgency, addToCart, loading, formatPriceWithCommas } =
        useAuth();
    const [planList, setPlanList] = useState();
    const [allcartData, setallCartData] = useState([]);
    const location = useLocation();
    const packageIdFromRoute = location?.state?.packageId;

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                let result = await getPackagesAgency();
                if (result?.success) {
                    let product = result?.data?.data?.packages;
                    setPlanList(product)
                }
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
        fetchPackage();
        // eslint-disable-next-line
    }, []);

    // Auto-add package to cart when coming from dashboard
    useEffect(() => {
        if (packageIdFromRoute && planList && planList.length > 0) {
            const packageToAdd = planList.find(p => p.id === packageIdFromRoute && p.type === "paid");
            if (packageToAdd) {
                const price = packageToAdd?.package_price?.price || 0;
                setallCartData((prevCart) => {
                    const existingItem = prevCart.find(
                        (item) => item.package_id === packageToAdd.id
                    );
                    console.log(existingItem);
                    if (!existingItem) {
                        // Only add if not already in cart
                        console.log("hello");

                        return [
                            ...prevCart,
                            {
                                package_id: packageToAdd.id,
                                product_quantity: 1,
                                type: "package",
                                package_price: price,
                                price: price,
                                package_name: packageToAdd.name,
                            },
                        ];
                    }
                    return prevCart;
                });
            }
        }
        // eslint-disable-next-line
    }, [packageIdFromRoute, planList]);

    const handleAddQuantity = (product) => {
        const price = product?.package_price?.price || 0;
        setallCartData((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.package_id === product.id
            );

            if (existingItem) {
                // agar product already cart me hai to uski quantity +1 karo
                return prevCart.map((item) =>
                    item.package_id === product.id
                        ? {
                            ...item,
                            product_quantity: item.product_quantity + 1,
                            package_price: item.package_price + price,
                            price: item.price, // total price update
                        }
                        : item
                );
            } else {
                // agar cart me nai hai to naya add karo
                return [
                    ...prevCart,
                    {
                        package_id: product.id,
                        product_quantity: 1,
                        package_price: price,
                        price: price,
                        package_name: product.name,
                        type: "package"
                    },
                ];
            }
        });
    };


    const handleDecreaseQuantity = (product) => {

        const price = product?.package_price?.price || 0;
        setallCartData((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.package_id === product.id
            );

            if (!existingItem) return prevCart; // agar product cart me nahi hai

            // agar quantity 1 se zyada hai → kam karo
            if (existingItem.product_quantity > 1) {
                return prevCart.map((item) =>
                    item.package_id === product.id
                        ? {
                            ...item,
                            product_quantity: item.product_quantity - 1,
                            package_price: item.package_price - price,
                        }
                        : item
                );
            }

            // agar quantity 1 thi ya 0 ho gayi → cart se hata do
            return prevCart.filter((item) => item.package_id !== product.id);
        });
    };
    const subTotal = (data) => {
        let amount = 0
        data?.map((item) => {
            amount = amount + item.package_price
        })
        return amount
    }
    const navigate = useNavigate()
    const checkout = async () => {
        try {
            // Only send packages (type === "paid") to checkout, filter out quota values
            const packageCartData = allcartData.filter(item => {
                const product = planList?.find(p => p.id === item?.package_id);
                return product && product.type === "paid";
            });

            let result = await addToCart({
                cart_key: "sdsa988239832hqudhas",
                products: packageCartData
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
                    <h3 className='page-portal-heading m-0'>PackageShop</h3>
                    <p className='portal-breadCrums m-0'>Home - <span>Buy Packages</span></p>

                </div>

            </div>
            <div className='propshop_mian row mx-0 mt-3' style={{ gap: "20px 0" }}>
                <div className='col-xl-8 col-lg-7 ps-0 pe-xl-3 pe-lg-2 pe-0 h-100'>
                    <div className='content '>
                        <h4 className='m-0'>Packages</h4>
                        {loading ?
                            <div className='placeholder-glow'>
                                <div className='placeholder w-100 mb-2' style={{ height: "60px" }} />
                                <div className='placeholder w-100 mb-2' style={{ height: "60px" }} />
                                <div className='placeholder w-100 mb-2' style={{ height: "60px" }} />
                            </div> : <>
                                {planList?.filter(item => item?.type === "paid")?.length > 0 ? (
                                    planList?.map((item) => {
                                        if (item?.type === "paid") {
                                            const cartItem = allcartData.find(
                                                (cartItem) => cartItem.package_id === item?.id
                                            );
                                            const price = item?.package_price?.price || 0;

                                            return (
                                                <div
                                                    className="w-100 table_data_item flex-sm-row flex-column" style={{ gap: "20px" }}
                                                    key={item?.id}
                                                >
                                                    <div style={{ gap: "20px" }} className="data_pro d-flex align-items-sm-center flex-sm-row flex-column w-100">
                                                        <div className="d-flex align-items-center" style={{ gap: "20px" }}>
                                                            <div className="img" style={{ minWidth: "120px", width: "120px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#F4F4F4", borderRadius: "12px", overflow: "hidden", flexShrink: 0 }}>
                                                                <Image
                                                                    src={item?.image || defaultPackageImage}
                                                                    alt={item?.name || "Package"}
                                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                                    onError={(e) => {
                                                                        e.target.src = defaultPackageImage;
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className='d-sm-none'>
                                                                <h6 className="p-0 m-0 mb-2">
                                                                    {item?.name}
                                                                </h6>
                                                                <div className="mb-2" style={{ fontSize: "18px", fontWeight: "600", color: "#447158" }}>
                                                                    Rs, {formatPriceWithCommas(price)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-center flex-column mx-2 ps-sm-1 flex-grow-1">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                           <div>
                                                           <h6 className="p-0 m-0 mb-2 d-sm-flex d-none">
                                                                {item?.name}
                                                            </h6>
                                                            <div className="mb-2 d-sm-flex d-none" style={{ fontSize: "18px", fontWeight: "600", color: "#447158" }}>
                                                                Rs, {formatPriceWithCommas(price)}
                                                            </div>
                                                            {item?.description && (
                                                                <span className="mb-2 d-block">
                                                                    {item?.description}
                                                                </span>
                                                            )}
                                                           </div>
                                                            <div className='btn-container' style={{ flexShrink: 0 }}>
                                                                <button onClick={() => handleDecreaseQuantity(item)} disabled={cartItem?.product_quantity && cartItem?.product_quantity > 0 ? false : true} className={cartItem?.product_quantity && cartItem?.product_quantity > 0 ? "active" : ""}>
                                                                    <FaMinus />
                                                                </button>
                                                                <input readOnly value={cartItem?.product_quantity ? cartItem?.product_quantity : 0} />
                                                                <button onClick={() => handleAddQuantity(item)} className='active'>
                                                                    <FaPlus />
                                                                </button>
                                                            </div>
                                                            </div>
                                                            {item?.offers && item?.offers.length > 0 && (
                                                                <div className="mt-2" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                                                    {item.offers.slice(0, 4).map((offer, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className={`offer-tag tag-${idx + 1}`}
                                                                        >
                                                                            {offer?.label}: {offer?.pivot?.value || "N/A"}
                                                                        </span>
                                                                    ))}
                                                                    {item.offers.length > 4 && (
                                                                        <span style={{
                                                                            padding: "4px 12px",
                                                                            backgroundColor: "#DCDCDC",
                                                                            borderRadius: "6px",
                                                                            fontSize: "12px",
                                                                            color: "#555",
                                                                            fontWeight: "500 "
                                                                        }}>
                                                                            +{item.offers.length - 3} more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                </div>
                                            );
                                        }
                                        return null;
                                    })
                                ) : (
                                    <div className='d-flex justify-content-center align-items-center flex-column' style={{ padding: "40px 20px", minHeight: "200px" }}>
                                        <Image src={notFound} alt='No packages found' style={{ width: "120px", height: "120px", marginBottom: "16px", opacity: 0.6 }} />
                                        <p className='mb-0' style={{ color: "#737678", fontSize: "16px" }}>No Packages Available</p>
                                    </div>
                                )}
                            </>
                        }

                    </div>
                </div>
                <div className='col-xl-4 col-lg-5 pe-0 ps-xl-3 ps-lg-2 ps-0 h-lg-100 pb-lg-0 pb-3'>
                    <div className='content '>
                        <h4>Order Summary</h4>
                        {allcartData?.filter(item => {
                            // Only show items that are packages (type === "paid") from planList
                            const product = planList?.find(p => p.id === item?.package_id);
                            console.log("hello1");
                            console.log(product);

                            return product && product.type === "paid";
                        }).length > 0 ?
                            <>
                                <div className='cart_list_main'>
                                    {allcartData?.filter(item => {
                                        // Only show items that are packages (type === "paid") from planList
                                        const product = planList?.find(p => p.id === item?.package_id);
                                        console.log("hello");

                                        return product && product.type === "paid";
                                    }).map((item) => {
                                        return (
                                            <div
                                                className="w-100 cart_data_item"
                                                key={item?.id || item?.package_id}
                                            >
                                                <div style={{ gap: "20px" }} className="data_pro d-flex align-items-center justify-content-between flex-wrap">


                                                    <h6 className="p-0 m-0">
                                                        {item?.package_name}
                                                    </h6>
                                                    <div className='price'>Rs, {formatPriceWithCommas(item?.price)}</div>
                                                    <div className='btn-container'>
                                                        <button onClick={() => {
                                                            const product = planList?.find(p => p.id === item?.package_id);
                                                            console.log(product);

                                                            if (product) {
                                                                handleDecreaseQuantity(product);
                                                            }
                                                        }} disabled={item?.product_quantity && item?.product_quantity > 0 ? false : true} className={item?.product_quantity && item?.product_quantity > 0 ? "active" : ""}>
                                                            <FaMinus className='m-0 p-0' />
                                                        </button>
                                                        <input readOnly value={item?.product_quantity ? item?.product_quantity : 0} />
                                                        <button onClick={() => {
                                                            const product = planList?.find(p => p.id === item?.package_id);
                                                            console.log(product);

                                                            if (product) {
                                                                handleAddQuantity(product);
                                                            }
                                                        }} className='active'>
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
                                    <h5>Rs, {formatPriceWithCommas(subTotal(allcartData.filter(item => {
                                        const product = planList?.find(p => p.id === item?.package_id);
                                        return product && product.type === "paid";
                                    })))}</h5>
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
                                    <h6 className='mb-0'>Rs, {formatPriceWithCommas(subTotal(allcartData.filter(item => {
                                        const product = planList?.find(p => p.id === item?.package_id);
                                        return product && product.type === "paid";
                                    })))}</h6>
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

export default PackageShop