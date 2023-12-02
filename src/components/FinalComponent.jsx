import React from "react";
import tree from "./../assets/tree.png";
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);


const FinalComponent = ({ carbonCount, categoryFootprints }) => {

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
  console.log("Category foot prints", categoryFootprints)

  const options = {
    maintainAspectRatio: true, // Set to false if you want to define custom dimensions
    aspectRatio: 1, // Adjust this value to set the desired aspect ratio
    // Other options...
  };
  return (
    <div style={{ paddingTop: "50px" }}>
      <div
        style={{
          width: "40%",
          height: "100px",
          background: "white",
          margin: "25px auto",
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
          height: "100px",
          background: "white",
          margin: "25px auto",
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
      <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Pie data={pieData} options={options} />
      </div>

    </div>
  );
};

export default FinalComponent;

