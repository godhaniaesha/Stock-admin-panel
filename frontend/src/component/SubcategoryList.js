import React, { useEffect, useState } from 'react';
import '../styles/Z_styles.css';
import { Table, Modal } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubcategories, deleteSubcategory } from '../redux/slice/subCategory.slice';

function SubcategoryList() {
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { subcategories, isLoading, error } = useSelector((state) => state.subcategory);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);
    const [timeFilter, setTimeFilter] = useState('thisMonth');

    useEffect(() => {
        dispatch(fetchSubcategories());
    }, [dispatch]);

    const handleAddSubcategory = () => {
        navigate('/subcategories/add');
    };

    const handleEdit = (subcategory) => {
        navigate('/subcategories/edit', { state: { subcategoryData: subcategory } });
    };

    const handleDeleteClick = (subcategory) => {
        setSubcategoryToDelete(subcategory);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (subcategoryToDelete) {
            try {
                await dispatch(deleteSubcategory(subcategoryToDelete._id)).unwrap();
                setShowDeleteModal(false);
                setSubcategoryToDelete(null);
            } catch (error) {
                console.error('Failed to delete subcategory:', error);
            }
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setSubcategoryToDelete(null);
    };

    const handleTimeFilterChange = (e) => {
        setTimeFilter(e.target.value);
    };

    const filterSubcategoriesByTime = (subcategories) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return subcategories.filter(subcategory => {
            const subcategoryDate = new Date(subcategory.createdAt);
            const subcategoryMonth = subcategoryDate.getMonth();
            const subcategoryYear = subcategoryDate.getFullYear();

            switch (timeFilter) {
                case 'thisMonth':
                    return subcategoryMonth === currentMonth && subcategoryYear === currentYear;
                case 'lastMonth':
                    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                    return subcategoryMonth === lastMonth && subcategoryYear === lastMonthYear;
                case 'last3Months':
                    const threeMonthsAgo = new Date(now);
                    threeMonthsAgo.setMonth(now.getMonth() - 3);
                    return subcategoryDate >= threeMonthsAgo;
                default:
                    return true;
            }
        });
    };

    if (isLoading) {
        return <div>Loading subcategories...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const filteredSubcategories = filterSubcategoriesByTime(subcategories);

    return (
        <>
            <section className={`Z_product_section w-100 mx-0 mx-lg-5 my-3 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
                <div className="Z_table_wrapper">
                    <div className="Z_table_header">
                        <h4>All Subcategory List</h4>
                        <div className="Z_table_actions">
                            <button className="Z_add_product_btn" onClick={handleAddSubcategory}>Add Subcategory</button>
                            <select 
                                className="Z_time_filter" 
                                value={timeFilter}
                                onChange={handleTimeFilterChange}
                            >
                                <option value="thisMonth">This Month</option>
                                <option value="lastMonth">Last Month</option>
                                <option value="last3Months">Last 3 Months</option>
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
                                {filteredSubcategories.map((subcategory) => (
                                    <tr key={subcategory._id}>
                                        <td>
                                            <div className="Z_custom_checkbox">
                                                <input
                                                    type="checkbox"
                                                    id={`checkbox-${subcategory._id}`}
                                                    className="Z_checkbox_input"
                                                />
                                                <label
                                                    htmlFor={`checkbox-${subcategory._id}`}
                                                    className="Z_checkbox_label"
                                                ></label>
                                            </div>
                                        </td>
                                        <td>#{subcategory._id}</td>
                                        <td>
                                            <div className="Z_category_name_cell">
                                                <div className="Z_table_product_name">{subcategory.category?.title || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="Z_subcategory_details_cell">
                                                <img 
                                                    src={`http://localhost:2221/${subcategory.image}`}
                                                    alt={subcategory.subcategoryTitle} 
                                                    className="Z_table_subcategory_img" 
                                                    width={60} 
                                                    height={60} 
                                                />
                                                <div className="Z_table_subcategory_name">{subcategory.subcategoryTitle}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="Z_category_description_cell">
                                                <div className="Z_table_product_description">{subcategory.description || 'No description'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="Z_action_buttons">
                                                <button className="Z_action_btn Z_view_btn">
                                                    <TbEye size={22} />
                                                </button>
                                                <button 
                                                    className="Z_action_btn Z_edit_btn"
                                                    onClick={() => handleEdit(subcategory)}
                                                >
                                                    <TbEdit size={22} />
                                                </button>
                                                <button 
                                                    className="Z_action_btn Z_delete_btn"
                                                    onClick={() => handleDeleteClick(subcategory)}
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

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onHide={handleDeleteCancel}
                centered
                className={`${isDarkMode ? 'd_dark' : 'd_light'}`}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Subcategory</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the subcategory "{subcategoryToDelete?.subcategoryTitle}"?
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="Z_btn Z_btn_cancel"
                        onClick={handleDeleteCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="Z_btn Z_btn_delete"
                        onClick={handleDeleteConfirm}
                    >
                        Delete
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SubcategoryList;