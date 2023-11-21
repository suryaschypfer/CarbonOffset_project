import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from "../logo2.png";



function Header(props) {
    const navigate = useNavigate();
    const handleAdminNavigation = () => {
        navigate('/admin');
    };
    const handlehome = () => {
        navigate('/');
    };

    const handleContactUsNavigation = () => {
        navigate('/contactus');
    };

    const handleAboutUsNavigation = () => {
        navigate('/aboutus');
    };

    return (
       
        <nav className="nav-bar" style={{ display: 'flex', width: '100%' }}>
            {/* <div className="leftnav">
                <a href="#" onClick={handlehome} >
                <span>
                    <img className="mainlogo" src="/logo2.png" alt="OFFSET CRBN" ></img>
                    </span> 
                </a>
            </div> */}
            {/* <div className="leftnav"></div> */}
            <span>
            <a href="#" onClick={handlehome} >
              <img
                src={logoImg}
                style={{ width: "300px", height: "90px", marginLeft: "50px" }}
              ></img>
              </a>
            </span>
            
            <div className="rightnav">
                <a href="#" className="selected">
                    Home
                </a>
                <a href="#" onClick={handleAboutUsNavigation}>
                    About Us
                </a>
                <a href="#">Calculator</a>
                <a href="#" onClick={handleContactUsNavigation}>
                    Contact Us
                </a>
            </div>
        </nav>
    
            
    );
}

export default Header;
