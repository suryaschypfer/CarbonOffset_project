import React, {useEffect, useState} from "react";
import tree from "./../assets/tree.png";
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie , Bar} from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);


const FinalComponent = ({ carbonCount, categoryFootprints, isFinal}) => {
  const [final,updateFinal] = useState(false);
  const pieData = {
    labels: Object.keys(categoryFootprints),
    datasets: [
      {
        data: Object.values(categoryFootprints),
        backgroundColor: [
          '#FF6384', // Red
          '#36A2EB', // Blue
          '#FFCE56', // Yellow
          '#4BC0C0', // Teal
          '#9966FF', // Purple
          '#FF9F40', // Orange
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderWidth: 1,
      },
    ],
  };
  const [earlierCarbonFootprint, setEarlierCarbonFootprint] = useState(0);
  useEffect(()=>{

  
  if (isFinal) {
    // Check if there is a saved value in localStorage
    const savedCarbon = localStorage.getItem('carbonCount');

    // If there is a saved value, parse it and save it in earlierCarbon
    const earlierCarbon = savedCarbon ? parseInt(savedCarbon, 10) : null;

    // Save the latest carbonCount to localStorage
    localStorage.setItem('carbonCount', carbonCount);

    // Set earlierCarbonFootprint if it exists
    if (earlierCarbon !== null) {
      setEarlierCarbonFootprint(earlierCarbon);
    }

    console.log("Earlier Carbon Value:", earlierCarbon);
    console.log("Latest Carbon Value Saved:", carbonCount);
  }
}, [isFinal, carbonCount]);

  console.log("Category foot prints", categoryFootprints);
  // console.log("The value of final component is ", isFinal);

  const options = {
    maintainAspectRatio: true, // Set to false if you want to define custom dimensions
    aspectRatio: 1, // Adjust this value to set the desired aspect ratio
    // Other options...
  };

  // Bar chart data
  const barData = {
    labels: Object.keys(categoryFootprints),
    datasets: [
      {
        label: 'Carbon Footprint by Category',
        data: Object.values(categoryFootprints),
        backgroundColor: '#36A2EB', // Blue
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Carbon Footprint',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Categories',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const enhancedOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / carbonCount) * 100).toFixed(2);
            return `${label}: ${value} lbs (${percentage}%)`;
          },
        },
      },
    },
    title: {
      display: true,
      text: 'Carbon Footprint Distribution',
      fontSize: 16,
    },
  };
  return (
    <div style={{ paddingTop: "5vh" }}>
      <div
        style={{
          width: "40%",
          height: "13vh",
          background: "white",
          margin: "0 auto",
          marginTop:"2vh",
          marginBottom:"2vh",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p style={{ marginBottom: "10px", paddingTop: "10px", fontWeight: "bold" }}>
          No. of Trees to be planted
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              width: "50%",
              textAlign: "center",
              fontWeight: "bold",
              margin: "0 auto",
            }}
          >
            {Math.round(carbonCount / 48)}
          </div>
          <div style={{ margin: "0 auto" }}>
            <img src={tree} alt="Tree" style={{ width: "50px" }} />
          </div>
        </div>
      </div>
      <div
        style={{
          width: "40%",
          height: "13vh",
          background: "white",
          margin: "0 auto",
          marginTop:"2vh",
          marginBottom:"2vh",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p style={{ marginBottom: "10px", paddingTop: "10px", fontWeight: "bold" }}>
          Your Carbon Footprint
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              width: "50%",
              textAlign: "center",
              fontWeight: "bold",
              margin: "0 auto",
            }}
          >
            {carbonCount}
          </div>
          <div style={{ margin: "0 auto", fontSize: "30px", fontWeight: "bold" }}>
            lbs
          </div>
        </div>
      </div>
      
      <div style={{ paddingTop: '3vh', textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
      
      <div style={{ marginLeft: '10%',marginRight:"", background: 'white', width: '37%', borderRadius: '20px', height: '28vh', padding: '20px' }}>
        {/* <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '10px', justifyContent:"center" }}>Carbon Footprint Distribution</div> */}
        <Pie data={pieData} options={enhancedOptions} />
      </div>
      {/* <div style={{ marginLeft: "",marginRight:"10%", background: 'white', width: '37%', borderRadius: '20px', height: '25vh', padding: '20px' }}>
      {earlierCarbonFootprint>0?(earlierCarbonFootprint-carbonCount)>0?
    <div>you are saving carbon</div>:(earlierCarbonFootprint-carbonCount)<0?<div>You are creating more carbon</div>:<div>Same carbon as earlier</div> :
    <div>By planting {carbonCount/48} trees you can offset the total carbon footprint of {carbonCount}</div> 
    }
      </div> */}
      <div style={{ marginLeft: "", marginRight: "10%", background: 'white', width: '37%', borderRadius: '20px', height: '28vh', padding: '20px', textAlign: 'center', fontSize: '18px' }}>
  {earlierCarbonFootprint > 0 ? (
    (earlierCarbonFootprint - carbonCount) > 0 ?
      <div>
        <p style={{ color: '#4CAF50', fontSize: '26px', fontWeight: 'bold' }}>Congratulations!</p>
        <p>You've reduced your carbon footprint by <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>{earlierCarbonFootprint - carbonCount} lbs</span>.</p>
        <p>Your earlier carbon footprint was {earlierCarbonFootprint} lbs.</p>
      </div> : 
      (earlierCarbonFootprint - carbonCount) < 0 ?
        <div>
          <p style={{ color: '#FF5252', fontSize: '26px', fontWeight: 'bold' }}>Unfortunately!</p>
          <p>Your carbon footprint has increased by <span style={{ color: '#FF5252', fontWeight: 'bold' }}>{Math.abs(earlierCarbonFootprint - carbonCount)} lbs</span>.</p>
          <p>Your earlier carbon footprint was {earlierCarbonFootprint} lbs.</p>
        </div> :
        <div>
          <p style={{ color: '#3F51B5', fontSize: '26px', fontWeight: 'bold' }}>Great news!</p>
          <p>Your carbon footprint remains the same as earlier, at {carbonCount} lbs.</p>
        </div>
  ) : 
  <div>
    <p style={{ color: '#2196F3', fontSize: '26px', fontWeight: 'bold' }}>Offset Your Carbon Footprint!</p>
    <p>By planting {Math.round(carbonCount / 48)} trees, you can offset the total carbon footprint of {carbonCount} lbs.</p>
  </div>
  }
</div>

      
      </div>

    </div>
  );
};

export default FinalComponent;

