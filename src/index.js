// import React from 'react';
// import ReactDOM from 'react-dom';

// import {
//   BrowserRouter as Router, // Use BrowserRouter as an alias
//   Route,
//   Routes, // Instead of createRoutesFromElements
// } from 'react-router-dom';

// import { Provider } from 'react-redux';
// import store from './store';
// import './index.css';
// import App from './App';
// import "./components/values.css";
// import reportWebVitals from './reportWebVitals';
// import AdminLogin from './components/admin_login';
// import ForgotPassword from './components/ForgotPassword';
// import Questions from './components/questions';
// import Landing_Page from './components/landing_page';
// import First_Question from './components/firstquestion';
// import ValuesLandingPage from './components/valuesLandingpage.tsx';
// import ValuesPage from './components/valuespage'

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <Router> {/* Use BrowserRouter as a top-level Router */}
//         <Routes> {/* Use Routes to define your routes */}
//           <Route path="/" element={<App />}>
//             <Route index={true} path="/" element={<Landing_Page />} />
//             <Route path="/firstquestion" element={<First_Question />} />
//             <Route path="/admin" element={<AdminLogin />} />
//             <Route path="/forgotpassword" element={<ForgotPassword />} />
//             <Route path="/questions" element={<Questions />} />
//             <Route path="/values" element={<ValuesPage />} />
//           </Route>
//         </Routes>
//       </Router>
//     </Provider>
//   </React.StrictMode>
// );

// reportWebVitals();

import React from 'react';
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
import ForgotPassword from './components/ForgotPassword';
import Questions from './components/questions';
import Landing_Page from './components/landing_page';
import First_Question from './components/firstquestion';
import ValuesLandingPage from './components/valuesLandingpage.tsx';
import { ValuesPage, Values } from "./components/valuespage";
import Utility from './components/Utility';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <Router> {/* Use BrowserRouter as a top-level Router */}
<div className="app-container">
        <nav className="navbar">
          <div className="navbar-left">
            <span style={{ fontSize: 22 }}>Admin Portal</span>
          </div>
          <div className="navbar-right">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/values">Values</NavLink>
            <NavLink to="/questions">Questions</NavLink>
            <NavLink to="/support">Support</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/logout">Logout</NavLink>
            {/* Add other navigation links */}
          </div>
        </nav>
        <div className="main-window">
        <Routes> {/* Use Routes to define your routes */}
          <Route path="/" element={<App />}>
            <Route index={true} path="/" element={<Landing_Page />} />
            <Route path="/firstquestion" element={<First_Question />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/utility" element={<Utility />} />
            {/* <Route path="/values" element={<ValuesLandingPage />} /> */}
            <Route path="/values/*" element={<ValuesPage> <Values /> </ValuesPage> } />
            <Route path="/support" element={<div>Support</div>} />
            <Route path="/contact" element={<div>Contact</div>} />
            <Route path="/home" element={<div>Home</div>} />
            <Route path="/logout" element={<AdminLogin />} />
          </Route>
        </Routes>
        </div>
      </div>
      </Router>

    </Provider>
  </React.StrictMode>
);

reportWebVitals();