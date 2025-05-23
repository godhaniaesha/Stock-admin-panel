import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import UserRoutes from './route/admin.route';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <Header /> */}
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
         

        </Routes>
        {/* <Footer /> */}
      </div>

    </Router>
  );
}

export default App;