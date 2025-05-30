import React from 'react';
import '../styles/Z_styles.css';
import { Table } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

function SubcategoryList(props) {
    const { isDarkMode } = useOutletContext();
    const subcategories = [
        {
            id: 1,
            categoryName: "Fashion",
            image: "https://i.ibb.co/VpW4x5t/roll-up-t-shirt.png",
            name: "Fashion Men, Women & Kid's",
            description: "All types of fashion clothing for men, women and kids"
        },
        {
            id: 2,
            categoryName: "Accessories",
            image: "https://i.ibb.co/CtqLGfZ/green-bag.png",
            name: "Women Hand Bag",
            description: "Stylish hand bags for women"
        },
        {
            id: 3,
            categoryName: "Accessories",
            image: "https://i.ibb.co/TRw8qzb/black-cap.png",
            name: "Cap and Hat",
            description: "Trendy caps and hats collection"
        },
        {
            id: 4,
            categoryName: "Electronics",
            image: "https://i.ibb.co/9ZXPN8n/headphone.png",
            name: "Electronics Headphone",
            description: "High-quality audio headphones"
        },
        {
            id: 5,
            categoryName: "Footwear",
            image: "https://i.ibb.co/QJfzwXx/shoes.png",
            name: "Foot Wares",
            description: "Comfortable and stylish footwear"
        },
        {
            id: 6,
            categoryName: "Accessories",
            image: "https://i.ibb.co/Lx6zw4v/wallet.png",
            name: "Wallet Categories",
            description: "Premium quality wallets"
        }
    ];

    return (
        <>
            <section className={`Z_product_section w-100 mx-0 mx-lg-5 my-3 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
                <div className="Z_table_wrapper">
                    <div className="Z_table_header">
                        <h4>All Subcategory List</h4>
                        <div className="Z_table_actions">
                            <button className="Z_add_product_btn">Add Subcategory</button>
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
                                    <th>Subcategory ID</th>
                                    <th>Category Name</th>
                                    <th>Subcategory Details</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subcategories.map((subcategory) => (
                                    <tr key={subcategory.id}>
                                        <td>
                                            <div className="Z_custom_checkbox">
                                                <input
                                                    type="checkbox"
                                                    id={`checkbox-${subcategory.id}`}
                                                    className="Z_checkbox_input"
                                                />
                                                <label
                                                    htmlFor={`checkbox-${subcategory.id}`}
                                                    className="Z_checkbox_label"
                                                ></label>
                                            </div>
                                        </td>
                                        <td>#{subcategory.id}</td>
                                        <td>
                                            <div className="Z_category_name_cell">
                                                <div className="Z_table_product_name">{subcategory.categoryName}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="Z_subcategory_details_cell">
                                                <img 
                                                    src={subcategory.image} 
                                                    alt={subcategory.name} 
                                                    className="Z_table_subcategory_img" 
                                                    width={60} 
                                                    height={60} 
                                                />
                                                <div className="Z_table_subcategory_name">{subcategory.name}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="Z_category_description_cell">
                                                <div className="Z_table_product_description">{subcategory.description}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="Z_action_buttons">
                                                <button className="Z_action_btn Z_view_btn">
                                                    <TbEye size={22} />
                                                </button>
                                                <button className="Z_action_btn Z_edit_btn">
                                                    <TbEdit size={22} />
                                                </button>
                                                <button className="Z_action_btn Z_delete_btn">
                                                    <RiDeleteBin6Line size={22} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))} 
                            </tbody>
                        </Table>
                    </div>
                    <div className="Z_pagination d-flex justify-content-end align-items-center mt-4">
                        <button className="Z_page_btn" disabled>
                            <FaAngleLeft />
                        </button>
                        <button className="Z_page_btn active">1</button>
                        <button className="Z_page_btn">2</button>
                        <button className="Z_page_btn">3</button>
                        <button className="Z_page_btn">
                            <FaAngleRight />
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default SubcategoryList;