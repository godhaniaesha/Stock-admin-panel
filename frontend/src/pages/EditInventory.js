import React, { useState, useEffect } from 'react';
import '../styles/x_app.css';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Spinner } from 'react-bootstrap';
// import { fetchCategories } from '../redux/slice/category.slice';
// import { fetchSubcategories } from '../redux/slice/subCategory.slice';
import { fetchCategories, WaccessCategories } from '../redux/slice/category.slice';
import { fetchSubcategories, WaccesssubCategories } from '../redux/slice/subCategory.slice';
import { fetchProducts } from '../redux/slice/product.slice';
import { fetchInventoryById, updateInventory } from '../redux/slice/inventory.Slice';

const EditInventory = () => {
    const { isDarkMode } = useOutletContext();
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux states
    const { isLoading: inventoryLoading, error: inventoryError } = useSelector((state) => state.inventory);
    const { categories, isLoading: categoriesLoading } = useSelector((state) => state.category);
    const { subcategories, isLoading: subcategoriesLoading } = useSelector((state) => state.subcategory);
    const { products, isLoading: productsLoading } = useSelector((state) => state.product);

    const [inventoryData, setInventoryData] = useState({
        category: '',
        subcategory: '',
        product: '',
        quantity: '',
        lowStockLimit: ''
    });

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Fetch all necessary data
    useEffect(() => {
        dispatch(WaccessCategories());
        dispatch(WaccesssubCategories());
        dispatch(fetchProducts());
    }, [dispatch]);

    // Fetch inventory data when component mounts and all data is available
    useEffect(() => {
        if (id && categories.length > 0 && subcategories.length > 0 && products.length > 0 && !dataLoaded) {
            dispatch(fetchInventoryById(id))
                .unwrap()
                .then((data) => {
                    console.log(data, 'data');

                    // Auto-fill with proper IDs based on the fetched inventory data
                    let categoryId = '';
                    let subcategoryId = '';
                    let productId = '';

                    // If the API returns objects with IDs, extract the IDs
                    if (typeof data.category === 'object' && data.category._id) {
                        categoryId = data.category._id;
                    } else if (typeof data.category === 'string') {
                        categoryId = data.category;
                    }

                    if (typeof data.subcategory === 'object' && data.subcategory._id) {
                        subcategoryId = data.subcategory._id;
                    } else if (typeof data.subcategory === 'string') {
                        subcategoryId = data.subcategory;
                    }

                    if (typeof data.product === 'object' && data.product._id) {
                        productId = data.product._id;
                    } else if (typeof data.product === 'string') {
                        productId = data.product;
                    }

                    // Alternative approach: If API returns names instead of IDs, find the matching IDs
                    if (!categoryId && typeof data.category === 'string') {
                        const matchingCategory = categories.find(cat =>
                            cat.title.toLowerCase() === data.category.toLowerCase() || cat._id === data.category
                        );
                        categoryId = matchingCategory ? matchingCategory._id : '';
                    }

                    if (!subcategoryId && typeof data.subcategory === 'string') {
                        const matchingSubcategory = subcategories.find(sub =>
                            sub.subcategoryTitle.toLowerCase() === data.subcategory.toLowerCase() || sub._id === data.subcategory
                        );
                        subcategoryId = matchingSubcategory ? matchingSubcategory._id : '';
                    }

                    if (!productId && typeof data.product === 'string') {
                        const matchingProduct = products.find(prod =>
                            prod.productName.toLowerCase() === data.product.toLowerCase() || prod._id === data.product
                        );
                        productId = matchingProduct ? matchingProduct._id : '';
                    }

                    setInventoryData({
                        category: categoryId,
                        subcategory: subcategoryId,
                        product: productId,
                        quantity: data.quantity || '',
                        lowStockLimit: data.lowStockLimit || ''
                    });
                    setDataLoaded(true);
                })
                .catch((error) => {
                    console.error('Error fetching inventory:', error);
                });
        }
    }, [id, dispatch, categories, subcategories, products, dataLoaded]);

    // Filter subcategories based on selected category
    const filteredSubcategories = subcategories.filter(
        sub =>  sub.category._id === inventoryData.category
    );

    // Filter products based on selected subcategory
    const filteredProducts = products.filter(
        prod => prod.subcategoryId?._id == inventoryData.subcategory
    );

    const handleCategorySelect = (value) => {
        console.log("valuecategory", value)
        setInventoryData(prev => ({
            ...prev,
            category: value,
            subcategory: '', // Reset subcategory when category changes
            product: '' // Reset product when category changes
        }));
        setIsCategoryOpen(false);
    };

    const handleSubcategorySelect = (value) => {
        console.log("value Subcategory", value)
        setInventoryData(prev => ({
            ...prev,
            subcategory: value,
            product: '' // Reset product when subcategory changes
        }));
        setIsSubcategoryOpen(false);
    };

    const handleProductSelect = (value) => {
        setInventoryData(prev => ({ ...prev, product: value }));
        setIsProductOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInventoryData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {
                category: inventoryData.category,
                subcategory: inventoryData.subcategory,
                product: inventoryData.product,
                quantity: parseInt(inventoryData.quantity),
                lowStockLimit: parseInt(inventoryData.lowStockLimit)
            };
            console.log("updatedData", updatedData, "id", id);

            const result = await dispatch(updateInventory({ id, updatedData })).unwrap();
            console.log("Update result:", result);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
    };

    const handleCancel = () => {
        navigate('/stock');
    };

    const isLoading = inventoryLoading || categoriesLoading || subcategoriesLoading || productsLoading;

    return (
        <div className={`x_product_page_container Z_product_section  ${isDarkMode ? 'd_dark' : 'd_light'}`}>
            <div className="x_add_product_container">
                <div className="x_product_form">
                    <div className="x_product_info">
                        <h2 className="x_product_title">Edit Stock</h2>
                        {inventoryError && <div className="alert alert-danger">{inventoryError}</div>}
                        <div className='x_form_p'>
                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>Category</label>
                                    <div className="x_custom_dropdown">
                                        <div
                                            className="x_dropdown_header"
                                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                        >
                                            <span>
                                                {categories.find(cat => cat._id === inventoryData.category)?.title || 'Select Category'}
                                            </span>
                                            <svg
                                                className={`x_dropdown_arrow ${isCategoryOpen ? 'open' : ''}`}
                                                width="10"
                                                height="6"
                                                viewBox="0 0 10 6"
                                            >
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            </svg>
                                        </div>
                                        {isCategoryOpen && (
                                            <div className="x_dropdown_options">
                                                {categories.map((category) => (
                                                    <div
                                                        key={category._id}
                                                        className="x_dropdown_option"
                                                        onClick={() => handleCategorySelect(category._id)}
                                                    >
                                                        {category.title}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="x_form_group">
                                    <label>Subcategory</label>
                                    <div className="x_custom_dropdown">
                                        <div
                                            className="x_dropdown_header"
                                            onClick={() => setIsSubcategoryOpen(!isSubcategoryOpen)}
                                            style={{ opacity: !inventoryData.category ? 0.5 : 1 }}
                                        >
                                            <span>
                                                {filteredSubcategories.find(sub => sub._id === inventoryData.subcategory)?.subcategoryTitle || 'Select Subcategory'}
                                            </span>
                                            <svg
                                                className={`x_dropdown_arrow ${isSubcategoryOpen ? 'open' : ''}`}
                                                width="10"
                                                height="6"
                                                viewBox="0 0 10 6"
                                            >
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            </svg>
                                        </div>
                                        {isSubcategoryOpen && inventoryData.category && (
                                            <div className="x_dropdown_options">
                                                {filteredSubcategories.map((subcategory) => (
                                                    <div
                                                        key={subcategory._id}
                                                        className="x_dropdown_option"
                                                        onClick={() => handleSubcategorySelect(subcategory._id)}
                                                    >
                                                        {subcategory.subcategoryTitle}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="x_form_group">
                                    <label>Product</label>
                                    <div className="x_custom_dropdown">
                                        <div
                                            className="x_dropdown_header"
                                            onClick={() => setIsProductOpen(!isProductOpen)}
                                            style={{ opacity: !inventoryData.subcategory ? 0.5 : 1 }}
                                        >
                                            <span>
                                                {filteredProducts.find(prod => prod._id === inventoryData.product)?.productName || 'Select Product'}
                                            </span>
                                            <svg
                                                className={`x_dropdown_arrow ${isProductOpen ? 'open' : ''}`}
                                                width="10"
                                                height="6"
                                                viewBox="0 0 10 6"
                                            >
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            </svg>
                                        </div>
                                        {isProductOpen && inventoryData.subcategory && (
                                            <div className="x_dropdown_options">
                                                {filteredProducts.map((product) => (
                                                    <div
                                                        key={product._id}
                                                        className="x_dropdown_option"
                                                        onClick={() => handleProductSelect(product._id)}
                                                    >
                                                        {product.productName}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        placeholder="Enter Quantity"
                                        value={inventoryData.quantity}
                                        onChange={handleInputChange}
                                        className="x_input"
                                        min="0"
                                    />
                                </div>

                                <div className="x_form_group">
                                    <label>Low Stock Limit</label>
                                    <input
                                        type="number"
                                        name="lowStockLimit"
                                        placeholder="Enter Low Stock Limit"
                                        value={inventoryData.lowStockLimit}
                                        onChange={handleInputChange}
                                        className="x_input"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="x_btn_wrapper mt-3">
                    <button
                        type="submit"
                        className="x_btn x_btn_create"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                    <button
                        type="button"
                        className="x_btn x_btn_cancel"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={() => {
                setShowSuccessModal(false);
                navigate('/stock-overview');
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Inventory has been updated successfully!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowSuccessModal(false);
                        navigate('/stock');
                    }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EditInventory;