import React, { useState, useEffect } from "react";
import { baseUrl } from "../config";
import FinalComponent from "./FinalComponent";
import { Form } from "react-bootstrap";
import factLogo from "../assets/factLogo.png";
import { useNavigate,Link ,useLocation} from 'react-router-dom';
import axiosInstance from './axiosconfig';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import FinalPage from "./FinalPage";
import { useParams } from 'react-router-dom';
import tree from "./../assets/tree.png";
import Modal from
 
'react-bootstrap/Modal';
import Button from
 
'react-bootstrap/Button';
import "./ContactUs.css"

const DynamicQuestionPage2 = () => {
  const [questions, setQuestions] = useState([]);
  const [fact, setFact] = useState("");
  const [image, setImage] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [dataSourceLink, setDataSourceLink] = useState('');
  const [dataSourceText, setDataSourceText] = useState('Loading...');
  const [filteredQuestions, setFilteredQuestions] = useState(
    []
  );
  const location = useLocation();
  const codeForZip = new URLSearchParams(location.search).get('zip');
  const familySize = parseFloat( new URLSearchParams(location.search).get('familySize'));
  const navigate = useNavigate();
  const [selectedChoiceIndexes, setSelectedChoiceIndexes] = useState(
    []
  );
//   const [savedData, setSavedData] = useState({});
const [savedData, setSavedData] = useState(() => {
  try {
    const savedDataString = localStorage.getItem('savedData');
    if (savedDataString) {
      return JSON.parse(savedDataString);
    }
    return {};
  } catch (error) {
    console.error('Error retrieving saved data:', error);
    return {};
  }
});



// Your renderTooltip function
const renderTooltip = (props) => (
  <Tooltip id="button-tooltip" {...props} className="custom-tooltip">
    {dataSourceText}
  </Tooltip>
);


const [showPopup, setShowPopup] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(false);
  const [type1Ans1, setType1Ans1] = useState(0);
  const [type2Ans1, setType2Ans1] = useState(0);

  const [currentChoices, setCurrentChoices] = useState([]);
  const [currentRefs, setCurrentRefs] = useState([]);
  const [currentSelectedUnits, setCurrentSelectedUnits] = useState(
    []
  );
  const [currentSelectedFormulas, setCurrentSelectedFormulas] = useState([]);
  const [currentLabel, setCurrentLabel] = useState("");

  const [currentSelectedUnit, setCurrentSelectedUnit] = useState("");
  const [answers, setAnswers] = useState(Array(0).fill(0));
  const [currentUnitIndex, setCurrentUnitIndex] = useState(-1);
  const [mf, setMf] = useState(1);
  const [choiceIndex, setChoiceIndex] = useState(-1);
  const [carbonCount, updateCarbonCount] = useState(0);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/questionsuser`);
        console.log("Response Status:", response.status);

        if (!response.ok) {
          console.error("Failed to fetch questions:", response.statusText);
          return;
        }

        const data= await response.json();
        console.log("Fetched Data:", data);

        // Filter out questions with enabled = false
        const enabledQuestions = data.filter((question) => question.enabled);

        setQuestions(enabledQuestions);
        setFilteredQuestions(enabledQuestions);
        setAnswers(Array(enabledQuestions.length).fill(0));
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const fetchRandomFact = async () => {
    try {
      const randomValue = Math.random();
      const response = await axiosInstance.get(`/api/randomfact/${currentQuestionIndex}?nocache=${randomValue}`);


      if (response.data && response.data.fact) {
        setFact(response.data.fact);
        //console.log("Full Response:", response);
        //console.log("Fetched Fact:", response.data.fact);
      }
    } catch (error) {
      console.error('Error fetching random fact:', error);
      // Optionally set some state here to show an error to the user.
    }
  };

  useEffect(() => {
    // Call the function on component mount and when dependencies change
    renderDataSourceLink().then(dataSourceInfo => {
      setDataSourceLink(dataSourceInfo.link);
      setDataSourceText(dataSourceInfo.text);
    });
  }, [currentQuestionIndex, questions]);
  
  const fetchDataForZipcode = async () => {
    try {
      const response = await axiosInstance.post('/api/utilityzipcode', { zipcode: codeForZip });
      if (response.status === 200) {
        console.log("Successfully fetched zipcode details. Status:", response.status);
        return response.data;
      } else {
        console.error("Failed to fetch zipcode details. Status:", response.status);
        throw new Error(`Failed to fetch zipcode details. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching zipcode details:", error);
      throw error;
    }
  };
  
  const renderDataSourceLink = async () => {
    let questionLabel = "";
    let questiontext = "";
    let questionUtility = "";
  
    try {
      let isZipcodeZero = questions[currentQuestionIndex].zipcode;
      questionLabel = questions[currentQuestionIndex].label;
      questiontext = questions[currentQuestionIndex].questionContent;
  
      // Determine question utility based on question text
      if (questiontext.toLowerCase().includes("electricity")) {
        questionUtility = "Electricity";
      } else if (questiontext.toLowerCase().includes("gas") || questiontext.toLowerCase().includes("hydrogen") || questiontext.toLowerCase().includes("pallets") || questiontext.toLowerCase().includes("coal")) {
        questionUtility = "Gas";
      } else if (questiontext.toLowerCase().includes("bike") || questiontext.toLowerCase().includes("car") || questiontext.toLowerCase().includes("flight") || questiontext.toLowerCase().includes("commute") || questiontext.includes("mileage") || questiontext.includes("transport") || questiontext.includes("transit") || questiontext.includes("vehicle")) {
        questionUtility = "Fuel";
      } else if (questiontext.includes("Water") || questiontext.includes("Diet") || questiontext.includes("eat")) {
        questionUtility = "Food";
      } else if (questiontext.toLowerCase().includes("shop") || questiontext.toLowerCase().includes("groceries") || questiontext.toLowerCase().includes("clothing")) {
        questionUtility = "Shopping";
      } else if (questiontext.toLowerCase().includes("waste") || questiontext.toLowerCase().includes("recycle")) {
        questionUtility = "Waste";
      } else {
        questionUtility = "";
      }
  
      const data = await fetchDataForZipcode();
  
      if (!data || Object.keys(data).length === 0 || data === null) {
        return {
          text: "Our calculations are based on countrywide average data.",
          link: 'https://www.epa.gov/egrid',
        };
      } else if (isZipcodeZero === 0) {
        if (questionUtility === "Shopping" || questionUtility === "Food") {
          return {
            text: `Our calculations are based on the countrywide average data related to ${questionUtility} habits.`,
            link: 'https://www.epa.gov/egrid',
          };
        } else if (questionUtility === "Waste") {
          return {
            text: `Our calculations are based on countrywide average ${questionUtility} management practices.`,
            link: 'https://www.epa.gov/egrid',
          };
        } else if (questionUtility === "") {
          return {
            text: ``,
            link: 'https://www.epa.gov/egrid',
          };
        } else {
          return {
            text: `Our calculations are based on the countrywide average rates for ${questionUtility} consumption.`,
            link: 'https://www.epa.gov/egrid',
          };
        }
      } else {
        return {
          text: `Our calculations are sourced from ${data.Sources} for your zipcode ${codeForZip}.`,
          link: 'https://www.epa.gov/egrid',
        };
      }
    } catch (error) {
      console.error("Error rendering data source link:", error);
      if (questionUtility === "Shopping" || questionUtility === "Food") {
        return {
          text: `Our calculations are based on the countrywide average data related to ${questionUtility} habits.`,
          link: 'https://www.epa.gov/egrid',
        };
      } else if (questionUtility === "Waste") {
        return {
          text: `Our calculations are based on countrywide average ${questionUtility} management practices.`,
          link: 'https://www.epa.gov/egrid',
        };
      } else if (questionUtility === "") {
        return {
          text: ``,
          link: 'https://www.epa.gov/egrid',
        };
      } else {
        return {
          text: `Our calculations are based on the countrywide average rates for ${questionUtility} consumption.`,
          link: 'https://www.epa.gov/egrid',
        };
      }
    }
  };

  const fetchRandomImage = async () => {
    try {
      const randomValue = Math.random();
      const imgResponse = await axiosInstance.get(`/api/randomimage/${currentQuestionIndex}?nocache=${randomValue}`);
      if (imgResponse.data && imgResponse.data.img_name) {
        setImage(`/${imgResponse.data.img_name}`);
      }
    } catch (error) {
      console.error('Error fetching random image:', error);
      // Optionally set some state here to show an error to the user.
    }
  };
  const handleaboutus = () => {
    navigate('/aboutus'); // Use navigate to go to the desired route
  };
  const handleContactUs = () => {
    navigate('/ContactUs'); // Use navigate to go to the desired route
  };
  useEffect(() => {
    if (
      filteredQuestions.length > 0 &&
      currentQuestionIndex < filteredQuestions.length
    ) {
      // Set the state variables for the current question
      const currentQuestion = filteredQuestions[currentQuestionIndex];
      setCurrentChoices(currentQuestion.choices);
      setCurrentRefs(currentQuestion.refs);
      setCurrentSelectedUnits(currentQuestion.selectedUnits);
      setCurrentSelectedFormulas(currentQuestion.selectedFormulas);
      setCurrentLabel(currentQuestion.label);
    }
  }, [currentQuestionIndex, filteredQuestions]);

  useEffect(() => {
    // Check for savedData in local storage
    const savedDataString = localStorage.getItem('savedData');
    if (savedDataString) {
      const parsedSavedData = JSON.parse(savedDataString);
      if (Object.keys(parsedSavedData).length > 0) { // Check if savedData is empty
        setSavedData(parsedSavedData);
        setShowPopup(true);
      }
    }
  }, []);
  

  const handleLoadSavedData = () => {
    // Load savedData from local storage and update state
    const savedDataString = localStorage.getItem('savedData');
    const parsedSavedData = JSON.parse(savedDataString);
    setSavedData(parsedSavedData);

    // Close popup
    setShowPopup(false);
  };

  const handleDeleteSavedData = () => {
    // Remove savedData from local storage and update state
    localStorage.removeItem('savedData');
    setSavedData({});

    // Close popup
    setShowPopup(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  useEffect(() => {
   
    fetchRandomFact();
    fetchRandomImage();
    
    // renderDataSourceLink();
  }, [currentQuestionIndex]);

  useEffect(() => {
    localStorage.setItem('savedData', JSON.stringify(savedData));
  }, [savedData]);


  const handleNextQuestion = () => {
    // Increment the index to display the next question
    const curRealQuestionId = filteredQuestions[currentQuestionIndex].id;

    if (
      filteredQuestions[currentQuestionIndex].questionType == 2 &&
      filteredQuestions[currentQuestionIndex].choiceAns == "1"
    ) {
      setAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[currentQuestionIndex] = filteredQuestions[currentQuestionIndex].household == false ?(mf * type2Ans1):(mf*type2Ans1/ familySize);
        return updatedAnswers;
      });
      setSavedData((prevData) => ({
        ...prevData,
        [currentQuestionIndex]: {
          type1Ans1,
          mf,
          type2Ans1,
          currentSelectedUnit,
          currentUnitIndex,
          choiceIndex,
          selectedChoiceIndexes,
          curRealQuestionId,
        },
      }));
      setMf(1);
      setType2Ans1(0);
      setCurrentSelectedUnit("");
      setCurrentUnitIndex(-1);
    }

    if (
      filteredQuestions[currentQuestionIndex].questionType == 1 &&
      filteredQuestions[currentQuestionIndex].choiceAns == "2"
    ) {
      if (choiceIndex != -1) {
        setAnswers((prevAnswers) => {
          const updatedAnswers = [...prevAnswers];
          updatedAnswers[currentQuestionIndex] = filteredQuestions[currentQuestionIndex].household == false ?currentRefs[0][choiceIndex]:currentRefs[0][choiceIndex]/familySize;
          return updatedAnswers;
        });
        setSavedData((prevData) => ({
          ...prevData,
          [currentQuestionIndex]: {
            type1Ans1,
            mf,
            type2Ans1,
            currentSelectedUnit,
            currentUnitIndex,
            choiceIndex: choiceIndex,
            selectedChoiceIndexes,
            curRealQuestionId,
          },
        }));

        setChoiceIndex(-1);
      }
    }

    if (
      filteredQuestions[currentQuestionIndex].questionType == 2 &&
      filteredQuestions[currentQuestionIndex].choiceAns == "2"
    ) {
      if (choiceIndex != -1) {
        setAnswers((prevAnswers) => {
          const updatedAnswers = [...prevAnswers];
          updatedAnswers[currentQuestionIndex] = filteredQuestions[currentQuestionIndex].household == false ?
            mf * currentRefs[currentUnitIndex][choiceIndex]: (mf * currentRefs[currentUnitIndex][choiceIndex])/familySize;
          return updatedAnswers;
        });
        setSavedData((prevData) => ({
          ...prevData,
          [currentQuestionIndex]: {
            type1Ans1,
            mf,
            type2Ans1,
            currentSelectedUnit,
            currentUnitIndex,
            choiceIndex: choiceIndex,
            selectedChoiceIndexes,
            curRealQuestionId,
          },
        }));
        setMf(1);
        setChoiceIndex(-1);
        setCurrentSelectedUnit("");
        setCurrentUnitIndex(-1);
      }
    }

    if (
      filteredQuestions[currentQuestionIndex].questionType == 1 &&
      filteredQuestions[currentQuestionIndex].choiceAns == "3"
    ) {
      let sum = 0;
      selectedChoiceIndexes.map((element) => {
        console.log(currentRefs[0].toString());
        sum = sum + currentRefs[0][element];
      });

      setAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[currentQuestionIndex] = filteredQuestions[currentQuestionIndex].household == false ?sum:(sum/familySize);
        return updatedAnswers;
      });
      setSavedData((prevData) => ({
        ...prevData,
        [currentQuestionIndex]: {
          type1Ans1,
          mf,
          type2Ans1,
          currentSelectedUnit,
          currentUnitIndex,
          choiceIndex,
          selectedChoiceIndexes,
          curRealQuestionId,
        },
      }));

      setSelectedChoiceIndexes([]);
    }

    if (
      filteredQuestions[currentQuestionIndex].questionType == 2 &&
      filteredQuestions[currentQuestionIndex].choiceAns == "3"
    ) {
      let sum = 0;
      selectedChoiceIndexes.map((element) => {
        console.log(currentRefs[currentUnitIndex].toString());
        sum = sum + currentRefs[currentUnitIndex][element] * mf;
      });

      setAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[currentQuestionIndex] = filteredQuestions[currentQuestionIndex].household == false ?sum:(sum/familySize);
        return updatedAnswers;
      });
      setSavedData((prevData) => ({
        ...prevData,
        [currentQuestionIndex]: {
          type1Ans1,
          mf,
          type2Ans1,
          currentSelectedUnit,
          currentUnitIndex,
          choiceIndex,
          selectedChoiceIndexes,
          curRealQuestionId,
        },
      }));
      setMf(1);
      setCurrentSelectedUnit("");
      setCurrentUnitIndex(-1);
      setSelectedChoiceIndexes([]);
    }

    if (
      filteredQuestions[currentQuestionIndex].questionType == 1 &&
      filteredQuestions[currentQuestionIndex].choiceAns == "1"
    ) {
      setAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[currentQuestionIndex] =filteredQuestions[currentQuestionIndex].household == false ?
          filteredQuestions[currentQuestionIndex].refs[0][0] * type1Ans1:filteredQuestions[currentQuestionIndex].refs[0][0] * type1Ans1 / familySize;
        return updatedAnswers;
      });
      setSavedData((prevData) => ({
        ...prevData,
        [currentQuestionIndex]: {
          type1Ans1,
          mf,
          type2Ans1,
          currentSelectedUnit,
          currentUnitIndex,
          choiceIndex,
          selectedChoiceIndexes,
          curRealQuestionId,
        },
      }));

      setType1Ans1(0);
    }
    

    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

    // Check if all questions are completed
    if (currentQuestionIndex === filteredQuestions.length - 1) {
      setQuestionsCompleted(true);
    }
  };
  //   const calculateFormula = async (formulaName: string) => {
  //     // Make an API call to calculate the formula
  //     try {
  //       const response = await axios.post(`${baseUrl}/api/calculateFormula`, {
  //         formulaName,
  //       });

  //       // Get the result from the response
  //       const result = response.data.result;

  //       console.log(
  //         `Formula "${formulaName}" calculated successfully! Result:`,
  //         result
  //       );

  //       // You can do further processing with the result if needed
  //     } catch (error) {
  //       console.error(`Error calculating formula "${formulaName}":`, error);
  //     }
  //   };

  //   useEffect(() => {
  //     if (currentUnitIndex != -1) {
  //       const a = calculateFormula(currentSelectedFormulas[currentUnitIndex]);
  //       console.log(a);
  //     }
  //   }, [currentUnitIndex]);
  useEffect(() => {
    // Load data for the current question index
    const currentQuestionData = savedData[currentQuestionIndex];
    if (currentQuestionData) {
      setType1Ans1(currentQuestionData.type1Ans1);
      setMf(currentQuestionData.mf);
      setType2Ans1(currentQuestionData.type2Ans1);
      setCurrentSelectedUnit(currentQuestionData.currentSelectedUnit);
      setCurrentUnitIndex(currentQuestionData.currentUnitIndex);
      console.log("This is a log", currentQuestionData.choiceIndex);
      setChoiceIndex(currentQuestionData.choiceIndex);
      setSelectedChoiceIndexes(currentQuestionData.selectedChoiceIndexes);
    }
  }, [currentQuestionIndex, savedData]);

  useEffect(() => {
    console.log("This is quesid", currentQuestionIndex);
    console.log(filteredQuestions.length);
    updateProg((currentQuestionIndex * 100) / filteredQuestions.length);
    const subarray = answers.slice(0, currentQuestionIndex);

    // Calculate the sum using reduce
    const sum = subarray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    updateCarbonCount(Math.round(sum));
  }, [currentQuestionIndex]);

  useEffect(() => {
    const calculateAndSaveFormula = async () => {
      try {
        if (currentUnitIndex !== -1) {
          // Make a request to the server to calculate the formula
          const response = await fetch(`${baseUrl}/api/calculateFormula`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              formulaName: currentSelectedFormulas[currentUnitIndex],
              zipcode: codeForZip,
              // Include other required data like zipcode and utility if needed
            }),
          });

          if (!response.ok) {
            console.error("Failed to calculate formula:", response.statusText);
            // Handle the error if needed
            return;
          }

          const resultData = await response.json();
          const result = resultData.result;

          // Update the mf state with the calculated result
          console.log("setting the result: ", result);
          setMf(result);
        }
      } catch (error) {
        console.error("Error calculating formula:", error);
        // Handle the error if needed
      }
    };

    // Call the function to calculate and save the formula
    calculateAndSaveFormula();
  }, [currentUnitIndex]);
  const handleMultipleAnswerChange = (
    e,
    choiceIndex
  ) => {
    const checked = e.target.checked;

    // If checked, add the choiceIndex to the array; otherwise, remove it
    if (checked) {
      setSelectedChoiceIndexes((prevIndexes) => [...prevIndexes, choiceIndex]);
    } else {
      setSelectedChoiceIndexes((prevIndexes) =>
        prevIndexes.filter((index) => index !== choiceIndex)
      );
    }
  };
  const handlePreviousQuestion = () => {
    if(currentQuestionIndex==0){
        navigate("/");
    }
    // Decrement the index to display the previous question
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));

    // Reset the completed state if moving backward
    setQuestionsCompleted(false);
  };

  const handleInputChange1 = (event) => {
    setType1Ans1(parseFloat(event.target.value));
  };
  const handleInputChange2 = (event) => {
    setType2Ans1(parseFloat(event.target.value));
  };
  const handleSingleAnswerChange = (
    e,
    selectedChoice
  ) => {
    const checked = e.target.checked;
    console.log(selectedChoice);

    // Additional logic for handling the change...

    // Update the state if needed
    // setSavedData((prevSavedData) => {
    //     const newSavedData = { ...prevSavedData };
    
    //     if (newSavedData[currentQuestionIndex]) {
    //       // Update the choiceIndex property in savedData
    //       newSavedData[currentQuestionIndex].choiceIndex = -1;
    //     }
    
    //     return newSavedData;
    //   });
  };
  const [prog, updateProg] = useState(0);
  const navigateToHome = () => {
    navigate('/');
  }

  return (
    <><nav className="nav-bar" style={{ borderBottom: '1px solid #000', display: 'flex', width: '100%' }}>
    <div className="leftnav">
      <img className="mainlogo" src="/logo2.png" alt="OFFSET CRBN" onClick={navigateToHome}/>
    </div>
    <div className="rightnav">
      <a href="#" onClick={navigateToHome}>Home</a>
      <a href="#" onClick={handleaboutus} >About Us</a>
      <a href="#" className="selected">Calculator</a>
      {/* <a href="#">Admin</a> */}
      <a href="#" onClick={handleContactUs}>Contact Us</a>
    </div>

  </nav>
  <div
        className="container-fluid d-flex justify-content-center"
        style={{ paddingLeft: "2%", paddingRight: "2%" }}
      >

<div
        className="b1"
        style={{
          width: "70%",
          height: "80%",
          background: "",
        //   paddingTop:"0px"
          // marginTop: "100px",
        }}
      >
        <div>
          <div style={{fontSize:"18px",fontWeight:"bold",marginTop:"20px",textAlign:"center"}}>{prog.toFixed(1)+"%"}</div>
          <div
            className="progress"
            
            style={{
              // marginTop: "20px",
              // marginRight: "55px",
              // marginLeft: "55px",
            }}
          > 
            <div
              className="progress-bar progress-bar-striped progress-bar-animated bg-orange"
              role="progressbar"
              aria-valuenow={prog}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ width: `${prog}%`, backgroundColor: "#FF5701" }}
            >
             
            </div>
          </div>
        </div>
        {/* <div
          style={{
            background: "#c6ecf7",
            marginTop: "20px",
            borderRadius: "20px",
          }}
        > */}
        <div
  style={{
    position: 'relative', // This makes sure that the video is positioned relatively to this div
    marginTop: "20px",
            borderRadius: "20px",
    borderRadius: '20px', // The border radius for rounded corners
    overflow: 'hidden', // This ensures the video does not flow outside the border radius
  }}
>
  <video
    autoPlay
    muted
    loop
    style={{
      position: 'absolute', // Position absolutely to stretch over the div area
      width: '100%', // Ensure it covers the entire parent div
      height: '100%', // Ensure it covers the entire parent div
      objectFit: 'cover', // Ensure it covers the area without stretching
      top: 0, // Align to the top
      left: 0, // Align to the left
      zIndex: -1, // Position it behind any other content
    }}
  >
    <source
      src="https://video.wixstatic.com/video/11062b_a05955ed1c70427da0c0da8b85a42836/1080p/mp4/file.mp4"
      type="video/mp4"
    />
  </video>

  {!questionsCompleted && currentQuestionIndex > 0 && (
  <OverlayTrigger
    placement="bottom"
    delay={{ show: 25, hide: 40 }}
    overlay={renderTooltip}
  >
    <button
      onClick={() => window.open(dataSourceLink, '_blank')}
      className="data-source-button"
      style={{ position: 'absolute', top: '130px', left: '720px' }}
    >
      Data Source
    </button>
  </OverlayTrigger>
)}



          {questionsCompleted ? (
            // Render the new component when questions are completed
            <div style={{height:"80vh"}}>
              <FinalComponent carbonCount={carbonCount}/>
              <div
                    className="backSaveButton"
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "90%",
                      height: "60px",
                      margin: "0 auto",
                      paddingTop: "20px",
                      paddingLeft: "10%",
                      borderRadius: "20px",
                      paddingRight: "10%",
                    //   marginBottom:"20px"
                    }}
                  >
                    <button
                      className="btn btn-primary"
                      style={{
                        background: "black",
                        fontWeight: "bold",
                        border: "None",
                        width: "120px",
                      }}
                      onClick={handlePreviousQuestion}
                    >
                      Back
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{
                        background: "black",
                        border: "None",
                        fontWeight: "bold",
                        width: "120px",
                      }}
                      onClick={()=>{
                        console.log(savedData);
                      }}
                    >
                      Plant Trees{" "}
                    </button>
                  </div>
            </div>
          ) : (
            filteredQuestions.map((question, index) =>
              index === currentQuestionIndex ? (
                <div key={index}>
                  {/* <div
                  style={{
                    width: "90%",
                    height: "100px",
                    background: "#FF5701 ",
                    margin: "0 auto",
                    marginTop: "50px",
                    borderRadius: "20px",
                    paddingTop: "20px",
                  }}
                > */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column", // Vertical alignment
                      alignItems: "center", // Horizontal alignment
                      justifyContent: "center", // Vertical and horizontal centering
                      margin: "0 auto",
                      fontWeight: "bold",
                      paddingBottom: "10px",
                      paddingTop: "20px",
                    }}
                  >
                    Category: {question.label}
                  </div>
                  <div
                    style={{
                      width: "90%",
                      height: "60px",
                      background: "white",
                      margin: "0 auto",
                      paddingTop: "20px",
                      paddingLeft: "20px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {question.questionContent}
                  </div>
                  {/* </div> */}
                  <div
                    className="userInput"
                    style={{
                      width: "80%",
                      margin: "0 auto",
                      height: "40vh",
                      color: "black",
                      fontWeight: "bold",
                      borderRadius: "10px",
                      marginTop: "10px",
                    }}
                  >
                    {question.questionType == 1 && question.choiceAns == "1" ? (
                      <div
                        style={{
                          width: "300px",
                          margin: "0 auto",
                          paddingTop: "50px",
                          textAlign: "center",
                        }}
                      >
                        <p style={{}}>Enter the value in numbers</p>
                        <input
                          value={type1Ans1}
                          type="number"
                          className="form-control rounded"
                          onChange={handleInputChange1}
                        />
                      </div>
                    ) : null}

                    {question.questionType == 2 && question.choiceAns == "1" ? (
                      <>
                        <div
                          style={{
                            width: "300px",
                            paddingTop: "50px",
                            margin: "0 auto",

                            textAlign: "center",
                          }}
                        >
                          <p style={{}}>Enter the value in numbers</p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center", // Align items vertically in the center
                            width: "400px", // Adjust the width as needed
                            margin: "0 auto",

                            textAlign: "center",
                          }}
                        >
                          <input
                            value={type2Ans1}
                            type="number"
                            className="form-control rounded"
                            //   value={type2Ans1}
                            onChange={handleInputChange2}
                          />
                          <Form.Select
                            //   className="mb-3 ms-2" // Add margin to the left to create space between the input and the select
                            aria-label="Select unit"
                            value={currentSelectedUnit}
                            onChange={(e) => {
                              const selectedIndex =
                                currentSelectedUnits?.findIndex(
                                  (unit) => unit === e.target.value
                                );
                              setCurrentUnitIndex(
                                selectedIndex !== -1 ? selectedIndex : -1
                              );
                              setCurrentSelectedUnit(e.target.value);
                            }}
                            style={{ marginLeft: "20px" }}
                          >
                            <option value="" disabled>
                              Select the unit
                            </option>
                            {currentSelectedUnits?.map((unit, ind) => (
                              <option key={ind} value={unit}>
                                {unit}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </>
                    ) : null}

                    {/* {question.questionType == 1 && question.choiceAns == "2" ? (
                    <div
                      style={{
                        width: "400px",
                        margin: "0 auto",
                        paddingTop: "20px",
                      }}
                    >
                      <div style={{ marginTop: "20px" }}>
                        {question.choices[0].map((choice, choiceInd) => (
                          <div
                            key={choiceInd}
                            className="form-check"
                            style={{ marginBottom: "10px" }}
                          >
                            <input
                              type="radio"
                              className="form-check-input"
                              id={`choice_${choiceInd}`}
                              name="singleAnswer"
                              value={choice}
                              onChange={(e) => {
                                handleSingleAnswerChange(e, choice);
                                setChoiceIndex(choiceInd);
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`choice_${choiceIndex}`}
                            >
                              {choice}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null} */}

                    {question.questionType === 1 &&
                    question.choiceAns === "2" ? (
                      <div
                        style={{
                          width: "400px",
                          margin: "0 auto",
                          paddingTop: "20px",
                        }}
                      >
                        <div style={{ marginTop: "20px" }}>
                          <p style={{}}>Select Single Option</p>
                          {Array.isArray(question.choices[0]) &&
                            question.choices[0]?.map((choice, choiceIndex) => (
                              <div
                                key={choiceIndex}
                                className="form-check"
                                style={{ marginBottom: "10px" }}
                              >
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  id={`choice_${choiceIndex}`}
                                  name="singleAnswer"
                                  
                                //   checked={savedData.length===0? false:choiceIndex===savedData[currentQuestionIndex].choiceIndex || }
                                  onChange={(e) => {
                                    handleSingleAnswerChange(e, choice);
                                    setChoiceIndex(choiceIndex);
                                  }}
                                />
                                {/* <input
  type="radio"
  className="form-check-input"
  id={`choice_${ind}`}
  name="singleAnswer"
  checked={savedData[currentQuestionIndex]?.choiceIndex !== -1
        ? ind === savedData[currentQuestionIndex]?.choiceIndex
        : choiceIn
  }
  onChange={(e) => {
    handleSingleAnswerChange(e, choice);
    setChoiceIndex(choiceIndex);
    
  }}
/> */}


                                <label
                                  className="form-check-label"
                                  htmlFor={`choice_${choiceIndex}`}
                                >
                                  {choice}
                                </label>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : null}

                    {question.questionType == 2 && question.choiceAns == "2" ? (
                      <div
                        style={{
                          width: "400px",
                          margin: "0 auto",
                          paddingTop: "20px",
                        }}
                      >
                        <p style={{}}>Select the Unit and Single Option</p>
                        <Form.Select
                          //   className="mb-3 ms-2" // Add margin to the left to create space between the input and the select
                          aria-label="Select unit"
                          value={currentSelectedUnit}
                          onChange={(e) => {
                            const selectedIndex =
                              currentSelectedUnits?.findIndex(
                                (unit) => unit === e.target.value
                              );
                            setCurrentUnitIndex(
                              selectedIndex !== -1 ? selectedIndex : -1
                            );
                            setCurrentSelectedUnit(e.target.value);
                          }}
                          style={{ marginLeft: "20px" }}
                        >
                          <option value="" disabled>
                            Select the unit
                          </option>
                          {currentSelectedUnits?.map((unit, ind) => (
                            <option key={ind} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </Form.Select>
                        {currentUnitIndex !== -1 && (
                          <div style={{ marginTop: "20px" }}>
                            {question.choices[currentUnitIndex]?.map(
                              (choice, choiceInd) => (
                                <div
                                  key={choiceInd}
                                  className="form-check"
                                  style={{ marginBottom: "10px" }}
                                >
                                  <input
                                    type="radio"
                                    className="form-check-input"
                                    id={`choice_${choiceInd}`}
                                    name="singleAnswer"
                                    value={choice}
                                    onChange={(e) => {
                                      handleSingleAnswerChange(e, choice);
                                      setChoiceIndex(choiceInd);
                                    }}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`choice_${choiceIndex}`}
                                  >
                                    {choice}
                                  </label>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ) : null}

                    {question.questionType == 2 && question.choiceAns == "3" ? (
                      <div
                        style={{
                          width: "400px",
                          margin: "0 auto",
                          paddingTop: "20px",
                        }}
                      >
                        <p style={{}}>Select the Unit and Multiple Options</p>
                        <Form.Select
                          //   className="mb-3 ms-2" // Add margin to the left to create space between the input and the select
                          aria-label="Select unit"
                          value={currentSelectedUnit}
                          onChange={(e) => {
                            const selectedIndex =
                              currentSelectedUnits?.findIndex(
                                (unit) => unit === e.target.value
                              );
                            setCurrentUnitIndex(
                              selectedIndex !== -1 ? selectedIndex : -1
                            );
                            setCurrentSelectedUnit(e.target.value);
                          }}
                          style={{ marginLeft: "20px" }}
                        >
                          <option value="" disabled>
                            Select the unit
                          </option>
                          {currentSelectedUnits?.map((unit, ind) => (
                            <option key={ind} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </Form.Select>
                        {currentUnitIndex !== -1 && (
                          <div style={{ marginTop: "20px" }}>
                            {question.choices[currentUnitIndex]?.map(
                              (choice, choiceIndex) => (
                                <div
                                  key={choiceIndex}
                                  className="form-check"
                                  style={{ marginBottom: "10px" }}
                                >
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`choice_${choiceIndex}`}
                                    name={`choice_${choiceIndex}`}
                                    value={choice}
                                    onChange={(e) =>
                                      handleMultipleAnswerChange(e, choiceIndex)
                                    }
                                    checked={selectedChoiceIndexes.includes(
                                      choiceIndex
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`choice_${choiceIndex}`}
                                  >
                                    {choice}
                                  </label>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ) : null}

                    {question.questionType === 1 &&
                    question.choiceAns === "3" ? (
                      <div
                        style={{
                          width: "400px",
                          margin: "0 auto",
                          paddingTop: "20px",
                        }}
                      >
                        <div style={{ marginTop: "20px" }}>
                          <p style={{}}>Select the Unit and Multiple Options</p>
                          {Array.isArray(question.choices[0]) &&
                            question.choices[0].map((choice, choiceIndex) => (
                              <div
                                key={choiceIndex}
                                className="form-check"
                                style={{ marginBottom: "10px" }}
                              >
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`choice_${choiceIndex}`}
                                  name={`choice_${choiceIndex}`}
                                  value={choice}
                                  onChange={(e) =>
                                    handleMultipleAnswerChange(e, choiceIndex)
                                  }
                                  checked={selectedChoiceIndexes.includes(
                                    choiceIndex
                                  )}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`choice_${choiceIndex}`}
                                >
                                  {choice}
                                </label>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : null}

                    {/* {question.questionType == 1 && question.choiceAns == "3" ? (
                    <div
                      style={{
                        width: "400px",
                        margin: "0 auto",
                        paddingTop: "20px",
                      }}
                    >
                      {
                        <div style={{ marginTop: "20px" }}>
                          {question.choices[0].map((choice, choiceIndex) => (
                            <div
                              key={choiceIndex}
                              className="form-check"
                              style={{ marginBottom: "10px" }}
                            >
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={`choice_${choiceIndex}`}
                                name={`choice_${choiceIndex}`}
                                value={choice}
                                onChange={(e) =>
                                  handleMultipleAnswerChange(e, choiceIndex)
                                }
                                checked={selectedChoiceIndexes.includes(
                                  choiceIndex
                                )}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`choice_${choiceIndex}`}
                              >
                                {choice}
                              </label>
                            </div>
                          ))}
                        </div>
                      }
                    </div>
                  ) : null} */}
                  </div>
                  {/* buttons save and back */}
                  <div
                    className="backSaveButton"
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "90%",
                      height: "60px",
                      margin: "0 auto",
                      paddingTop: "20px",
                      paddingLeft: "10%",
                      borderRadius: "20px",
                      paddingRight: "10%",
                    }}
                  >
                    <button
                      className="btn btn-primary"
                      style={{
                        background: "black",
                        fontWeight: "bold",
                        border: "None",
                        width: "120px",
                      }}
                      onClick={handlePreviousQuestion}
                    >
                      Back
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{
                        background: "black",
                        border: "None",
                        fontWeight: "bold",
                        width: "120px",
                      }}
                      onClick={handleNextQuestion}
                    >
                      Next{" "}
                    </button>
                  </div>

                  <div
                    style={{
                      width: "",
                      height: "",
                      marginTop: "20px",
                      marginLeft: "50px",
                      marginRight: "50px",
                      borderRadius: "20px",
                      paddingBottom:"20px",
                      display: "flex",
                      justifyContent: "space-between",
                      // paddingLeft: "10%",
                      // paddingRight: "10%",
                    }}
                  >
                    <div
                        style={{
                            width: "40%",
                            height: "100px",
                            background: "white",
                            marginTop: "25px",
                            marginLeft: "50px",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column", // Arrange items vertically
                            alignItems: "center", // Align items to the center horizontally
                        }}
                        >
                        <p style={{ marginBottom: "10px", paddingTop:"10px" , fontWeight:"bold"}}>No. of Trees to be planted</p>
                        <div
                            style={{
                            display: "flex",
                            alignItems: "center", // Align items in the center vertically
                            justifyContent: "space-between", // Space items equally
                            width: "100%", // Occupy the full width of the container
                            }}
                        >
                            <div
                            style={{
                                fontSize: "30px",
                                width: "50%", // Adjust the width as needed
                                textAlign: "center", // Center text within the div
                                fontWeight: "bold",
                                margin:"0 auto"
                            }}
                            >
                            {Math.round(carbonCount / 48)}
                            </div>
                            <div style={{margin:"0 auto"}}><img src={tree} alt="Tree" style={{ width: "50px" }} /></div>
                            
                        </div>
                        </div>
                        <div
                        style={{
                            width: "40%",
                            height: "100px",
                            background: "white",
                            marginTop: "25px",
                            marginRight: "50px",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column", // Arrange items vertically
                            alignItems: "center", // Align items to the center horizontally
                        }}
                        >
                        <p style={{ marginBottom: "10px" ,paddingTop:"10px", fontWeight:"bold"}}>Your Carbon Footprint</p>
                        <div
                            style={{
                            display: "flex",
                            alignItems: "center", // Align items in the center vertically
                            justifyContent: "space-between", // Space items equally
                            width: "100%", // Occupy the full width of the container
                            }}
                        >
                            <div
                            style={{
                                fontSize: "30px",
                                width: "50%", // Adjust the width as needed
                                textAlign: "center", // Center text within the div
                                fontWeight: "bold",
                                margin:"0 auto"
                            }}
                            >
                            {Math.round(carbonCount)}
                            </div>
                            <div style={{margin:"0 auto", fontSize:"30px", fontWeight:"bold"}}>lbs</div>
                        </div>
                        </div>

                    {/* <div
                      style={{
                        width: "40%",
                        height: "100px",
                        background: "white",
                        marginTop: "25px",
                        marginRight: "50px",
                        borderRadius: "10px",
                      }}
                    >
                      {" "}
                      <div
                        style={{
                          fontSize: "30px",
                          width: "100px",
                          paddingLeft: "30px",
                          fontWeight: "bold",
                        }}
                      >
                        {carbonCount}
                      </div>
                    </div> */}
                  </div>
                  {/* <button
                  className="btn btn-primary"
                  onClick={() => {
                    console.log(answers);
                    console.log(selectedChoiceIndexes);
                    console.log(prog);
                  }}
                >
                  Answers
                </button> */}
                </div>
              ) : null
            )
          )}
        </div>
      </div>
      <div
        style={{
          background: "",
          width: "30%",
          paddingTop: "20px",
          paddingLeft: "30px",
          paddingRight: "30px",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img src={factLogo} style={{ width: "100%" }} alt="fact logo"></img>
        <div style={{ position: "relative", background: "red", flex: 1, borderRadius: "20px", overflow: "hidden" }}>
  <img
    src={image}
    alt="Your Alt Text"
    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px" }}
  />
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "20px",
      fontWeight:"bold",
      color: "black",
      backdropFilter: "blur(5px)", // Adjust the blur amount as needed
      backgroundColor: "rgba(255, 255, 255, 0.5)", // Adjust the background color and opacity
    }}
  >
    {fact}
  </div>
</div>

      </div>



      </div>
   
      <Modal show={showPopup} onHide={handleClosePopup}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#28a745', fontWeight: 'bold' }}>Saved Data Found</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontSize: '18px', lineHeight: '1.5' }}>You have saved data from a previous session. Would you like to load or delete this data?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleLoadSavedData}>Load Data</Button>
          <Button variant="danger" onClick={handleDeleteSavedData}>Delete Data</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DynamicQuestionPage2;
