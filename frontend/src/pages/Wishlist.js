import React, { useEffect, useState } from 'react';
import '../styles/Z_styles.css';
import { Table } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllWishlists, getWishlist, removeFromWishlist } from '../redux/slice/wishlist.slice';
import { IoMdCart } from 'react-icons/io';
import { addToCart, getCart } from '../redux/slice/cart.slice';
import { FaCaretDown } from 'react-icons/fa';
import { IMG_URL } from '../utils/baseUrl';
import { toast } from 'react-toastify';

function Wishlist() {
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();
    const { items: wishlistItems, loading, error } = useSelector((state) => state.wishlist);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [timeFilter, setTimeFilter] = useState('thisMonth');
    const handleTimeFilterChange = (e) => setTimeFilter(e.target.value);

    const filterWishlistByTime = (items) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return items.filter(item => {
            const itemDate = new Date(item.createdAt);
            const itemMonth = itemDate.getMonth();
            const itemYear = itemDate.getFullYear();

            switch (timeFilter) {
                case 'thisMonth':
                    return itemMonth === currentMonth && itemYear === currentYear;
                case 'lastMonth':
                    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                    return itemMonth === lastMonth && itemYear === lastMonthYear;
                case 'last3Months':
                    const threeMonthsAgo = new Date(now);
                    threeMonthsAgo.setMonth(now.getMonth() - 3);
                    return itemDate >= threeMonthsAgo;
                default:
                    return true;
            }
        });
    };

    const filteredWishlist = filterWishlistByTime(wishlistItems);

    console.log(wishlistItems, " wishlistItems");
    useEffect(() => {
        const userId = localStorage.getItem('user');
        if (userId) dispatch(getWishlist(userId));
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(removeFromWishlist(id));
    };

    if (loading) {
        return <div className="text-center p-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-5 text-danger">Error: {error}</div>;
    }
    // const handleMoveToCart = async (item) => {
    //     const userId = localStorage.getItem('user');
    //     if (!userId) return;

    //     // 1. Remove from wishlist
    //     await dispatch(removeFromWishlist(item._id));

    //     // 2. Add to cart (default quantity 1)
    //     await dispatch(addToCart({ userId, productId: item.productId._id, quantity: 1 }));

    //     // 3. Optionally refresh wishlist and cart
    //     dispatch(getWishlist(userId));
    //     // dispatch(getCart(userId));
    // };

    const handleMoveToCart = async (item) => {
        const userId = localStorage.getItem('user');
        if (!userId) return;

        try {
            const resultAction = await dispatch(addToCart({
                userId,
                productId: item.productId._id,
                quantity: 1
            }));
            console.log(addToCart.fulfilled.match(resultAction), "dfer");

            // Check if addToCart action was successful
            if (addToCart.fulfilled.match(resultAction)) {
                await dispatch(removeFromWishlist(item._id));
                await dispatch(getWishlist(userId));

                // Delay the toast slightly to ensure it doesn't get lost during re-render
                setTimeout(() => {
                    toast.success('Product added to cart successfully and removed from wishlist!');
                }, 10);
            }else {
                toast.error(resultAction?.error?.message || 'Failed to add product to cart!');
            }

        } catch (error) {
            toast.error('Something went wrong while moving to cart!');
            console.error(error);
        }
    };


    return (
        <>
            <ToastContainer />
            <section className={`Z_product_section ${isDarkMode ? 'd_dark' : 'd_light'} mx-lg-2 my-md-3`}>
                <div className="Z_table_wrapper">
                    <div className="Z_table_header">
                        <h4>My Wishlist</h4>
                        <div className='Z_select_wrapper'>
                            <select
                                className="Z_time_filter"
                                value={timeFilter}
                                onChange={handleTimeFilterChange}
                            >
                                <option value="thisMonth">This Month</option>
                                <option value="lastMonth">Last Month</option>
                                <option value="last3Months">Last 3 Months</option>
                            </select>
                            <div className="Z_select_caret"><FaCaretDown size={20} color='white' /></div>
                        </div>

                    </div>
                    <div className="Z_table_scroll_container">
                        <Table className="Z_product_table p-1">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="Z_custom_checkbox">
                                            <input type="checkbox" id="selectAll" className="Z_checkbox_input" />
                                            <label htmlFor="selectAll" className="Z_checkbox_label"></label>
                                        </div>
                                    </th>
                                    <th>Product Name & Size</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Category</th>

                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredWishlist?.map((item) => (
                                    // console.log(item.productId?.categoryId, "item")
                                    <tr key={item._id}>
                                        <td>
                                            <div className="Z_custom_checkbox">
                                                <input
                                                    type="checkbox"
                                                    id={`checkbox-${item._id}`}
                                                    className="Z_checkbox_input"
                                                />
                                                <label
                                                    htmlFor={`checkbox-${item._id}`}
                                                    className="Z_checkbox_label"
                                                ></label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="Z_product_info_cell">
                                                <img src={`${IMG_URL}${item.productId?.images[0]}`} alt={item.productId?.productName} className="Z_table_product_img" />
                                                <div>
                                                    <div className="Z_table_product_name">{item.productId?.productName}</div>
                                                    <div className="Z_table_product_size">Size: {item.productId?.size || 'Standard'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>${item.productId?.price}</td>
                                        <td>
                                            <div className="Z_stock_info">
                                                <div>{item.productId?.stock || 0} Items Left</div>
                                                <div className="Z_stock_sold">{item.productId?.sold || 0} Sold</div>
                                            </div>
                                        </td>
                                        <td>{item.productId?.categoryId?.title || 'No Category'}</td>

                                        <td>
                                            <div className="Z_action_buttons">
                                                <button className="Z_action_btn Z_view_btn" onClick={() => handleMoveToCart(item)}>
                                                    <IoMdCart size={22} />
                                                </button>
                                                {/* <button className="Z_action_btn Z_edit_btn">
                                                    <TbEdit size={22}/>
                                                </button> */}
                                                <button
                                                    className="Z_action_btn Z_delete_btn"
                                                    onClick={() => handleDelete(item._id)}
                                                >
                                                    <RiDeleteBin6Line size={22} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Wishlist;
