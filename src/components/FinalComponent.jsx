import React from "react";
import tree from "./../assets/tree.png";

const FinalComponent = ({ carbonCount }) => {
  return (
    <div style={{paddingTop:"50px"}}>
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
      
    </div>
  );
};

export default FinalComponent;
