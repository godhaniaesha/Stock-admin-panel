import React, { useEffect, useState } from 'react';
import '../styles/x_app.css';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/slice/category.slice';
import { fetchSubcategories } from '../redux/slice/subCategory.slice';
import { fetchProducts } from '../redux/slice/product.slice';
import { createInventory } from '../redux/slice/inventory.Slice';

const AddInventory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const { categories, isLoading: categoriesLoading } = useSelector((state) => state.category);
  const { subcategories, isLoading: subcategoriesLoading } = useSelector((state) => state.subcategory);
  const { products, isLoading: productsLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubcategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCategorySelect = (value) => {
    setInventoryData(prev => ({
      ...prev,
      category: value,
      subcategory: '',
      product: ''
    }));
    setIsCategoryOpen(false);
  };

  const handleSubcategorySelect = (value) => {
    setInventoryData(prev => ({
      ...prev,
      subcategory: value,
      product: ''
    }));
    setIsSubcategoryOpen(false);
  };

  const handleProductSelect = (value) => {
    setInventoryData(prev => ({
      ...prev,
      product: value
    }));
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
    if (!sellerId) return;

    const formData = {
      ...inventoryData,
      sellerId,
      isActive: true
    };

    try {
      const result = await dispatch(createInventory(formData)).unwrap();
      if (result) {
        setInventoryData({
          category: '',
          subcategory: '',
          product: '',
          quantity: '',
          lowStockLimit: ''
        });
        navigate('/stock');
      }
    } catch (error) {
      console.error('Create inventory failed:', error);
    }
  };

  const getFilteredSubcategories = () => {
    if (!inventoryData.category || !subcategories) return [];
    return subcategories.filter(sub => {
      const subCatId = sub.category?._id || sub.category || sub.categoryId;
      return subCatId === inventoryData.category;
    });
  };

  const getFilteredProducts = () => {
    if (!inventoryData.subcategory || !products) return [];
    return products.filter(prod => {
      const subCatId = prod.subcategoryId?._id || prod.subcategoryId;
      return subCatId === inventoryData.subcategory;
    });
  };

  const filteredSubcategories = getFilteredSubcategories();
  const filteredProducts = getFilteredProducts();

  return (
    <div className={`x_product_page_container Z_product_section ${isDarkMode ? 'd_dark' : 'd_light'}`}>
      <div className="x_add_product_container">
        <div className="x_product_form">
          <div className="x_product_info">
            <h2 className="x_product_title">Add Stock</h2>
            <div className='x_form_p'>
              <div className="x_form_row">
                {/* Category Dropdown */}
                <div className="x_form_group">
                  <label>Category</label>
                  <div className="x_custom_dropdown">
                    <div
                      className="x_dropdown_header"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    >
                      <span>
                        {categoriesLoading ? 'Loading...' :
                          categories.find(cat => cat?._id === inventoryData.category)?.title || 'Select Category'}
                      </span>
                      <svg className={`x_dropdown_arrow ${isCategoryOpen ? 'open' : ''}`} width="10" height="6">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      </svg>
                    </div>
                    {isCategoryOpen && (
                      <div className="x_dropdown_options">
                        {categories.map(category => (
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

                {/* Subcategory Dropdown */}
                <div className="x_form_group">
                  <label>Subcategory</label>
                  <div className="x_custom_dropdown">
                    <div
                      className={`x_dropdown_header ${!inventoryData.category ? 'disabled' : ''}`}
                      onClick={() => inventoryData.category && setIsSubcategoryOpen(!isSubcategoryOpen)}
                    >
                      <span>
                        {!inventoryData.category ? 'Select Category First' :
                          subcategoriesLoading ? 'Loading...' :
                            subcategories.find(sub => sub?._id === inventoryData.subcategory)?.subcategoryTitle || 'Select Subcategory'}
                      </span>
                      <svg className={`x_dropdown_arrow ${isSubcategoryOpen ? 'open' : ''}`} width="10" height="6">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      </svg>
                    </div>
                    {isSubcategoryOpen && (
                      <div className="x_dropdown_options">
                        {filteredSubcategories.length > 0 ? (
                          filteredSubcategories.map(sub => (
                            <div
                              key={sub._id}
                              className="x_dropdown_option"
                              onClick={() => handleSubcategorySelect(sub._id)}
                            >
                              {sub.subcategoryTitle}
                            </div>
                          ))
                        ) : (
                          <div className="x_dropdown_option">No subcategories found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Dropdown */}
                <div className="x_form_group">
                  <label>Product</label>
                  <div className="x_custom_dropdown">
                    <div
                      className={`x_dropdown_header ${!inventoryData.subcategory ? 'disabled' : ''}`}
                      onClick={() => inventoryData.subcategory && setIsProductOpen(!isProductOpen)}
                    >
                      <span>
                        {!inventoryData.subcategory ? 'Select Subcategory First' :
                          productsLoading ? 'Loading...' :
                            products.find(p => p._id === inventoryData.product)?.productName ||
                            products.find(p => p._id === inventoryData.product)?.title ||
                            'Select Product'}
                      </span>
                      <svg className={`x_dropdown_arrow ${isProductOpen ? 'open' : ''}`} width="10" height="6">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      </svg>
                    </div>
                    {isProductOpen && (
                      <div className="x_dropdown_options">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map(prod => (
                            <div
                              key={prod._id}
                              className="x_dropdown_option"
                              onClick={() => handleProductSelect(prod._id)}
                            >
                              {prod.productName || prod.title || 'Unnamed Product'}
                            </div>
                          ))
                        ) : (
                          <div className="x_dropdown_option">No products found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity and Low Stock Limit */}
              <div className="x_form_row">
                <div className="x_form_group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={inventoryData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter Quantity"
                    className="x_input"
                    min="0"
                  />
                </div>

                <div className="x_form_group">
                  <label>Low Stock Limit</label>
                  <input
                    type="number"
                    name="lowStockLimit"
                    value={inventoryData.lowStockLimit}
                    onChange={handleInputChange}
                    placeholder="Enter Low Stock Limit"
                    className="x_input"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="x_btn_wrapper  justify-content-center mt-3">
          <button className="x_btn x_btn_create" onClick={handleSubmit}>Create Stock</button>
          <button className="x_btn x_btn_cancel" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddInventory;
