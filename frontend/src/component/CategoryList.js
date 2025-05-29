import React from 'react';
import '../styles/Z_styles.css';
import { Table } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';

function CategoryList(props) {
    const categories = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f",
            name: "Electronics",
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a",
            name: "Fashion",
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
            name: "Footwear",
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
            name: "Accessories",
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
            name: "Beauty & Health",
        }
    ];

    return (
        <>
            <section className='Z_product_section  mx-0 mx-lg-5 my-3'>
                <div className="Z_table_wrapper">
                    <div className="Z_table_header">
                        <h4>All Category List</h4>
                        <div className="Z_table_actions">
                            <button className="Z_add_product_btn">Add Category</button>
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
                                    <th>Category ID</th>
                                    <th>Category Image</th>
                                    <th>Category Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>
                                            <div className="Z_custom_checkbox">
                                                <input 
                                                    type="checkbox" 
                                                    id={`checkbox-${category.id}`} 
                                                    className="Z_checkbox_input" 
                                                />
                                                <label 
                                                    htmlFor={`checkbox-${category.id}`} 
                                                    className="Z_checkbox_label"
                                                ></label>
                                            </div>
                                        </td>
                                        <td>#{category.id}</td>
                                        <td>
                                            <div className="Z_category_img_cell">
                                                <img src={category.image} alt={category.name} className="Z_table_product_img" />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="Z_category_name_cell">
                                                <div className="Z_table_product_name">{category.name}</div>
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

export default CategoryList;