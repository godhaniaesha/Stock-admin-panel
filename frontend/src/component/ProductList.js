import React from 'react';
import '../styles/Z_styles.css';
import { Table } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';

function ProductList(props) {
    const products = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
            name: "Classic White Sneakers",
            size: "US 7, 8, 9, 10",
            price: "$95.00",
            stock: {
                left: 324,
                sold: 178
            },
            category: "Footwear",
            rating: 4.7,
            reviews: 89
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
            name: "Leather Crossbody Bag",
            size: "Standard",
            price: "$149.99",
            stock: {
                left: 156,
                sold: 243
            },
            category: "Accessories",
            rating: 4.8,
            reviews: 167
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a",
            name: "Denim Jacket",
            size: "S, M, L, XL",
            price: "$89.99",
            stock: {
                left: 428,
                sold: 312
            },
            category: "Fashion",
            rating: 4.5,
            reviews: 234
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
            name: "Summer Floral Dress",
            size: "XS, S, M, L",
            price: "$65.00",
            stock: {
                left: 245,
                sold: 189
            },
            category: "Fashion",
            rating: 4.6,
            reviews: 145
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f",
            name: "Smart Watch Pro",
            size: "One Size",
            price: "$299.99",
            stock: {
                left: 89,
                sold: 411
            },
            category: "Electronics",
            rating: 4.9,
            reviews: 328
        }
    ];

    return (
        <>
            <section className='Z_product_section mx-0 mx-lg-5 my-3'>
                <div className="Z_table_wrapper">
                    <div className="Z_table_header">
                        <h4>All Product List</h4>
                        <div className="Z_table_actions">
                            <button className="Z_add_product_btn">Add Product</button>
                            <select className="Z_time_filter">
                                <option>This Month</option>
                                <option>Last Month</option>
                                <option>Last 3 Months</option>
                            </select>
                        </div>
                    </div>
                    <div className="Z_table_scroll_container">
                        <Table className="Z_product_table">
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
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="Z_custom_checkbox">
                                                <input 
                                                    type="checkbox" 
                                                    id={`checkbox-${product.id}`} 
                                                    className="Z_checkbox_input" 
                                                />
                                                <label 
                                                    htmlFor={`checkbox-${product.id}`} 
                                                    className="Z_checkbox_label"
                                                ></label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="Z_product_info_cell">
                                                <img src={product.image} alt={product.name} className="Z_table_product_img" />
                                                <div>
                                                    <div className="Z_table_product_name">{product.name}</div>
                                                    <div className="Z_table_product_size">Size: {product.size}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{product.price}</td>
                                        <td>
                                            <div className="Z_stock_info">
                                                <div>{product.stock.left} Items Left</div>
                                                <div className="Z_stock_sold">{product.stock.sold} Sold</div>
                                            </div>
                                        </td>
                                        <td>{product.category}</td>
                                        <td>
                                            <div className="Z_rating_cell">
                                                <div className="Z_rating_wrapper">
                                                    <span className="Z_rating_star">★</span>
                                                    <span className="Z_rating_value">{product.rating}</span>
                                                    <span className="Z_review_count">{product.reviews} Review</span>
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
                                                <button className="Z_action_btn Z_delete_btn">
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

export default ProductList;