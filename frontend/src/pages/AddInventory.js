import React, { useEffect, useState } from 'react';
import '../styles/x_app.css';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { fetchCategories } from '../redux/slice/category.slice';
import { fetchSubcategories } from '../redux/slice/subCategory.slice';
import { fetchProducts } from '../redux/slice/product.slice';
import { useDispatch, useSelector } from 'react-redux';
import { createInventory } from '../redux/slice/inventory.Slice';

const AddInventory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [inventoryData, setInventoryData] = useState({
        categoryId: '',
        subcategoryId: '',
        productId: '',
        quantity: '',
        lowStockLimit: ''
    });

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const { isDarkMode } = useOutletContext();
    const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);
    const [isProductOpen, setIsProductOpen] = useState(false);

    const { categories, isLoading: categoriesLoading } = useSelector((state) => state.category);
    const { subcategories, isLoading: subcategoriesLoading } = useSelector((state) => state.subcategory);
    const { products, isLoading: productsLoading } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchSubcategories());
        dispatch(fetchProducts());
    }, [dispatch]);


    // Debug useEffect - detailed logging
    useEffect(() => {
        console.log('=== DEBUG INFO ===');
        console.log('Categories:', categories);
        console.log('Subcategories:', subcategories);
        console.log('Products:', products);
        console.log('Current selection:', inventoryData);

        // Check product structure in detail
        if (products && products.length > 0) {
            console.log('First product structure:', products[0]);
            console.log('Product subcategory field:', products[0].subcategory);
            console.log('All product subcategory values:', products.map(p => ({
                name: p.productName || p.title,
                subcategory: p.subcategory,
                subcategoryId: p.subcategoryId,
                subcategory_id: p.subcategory?._id
            })));
        }
        console.log('==================');
    }, [categories, subcategories, products, inventoryData]);
    const handleCategorySelect = (value) => {
        setInventoryData(prev => ({
            ...prev,
            categoryId: value,
            subcategoryId: '',
            productId: ''
        }));
        setIsCategoryOpen(false);
    };

    const handleSubcategorySelect = (value) => {
        setInventoryData(prev => ({
            ...prev,
            subcategoryId: value,
            productId: ''
        }));
        setIsSubcategoryOpen(false);
    };

    const handleProductSelect = (value) => {
        setInventoryData(prev => ({ ...prev, productId: value }));
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
        const sellerId = localStorage.getItem('user');
        if (!sellerId) {
            console.error('Seller ID not found in localStorage');
            return;
        }

        const formData = {
            ...inventoryData,
            sellerId: sellerId,
            isActive: true
        };

        try {
            const result = await dispatch(createInventory(formData)).unwrap();
            if (result) {
                setInventoryData({
                    categoryId: '',
                    subcategoryId: '',
                    productId: '',
                    quantity: '',
                    lowStockLimit: ''
                });
                navigate('/products');
            }
        } catch (error) {
            console.error('Failed to create product:', error);
        }
    };
    // Safe filtering functions
    const getFilteredSubcategories = () => {
        if (!subcategories || !Array.isArray(subcategories) || !inventoryData.categoryId) {
            return [];
        }
        return subcategories.filter(sub => {
            if (!sub) return false;

            const categoryId = sub.category?._id || sub.category || sub.categoryId;
            return categoryId === inventoryData.categoryId;
        });
    };
    const getFilteredProducts = () => {
        if (!products || !Array.isArray(products) || !inventoryData.subcategoryId) {
            console.log('Early return - missing data or subcategoryId');
            return [];
        }
        console.log('=== FILTERING PRODUCTS ===');
        console.log('Looking for subcategoryId:', inventoryData.subcategoryId);

        const filtered = products.filter(prod => {


            if (!prod) {
                console.log('Product is null/undefined');
                return false;
            }
            // Check all possible subcategory field variations
            const subcategoryChecks = [
                prod.subcategory,           // Direct string
                prod.subcategory?._id,     // Object with _id
                prod.subcategoryId,        // Alternative field name
                prod.subCategory,          // Alternative camelCase
                prod.subCategory?._id,     // Alternative camelCase object
                prod.sub_category,         // Snake case
                prod.sub_category?._id     // Snake case object
            ];

            console.log(`Product: ${prod.productName || prod.title}`);
            console.log('Subcategory checks:', subcategoryChecks);

            // Check if any of the subcategory fields match
            const matches = subcategoryChecks.some(subCatId =>
                subCatId && subCatId === inventoryData.subcategoryId);

            console.log('Matches:', matches);
            return matches;
        });

        console.log('Filtered products result:', filtered);
        console.log('========================');
        return filtered;
    };
    const filteredSubcategories = getFilteredSubcategories();
    const filteredProducts = getFilteredProducts();

    return (
        <div className={`x_product_page_container ${isDarkMode ? 'd_dark' : 'd_light'}`}>
            <div className="x_add_product_container">
                <div className="x_product_form">
                    <div className="x_product_info">
                        <h2 className="x_product_title">Add Stock</h2>
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
                                                {categoriesLoading ? 'Loading categories...' :
                                                    (categories && categories.find(cat => cat?._id === inventoryData.categoryId)?.title) || 'Select Category'}
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
                                        {isCategoryOpen && categories && (
                                            <div className="x_dropdown_options">
                                                {categories.map((category) => (
                                                    category && category._id ? (
                                                        <div
                                                            key={category._id}
                                                            className="x_dropdown_option"
                                                            onClick={() => handleCategorySelect(category._id)}
                                                        >
                                                            {category.title}
                                                        </div>
                                                    ) : null
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="x_form_group">
                                    <label>Subcategory</label>
                                    <div className="x_custom_dropdown">
                                        <div
                                            className={`x_dropdown_header ${!inventoryData.categoryId ? 'disabled' : ''}`}
                                            onClick={() => inventoryData.categoryId && setIsSubcategoryOpen(!isSubcategoryOpen)}
                                        >
                                            <span>
                                                {!inventoryData.categoryId ? 'Select Category First' :
                                                    subcategoriesLoading ? 'Loading subcategories...' :
                                                        (subcategories && subcategories.find(sub => sub?._id === inventoryData.subcategoryId)?.subcategoryTitle) || 'Select Subcategory'}
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
                                        {isSubcategoryOpen && inventoryData.categoryId && (
                                            <div className="x_dropdown_options">

                                                {filteredSubcategories.length > 0 ? (
                                                    filteredSubcategories.map((subcategory) => (
                                                        subcategory && subcategory._id ? (
                                                            <div
                                                                key={subcategory._id}
                                                                className="x_dropdown_option"
                                                                onClick={() => handleSubcategorySelect(subcategory._id)}
                                                            >
                                                                {subcategory.subcategoryTitle}
                                                            </div>
                                                        ) : null
                                                    ))
                                                ) : (
                                                    <div className="x_dropdown_option">No subcategories found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="x_form_group">
                                    <label>Product</label>
                                    <div className="x_custom_dropdown">
                                        <div
                                            className={`x_dropdown_header ${!inventoryData.subcategoryId ? 'disabled' : ''}`}
                                            onClick={() => inventoryData.subcategoryId && setIsProductOpen(!isProductOpen)}
                                        >
                                            <span>
                                                {!inventoryData.subcategoryId ? 'Select Subcategory First' :
                                                    productsLoading ? 'Loading products...' :

                                                        (products && products.find(prod => prod?._id === inventoryData.productId)?.productName ||
                                                            products.find(prod => prod?._id === inventoryData.productId)?.title) || 'Select Product'}
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
                                        {isProductOpen && inventoryData.subcategoryId && (
                                            <div className="x_dropdown_options">
                                                {filteredProducts.length > 0 ? (
                                                    filteredProducts.map((product) =>
                                                        product && product._id ? (
                                                            <div
                                                                key={product._id}
                                                                className="x_dropdown_option"
                                                                onClick={() => handleProductSelect(product._id)}
                                                            >
                                                                {product.productName || product.title || 'Unnamed Product'}
                                                            </div>
                                                        ) : null
                                                    )
                                                ) : (
                                                    <div className="x_dropdown_option">
                                                        No products found
                                                    </div>
                                                )}
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
                    <button type="submit" className="x_btn x_btn_create" onClick={handleSubmit}>Create Stock</button>
                    <button type="button" className="x_btn x_btn_cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddInventory;