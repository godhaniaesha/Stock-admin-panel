import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import UserRoutes from './route/admin.route';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './redux/reducers';

// ✅ Toastify imports
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          {/* <Header /> */}
          <Routes>
            <Route path="/*" element={<UserRoutes />} />
          </Routes>
          {/* <Footer /> */}
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </Provider>
  );
}

export default App;