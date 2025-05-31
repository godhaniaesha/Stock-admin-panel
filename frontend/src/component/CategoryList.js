import React, { useEffect } from 'react';
import '../styles/Z_styles.css';
import { Table } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/slice/category.slice';
import { useOutletContext } from 'react-router-dom';

const CategoryList = () => {
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();
    const { categories, isLoading, error } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    if (isLoading) {
        return <div>Loading categories...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <section className={`Z_product_section mx-0 mx-lg-5 my-3 w-100 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
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
                    <Table className="Z_product_table p-1">
                        <thead>
                            <tr>
                                <th>
                                    <div className="Z_custom_checkbox">
                                        <input type="checkbox" id="selectAll" className="Z_checkbox_input" />
                                        <label htmlFor="selectAll" className="Z_checkbox_label"></label>
                                    </div>
                                </th>
                                <th>Category Image</th>
                                <th>Category Name</th>
                                <th>Description</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category._id}>
                                    <td>
                                        <div className="Z_custom_checkbox">
                                            <input
                                                type="checkbox"
                                                id={`checkbox-${category._id}`}
                                                className="Z_checkbox_input"
                                            />
                                            <label
                                                htmlFor={`checkbox-${category._id}`}
                                                className="Z_checkbox_label"
                                            ></label>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="Z_category_img_cell">
                                            <img
                                                src={`http://localhost:2221/${category.image}`}
                                                // {category.imageUrl || 'https://via.placeholder.com/50'}
                                                alt={category.title}
                                                className="Z_table_product_img"
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="Z_category_name_cell">
                                            <div className="Z_table_product_name">{category.title}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="Z_category_description">
                                            {category.description || 'No description'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="Z_category_date">
                                            {new Date(category.createdAt).toLocaleDateString()}
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
            </div>
        </section>
    );
};

export default CategoryList;