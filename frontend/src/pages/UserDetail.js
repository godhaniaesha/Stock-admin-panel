import React, { useEffect } from 'react';
import { Container, Card, Row, Col, Image } from 'react-bootstrap';
import { useOutletContext, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { db_fetchUserById } from '../redux/slice/userSlice';

const customStyles = `/* Your CSS remains unchanged */ 
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  :root {
    --dark-bg: #22282e;
    --dark-card-bg: #282f36;
    --dark-text: #ccd1d6;
    --dark-text-secondary: #dadee2;
    --dark-border: rgba(255, 255, 255, 0.1);
    --accent-color: #638679;
    --accent-hover-color: #4b6a5d;
    --light-bg: #f3f3f3;
    --light-card-bg: #fbf7f7;
    --light-text: #282f36;
    --light-text-secondary: #282f36;
    --light-border: rgba(12, 12, 12, 0.034);
  }
  body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .d_app-container {
    display: flex;
    flex-direction: column;
    min-height: 80vh;
    width: 100%;
  }
  .Z_product_section.light {
    background-color: var(--light-bg);
    color: var(--light-text);
  }
  .Z_product_section.dark {
    background-color: var(--dark-bg);
    color: var(--dark-text);
  }
  .d_main-container {
    flex-grow: 1;
    padding: 20px;
    max-width: 900px;
  }
  .d_user-card {
    border: 1px solid var(--light-border);
    background-color: var(--light-card-bg);
    color: var(--light-text);
    width: 100%;
    border-radius: 1rem;
  }
  .Z_product_section.dark .d_user-card {
    border: 1px solid var(--dark-border);
    background-color: var(--dark-card-bg);
    color: var(--dark-text);
  }
  .d_card-header {
    background-color: rgba(0, 0, 0, 0.03);
    border-bottom: 1px solid var(--light-border);
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
  }
  .Z_product_section.dark .d_card-header {
    background-color: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid var(--dark-border);
  }
  .d_profile-image {
    border: 4px solid var(--accent-color);
    object-fit: cover;
    width: 150px;
    height: 150px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  .d_user-name {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--accent-color);
  }
  .d_user-role {
    font-size: 1rem;
    color: var(--light-text-secondary);
  }
  .Z_product_section.dark .d_user-role {
    color: var(--dark-text-secondary);
  }
  .d_card-body {
    padding: 2.5rem;
  }
  .d_detail-label {
    font-weight: 500;
    color: var(--light-text-secondary);
    font-size: 0.9rem;
    margin-bottom: 0.2rem;
  }
  .Z_product_section.dark .d_detail-label {
    color: var(--dark-text-secondary);
  }
  .d_detail-value {
    font-weight: 400;
    font-size: 1rem;
    color: var(--light-text);
    margin-bottom: 1rem;
  }
  .Z_product_section.dark .d_detail-value {
    color: var(--dark-text);
  }
  @media (max-width: 767px) {
    .d_main-container { padding: 10px; }
    .d_user-card { border-radius: 0.75rem; }
    .d_profile-image { width: 120px; height: 120px; }
    .d_user-name { font-size: 1.5rem; }
    .d_user-role { font-size: 0.9rem; }
    .d_detail-label, .d_detail-value { font-size: 0.95rem; }
  }
`;

function UserDetail() {
  const { isDarkMode } = useOutletContext();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedUser, loading, error } = useSelector(state => state.user);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
    link.rel = "stylesheet";
    link.integrity = "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(db_fetchUserById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <>
        <style>{customStyles}</style>
        <div className={`Z_product_section ${isDarkMode ? 'dark' : 'light'}`}>
          <Container className="d_main-container d-flex justify-content-center align-items-center">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading user details...</p>
            </div>
          </Container>
        </div>
      </>
    );
  }

  if (!selectedUser && !loading) {
    return (
      <>
        <style>{customStyles}</style>
        <div className={`Z_product_section ${isDarkMode ? 'dark' : 'light'}`}>
          <Container className="d_main-container d-flex justify-content-center align-items-center">
            <div className="text-center">
              <h3>User not found</h3>
              <p>The user with ID {id} could not be found.</p>
            </div>
          </Container>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{customStyles}</style>
      <div className={`Z_product_section ${isDarkMode ? 'dark' : 'light'}`}>
        <Container className="d_main-container d-flex justify-content-center align-items-center">
          <Card className="d_user-card shadow-lg">
            <Card.Header className="d_card-header text-center py-4">
              <Image
               src={`http://localhost:2221/KAssets/profileImage/${selectedUser.profileImage}`}
               
                roundedCircle
                className="d_profile-image mb-3"
                alt={`${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/150x150/CCCCCC/000000?text=Error";
                }}
              />
              
              <Card.Title className="d_user-name mb-1">
                {selectedUser.firstName} {selectedUser.lastName}
              </Card.Title>
              <Card.Subtitle className="mb-2 d_user-role text-muted">
                {selectedUser.role || 'User'}
              </Card.Subtitle>
            </Card.Header>
            <Card.Body className="d_card-body">
              <Row className="mb-3">
                <Col md={6}>
                  <p className="d_detail-label">Email:</p>
                  <p className="d_detail-value">{selectedUser.email || 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <p className="d_detail-label">Phone:</p>
                  <p className="d_detail-value">{selectedUser.phone || selectedUser.mobile || 'N/A'}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <p className="d_detail-label">Birthdate:</p>
                  <p className="d_detail-value">
                    {selectedUser.birthdate ? new Date(selectedUser.birthdate).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric"
                    }) : 'N/A'}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="d_detail-label">Gender:</p>
                  <p className="d_detail-value text-capitalize">
                    {selectedUser.gender || 'N/A'}
                  </p>
                </Col>
              </Row>
              <div className="mb-3">
                <p className="d_detail-label">Address:</p>
                <p className="d_detail-value">
                  {selectedUser.address || ''}{selectedUser.address && selectedUser.city ? ', ' : ''}
                  {selectedUser.city || ''}{selectedUser.city && selectedUser.state ? ', ' : ''}
                  {selectedUser.state || ''}{selectedUser.state && selectedUser.country ? ', ' : ''}
                  {selectedUser.country || ''}
                </p>
              </div>
              <Row>
                <Col>
                  <p className="d_detail-label">Member Since:</p>
                  <p className="d_detail-value">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric"
                    }) : 'N/A'}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default UserDetail;
