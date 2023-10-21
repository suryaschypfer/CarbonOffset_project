// ValuesLandingPage.tsx
import React,  { useState }from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
const pieChartData = {
  labels: ["Red", "Blue", "Yellow"],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
    },
  ],
};

const pieChartOptions = {
  // Your chart options...
};


const ValuesLandingPage: React.FC = () => {
    const navigate = useNavigate();
    const handlequestions = () => {
        navigate('/questions'); 
    };
    const handleadmin = () => {
        navigate('/admin'); 
    };
  return (
    <div>
    <div style={{width: '1451px', height: '0px', left: '-11px', top: '134px', position: 'absolute', border: '1px black solid'}}></div>
        <div style={{width: 1234, height: 29, left: 106, top: 105, position: 'absolute'}}>
      <div style={{width: 1127, height: 29, left: 0, top: 0, position: 'absolute'}}>
        <div style={{left: 1053, top: 2, position: 'absolute', color: 'black', fontSize: 20, fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '600', wordWrap: 'break-word',cursor: 'pointer'}}>Support</div>
        <div style={{width: 1006.25, height: 29, left: 0, top: 0, position: 'absolute'}}>
          <div style={{width: 70, height: 29, left: 705, top: 0, position: 'absolute', background: '#A7C8A3'}} />
          <div style={{width: 1006.25, height: 27, left: 0, top: 2, position: 'absolute'}}>
            <div style={{width: 54.18, height: 24.07, left: 619.11, top: 0, position: 'absolute', color: 'black', fontSize: 20, fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '600', wordWrap: 'break-word',cursor: 'pointer'}}>Home</div>
            <div style={{width: 250, height: 24.07, left: 0, top: 0.48, position: 'absolute', color: 'black', fontSize: 20, fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '800', wordWrap: 'break-word'}}>OFFSET CRBN ADMIN</div>
            <div style={{width: 60.20, height: 24.07, left: 709, top: 2, position: 'absolute', color: 'black', fontSize: 20, fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '600', wordWrap: 'break-word',cursor: 'pointer'}}>Values</div>
            <div style={{width: 73.25, height: 24.07, left: 933, top: 0, position: 'absolute', color: 'black', fontSize: 20, fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '600', wordWrap: 'break-word',cursor: 'pointer'}}>Contact</div>
            <div style={{left: 802, top: 2, position: 'absolute', color: 'black', fontSize: 20, fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '600', wordWrap: 'break-word',cursor: 'pointer'}}onClick={handlequestions}>Questions</div>
          </div>
        </div>
      </div>
      <div style={{left: 1165, top: 0, position: 'absolute', color: 'black', fontSize: 20, fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '600', wordWrap: 'break-word',cursor: 'pointer'}}onClick={handleadmin}>LogOut</div>
    </div>
      {/* <h2>Values Landing Page</h2> */}
      <div style={{width: '1000px', height: '434px', left: '100px', top: '170px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word'}}>Welcome, Admin! This is your dedicated dashboard for monitoring and analyzing website's performance. We understand the importance of data-driven decisions, and here, you'll find all the key metrics and insights you need to assess website's effectiveness.</div>
      <div style={{ overflow: "hidden", paddingTop: 75 }}>
      <div className="traffic-comp" style={{ width: "50%", float: "left" }}>
      <img style={{width: '600px', height: '400px', left: '50px', top: '250px', position: 'absolute'}} src="traffic.jpg" alt="traffic" />

      {/* <img src="traffic.jpg" style={{ height: 400 }}></img> */}
    </div>
    <div style={{ width: "50%", float: "left" }}>
    <img style={{width: '650px', height: '450px', left: '700px', top: '250px', position: 'absolute'}} src="pie.png" alt="pie" />

      {/* <img src="pie.png" style={{ height: 450, width: 650 }}></img> */}
    </div>
      </div>
    </div>
  );
};


export default ValuesLandingPage;
