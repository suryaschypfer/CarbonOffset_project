import React from 'react';
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router, // Use BrowserRouter as an alias
  Route,
  Routes, // Instead of createRoutesFromElements
} from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AdminLogin from './components/admin_login';
import ForgotPassword from './components/ForgotPassword';
import Questions from './components/questions';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router> {/* Use BrowserRouter as a top-level Router */}
        <Routes> {/* Use Routes to define your routes */}
          <Route path="/" element={<App />}>
            <Route index={true} path="/" element={<AdminLogin />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/questions" element={<Questions />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
