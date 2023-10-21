import React from 'react';
import { useNavigate } from 'react-router-dom';


function Header(props) {
    const navigate = useNavigate();
    const handleAdminNavigation = () => {
        navigate('/admin');
    };

    const handleContactUsNavigation = () => {
        navigate('/ContactUs');
    };

    return (
        <>
            <div style={{width: '110px', height: '29px', left: '820.50px', top: '50px', position: 'absolute', background: '#A7C8A3'}}></div>
            <div style={{width: '1451px', height: '0px', left: '-11px', top: '79px', position: 'absolute', border: '1px black solid'}}></div>

            <div style={{width: '1178px', height: '30px', left: '131px', position: 'absolute'}}>
                <div style={{left: '0px', top: '5px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 800, wordWrap: 'break-word', cursor: 'pointer'}}>OFFSET CRBN</div>
                <div style={{left: '716px', top: '5px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer'}}>Home</div>
                <div style={{left: '831px', top: '5px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer'}}>About Us</div>
                <div style={{left: '975px', top: '5px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer'}}onClick={handleAdminNavigation}>Admin</div>
                <div style={{left: '1070px', top: '5px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer'}}onClick={handleContactUsNavigation}>Contact Us</div>
            </div>
        </>
    );
}

export default Header;
