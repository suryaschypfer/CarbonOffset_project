import React from 'react';
import { useNavigate } from 'react-router-dom';


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
            <div className="leftnav">
                <a href="#" onClick={handlehome} >
                    <img className="mainlogo" src="/logo2.png" alt="OFFSET CRBN" />
                </a>
            </div>
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
