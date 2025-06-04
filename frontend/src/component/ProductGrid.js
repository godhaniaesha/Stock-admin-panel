import React, { useState, useEffect } from 'react';
import '../styles/Z_styles.css';
import { Container, Row, Col, Form, InputGroup, Button, Offcanvas } from 'react-bootstrap';
import { FaSearch, FaCog, FaFilter, FaChevronDown, FaHeart } from 'react-icons/fa';
import { BiSearchAlt } from 'react-icons/bi';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slice/product.slice';

function ProductGrid() {
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();
    const [expandedFilter, setExpandedFilter] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const { products, isLoading, error } = useSelector((state) => state.product);
    // console.log(products,"products");
    

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const toggleFilter = (filterName) => {
        setExpandedFilter(expandedFilter === filterName ? null : filterName);
    };

    if (isLoading) {
        return <div className="text-center p-5">Loading products...</div>;
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
                            <Button variant="success" className="Z_new_product_btn">
                                + New Product
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Row>
                    {/* Filter sidebar for larger screens */}
                    <Col xl={3} lg={12} md={12} className="d-none d-xl-block">
                        <div className="Z_filter_sidebar">
                            <div className="Z_filter_group">
                                <button
                                    className="Z_filter_button"
                                    onClick={() => toggleFilter('categories')}
                                >
                                    Categories
                                    <FaChevronDown className={`Z_chevron ${expandedFilter === 'categories' ? 'Z_chevron_rotated' : ''}`} />
                                </button>
                                <div className={`Z_filter_content ${expandedFilter === 'categories' ? 'Z_filter_content_show' : ''}`}>
                                    <Form.Check type="checkbox" label="All Categories" className="Z_filter_option" />
                                    <Form.Check type="checkbox" label="Fashion Men, Women & Kid's" className="Z_filter_option" />
                                    <Form.Check type="checkbox" label="Eye Ware & Sunglass" className="Z_filter_option" />
                                    <Form.Check type="checkbox" label="Watches" className="Z_filter_option" />
                                    <Form.Check type="checkbox" label="Electronics Items" className="Z_filter_option" />
                                    <Form.Check type="checkbox" label="Furniture" className="Z_filter_option" />
                                    <Form.Check type="checkbox" label="Headphones" className="Z_filter_option" />
                                    <Form.Check type="checkbox" label="Beauty & Health" className="Z_filter_option" />
                                    <Form.Check type="checkbox" label="Foot Ware" className="Z_filter_option" />
                                </div>
                            </div>

                            <div className="Z_filter_group">
                                <button
                                    className="Z_filter_button"
                                    onClick={() => toggleFilter('price')}
                                >
                                    Product Price
                                    <FaChevronDown className={`Z_chevron ${expandedFilter === 'price' ? 'Z_chevron_rotated' : ''}`} />
                                </button>
                                <div className={`Z_filter_content ${expandedFilter === 'price' ? 'Z_filter_content_show' : ''}`}>
                                    <Form.Check type="radio" name="price" label="Under $50" className="Z_filter_option" />
                                    <Form.Check type="radio" name="price" label="$50 - $100" className="Z_filter_option" />
                                    <Form.Check type="radio" name="price" label="$100 - $200" className="Z_filter_option" />
                                    <Form.Check type="radio" name="price" label="Over $200" className="Z_filter_option" />
                                </div>
                            </div>

                            <div className="Z_filter_group">
                                <button
                                    className="Z_filter_button"
                                    onClick={() => toggleFilter('gender')}
                                >
                                    Gender
                                    <FaChevronDown className={`Z_chevron ${expandedFilter === 'gender' ? 'Z_chevron_rotated' : ''}`} />
                                </button>
                                <div className={`Z_filter_content ${expandedFilter === 'gender' ? 'Z_filter_content_show' : ''}`}>
                                    <Form.Check type="radio" name="gender" label="Men" className="Z_filter_option" />
                                    <Form.Check type="radio" name="gender" label="Women" className="Z_filter_option" />
                                    <Form.Check type="radio" name="gender" label="Unisex" className="Z_filter_option" />
                                </div>
                            </div>

                            <div className="Z_filter_group">
                                <button
                                    className="Z_filter_button"
                                    onClick={() => toggleFilter('size')}
                                >
                                    Size & Fit
                                    <FaChevronDown className={`Z_chevron ${expandedFilter === 'size' ? 'Z_chevron_rotated' : ''}`} />
                                </button>
                                <div className={`Z_filter_content ${expandedFilter === 'size' ? 'Z_filter_content_show' : ''}`}>
                                    <Form.Check type="checkbox" label="Small" className="Z_filter_option" />
                                    <Form.Check type="checkbox" label="Medium" className="Z_filter_option" />
                                    <Form.Check type="checkbox" label="Large" className="Z_filter_option" />
                                    <Form.Check type="checkbox" label="X-Large" className="Z_filter_option" />
                                </div>
                            </div>

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
                                        id="rating1"
                                        label={<>1 ★ & Above <span>(437)</span></>}
                                        name="rating"
                                        className="Z_rating_option"
                                    />
                                    <Form.Check
                                        type="radio"
                                        id="rating2"
                                        label={<>2 ★ & Above <span>(657)</span></>}
                                        name="rating"
                                        className="Z_rating_option"
                                    />
                                    <Form.Check
                                        type="radio"
                                        id="rating3"
                                        label={<>3 ★ & Above <span>(1,897)</span></>}
                                        name="rating"
                                        className="Z_rating_option"
                                    />
                                    <Form.Check
                                        type="radio"
                                        id="rating4"
                                        label={<>4 ★ & Above <span>(3,571)</span></>}
                                        name="rating"
                                        className="Z_rating_option"
                                    />
                                </div>
                            </div>

                            <button className="Z_apply_button">
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
                                <div className="Z_filter_group">
                                    <button
                                        className="Z_filter_button"
                                        onClick={() => toggleFilter('categories')}
                                    >
                                        Categories
                                        <FaChevronDown className={`Z_chevron ${expandedFilter === 'categories' ? 'Z_chevron_rotated' : ''}`} />
                                    </button>
                                    <div className={`Z_filter_content ${expandedFilter === 'categories' ? 'Z_filter_content_show' : ''}`}>
                                        <Form.Check type="checkbox" label="Electronics" className="Z_filter_option" />
                                        <Form.Check type="checkbox" label="Clothing" className="Z_filter_option" />
                                        <Form.Check type="checkbox" label="Books" className="Z_filter_option" />
                                    </div>
                                </div>

                                <div className="Z_filter_group">
                                    <button
                                        className="Z_filter_button"
                                        onClick={() => toggleFilter('price')}
                                    >
                                        Product Price
                                        <FaChevronDown className={`Z_chevron ${expandedFilter === 'price' ? 'Z_chevron_rotated' : ''}`} />
                                    </button>
                                    <div className={`Z_filter_content ${expandedFilter === 'price' ? 'Z_filter_content_show' : ''}`}>
                                        <Form.Check type="radio" name="price" label="Under $50" className="Z_filter_option" />
                                        <Form.Check type="radio" name="price" label="$50 - $100" className="Z_filter_option" />
                                        <Form.Check type="radio" name="price" label="$100 - $200" className="Z_filter_option" />
                                        <Form.Check type="radio" name="price" label="Over $200" className="Z_filter_option" />
                                    </div>
                                </div>

                                <div className="Z_filter_group">
                                    <button
                                        className="Z_filter_button"
                                        onClick={() => toggleFilter('gender')}
                                    >
                                        Gender
                                        <FaChevronDown className={`Z_chevron ${expandedFilter === 'gender' ? 'Z_chevron_rotated' : ''}`} />
                                    </button>
                                    <div className={`Z_filter_content ${expandedFilter === 'gender' ? 'Z_filter_content_show' : ''}`}>
                                        <Form.Check type="radio" name="gender" label="Men" className="Z_filter_option" />
                                        <Form.Check type="radio" name="gender" label="Women" className="Z_filter_option" />
                                        <Form.Check type="radio" name="gender" label="Unisex" className="Z_filter_option" />
                                    </div>
                                </div>

                                <div className="Z_filter_group">
                                    <button
                                        className="Z_filter_button"
                                        onClick={() => toggleFilter('size')}
                                    >
                                        Size & Fit
                                        <FaChevronDown className={`Z_chevron ${expandedFilter === 'size' ? 'Z_chevron_rotated' : ''}`} />
                                    </button>
                                    <div className={`Z_filter_content ${expandedFilter === 'size' ? 'Z_filter_content_show' : ''}`}>
                                        <Form.Check type="checkbox" label="Small" className="Z_filter_option" />
                                        <Form.Check type="checkbox" label="Medium" className="Z_filter_option" />
                                        <Form.Check type="checkbox" label="Large" className="Z_filter_option" />
                                        <Form.Check type="checkbox" label="X-Large" className="Z_filter_option" />
                                    </div>
                                </div>

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
                                            id="rating1"
                                            label={<>1 ★ & Above <span>(437)</span></>}
                                            name="rating"
                                            className="Z_rating_option"
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="rating2"
                                            label={<>2 ★ & Above <span>(657)</span></>}
                                            name="rating"
                                            className="Z_rating_option"
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="rating3"
                                            label={<>3 ★ & Above <span>(1,897)</span></>}
                                            name="rating"
                                            className="Z_rating_option"
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="rating4"
                                            label={<>4 ★ & Above <span>(3,571)</span></>}
                                            name="rating"
                                            className="Z_rating_option"
                                        />
                                    </div>
                                </div>

                                <button className="Z_apply_button">
                                    Apply
                                </button>
                            </div>
                        </Offcanvas.Body>
                    </Offcanvas>

                    <Col xl={9} lg={12} md={12}>
                        <Row>
                            {products?.map((product) => (
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
                                            <div className="Z_product_category">{product.category?.title || 'No Category'}</div>
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