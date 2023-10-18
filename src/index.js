import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router, // Use BrowserRouter as an alias
  Route,
  Routes,NavLink // Instead of createRoutesFromElements
} from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App';
import "./components/values.css";

import reportWebVitals from './reportWebVitals';
import AdminLogin from './components/admin_login';
import Questions from './components/questions';
import Landing_Page from './components/landing_page';
import DynamicQuestionPage from './components/DynamicQuestionPage';
import SecondQuestion from './components/secondquestion';
import Third_Question from './components/thirdquestion';
import ForgotPassword from './components/ForgotPassword';
import ValuesLandingPage from './components/valuesLandingpage.tsx';
import ContactUs from "./components/ContactUs";
import { ValuesPage, Values } from "./components/valuespage";
import Utility from './components/Utility';



// const root = ReactDOM.createRoot(document.getElementById('root'));
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <Provider store={store}>
      <Router> {/* Use BrowserRouter as a top-level Router */}
        <Routes> {/* Use Routes to define your routes */}
          <Route path="/" element={<App />}>
            <Route index={true} path="/" element={<Landing_Page />} />
            <Route path="/question" element={<DynamicQuestionPage />} />
            <Route path="/secondquestion" element={<SecondQuestion />} />
            <Route path="/thirdquestion" element={<Third_Question />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/contactus" element={<ContactUs />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();