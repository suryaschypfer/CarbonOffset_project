// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import AdminLogin from './components/admin_login.jsx'; // Import your AdminLogin component
// import ForgotPassword from './components/ForgotPassword.jsx'; // Import your ForgotPassword component

// function App() {
//   return (
//     <Router>
//       <div>
//         <Routes>
//           {/* Route to AdminLogin component */}
//           <Route path="/admin_login" component={AdminLogin} />

//           {/* Route to ForgotPassword component */}
//           {/*<Route path="./components/ForgotPassword" component={ForgotPassword} />*/}

//           {/* Add other routes as needed */}
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


import { Container } from 'react-bootstrap'
import React from 'react'
import toast, { Toaster } from "react-hot-toast";
import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <>
      <Toaster />
      <main className='py-3'>
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  )
}
export default App