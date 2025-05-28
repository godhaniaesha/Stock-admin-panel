import React from 'react';
import '../styles/Z_styles.css';
import { Table } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6';
import { BsCheckAll } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";

function ListCoupons(props) {
    const coupons = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1612599316791-451087c7fe15",
            name: "Summer Special",
            category: "Seasonal",
            discount: "20%",
            code: "SUMMER20",
            startDate: "2024-05-01",
            endDate: "2024-06-30",
            status: "Active"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d",
            name: "Welcome Discount",
            category: "New Users",
            discount: "15%",
            code: "WELCOME15",
            startDate: "2024-04-01",
            endDate: "2024-12-31",
            status: "Active"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1607082349566-187342175e2f",
            name: "Flash Sale",
            category: "Limited Time",
            discount: "30%",
            code: "FLASH30",
            startDate: "2024-04-15",
            endDate: "2024-04-20",
            status: "Inactive"
        }
    ];

    return (
        <>
            <section className='Z_product_section mx-0 mx-lg-5 my-3'>
                <div className="Z_table_wrapper">
                    <div className="Z_table_header">
                        <h4>All Coupons List</h4>
                        <div className="Z_table_actions">
                            <button className="Z_add_product_btn">Add Coupon</button>
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
                                    <th>Coupon Details</th>
                                    <th>Discount</th>
                                    <th>Code</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.map((coupon) => (
                                    <tr key={coupon.id}>
                                        <td>
                                            <div className="Z_custom_checkbox">
                                                <input 
                                                    type="checkbox" 
                                                    id={`checkbox-${coupon.id}`} 
                                                    className="Z_checkbox_input" 
                                                />
                                                <label 
                                                    htmlFor={`checkbox-${coupon.id}`} 
                                                    className="Z_checkbox_label"
                                                ></label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="Z_product_info_cell">
                                                <img src={coupon.image} alt={coupon.name} className="Z_table_product_img" />
                                                <div>
                                                    <div className="Z_table_product_name">{coupon.name}</div>
                                                    <div className="Z_table_product_size">{coupon.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{coupon.discount}</td>
                                        <td><span className="Z_coupon_code">{coupon.code}</span></td>
                                        <td>{coupon.startDate}</td>
                                        <td>{coupon.endDate}</td>
                                        <td>
                                            <div >
                                                <span className={`Z_coupon_status d-flex align-items-center ${coupon.status.toLowerCase()}`}>
                                                {coupon.status === 'Active' ? (
                                                    <BsCheckAll className="me-1" size={14} />
                                                ) : (
                                                    <AiOutlineClose className="me-1" size={14} />
                                                )}
                                                {coupon.status}
                                                </span>
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

export default ListCoupons;