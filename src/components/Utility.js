import React, { useEffect, useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './Utility.css'; // Import your CSS file
/*import datas from "./data.json"*/
import axios from 'axios'; // Import Axios library


const Utility = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const handlequestions = () => {
    navigate('/questions'); // Use navigate to go to the desired route
  };
  const handleadmin = () => {
    navigate('/admin'); // Use navigate to go to the desired route
  };

  // Function to fetch data from the server
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/Utility');
      console.log('Response data:', response.data);
      setData(response.data); // Set the data received from the API
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = () => {
    const searchInput = document.getElementById('search-input');
    const value = searchInput.value.toLowerCase();
    const filteredData = searchTable(value, data);
    setData(filteredData);
  };

  const searchTable = (value, data) => {
    const filteredData = [];
    for (let i = 0; i < data.length; i++) {
      const Utility = data[i].Utility.toLowerCase();
      if (Utility.includes(value)) {
        filteredData.push(data[i]);
      }
    }
    return filteredData;
  };


  useEffect(() => {
    handleSearch(); // Initially, show all data
  }, []);

  useEffect(() => {
    fetchData(); // Fetch data from the API when the component mounts
  }, []);

  return (
    <div>
      {/* <div className="top-nav">
      <div style={{width: 250, height: 24.07, left: 50, top: 95, position: 'absolute', color: 'black', fontSize: 20, fontFamily: 'Outfit', fontWeight: '800', wordWrap: 'break-word'}}>OFFSET CRBN ADMIN</div>
        <a href="#"><span className="Home">
          Home</span>
        </a>
        <a href="#"><span className="Values">Values</span></a>
        <a href="#"><span className="Questions" onClick={handlequestions}>Questions</span></a>
        <a href="#"><span className="Contact">Contact</span></a>
        <a href="#"><span className="Support">Support</span></a>
        <a href="#"><span className="Logout" onClick={handleadmin}>Logout</span></a>
        </div> */}

      <div className="action">
        <div className="action-item">Action item:</div>
        <div className="modify">
          <a href="#">
            <img src="/add.png" alt="add" />
          </a>
          <a href="#">
            <img src="/edit.png" alt="edit" />
          </a>
          <a href="#">
            <img src="/delete.png" alt="delete" />
          </a>
        </div>
      </div>

      <div className="utilities-and-search">
        <div className="utilities">Utilities</div>
        <div className="search-container">
          <input
            id="search-input"
            type="text"
            className='utility_input'
            placeholder="Search..."
            onChange={handleSearch}

          />
        </div>
      </div>

      <div className="sidebar">
        <div>
          <a href="#" style={{ height: '200px' }}>
            <img src="/lines.png" alt="lines" />
          </a>
        </div>
        <div>
          <a href="#">
            <img src="/admin.png" alt="admin" /></a>
        </div>
        <div>
          <a href="#">
            <img src="/utilities.png" alt="Utilities" /></a>
        </div>
        <div>
          <a href="#">
            <img src="/payment.png" alt="lines" /></a>
        </div>
        <div>
          <a href="#">
            <img src="/formulas.png" alt="formulas" /></a>
        </div>
      </div>


      <div className="table-wrapper">
        <table className="tabl-sapce">
          <thead>
            <tr className="bg-info sticky-header">
              <th>Select</th>
              <th>Val_Id</th>
              <th>Zipcode</th>
              <th>Country</th>
              <th>City</th>
              <th>Utility</th>
              <th>Utility Value</th>
              <th>Utility_Units</th>
              <th>Carbon Intensity</th>
              <th>Carbon Intensity_Unit</th>
              <th>Ref Value(lbs of Co2)</th>
              <th>Sources</th>
              <th>Date of Source</th>
            </tr>
          </thead>

          <tbody id="myTable">
            {data.map((item) => (
              <tr key={item.Val_Id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{item.Val_Id}</td>
                <td>{item.Zipcode}</td>
                <td>{item.Country}</td>
                <td>{item.City}</td>
                <td>{item.Utility}</td>
                <td>{item.Utility_Value}</td>
                <td>{item.Utility_Units}</td>
                <td>{item.Carbon_Intensity}</td>
                <td>{item.Carbon_Intensity_Unit}</td>
                <td>{item.Ref_Value}</td>
                <td>{item.Sources}</td>
                <td>{item.Date_of_Source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="back">BACK</button>

      <div className="bottom-border"></div>
    </div>
  );
}
export default Utility;
