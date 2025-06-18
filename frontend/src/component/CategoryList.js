import React, { useEffect, useState } from 'react';
import '../styles/Z_styles.css';
import { Table, Modal, Button, Spinner } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, fetchCategories } from '../redux/slice/category.slice';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { FaCaretDown } from 'react-icons/fa';
import { IMG_URL } from '../utils/baseUrl';

const CategoryList = () => {
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories, isLoading, error } = useSelector((state) => state.category);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [timeFilter, setTimeFilter] = useState('thisMonth');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const filterCategoriesByTime = (categories) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return categories.filter(category => {
            const categoryDate = new Date(category.createdAt);
            const categoryMonth = categoryDate.getMonth();
            const categoryYear = categoryDate.getFullYear();

            switch (timeFilter) {
                case 'thisMonth':
                    return categoryMonth === currentMonth && categoryYear === currentYear;
                case 'lastMonth':
                    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                    return categoryMonth === lastMonth && categoryYear === lastMonthYear;
                case 'last3Months':
                    const threeMonthsAgo = new Date(now);
                    threeMonthsAgo.setMonth(now.getMonth() - 3);
                    return categoryDate >= threeMonthsAgo;
                default:
                    return true;
            }
        });
    };

    const handleTimeFilterChange = (e) => {
        setTimeFilter(e.target.value);
    };

    const handleEdit = (category) => {
        navigate('/categories/edit', { state: { categoryData: category } });
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (categoryToDelete) {
            try {
                await dispatch(deleteCategory(categoryToDelete._id)).unwrap();
                setShowDeleteModal(false);
                setCategoryToDelete(null);
            } catch (error) {
                console.error('Failed to delete category:', error);
            }
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setCategoryToDelete(null);
    };

    // Handle checkbox selection
    const handleCategorySelection = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectedCategories.length === filteredCategories.length) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(filteredCategories.map(cat => cat._id));
        }
    };

    // Handle bulk delete
    const handleBulkDelete = () => {
        setShowBulkDeleteModal(true);
    };

    const confirmBulkDelete = async () => {
        if (selectedCategories.length > 0) {
            try {
                await Promise.all(
                    selectedCategories.map(id => dispatch(deleteCategory(id)).unwrap())
                );
                setSelectedCategories([]);
                setShowBulkDeleteModal(false);
            } catch (error) {
                console.error('Bulk delete error:', error);
            }
        }
    };

    if (isLoading) {
        return <div>Loading categories...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const filteredCategories = filterCategoriesByTime(categories);

    return (
        <>
            <section className={`Z_product_section mx-0 mx-lg-2 my-md-3  ${isDarkMode ? 'd_dark' : 'd_light'}`}>
                <div className="Z_table_wrapper">
                    <div className="Z_table_header">
                        <h4>All Category List</h4>
                        <div className="Z_table_actions">
                            <button className="Z_add_product_btn" onClick={() => navigate('/categories/add')}>Add Category</button>
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
                            {selectedCategories.length > 0 && (
                                <button
                                    className="Z_btn Z_btn_delete"
                                    onClick={handleBulkDelete}
                                    disabled={isLoading}
                                >
                                    Delete Selected ({selectedCategories.length})
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="Z_table_scroll_container">
                        <Table className="Z_product_table p-1">
                            <thead>
                                <tr>
                                    {/* <th>
                                        <div className="Z_custom_checkbox">
                                            <input
                                                type="checkbox"
                                                id="selectAll"
                                                className="Z_checkbox_input"
                                                checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                            <label htmlFor="selectAll" className="Z_checkbox_label"></label>
                                        </div>
                                    </th> */}
                                    <th>Category Image</th>
                                    <th>Category Name</th>
                                    <th>Description</th>
                                    <th>Created At</th>
                                    {/* <th>Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map((category) => (
                                    <tr key={category._id}>
                                        {/* <td>
                                            <div className="Z_custom_checkbox">
                                                <input
                                                    type="checkbox"
                                                    id={`checkbox-${category._id}`}
                                                    className="Z_checkbox_input"
                                                    checked={selectedCategories.includes(category._id)}
                                                    onChange={() => handleCategorySelection(category._id)}
                                                />
                                                <label
                                                    htmlFor={`checkbox-${category._id}`}
                                                    className="Z_checkbox_label"
                                                ></label>
                                            </div>
                                        </td> */}
                                        <td>
                                            <div className="Z_category_img_cell">
                                                <img
                                                    src={`${IMG_URL}${category.image}`}
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
                                        {/* <td>
                                            <div className="Z_action_buttons">
                                                <button className="Z_action_btn Z_view_btn">
                                                        <TbEye size={22} />
                                                    </button>
                                                <button
                                                    className="Z_action_btn Z_edit_btn"
                                                    onClick={() => handleEdit(category)}
                                                >
                                                    <TbEdit size={22} />
                                                </button>
                                                <button
                                                    className="Z_action_btn Z_delete_btn"
                                                    onClick={() => handleDeleteClick(category)}
                                                >
                                                    <RiDeleteBin6Line size={22} />
                                                </button>
                                            </div>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </section>

            {/* Single Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete category "{categoryToDelete?.title}"? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDeleteConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Bulk Delete Modal */}
            <Modal show={showBulkDeleteModal} onHide={() => setShowBulkDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Bulk Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <strong>{selectedCategories.length}</strong> selected category(s)? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBulkDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmBulkDelete} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Deleting...
                            </>
                        ) : (
                            'Confirm Delete'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CategoryList;