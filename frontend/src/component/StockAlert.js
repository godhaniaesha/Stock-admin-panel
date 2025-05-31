import React from 'react';
import '../styles/Z_styles.css';
import { Table } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useOutletContext } from 'react-router-dom';

function StockAlert(props) {
    const { isDarkMode } = useOutletContext();

    const lowStockProducts = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
            name: "Classic White Sneakers",
            size: "US 7, 8, 9, 10",
            price: "$95.00",
            stock: {
                left: 5,
                threshold: 10
            },
            category: "Footwear",
            status: "Critical"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
            name: "Leather Crossbody Bag",
            size: "Standard",
            price: "$149.99",
            stock: {
                left: 8,
                threshold: 15
            },
            category: "Accessories",
            status: "Warning"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a",
            name: "Denim Jacket",
            size: "S, M, L, XL",
            price: "$89.99",
            stock: {
                left: 3,
                threshold: 20
            },
            category: "Fashion",
            status: "Critical"
        }
    ];

    return (
        <>
            <section className={`Z_product_section mx-0 mx-lg-5 my-3 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
                <div className="Z_table_wrapper">
                    <div className="Z_table_header">
                        <h4>Low Stock Alert</h4>
                        <div className="Z_table_actions">
                            <select className="Z_time_filter">
                                <option>All Items</option>
                                <option>Critical Stock</option>
                                <option>Warning Stock</option>
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
                                    <th>Stock Status</th>
                                    <th>Category</th>
                                    <th>Alert Level</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockProducts.map((product) => (
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
                                                <div className="Z_stock_sold">Threshold: {product.stock.threshold}</div>
                                            </div>
                                        </td>
                                        <td>{product.category}</td>
                                        <td>
                                            <span className={`Z_order_status ${product.status.toLowerCase()}`}>
                                                {product.status}
                                            </span>
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

export default StockAlert;