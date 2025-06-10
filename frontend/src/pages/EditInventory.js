import React, { useState } from 'react';
import '../styles/x_app.css';
import { useOutletContext } from 'react-router-dom';

const EditInventory = () => {
     const { isDarkMode } = useOutletContext();
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

    const categoryOptions = [
        { value: 'clothing', label: 'Clothing' },
        { value: 'shoes', label: 'Shoes' },
        { value: 'accessories', label: 'Accessories' }
    ];
    const subcategoryOptions = {
        clothing: [
            { value: 'tshirts', label: 'T-Shirts' },
            { value: 'shirts', label: 'Shirts' },
            { value: 'pants', label: 'Pants' },
            { value: 'dresses', label: 'Dresses' }
        ],
        shoes: [
            { value: 'sneakers', label: 'Sneakers' },
            { value: 'formal', label: 'Formal' },
            { value: 'sports', label: 'Sports' },
            { value: 'sandals', label: 'Sandals' }
        ],
        accessories: [
            { value: 'bags', label: 'Bags' },
            { value: 'belts', label: 'Belts' },
            { value: 'watches', label: 'Watches' },
            { value: 'jewelry', label: 'Jewelry' }
        ]
    };

    const productOptions = {
        tshirts: [
            { value: 'basic-tee', label: 'Basic Tee' },
            { value: 'polo', label: 'Polo T-Shirt' },
            { value: 'graphic-tee', label: 'Graphic T-Shirt' }
        ],
        shirts: [
            { value: 'casual-shirt', label: 'Casual Shirt' },
            { value: 'formal-shirt', label: 'Formal Shirt' },
            { value: 'denim-shirt', label: 'Denim Shirt' }
        ],
        // Add more product options for other subcategories as needed
    };

    const handleCategorySelect = (value) => {
        setInventoryData(prev => ({ ...prev, category: value }));
        setIsCategoryOpen(false);
    };

    const handleSubcategorySelect = (value) => {
        setInventoryData(prev => ({ ...prev, subcategory: value }));
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your submit logic here
    };

    return (
        <div className={`x_product_page_container w-100 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
            <div className="x_add_product_container">
                <div className="x_product_form">
                    <div className="x_product_info">
                        <h2 className="x_product_title">Edit Stock</h2>
                        <div className='x_form_p'>
                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>Category</label>
                                    <div className="x_custom_dropdown">
                                        <div
                                            className="x_dropdown_header"
                                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                        >
                                            <span>{inventoryData.category || 'Select Category'}</span>
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
                                                {categoryOptions.map((option) => (
                                                    <div
                                                        key={option.value}
                                                        className="x_dropdown_option"
                                                        onClick={() => handleCategorySelect(option.value)}
                                                    >
                                                        {option.label}
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
                                        >
                                            <span>{inventoryData.subcategory || 'Select Subcategory'}</span>
                                            <svg
                                                className={`x_dropdown_arrow ${isSubcategoryOpen ? 'open' : ''}`}
                                                width="10"
                                                height="6"
                                                viewBox="0 0 10 6"
                                            >
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            </svg>
                                        </div>
                                        {isSubcategoryOpen && (
                                            <div className="x_dropdown_options">
                                                {inventoryData.category && subcategoryOptions[inventoryData.category].map((option) => (
                                                    <div
                                                        key={option.value}
                                                        className="x_dropdown_option"
                                                        onClick={() => handleSubcategorySelect(option.value)}
                                                    >
                                                        {option.label}
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
                                        >
                                            <span>{inventoryData.product || 'Select Product'}</span>
                                            <svg
                                                className={`x_dropdown_arrow ${isProductOpen ? 'open' : ''}`}
                                                width="10"
                                                height="6"
                                                viewBox="0 0 10 6"
                                            >
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            </svg>
                                        </div>
                                        {isProductOpen && (
                                            <div className="x_dropdown_options">
                                                {inventoryData.subcategory && productOptions[inventoryData.subcategory] && productOptions[inventoryData.subcategory].map((option) => (
                                                    <div
                                                        key={option.value}
                                                        className="x_dropdown_option"
                                                        onClick={() => handleProductSelect(option.value)}
                                                    >
                                                        {option.label}
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
                    <button type="submit" className="x_btn x_btn_create" onClick={handleSubmit}>Save Changes</button>
                    <button type="button" className="x_btn x_btn_cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditInventory;