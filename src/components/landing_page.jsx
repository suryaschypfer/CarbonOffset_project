//import './style.css'; 
import React from 'react';
//import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios library

export function Landing_Page(props) {
    const navigate = useNavigate();
    const handlefirstquestion = () => {
        navigate('/firstquestion'); // Use navigate to go to the desired route
    };
    const handleadmin = () => {
        navigate('/admin'); // Use navigate to go to the desired route
    };
  return (
    <div style={{width: '100%', height: '100%', position: 'relative', background: 'white'}}>
    <div style={{width: '110px', height: '29px', left: '820.50px', top: '98.50px', position: 'absolute', background: '#A7C8A3'}}></div>
    <div style={{width: '1178px', height: '30px', left: '131px', top: '104px', position: 'absolute'}}>
        <div style={{left: '716px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer'}}>Home</div>
        <div style={{left: '0px', top: '5px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 800, wordWrap: 'break-word', cursor: 'pointer'}}>OFFSET CRBN</div>
        <div style={{left: '831px', top: '5px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer'}}>About Us</div>
        <div style={{left: '975px', top: '5px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer'}}onClick={handleadmin}>Admin</div>
        <div style={{left: '1078px', top: '5px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer'}}>Contact Us</div>
    </div>
    <img style={{width: '842px', height: '497px', left: '598px', top: '301px', position: 'absolute'}} src="LandingPageImage.png" alt="Landing Page" />
    <div style={{width: '500px', height: '552px', left: '128px', top: '219px', position: 'absolute'}}>
        <div style={{width: '500px', height: '88px', left: '0px', top: '0px', position: 'absolute', color: 'black', fontSize: '32px', fontFamily: 'Outfit', fontWeight: 700, wordWrap: 'break-word'}}>Empowering You to Plant a Greener Future</div>
        <div style={{width: '482px', height: '434px', left: '3px', top: '118px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 400, wordWrap: 'break-word'}}>At Offset CRBN, we're on a mission to make a positive impact on our planet's health. We understand that in today's world, it's essential to take responsibility for our carbon footprint. That's why we've created a simple yet powerful platform that empowers individuals like you to take action and make a difference.</div>
    </div>
    <div style={{width: '485px', height: '397px', left: '128px', top: '526px', position: 'absolute', background: '#EDF7FC', borderRadius: '20px'}}></div>
    <div style={{width: '285px', height: '56px', left: '226px', top: '845px', position: 'absolute'}}>
    <div style={{display: 'block', width: '285px', height: '56px', left: '0px', top: '0px', position: 'absolute', background: 'rgba(97.05, 197.20, 240.12, 0.78)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '300px', border: '1px black solid', textAlign: 'center', lineHeight: '56px', textDecoration: 'none', color: 'black'}}onClick={handlefirstquestion}>
            <div style={{left: '90px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 400, wordWrap: 'break-word'}}>Get Started</div>
        </div>        
    </div>
    <div style={{width: '1451px', height: '0px', left: '-11px', top: '134px', position: 'absolute', border: '1px black solid'}}></div>
    <div style={{width: '1522px', height: '100px', left: '0px', top: '974px', position: 'absolute', background: '#9FC1A2', border: '1px black solid', backdropFilter: 'blur(4px)'}}></div>
    <div style={{width: '482px', height: '28px', left: '131px', top: '549px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 500, wordWrap: 'break-word'}}>Answer below questions to start calculating your carbon footprint</div>
    <div style={{width: '398px', height: '100px', left: '169px', top: '601px', position: 'absolute'}}>
        <div style={{width: '0.82px', height: '12px', left: '257.67px', top: '74px', position: 'absolute'}}></div>
        <div style={{width: '398px', height: '100px', left: '0px', top: '0px', position: 'absolute', background: '#84D2F3', borderRadius: '15px'}}></div>
        <div style={{left: '80px', top: '15px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 400, wordWrap: 'break-word'}}>Please enter your Zip Code</div>
        <input type="text" name="zipcode" placeholder="Enter ZIP Code" maxLength="5" style={{width: '233.88px', height: '33px', position: 'absolute', left: '82.06px', top: '53px', background: 'white', borderRadius: '300px', border: 'none', padding: '0 10px'}}/>

    </div>
    <div style={{width: '398px', height: '100px', left: '169px', top: '726px', position: 'absolute'}}>
        <div style={{width: '1px', height: '12px', left: '261px', top: '74px', position: 'absolute'}}></div>
        <div style={{width: '398px', height: '100px', left: '0px', top: '0px', position: 'absolute', background: '#84D2F3', borderRadius: '15px'}}></div>
        <div style={{left: '35px', top: '12px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 400, wordWrap: 'break-word'}}>How many members in your family?</div>
        <input type="number" name="numericValue" placeholder="Enter Number" style={{width: '234px', height: '33px', position: 'absolute', left: '80px', top: '53px', background: 'white', borderRadius: '300px', border: 'none', padding: '0 10px', outline: 'none'}} onInput={e => { if (e.target.value.length > e.target.maxLength) e.target.value = e.target.value.slice(0, e.target.maxLength); }} maxLength="10"/>

    </div>
</div>

  );
}

export default Landing_Page;