import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export function FinalPage (props) {
  const location = useLocation();
  const { zip, familySize, answers, carbonFootprint, numberOfTrees } = location.state || {};

    const navigate = useNavigate();

    const navigateToHome = () => {
        navigate('/');
    }
    const handleadmin = () => {
        navigate('/admin'); // Use navigate to go to the desired route
    };
    const handleContactUs = () => {
        navigate('/ContactUs'); // Use navigate to go to the desired route
    };
    // Handler for the 'Previous Page' button
    const handlePrevious = () => {
        navigate('/question'); // Replace with your previous question page route
    };

    // Handler for the 'Plant Trees' button
    const handlePlantTrees = () => {
        navigate('/amountpage'); // Navigate to the amount page
    };
    if (!carbonFootprint || !numberOfTrees) {

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: 'white' }}>
      
          {/* <div style={{ width: '110px', height: '29px', left: '958px', top: '102px', position: 'absolute', background: '#A7C8A3' }} /> */}
      
          {/* <div style={{ width: '1178px', height: '25px', left: '128px', top: '106px', position: 'absolute' }}>
            <div style={{ left: '614px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer'}}onClick={navigateToHome}>Home</div>
            <div style={{ left: '0px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 800 }}>OFFSET CRBN</div>
            <div style={{ left: '711px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600 }}>About Us</div>
            <div style={{ left: '837px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600 }}>Calculator</div>
            <div style={{ left: '1070px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer'}}onClick={handleContactUs}>Contact Us</div>
          </div> */}

<nav className="nav-bar" style={{ borderBottom: '1px solid #000', display: 'flex', width: '110%' }}>
                <div className="leftnav">
                    <img className="mainlogo" src="/logo2.png" alt="OFFSET CRBN" />
                </div>
                <div className="rightnav">
                    <a href="#" onClick={navigateToHome}>Home</a>
                    <a href="#">About Us</a>
                    <a href="#" className ="selected">Calculator</a>
                    <a href="#" onClick={handleadmin}>Admin</a>
                    <a href="#" onClick={handleContactUs}>Contact Us</a>
                </div>

    </nav>
      
          <div style={{ width: '1400px', height: '50px', left: '-10px', top: '975px', position: 'absolute', background: '#ff9d76', border: '1px black solid', backdropFilter: 'blur(4px)' }} />
      
          {/* <div style={{ width: '1451px', height: '0px', left: '-5px', top: '134px', position: 'absolute', border: '1px black solid' }} /> */}
      
          <div style={{ width: '885px', height: '655px', left: '124px', top: '225px', position: 'absolute' }}>
            <div style={{ width: '885px', height: '655px', left: '0px', top: '-75px', position: 'absolute', background: 'rgba(217, 217, 217, 0.12)', borderRadius: '30px' }} />
            <div style={{ width: '200px', height: '56px', left: '204px', top: '450px', position: 'absolute' }}>
              <div style={{ width: '184.66px', height: '56px', left: '0px', top: '0px', position: 'absolute', background: 'black', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '300px', border: '1px black solid' }} />
              <div style={{ width: '171.05px', left: '28.95px', top: '15px', position: 'absolute', color: 'white', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word', cursor: 'pointer'}}onClick={handlePrevious}>Previous Page</div>
            </div>
            <div style={{ width: '214.05px', height: '56px', left: '504px', top: '450px', position: 'absolute' }}>
              <div style={{ width: '184.66px', height: '56px', left: '0px', top: '0px', position: 'absolute', background: 'black', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '300px', border: '1px black solid' }} />
              <div style={{ width: '171.05px', left: '43px', top: '15px', position: 'absolute', color: 'white', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, cursor: 'pointer'}} onClick={handlePlantTrees}>Plant Trees</div>
            </div>
            <div style={{ width: '683px', height: '167px', left: '101px', top: '131px', position: 'absolute' }} />
            <div style={{ left: '324px', top: '43px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 500 }}>Your total carbon footprint </div>
            <div style={{ left: '210px', top: '246px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 500 }}>No. of Trees to be planted to offset carbon footprints</div>
          </div>
      
          <div style={{ width: '322px', height: '108px', left: '406px', top: '324px', position: 'absolute', background: '#D9D9D9', borderRadius: '15px' }} />
          <div style={{ width: '322px', height: '109px', left: '406px', top: '523px', position: 'absolute', background: '#D9D9D9', borderRadius: '15px' }} />
      
          <div style={{ width: '671px', height: '655px', left: '642px', top: '225px', position: 'absolute' }}>
            <img style={{ width: '75px', height: '86px', left: '0px', top: '311px', position: 'absolute', mixBlendMode: 'color-burn' }} src="Tree.png" alt="Tree" />
            <div style={{ width: '285px', height: '550px', left: '386px', top: '0px', position: 'absolute', background: '#FAFAFA', borderRadius: '30px' }} />
            {/* <div style={{ width: '265px', height: '403px', left: '398px', top: '197px', position: 'absolute', background: '#A3C7A0', borderRadius: '30px' }} /> */}
            <div style={{ width: '300px', height: '500px', left: '398px', top: '-75px', position: 'absolute', overflow: 'hidden' }}>
    <img src="leaves.webp" alt="Background Image" style={{ width: '100%', height: '100%', borderTopLeftRadius: '30px', borderTopRightRadius: '30px' }} />
    <div style={{ position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, overflowWrap: 'break-word', bottom: '10px', backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '10px', borderRadius: '0 0 30px 30px' }}>
        Buildings account for nearly 40% of global carbon emissions, with residential homes contributing a large portion due to heating, cooling, and electricity consumption.
    </div>
</div>


          </div>
      
          <div style={{ left: '498px', top: '346px', position: 'absolute', color: 'black', fontSize: '50px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 800 }}>{carbonFootprint || "N/A"} </div>
          <div style={{ left: '544px', top: '546px', position: 'absolute', color: 'black', fontSize: '50px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 800 }}>{numberOfTrees || "N/A"}</div>
          <div style={{ width: '71px', height: '30px', left: '657px', top: '376px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 800 }}>lbs</div>
          {/* <div style={{ left: '1112px', top: '106px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer'}}onClick={handleadmin}>Admin</div> */}
          
        </div>
      );
    }
      

}
export default FinalPage;