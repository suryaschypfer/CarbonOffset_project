import React, { useState } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";

const ValuesPage = ({ children }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isPanelExpanded, setPanelExpanded] = useState(false);
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    navigate(`/values/${option}`);
  };

  const togglePanel = () => {
    setPanelExpanded(!isPanelExpanded);
  };

  return (
    <div className={`values-page ${isPanelExpanded ? "panel-expanded" : ""}`}>
      <div className="side-panel">
        <div className="expand-button" onClick={togglePanel}>
          {isPanelExpanded ? (
            <i className="bi bi-list" style={{ fontSize: "2em" }}></i>
          ) : (
            <i className="bi bi-list" style={{ fontSize: "2em" }}></i>
          )}
        </div>
        <Link
          to="admin"
          className={selectedOption === "admin" ? "selected" : ""}
          onClick={() => handleOptionClick("admin")}
        >
          {isPanelExpanded ? (
            <div>
              <i
                className="bi bi-person-fill"
                style={{ fontSize: "1.5em" }}
              ></i>
              &nbsp; Admin
            </div>
          ) : (
            <i className="bi bi-person-fill" style={{ fontSize: "2em" }}></i>
          )}
        </Link>
        <Link
          to="utilities"
          className={selectedOption === "utilities" ? "selected" : ""}
          onClick={() => handleOptionClick("utilities")}
        >
          {isPanelExpanded ? (
            <div>
              <i
                className="bi bi-wrench-adjustable"
                style={{ fontSize: "1.5em" }}
              ></i>
              &nbsp; Utilities
            </div>
          ) : (
            <i
              className="bi bi-wrench-adjustable"
              style={{ fontSize: "2em" }}
            ></i>
          )}
        </Link>
        <Link
          to="payments"
          className={selectedOption === "payments" ? "selected" : ""}
          onClick={() => handleOptionClick("payments")}
        >
          {isPanelExpanded ? (
            <div>
              <i
                className="bi bi-credit-card-2-back-fill"
                style={{ fontSize: "1.5em" }}
              ></i>
              &nbsp; Payments
            </div>
          ) : (
            <i
              className="bi bi-credit-card-2-back-fill"
              style={{ fontSize: "2em" }}
            ></i>
          )}
        </Link>
        <Link
          to="zipcodes"
          className={selectedOption === "zipcodes" ? "selected" : ""}
          onClick={() => handleOptionClick("zipcodes")}
        >
          {isPanelExpanded ? (
            <div>
              <i
                className="bi bi-globe-americas"
                style={{ fontSize: "1.5em" }}
              ></i>
              &nbsp; Zip Codes
            </div>
          ) : (
            <i className="bi bi-globe-americas" style={{ fontSize: "2em" }}></i>
          )}
        </Link>
        <Link
          to="formulas"
          className={selectedOption === "formulas" ? "selected" : ""}
          onClick={() => handleOptionClick("formulas")}
        >
          {isPanelExpanded ? (
            <div>
              <i className="bi bi-percent" style={{ fontSize: "1.5em" }}></i>
              &nbsp; Formulas
            </div>
          ) : (
            <i className="bi bi-percent" style={{ fontSize: "2em" }}></i>
          )}
        </Link>
      </div>
      <div className="main-window">{children}</div>
    </div>
  );
};

const Admin = () => <div>Admin Page</div>;
const Utilities = () => <div>Utilities Page</div>;
const Payments = () => <div>Payments Page</div>;
const ZipCodes = () => <div>Zip Codes Page</div>;
const Formulas = () => <div>Formulas Page</div>;

const Values = () => {
  return (
    <Routes>
      <Route index element={<ValuesLandingPage />} />
      <Route path="/values/admin" element={<Admin />} />
      <Route path="/values/utilities" element={<Utilities />} />
      <Route path="/values/payments" element={<Payments />} />
      <Route path="/values/zipcodes" element={<ZipCodes />} />
      <Route path="/values/formulas" element={<Formulas />} />
    </Routes>
  );
};

const ValuesLandingPage = () => {
  const navigate = useNavigate();

  const handleQuestions = () => {
    navigate('/questions');
  };

  const handleAdmin = () => {
    navigate('/values/admin');
  };

  return (
    <div>
      {/* <div
        style={{
          width: '1451px',
          height: '0px',
          left: '-11px',
          top: '134px',
          position: 'absolute',
          border: '1px black solid',
        }}
      ></div> */}
      {/* <div style={{ width: 1234, height: 29, left: 106, top: 105, position: 'absolute' }}>
        <div style={{ width: 1127, height: 29, left: 0, top: 0, position: 'absolute' }}>
          <div
            style={{
              left: 1053,
              top: 2,
              position: 'absolute',
              color: 'black',
              fontSize: 20,
              fontFamily: 'Outfit',
              fontWeight: '600',
              wordWrap: 'break-word',
              cursor: 'pointer',
            }}
          >
            Support
          </div>
          <div style={{ width: 1006.25, height: 29, left: 0, top: 0, position: 'absolute' }}>
            <div style={{ width: 70, height: 29, left: 705, top: 0, position: 'absolute', background: '#A7C8A3' }} />
            <div style={{ width: 1006.25, height: 27, left: 0, top: 2, position: 'absolute' }}>
              <div
                style={{
                  width: 54.18,
                  height: 24.07,
                  left: 619.11,
                  top: 0,
                  position: 'absolute',
                  color: 'black',
                  fontSize: 20,
                  fontFamily: 'Outfit',
                  fontWeight: '600',
                  wordWrap: 'break-word',
                  cursor: 'pointer',
                }}
              >
                Home
              </div>
              <div
                style={{
                  width: 250,
                  height: 24.07,
                  left: 0,
                  top: 0.48,
                  position: 'absolute',
                  color: 'black',
                  fontSize: 20,
                  fontFamily: 'Outfit',
                  fontWeight: '800',
                  wordWrap: 'break-word',
                }}
              >
                OFFSET CRBN ADMIN
              </div>
              <div
                style={{
                  width: 60.20,
                  height: 24.07,
                  left: 709,
                  top: 2,
                  position: 'absolute',
                  color: 'black',
                  fontSize: 20,
                  fontFamily: 'Outfit',
                  fontWeight: '600',
                  wordWrap: 'break-word',
                  cursor: 'pointer',
                }}
              >
                Values
              </div>
              <div
                style={{
                  width: 73.25,
                  height: 24.07,
                  left: 933,
                  top: 0,
                  position: 'absolute',
                  color: 'black',
                  fontSize: 20,
                  fontFamily: 'Outfit',
                  fontWeight: '600',
                  wordWrap: 'break-word',
                  cursor: 'pointer',
                }}
              >
                Contact
              </div>
              <div
                style={{
                  left: 802,
                  top: 2,
                  position: 'absolute',
                  color: 'black',
                  fontSize: 20,
                  fontFamily: 'Outfit',
                  fontWeight: '600',
                  wordWrap: 'break-word',
                  cursor: 'pointer',
                }}
                onClick={handleQuestions}
              >
                Questions
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            left: 1165,
            top: 0,
            position: 'absolute',
            color: 'black',
            fontSize: 20,
            fontFamily: 'Outfit',
            fontWeight: '600',
            wordWrap: 'break-word',
            cursor: 'pointer',
          }}
          onClick={handleAdmin}
        >
          LogOut
        </div>
      </div> */}
      <div
        style={{
          width: '1000px',
          height: '434px',
          left: '230px',
          top: '170px',
          position: 'absolute',
          color: 'black',
          fontSize: '20px',
          fontFamily: 'Outfit',
          fontWeight: 400,
          wordWrap: 'break-word',
        }}
      >
        Welcome, Admin! This is your dedicated dashboard for monitoring and analyzing website's performance. We understand the importance of data-driven decisions, and here, you'll find all the key metrics and insights you need to assess website's effectiveness.
      </div>
      <div style={{ overflow: 'hidden', paddingTop: 75 }}>
        <div className="traffic-comp" style={{ width: '50%', float: 'left' }}>
          <img style={{ width: '600px', height: '400px', left: '220px', top: '250px', position: 'absolute' }} src="traffic.jpg" alt="traffic" />
        </div>
        <div style={{ width: '50%', float: 'left' }}>
          <img style={{ width: '650px', height: '450px', left: '760px', top: '250px', position: 'absolute' }} src="pie.png" alt="pie" />
        </div>
      </div>
    </div>
  );
}

export default ValuesLandingPage;
export { ValuesPage, Values };
