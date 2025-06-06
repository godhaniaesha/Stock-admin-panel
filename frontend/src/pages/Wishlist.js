import React, { useEffect } from 'react';
import '../styles/Z_styles.css';
import { Table } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllWishlists, removeFromWishlist } from '../redux/slice/wishlist.slice';

function Wishlist() {
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();
    const { items: wishlistItems, loading, error } = useSelector((state) => state.wishlist);

    useEffect(() => {
        dispatch(getAllWishlists());
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

    return (
        <>
            <section className={`Z_product_section w-100 ${isDarkMode ? 'd_dark' : 'd_light'} mx-5 my-3`}>
                <div className="Z_table_wrapper">
                    <div className="Z_table_header">
                        <h4>My Wishlist</h4>
                        <div className="Z_table_actions">
                            <select className="Z_time_filter">
                                <option>This Month</option>
                                <option>Last Month</option>
                                <option>Last 3 Months</option>
                            </select>
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
                                    <th>Rating</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wishlistItems?.map((item) => (
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
                                                <img src={item.productId?.images?.[0] || 'https://via.placeholder.com/400x400'} alt={item.productId?.productName} className="Z_table_product_img" />
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
                                            <div className="Z_rating_cell">
                                                <div className="Z_rating_wrapper">
                                                    <span className="Z_rating_star">★</span>
                                                    <span className="Z_rating_value">{item.productId?.rating || 0}</span>
                                                    <span className="Z_review_count">{item.productId?.reviews || 0} Review</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="Z_action_buttons">
                                                <button className="Z_action_btn Z_view_btn">
                                                    <TbEye size={22}/>
                                                </button>
                                                <button className="Z_action_btn Z_edit_btn">
                                                    <TbEdit size={22}/>
                                                </button>
                                                <button 
                                                    className="Z_action_btn Z_delete_btn"
                                                    onClick={() => handleDelete(item._id)}
                                                >
                                                    <RiDeleteBin6Line size={22}/>
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
