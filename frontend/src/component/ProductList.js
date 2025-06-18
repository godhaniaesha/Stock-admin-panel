import React, { useEffect, useState } from 'react';
import '../styles/Z_styles.css';
import { Table, Modal } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../redux/slice/product.slice';
import { fetchCategories } from '../redux/slice/category.slice';
import { FaCaretDown } from 'react-icons/fa';
import { IMG_URL } from '../utils/baseUrl';

function ProductList() {
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productState = useSelector((state) => state.product || {});
    const { products = [], isLoading: productsLoading = false, error: productError = null } = productState;

    const categoryState = useSelector((state) => state.category || {});
    const { categories = [], isLoading: categoriesLoading = false } = categoryState;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const [timeFilter, setTimeFilter] = useState('thisMonth');

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleAddProduct = () => {
        navigate('/products/add');
    };

    const handleEdit = (product) => {
        navigate(`/products/edit/${product._id}`);
    };

    const handleView = (product) => {
        navigate(`/products/details/${product._id}`);
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (productToDelete) {
            try {
                await dispatch(deleteProduct(productToDelete._id)).unwrap();
                setShowDeleteModal(false);
                setProductToDelete(null);
            } catch (error) {
                console.error('Failed to delete product:', error);
            }
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    const handleTimeFilterChange = (e) => {
        setTimeFilter(e.target.value);
    };

    const filterProductsByTime = (products) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return products.filter(product => {
            const productDate = new Date(product.createdAt);
            const productMonth = productDate.getMonth();
            const productYear = productDate.getFullYear();

            switch (timeFilter) {
                case 'thisMonth':
                    return productMonth === currentMonth && productYear === currentYear;
                case 'lastMonth':
                    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                    return productMonth === lastMonth && productYear === lastMonthYear;
                case 'last3Months':
                    const threeMonthsAgo = new Date(now);
                    threeMonthsAgo.setMonth(now.getMonth() - 3);
                    return productDate >= threeMonthsAgo;
                default:
                    return true;
            }
        });
    };

    const filteredProducts = filterProductsByTime(products);

    if (productsLoading || categoriesLoading) {
        return <div>Loading products and categories...</div>;
    }

    if (productError) {
        return <div>Error loading products: {productError}</div>;
    }

    return (
        <>
            <section className={`Z_product_section mx-0 mx-lg-5 my-md-3 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
                <div className="Z_table_wrapper">
                    <div className="Z_table_header">
                        <h4>All Product List</h4>
                        <div className="Z_table_actions">
                            <button className="Z_add_product_btn" onClick={handleAddProduct}>Add Product</button>
                            <div className='Z_select_wrapper'>
                                <select className="Z_time_filter" value={timeFilter} onChange={handleTimeFilterChange}>
                                    <option value="thisMonth">This Month</option>
                                    <option value="lastMonth">Last Month</option>
                                    <option value="last3Months">Last 3 Months</option>
                                </select>
                                <div className="Z_select_caret"><FaCaretDown size={20} color='white' /></div>
                            </div>
                            {selectedProducts.length > 0 && (
                                <button className="Z_add_product_btn" onClick={() => setShowBulkDeleteModal(true)}>
                                    Delete Selected
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="Z_table_scroll_container">
                        <Table className="Z_product_table p-1">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="Z_custom_checkbox">
                                            <input
                                                type="checkbox"
                                                id="selectAll"
                                                className="Z_checkbox_input"
                                                checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedProducts(filteredProducts.map(product => product._id));
                                                    } else {
                                                        setSelectedProducts([]);
                                                    }
                                                }}
                                            />
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
                                {filteredProducts.map((product) => {
                                    const categoryIdToMatch = product.categoryId ? product.categoryId._id : null;
                                    const productCategory = categories.find(category => category._id === categoryIdToMatch);
                                    const categoryTitle = productCategory ? productCategory.title : 'N/A';

                                    return (
                                        <tr key={product._id}>
                                            <td>
                                                <div className="Z_custom_checkbox">
                                                    <input
                                                        type="checkbox"
                                                        id={`checkbox-${product._id}`}
                                                        className="Z_checkbox_input"
                                                        checked={selectedProducts.includes(product._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedProducts([...selectedProducts, product._id]);
                                                            } else {
                                                                setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor={`checkbox-${product._id}`} className="Z_checkbox_label"></label>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="Z_product_info_cell">
                                                    <img
                                                        src={product.images && product.images[0] ? `${IMG_URL}${product.images[0]}` : 'placeholder.jpg'}
                                                        alt={product.productName}
                                                        className="Z_table_product_img"
                                                    />
                                                    <div>
                                                        <div className="Z_table_product_name">{product.productName}</div>
                                                        <div className="Z_table_product_size">Size: {product.weight}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>${product.price}</td>
                                            <td>
                                                <div className="Z_stock_info">
                                                    <div>{product.stock} Items Left</div>
                                                    <div className="Z_stock_sold">Low Stock: {product.lowStockThreshold}</div>
                                                </div>
                                            </td>
                                            <td>{categoryTitle}</td>
                                            <td>
                                                <div className="Z_rating_cell">
                                                    <div className="Z_rating_wrapper">
                                                        <span className="Z_rating_star">★</span>
                                                        <span className="Z_rating_value">4.5</span>
                                                        <span className="Z_review_count">(0 Reviews)</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="Z_action_buttons">
                                                    <button className="Z_action_btn Z_view_btn" onClick={() => handleView(product)}><TbEye size={22} /></button>
                                                    <button className="Z_action_btn Z_edit_btn" onClick={() => handleEdit(product)}><TbEdit size={22} /></button>
                                                    <button className="Z_action_btn Z_delete_btn" onClick={() => handleDeleteClick(product)}><RiDeleteBin6Line size={22} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </section>

            {/* Single Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onHide={handleDeleteCancel}
                centered
                className={`z_delete_modal ${isDarkMode ? 'd_dark' : 'd_light'}`}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the product "{productToDelete?.productName}"?
                </Modal.Body>
                <Modal.Footer>
                    <button className="Z_btn Z_btn_cancel" onClick={handleDeleteCancel}>Cancel</button>
                    <button className="Z_btn Z_btn_delete" onClick={handleDeleteConfirm}>Delete</button>
                </Modal.Footer>
            </Modal>

            {/* Bulk Delete Confirmation Modal */}
            <Modal
                show={showBulkDeleteModal}
                onHide={() => setShowBulkDeleteModal(false)}
                centered
                className={`z_delete_modal ${isDarkMode ? 'd_dark' : 'd_light'}`}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Selected Products</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <strong>{selectedProducts.length}</strong> selected products?
                </Modal.Body>
                <Modal.Footer>
                    <button className="Z_btn Z_btn_cancel" onClick={() => setShowBulkDeleteModal(false)}>Cancel</button>
                    <button
                        className="Z_btn Z_btn_delete"
                        onClick={async () => {
                            try {
                                await Promise.all(
                                    selectedProducts.map(id => dispatch(deleteProduct(id)).unwrap())
                                );
                                setSelectedProducts([]);
                                setShowBulkDeleteModal(false);
                            } catch (error) {
                                console.error('Failed to delete selected products:', error);
                            }
                        }}
                    >
                        Delete
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ProductList;
