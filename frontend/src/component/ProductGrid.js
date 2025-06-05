import React, { useState, useEffect } from 'react';
import '../styles/Z_styles.css';
import { Container, Row, Col, Form, InputGroup, Button, Offcanvas } from 'react-bootstrap';
import { FaSearch, FaCog, FaFilter, FaChevronDown, FaHeart } from 'react-icons/fa';
import { BiSearchAlt } from 'react-icons/bi';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slice/product.slice';
import { fetchCategories } from '../redux/slice/category.slice';

function ProductGrid() {
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [expandedFilter, setExpandedFilter] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [selectedRating, setSelectedRating] = useState('');

    const { products, isLoading, error } = useSelector((state) => state.product);
    const { categories, isLoading: categoriesLoading } = useSelector((state) => state.category);
    console.log(categories,"categories");

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const toggleFilter = (filterName) => {
        setExpandedFilter(expandedFilter === filterName ? null : filterName);
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const handleSubcategoryChange = (subcategoryId) => {
        setSelectedSubcategories(prev => {
            if (prev.includes(subcategoryId)) {
                return prev.filter(id => id !== subcategoryId);
            } else {
                return [...prev, subcategoryId];
            }
        });
    };

    const handlePriceChange = (priceRange) => {
        setSelectedPriceRange(priceRange);
    };

    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
    };

    const handleApplyFilters = () => {
        const filters = {
            category: selectedCategories,
            subcategory: selectedSubcategories,
            priceRange: selectedPriceRange,
            rating: selectedRating
        };
        dispatch(fetchProducts(filters));
    };

    const handleNewProduct = () => {
        navigate('/products/add');
    };

    const filterProductsByPrice = (products) => {
        if (!selectedPriceRange) return products;

        return products.filter(product => {
            const price = product.price;
            switch (selectedPriceRange) {
                case 'under50':
                    return price < 50;
                case '50to100':
                    return price >= 50 && price <= 100;
                case '100to200':
                    return price > 100 && price <= 200;
                case 'over200':
                    return price > 200;
                default:
                    return true;
            }
        });
    };

    const filterProductsByRating = (products) => {
        if (!selectedRating) return products;
        return products.filter(product => product.rating >= parseInt(selectedRating));
    };

    const filteredProducts = filterProductsByRating(
        filterProductsByPrice(
            products.filter(product => {
                const categoryMatch = selectedCategories.length === 0 || 
                    selectedCategories.includes(product.categoryId._id);
                const subcategoryMatch = selectedSubcategories.length === 0 || 
                    selectedSubcategories.includes(product.subcategoryId._id);
                return categoryMatch && subcategoryMatch;
            })
        )
    );

    if (isLoading || categoriesLoading) {
        return <div className="text-center p-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-5 text-danger">Error: {error}</div>;
    }

    return (
        <>
            <section className={`Z_product_section mx-0 mx-lg-5 my-3 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
                <Row className="Z_topbar_wrapper">
                    {/* Search input for larger screens */}
                    <Col xl={3} lg={12} className="mb-3 mb-lg-0 d-none d-xl-block">
                        <div className="Z_heading">
                            <div className='Z_input_grp'>
                                <InputGroup>
                                    <Form.Control
                                        placeholder="Search..."
                                        className="Z_search_input"
                                    />
                                    <InputGroup.Text className="Z_search_icon">
                                        <BiSearchAlt size={20} />
                                    </InputGroup.Text>
                                </InputGroup>
                            </div>
                        </div>
                    </Col>

                    <Col xl={9} lg={12} className="d_show_result d-flex justify-content-between align-items-center" style={{ background: '#fff', padding: '10px 12px', borderRadius: '8px' }}>
                        <div className="">
                            <span>Categories</span>
                            <span className="mx-2">›</span>
                            <span>All Product</span>
                            <div className="Z_results me-3">
                                Showing all {products?.length || 0} items results
                            </div>
                        </div>
                        <div className="Z_right_actions d-flex align-items-center">
                            <Button variant="outline-secondary" className="Z_filter_btn me-2 d-xl-none" onClick={() => setShowOffcanvas(true)}>
                                <FaFilter /> Filters
                            </Button>
                            <Button variant="success" className="Z_new_product_btn" onClick={handleNewProduct}>
                                + New Product
                            </Button>
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
                                    onClick={() => toggleFilter('categories')}
                                >
                                    Categories
                                    <FaChevronDown className={`Z_chevron ${expandedFilter === 'categories' ? 'Z_chevron_rotated' : ''}`} />
                                </button>
                                <div className={`Z_filter_content ${expandedFilter === 'categories' ? 'Z_filter_content_show' : ''}`}>
                                    <Form.Check 
                                        type="checkbox" 
                                        label="All Categories" 
                                        className="Z_filter_option"
                                        checked={selectedCategories.length === 0}
                                        onChange={() => setSelectedCategories([])}
                                    />
                                    {categories && categories.map((category) => (
                                        <Form.Check
                                            key={category._id}
                                            type="checkbox"
                                            label={category.title}
                                            className="Z_filter_option"
                                            checked={selectedCategories.includes(category._id)}
                                            onChange={() => handleCategoryChange(category._id)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Subcategory Filter */}
                            <div className="Z_filter_group">
                                <button
                                    className="Z_filter_button"
                                    onClick={() => toggleFilter('subcategories')}
                                >
                                    Subcategories
                                    <FaChevronDown className={`Z_chevron ${expandedFilter === 'subcategories' ? 'Z_chevron_rotated' : ''}`} />
                                </button>
                                <div className={`Z_filter_content ${expandedFilter === 'subcategories' ? 'Z_filter_content_show' : ''}`}>
                                    <Form.Check 
                                        type="checkbox" 
                                        label="All Subcategories" 
                                        className="Z_filter_option"
                                        checked={selectedSubcategories.length === 0}
                                        onChange={() => setSelectedSubcategories([])}
                                    />
                                    {categories && categories.map((category) => (
                                        category.subcategories && category.subcategories.map((subcategory) => (
                                            <Form.Check
                                                key={subcategory._id}
                                                type="checkbox"
                                                label={subcategory.title}
                                                className="Z_filter_option"
                                                checked={selectedSubcategories.includes(subcategory._id)}
                                                onChange={() => handleSubcategoryChange(subcategory._id)}
                                            />
                                        ))
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="Z_filter_group">
                                <button
                                    className="Z_filter_button"
                                    onClick={() => toggleFilter('price')}
                                >
                                    Product Price
                                    <FaChevronDown className={`Z_chevron ${expandedFilter === 'price' ? 'Z_chevron_rotated' : ''}`} />
                                </button>
                                <div className={`Z_filter_content ${expandedFilter === 'price' ? 'Z_filter_content_show' : ''}`}>
                                    <Form.Check 
                                        type="radio" 
                                        name="price" 
                                        label="Under $50" 
                                        className="Z_filter_option"
                                        checked={selectedPriceRange === 'under50'}
                                        onChange={() => handlePriceChange('under50')}
                                    />
                                    <Form.Check 
                                        type="radio" 
                                        name="price" 
                                        label="$50 - $100" 
                                        className="Z_filter_option"
                                        checked={selectedPriceRange === '50to100'}
                                        onChange={() => handlePriceChange('50to100')}
                                    />
                                    <Form.Check 
                                        type="radio" 
                                        name="price" 
                                        label="$100 - $200" 
                                        className="Z_filter_option"
                                        checked={selectedPriceRange === '100to200'}
                                        onChange={() => handlePriceChange('100to200')}
                                    />
                                    <Form.Check 
                                        type="radio" 
                                        name="price" 
                                        label="Over $200" 
                                        className="Z_filter_option"
                                        checked={selectedPriceRange === 'over200'}
                                        onChange={() => handlePriceChange('over200')}
                                    />
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="Z_filter_group">
                                <button
                                    className="Z_filter_button"
                                    onClick={() => toggleFilter('rating')}
                                >
                                    Rating
                                    <FaChevronDown className={`Z_chevron ${expandedFilter === 'rating' ? 'Z_chevron_rotated' : ''}`} />
                                </button>
                                <div className={`Z_filter_content ${expandedFilter === 'rating' ? 'Z_filter_content_show' : ''}`}>
                                    <Form.Check
                                        type="radio"
                                        name="rating"
                                        label={<>1 ★ & Above</>}
                                        className="Z_rating_option"
                                        checked={selectedRating === '1'}
                                        onChange={() => handleRatingChange('1')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="rating"
                                        label={<>2 ★ & Above</>}
                                        className="Z_rating_option"
                                        checked={selectedRating === '2'}
                                        onChange={() => handleRatingChange('2')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="rating"
                                        label={<>3 ★ & Above</>}
                                        className="Z_rating_option"
                                        checked={selectedRating === '3'}
                                        onChange={() => handleRatingChange('3')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="rating"
                                        label={<>4 ★ & Above</>}
                                        className="Z_rating_option"
                                        checked={selectedRating === '4'}
                                        onChange={() => handleRatingChange('4')}
                                    />
                                </div>
                            </div>

                            <button className="Z_apply_button" onClick={handleApplyFilters}>
                                Apply
                            </button>
                        </div>
                    </Col>

                    {/* Offcanvas for smaller screens */}
                    <Offcanvas
                        show={showOffcanvas}
                        onHide={() => setShowOffcanvas(false)}
                        placement="start"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Filters</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <div className='Z_input_grp mb-4'>
                                <InputGroup>
                                    <Form.Control
                                        placeholder="Search..."
                                        className="Z_search_input"
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
                                        onClick={() => toggleFilter('categories')}
                                    >
                                        Categories
                                        <FaChevronDown className={`Z_chevron ${expandedFilter === 'categories' ? 'Z_chevron_rotated' : ''}`} />
                                    </button>
                                    <div className={`Z_filter_content ${expandedFilter === 'categories' ? 'Z_filter_content_show' : ''}`}>
                                        <Form.Check 
                                            type="checkbox" 
                                            label="All Categories" 
                                            className="Z_filter_option"
                                            checked={selectedCategories.length === 0}
                                            onChange={() => setSelectedCategories([])}
                                        />
                                        {categories && categories.map((category) => (
                                            <Form.Check
                                                key={category._id}
                                                type="checkbox"
                                                label={category.title}
                                                className="Z_filter_option"
                                                checked={selectedCategories.includes(category._id)}
                                                onChange={() => handleCategoryChange(category._id)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Subcategory Filter */}
                                <div className="Z_filter_group">
                                    <button
                                        className="Z_filter_button"
                                        onClick={() => toggleFilter('subcategories')}
                                    >
                                        Subcategories
                                        <FaChevronDown className={`Z_chevron ${expandedFilter === 'subcategories' ? 'Z_chevron_rotated' : ''}`} />
                                    </button>
                                    <div className={`Z_filter_content ${expandedFilter === 'subcategories' ? 'Z_filter_content_show' : ''}`}>
                                        <Form.Check 
                                            type="checkbox" 
                                            label="All Subcategories" 
                                            className="Z_filter_option"
                                            checked={selectedSubcategories.length === 0}
                                            onChange={() => setSelectedSubcategories([])}
                                        />
                                        {categories && categories.map((category) => (
                                            category.subcategories && category.subcategories.map((subcategory) => (
                                                <Form.Check
                                                    key={subcategory._id}
                                                    type="checkbox"
                                                    label={subcategory.title}
                                                    className="Z_filter_option"
                                                    checked={selectedSubcategories.includes(subcategory._id)}
                                                    onChange={() => handleSubcategoryChange(subcategory._id)}
                                                />
                                            ))
                                        ))}
                                    </div>
                                </div>

                                {/* Price Filter */}
                                <div className="Z_filter_group">
                                    <button
                                        className="Z_filter_button"
                                        onClick={() => toggleFilter('price')}
                                    >
                                        Product Price
                                        <FaChevronDown className={`Z_chevron ${expandedFilter === 'price' ? 'Z_chevron_rotated' : ''}`} />
                                    </button>
                                    <div className={`Z_filter_content ${expandedFilter === 'price' ? 'Z_filter_content_show' : ''}`}>
                                        <Form.Check 
                                            type="radio" 
                                            name="price" 
                                            label="Under $50" 
                                            className="Z_filter_option"
                                            checked={selectedPriceRange === 'under50'}
                                            onChange={() => handlePriceChange('under50')}
                                        />
                                        <Form.Check 
                                            type="radio" 
                                            name="price" 
                                            label="$50 - $100" 
                                            className="Z_filter_option"
                                            checked={selectedPriceRange === '50to100'}
                                            onChange={() => handlePriceChange('50to100')}
                                        />
                                        <Form.Check 
                                            type="radio" 
                                            name="price" 
                                            label="$100 - $200" 
                                            className="Z_filter_option"
                                            checked={selectedPriceRange === '100to200'}
                                            onChange={() => handlePriceChange('100to200')}
                                        />
                                        <Form.Check 
                                            type="radio" 
                                            name="price" 
                                            label="Over $200" 
                                            className="Z_filter_option"
                                            checked={selectedPriceRange === 'over200'}
                                            onChange={() => handlePriceChange('over200')}
                                        />
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div className="Z_filter_group">
                                    <button
                                        className="Z_filter_button"
                                        onClick={() => toggleFilter('rating')}
                                    >
                                        Rating
                                        <FaChevronDown className={`Z_chevron ${expandedFilter === 'rating' ? 'Z_chevron_rotated' : ''}`} />
                                    </button>
                                    <div className={`Z_filter_content ${expandedFilter === 'rating' ? 'Z_filter_content_show' : ''}`}>
                                        <Form.Check
                                            type="radio"
                                            name="rating"
                                            label={<>1 ★ & Above</>}
                                            className="Z_rating_option"
                                            checked={selectedRating === '1'}
                                            onChange={() => handleRatingChange('1')}
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="rating"
                                            label={<>2 ★ & Above</>}
                                            className="Z_rating_option"
                                            checked={selectedRating === '2'}
                                            onChange={() => handleRatingChange('2')}
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="rating"
                                            label={<>3 ★ & Above</>}
                                            className="Z_rating_option"
                                            checked={selectedRating === '3'}
                                            onChange={() => handleRatingChange('3')}
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="rating"
                                            label={<>4 ★ & Above</>}
                                            className="Z_rating_option"
                                            checked={selectedRating === '4'}
                                            onChange={() => handleRatingChange('4')}
                                        />
                                    </div>
                                </div>

                                <button className="Z_apply_button" onClick={handleApplyFilters}>
                                    Apply
                                </button>
                            </div>
                        </Offcanvas.Body>
                    </Offcanvas>

                    <Col xl={9} lg={12} md={12}>
                        <Row>
                            {filteredProducts?.map((product) => (
                                <Col lg={3} md={4} sm={6} className="mb-4" key={product._id}>
                                    <div className="Z_product_card">
                                        <div className="Z_product_image">
                                            <img 
                                                src={product.images?.[0] || 'https://via.placeholder.com/400x400'} 
                                                alt={product.productName} 
                                            />
                                        </div>
                                        <div className="Z_product_info">
                                            <h3 className="Z_product_title">{product.productName}</h3>
                                            <div className="Z_product_category">
                                                {categories.find(cat => cat._id === product.categoryId._id)?.title || 'No Category'}
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
                                            <div className="Z_product_rating">
                                                <span>{product.rating || 0} ★</span>
                                                <span className="Z_rating_count">({product.reviews || 0} Reviews)</span>
                                            </div>
                                            <div className="Z_card_actions">
                                                <Button className="Z_add_to_cart_btn">
                                                    Add To Cart
                                                </Button>
                                                <button className="Z_card_wishlist_btn">
                                                    <FaHeart />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </section>
        </>
    );
}

export default ProductGrid;