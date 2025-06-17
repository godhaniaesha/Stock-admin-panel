import React, { useState, useEffect } from 'react';
import '../styles/sales.css'
import '../styles/Z_styles.css';
import { Container, Row, Col, Form, InputGroup, Button, Offcanvas, Badge, Card } from 'react-bootstrap';
import { FaFilter, FaChevronDown, FaHeart } from 'react-icons/fa';
import { BiSearchAlt } from 'react-icons/bi';
import { IoIosHeart, IoMdCart, IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchProducts, getallwAccess } from '../redux/slice/product.slice';
// import { fetchCategories } from '../redux/slice/category.slice';
// import { fetchSubcategories } from '../redux/slice/subCategory.slice';
import { addToCart, getCart } from '../redux/slice/cart.slice';
import { addToWishlist, getAllWishlists, getWishlist, removeFromWishlist } from '../redux/slice/wishlist.slice';
import { fetchCategories, WaccessCategories } from '../redux/slice/category.slice';
import { fetchSubcategories, WaccesssubCategories } from '../redux/slice/subCategory.slice';
import { IMG_URL } from '../utils/baseUrl';
function ProductGrid() {
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [localWishlist, setLocalWishlist] = useState([]);
    const [filters, setFilters] = useState({
        expandedFilter: null,
        showOffcanvas: false,
        selectedCategories: [],
        selectedSubcategories: [],
        selectedPriceRange: '',
        searchQuery: ''
    });

    const { products, isLoading, error } = useSelector((state) => state.product);
    const { categories } = useSelector((state) => state.category);
    const { subcategories } = useSelector((state) => state.subcategory);
    const { items: wishlistItems } = useSelector((state) => state.wishlist);
    const { items: cartItems, totalItems } = useSelector((state) => state.cart);

    useEffect(() => {
        const userId = localStorage.getItem('user');
        // dispatch(fetchProducts());
        dispatch(getallwAccess())
        // dispatch(fetchCategories());
        dispatch(WaccessCategories());
        dispatch(WaccesssubCategories());
        // dispatch(fetchSubcategories());
        if (userId) {
            dispatch(getCart(userId));
            dispatch(getWishlist(userId));
        }
    }, [dispatch]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: typeof value === 'function' ? value(prev[filterType]) : value
        }));
    };

    const filterProducts = () => {
        return products.filter(product => {
            const searchMatch = product.productName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                product.categoryId?.title?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                product.subcategoryId?.title?.toLowerCase().includes(filters.searchQuery.toLowerCase());

            const categoryMatch = filters.selectedCategories.length === 0 ||
                (product.categoryId && filters.selectedCategories.includes(product.categoryId._id));
            const subcategoryMatch = filters.selectedSubcategories.length === 0 ||
                (product.subcategoryId && filters.selectedSubcategories.includes(product.subcategoryId._id));

            const priceMatch = !filters.selectedPriceRange || (
                (filters.selectedPriceRange === 'under50' && product.price < 50) ||
                (filters.selectedPriceRange === '50to100' && product.price >= 50 && product.price <= 100) ||
                (filters.selectedPriceRange === '100to200' && product.price > 100 && product.price <= 200) ||
                (filters.selectedPriceRange === 'over200' && product.price > 200)
            );

            return searchMatch && categoryMatch && subcategoryMatch && priceMatch;
        });
    };

    const handleWishlistToggle = (product) => {
        const userId = localStorage.getItem('user');
        if (!userId) return;

        // If already in wishlist, remove it
        if (isProductInWishlist(product._id)) {
            // Find the wishlist item id (not product id)
            const wishlistItem = wishlistItems.find(item => item.productId._id === product._id);
            if (wishlistItem) {
                setLocalWishlist((prev) => prev.filter(id => id !== product._id));
                dispatch(removeFromWishlist(wishlistItem._id))
                    .then(() => {
                        dispatch(getWishlist(userId));
                    })
                    .catch(() => {
                        setLocalWishlist((prev) => [...prev, product._id]);
                    });
            }
        } else {
            // Add to wishlist
            setLocalWishlist((prev) => [...prev, product._id]);
            dispatch(addToWishlist({ userId, productId: product._id }))
                .then(() => {
                    dispatch(getWishlist(userId));
                })
                .catch(() => {
                    setLocalWishlist((prev) => prev.filter(id => id !== product._id));
                });
        }
    };

    const handleAddToCart = async (product) => {
        const userId = localStorage.getItem('user');
        if (!userId) {
            toast.error('Please login to add items to cart');
            return;
        }
        try {
            await dispatch(addToCart({ userId, productId: product._id, quantity: 1 })).unwrap();
            await dispatch(getCart(userId)).unwrap();
            toast.success('Product added to cart successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to add product to cart. Please try again.');
        }
    };

    const isProductInWishlist = (productId) => {
        // Show local state immediately, fallback to redux state
        if (localWishlist.length > 0) {
            return localWishlist.includes(productId);
        }
        return wishlistItems.some(item => {
            console.log('Checking wishlist item:', item);
            console.log('Item productId:', item ? item.productId : 'item is null');
            return item && item.productId && item.productId._id === productId;
        });
    };
    useEffect(() => {
        if (wishlistItems && wishlistItems.length > 0) {
            console.log('Wishlist items on useEffect update:', wishlistItems);
            setLocalWishlist(wishlistItems.map(item => item && item.productId ? item.productId._id : null).filter(Boolean));
        }
    }, [wishlistItems]);

    if (isLoading) return <div className="text-center p-5">Loading...</div>;
    if (error) return <div className="text-center p-5 text-danger">Error: {error}</div>;

    const filteredProducts = filterProducts();

    return (
        <>
            <ToastContainer />
            <section className={`Z_product_section mx-0 mx-lg-2 my-3 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
                <Row className="Z_topbar_wrapper">
                    {/* Search input for larger screens */}
                    <Col xl={3} lg={12} className="mb-3 mb-lg-0 d-none d-xl-block">
                        <div className="Z_heading">
                            <div className='Z_input_grp'>
                                <InputGroup>
                                    <Form.Control
                                        placeholder="Search products..."
                                        className="Z_search_input"
                                        value={filters.searchQuery}
                                        onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                                    />
                                    <InputGroup.Text className="Z_search_icon">
                                        <BiSearchAlt size={20} />
                                    </InputGroup.Text>
                                </InputGroup>
                            </div>
                        </div>
                    </Col>

                    <Col xl={9} lg={12} className="d_show_result d-flex justify-content-between align-items-center" style={{ background: '#fff', padding: '10px 12px', borderRadius: '8px' }}>
                        <div className="Z_preview_path">
                            {/* <span>Categories</span>
                            <span className="mx-2">›</span> */}
                            <span>All Product</span>
                            <div className="Z_results me-3">
                                Showing all {products?.length || 0} items results
                            </div>
                        </div>
                        <div className="Z_right_actions d-flex align-items-center">
                            <Button variant="outline-secondary" className="Z_filter_btn me-2 d-xl-none" onClick={() => handleFilterChange('showOffcanvas', true)}>
                                <FaFilter />
                                <span className='Z_filterResp'> Filters</span>
                            </Button>
                            <div>
                                <span
                                    role="button"
                                    tabIndex={0}
                                    className="Z_header_icon mx-2 position-relative"
                                    onClick={() => navigate('/cart')}
                                    onKeyDown={(e) => e.key === 'Enter' && navigate('/cart')}
                                    title="View Cart"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <IoMdCart size={24} />
                                    {totalItems > 0 && (
                                        <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.6em', padding: '0.3em 0.5em' }}>
                                            {totalItems > 9 ? '9+' : totalItems}
                                        </Badge>
                                    )}
                                </span>
                                <span
                                    role="button"
                                    tabIndex={0}
                                    className="Z_header_icon mx-2 position-relative"
                                    onClick={() => navigate('/wishlist')}
                                    onKeyDown={(e) => e.key === 'Enter' && navigate('/wishlist')}
                                    title="View Wishlist"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <IoIosHeart size={24} />
                                    {wishlistItems && wishlistItems.length > 0 && (
                                        <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.6em', padding: '0.3em 0.5em' }}>
                                            {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                                        </Badge>
                                    )}
                                </span>
                            </div>
                            {/* <Button variant="success" className="Z_new_product_btn" onClick={handleNewProduct}>
                                + New Product
                            </Button> */}
                        </div>
                    </Col>
                </Row>

                <Row>
                    {/* Filter sidebar for larger screens */}
                    <Col xl={3} lg={12} md={12} className="d-none d-xl-block">
                        <div className="Z_filter_sidebar">
                            {/* Category Filter */}
                            <div className="Z_filter_group">
                                <button
                                    className="Z_filter_button"
                                    onClick={() => handleFilterChange('expandedFilter', filters.expandedFilter === 'categories' ? null : 'categories')}
                                >
                                    Categories
                                    <FaChevronDown className={`Z_chevron ${filters.expandedFilter === 'categories' ? 'Z_chevron_rotated' : ''}`} />
                                </button>
                                <div className={`Z_filter_content ${filters.expandedFilter === 'categories' ? 'Z_filter_content_show' : ''}`}>
                                    <Form.Check
                                        type="checkbox"
                                        label="All Categories"
                                        className="Z_filter_option"
                                        checked={filters.selectedCategories.length === 0}
                                        onChange={() => handleFilterChange('selectedCategories', [])}
                                    />
                                    {categories && categories.map((category) => (
                                        <Form.Check
                                            key={category._id}
                                            type="checkbox"
                                            label={category.title}
                                            className="Z_filter_option"
                                            checked={filters.selectedCategories.includes(category._id)}
                                            onChange={() => handleFilterChange('selectedCategories', prev => {
                                                if (prev.includes(category._id)) {
                                                    return prev.filter(id => id !== category._id);
                                                } else {
                                                    return [...prev, category._id];
                                                }
                                            })}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Subcategory Filter */}
                            <div className="Z_filter_group">
                                <button
                                    className="Z_filter_button"
                                    onClick={() => handleFilterChange('expandedFilter', filters.expandedFilter === 'subcategories' ? null : 'subcategories')}
                                >
                                    Subcategories
                                    <FaChevronDown className={`Z_chevron ${filters.expandedFilter === 'subcategories' ? 'Z_chevron_rotated' : ''}`} />
                                </button>
                                <div className={`Z_filter_content ${filters.expandedFilter === 'subcategories' ? 'Z_filter_content_show' : ''}`}>
                                    <Form.Check
                                        type="checkbox"
                                        label="All Subcategories"
                                        className="Z_filter_option"
                                        checked={filters.selectedSubcategories.length === 0}
                                        onChange={() => handleFilterChange('selectedSubcategories', [])}
                                    />
                                    {subcategories && subcategories
                                        .filter(subcategory =>
                                            filters.selectedCategories.length === 0 ||
                                            filters.selectedCategories.includes(subcategory.category._id)
                                        )
                                        .map((subcategory) => (
                                            <Form.Check
                                                key={subcategory._id}
                                                type="checkbox"
                                                label={`${subcategory.category && subcategory.category.title ? subcategory.category.title : 'No Category'} - ${subcategory.subcategoryTitle}`}
                                                className="Z_filter_option"
                                                checked={filters.selectedSubcategories.includes(subcategory._id)}
                                                onChange={() => handleFilterChange('selectedSubcategories', prev => {
                                                    if (prev.includes(subcategory._id)) {
                                                        return prev.filter(id => id !== subcategory._id);
                                                    } else {
                                                        return [...prev, subcategory._id];
                                                    }
                                                })}
                                            />
                                        ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="Z_filter_group">
                                <button
                                    className="Z_filter_button"
                                    onClick={() => handleFilterChange('expandedFilter', filters.expandedFilter === 'price' ? null : 'price')}
                                >
                                    Product Price
                                    <FaChevronDown className={`Z_chevron ${filters.expandedFilter === 'price' ? 'Z_chevron_rotated' : ''}`} />
                                </button>
                                <div className={`Z_filter_content ${filters.expandedFilter === 'price' ? 'Z_filter_content_show' : ''}`}>
                                    <Form.Check
                                        type="radio"
                                        name="price"
                                        id="price-under50"
                                        label="Under $50"
                                        className="Z_filter_option"
                                        checked={filters.selectedPriceRange === 'under50'}
                                        onChange={() => handleFilterChange('selectedPriceRange', 'under50')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="price"
                                        id="price-50to100"
                                        label="$50 - $100"
                                        className="Z_filter_option"
                                        checked={filters.selectedPriceRange === '50to100'}
                                        onChange={() => handleFilterChange('selectedPriceRange', '50to100')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="price"
                                        id="price-100to200"
                                        label="$100 - $200"
                                        className="Z_filter_option"
                                        checked={filters.selectedPriceRange === '100to200'}
                                        onChange={() => handleFilterChange('selectedPriceRange', '100to200')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="price"
                                        id="price-over200"
                                        label="Over $200"
                                        className="Z_filter_option"
                                        checked={filters.selectedPriceRange === 'over200'}
                                        onChange={() => handleFilterChange('selectedPriceRange', 'over200')}
                                    />
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button className="Z_apply_button" onClick={() => {
                                    // Apply filters logic can be added here if needed
                                }}>
                                    Apply
                                </button>
                                <button className="Z_reset_button" onClick={() => {
                                    // Reset all filters
                                    setFilters({
                                        expandedFilter: null,
                                        showOffcanvas: false,
                                        selectedCategories: [],
                                        selectedSubcategories: [],
                                        selectedPriceRange: '',
                                        searchQuery: ''
                                    });
                                    // Reset all form checkboxes
                                    document.querySelectorAll('.Z_filter_option input[type="checkbox"]').forEach(checkbox => {
                                        checkbox.checked = false;
                                    });
                                    document.querySelectorAll('.Z_filter_option input[type="radio"]').forEach(radio => {
                                        radio.checked = false;
                                    });
                                }}>
                                    Reset
                                </button>
                            </div>
                        </div>
                    </Col>

                    {/* Offcanvas for smaller screens */}
                    <Offcanvas
                        show={filters.showOffcanvas}

                        onHide={() => handleFilterChange('showOffcanvas', false)}
                        placement="start"
                        className={`Z_offcan_width ${isDarkMode ? 'd_dark' : 'd_light'}`}
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Filters</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <div className='Z_input_grp mb-4'>
                                <InputGroup>
                                    <Form.Control
                                        placeholder="Search products..."
                                        className="Z_search_input"
                                        value={filters.searchQuery}
                                        onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                                    />
                                    <InputGroup.Text className="Z_search_icon">
                                        <BiSearchAlt size={20} />
                                    </InputGroup.Text>
                                </InputGroup>
                            </div>
                            <div className="Z_filter_sidebar">
                                {/* Category Filter */}
                                <div className="Z_filter_group">
                                    <button
                                        className="Z_filter_button"
                                        onClick={() => handleFilterChange('expandedFilter', filters.expandedFilter === 'categories' ? null : 'categories')}
                                    >
                                        Categories
                                        <FaChevronDown className={`Z_chevron ${filters.expandedFilter === 'categories' ? 'Z_chevron_rotated' : ''}`} />
                                    </button>
                                    <div className={`Z_filter_content ${filters.expandedFilter === 'categories' ? 'Z_filter_content_show' : ''}`}>
                                        <Form.Check
                                            type="checkbox"
                                            label="All Categories"
                                            className="Z_filter_option"
                                            checked={filters.selectedCategories.length === 0}
                                            onChange={() => handleFilterChange('selectedCategories', [])}
                                        />
                                        {categories && categories.map((category) => (
                                            <Form.Check
                                                key={category._id}
                                                type="checkbox"
                                                label={category.title}
                                                className="Z_filter_option"
                                                checked={filters.selectedCategories.includes(category._id)}
                                                onChange={() => handleFilterChange('selectedCategories', prev => {
                                                    if (prev.includes(category._id)) {
                                                        return prev.filter(id => id !== category._id);
                                                    } else {
                                                        return [...prev, category._id];
                                                    }
                                                })}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Subcategory Filter */}
                                <div className="Z_filter_group">
                                    <button
                                        className="Z_filter_button"
                                        onClick={() => handleFilterChange('expandedFilter', filters.expandedFilter === 'subcategories' ? null : 'subcategories')}
                                    >
                                        Subcategories
                                        <FaChevronDown className={`Z_chevron ${filters.expandedFilter === 'subcategories' ? 'Z_chevron_rotated' : ''}`} />
                                    </button>
                                    <div className={`Z_filter_content ${filters.expandedFilter === 'subcategories' ? 'Z_filter_content_show' : ''}`}>
                                        <Form.Check
                                            type="checkbox"
                                            label="All Subcategories"
                                            className="Z_filter_option"
                                            checked={filters.selectedSubcategories.length === 0}
                                            onChange={() => handleFilterChange('selectedSubcategories', [])}
                                        />
                                        {subcategories && subcategories
                                            .filter(subcategory =>
                                                filters.selectedCategories.length === 0 ||
                                                filters.selectedCategories.includes(subcategory.category._id)
                                            )
                                            .map((subcategory) => (
                                                <Form.Check
                                                    key={subcategory._id}
                                                    type="checkbox"
                                                    label={`${subcategory.category && subcategory.category.title ? subcategory.category.title : 'No Category'} - ${subcategory.subcategoryTitle}`}
                                                    className="Z_filter_option"
                                                    checked={filters.selectedSubcategories.includes(subcategory._id)}
                                                    onChange={() => handleFilterChange('selectedSubcategories', prev => {
                                                        if (prev.includes(subcategory._id)) {
                                                            return prev.filter(id => id !== subcategory._id);
                                                        } else {
                                                            return [...prev, subcategory._id];
                                                        }
                                                    })}
                                                />
                                            ))}
                                    </div>
                                </div>

                                {/* Price Filter */}
                                <div className="Z_filter_group">
                                    <button
                                        className="Z_filter_button"
                                        onClick={() => handleFilterChange('expandedFilter', filters.expandedFilter === 'price' ? null : 'price')}
                                    >
                                        Product Price
                                        <FaChevronDown className={`Z_chevron ${filters.expandedFilter === 'price' ? 'Z_chevron_rotated' : ''}`} />
                                    </button>
                                    <div className={`Z_filter_content ${filters.expandedFilter === 'price' ? 'Z_filter_content_show' : ''}`}>
                                        <Form.Check
                                            type="radio"
                                            name="price-mobile"
                                            id="price-under50-mobile"
                                            label="Under $50"
                                            className="Z_filter_option"
                                            checked={filters.selectedPriceRange === 'under50'}
                                            onChange={() => handleFilterChange('selectedPriceRange', 'under50')}
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="price-mobile"
                                            id="price-50to100-mobile"
                                            label="$50 - $100"
                                            className="Z_filter_option"
                                            checked={filters.selectedPriceRange === '50to100'}
                                            onChange={() => handleFilterChange('selectedPriceRange', '50to100')}
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="price-mobile"
                                            id="price-100to200-mobile"
                                            label="$100 - $200"
                                            className="Z_filter_option"
                                            checked={filters.selectedPriceRange === '100to200'}
                                            onChange={() => handleFilterChange('selectedPriceRange', '100to200')}
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="price-mobile"
                                            id="price-over200-mobile"
                                            label="Over $200"
                                            className="Z_filter_option"
                                            checked={filters.selectedPriceRange === 'over200'}
                                            onChange={() => handleFilterChange('selectedPriceRange', 'over200')}
                                        />
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="Z_apply_button" onClick={() => {
                                        // Apply filters logic can be added here if needed
                                    }}>
                                        Apply
                                    </button>
                                    <button className="Z_reset_button" onClick={() => {
                                        // Reset all filters
                                        setFilters({
                                            expandedFilter: null,
                                            showOffcanvas: false,
                                            selectedCategories: [],
                                            selectedSubcategories: [],
                                            selectedPriceRange: '',
                                            searchQuery: ''
                                        });
                                        // Reset all form checkboxes
                                        document.querySelectorAll('.Z_filter_option input[type="checkbox"]').forEach(checkbox => {
                                            checkbox.checked = false;
                                        });
                                        document.querySelectorAll('.Z_filter_option input[type="radio"]').forEach(radio => {
                                            radio.checked = false;
                                        });
                                    }}>
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </Offcanvas.Body>
                    </Offcanvas>

                    <Col xl={9} lg={12} md={12}>
                        <Row>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <Col key={product._id} lg={4} md={6} sm={6} xs={12} className="mb-4">
                                        <Card className="h-100 Z_product_card">
                                            <div className="Z_product_image">
                                                <img
                                                    src={`${IMG_URL}${product.images?.[0]}`}
                                                    alt={product.productName}
                                                />
                                            </div>
                                            <div className="Z_product_info">
                                                <h3 className="Z_product_title">{product.productName}</h3>
                                                <div className="Z_product_category">
                                                    {product.categoryId && categories.find(cat => cat._id === product.categoryId._id)?.title || 'No Category'}
                                                </div>
                                                <div className="Z_product_price">
                                                    <span className="Z_price_current">${product.price}</span>
                                                    {product.discount > 0 && (
                                                        <>
                                                            <span className="Z_price_original">
                                                                ${(product.price * (1 + product.discount / 100)).toFixed(2)}
                                                            </span>
                                                            <span className="Z_discount">({product.discount}% Off)</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="Z_product_actions gap-2 d-flex align-items-center justify-content-between">
                                                    <Button
                                                        className="Z_add_to_cart_btn"
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        Add To Cart
                                                    </Button>
                                                    <div
                                                        className="Z_wishlist_btn"
                                                        onClick={() => handleWishlistToggle(product)}
                                                    >
                                                        {isProductInWishlist(product._id) ? (
                                                            <IoMdHeart size={24} color="red" />
                                                        ) : (
                                                            <IoMdHeartEmpty size={24} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col xs={12} className="text-center py-5">
                                    <div className="Z_no_data_wrapper">
                                        <img 
                                            src="https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-3678255-3098784.png" 
                                            alt="No Products Found"
                                            className="Z_no_data_image"
                                        />
                                        <h3 className="Z_no_data_title">No Products Found</h3>
                                        <p className="Z_no_data_text">Try adjusting your search or filter to find what you're looking for.</p>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            </section>
        </>
    );
}

export default ProductGrid;