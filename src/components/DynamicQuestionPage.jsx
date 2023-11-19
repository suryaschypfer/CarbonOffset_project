import React, { useState, useEffect } from 'react';
import { useNavigate,Link ,useLocation} from 'react-router-dom';
import axiosInstance from './axiosconfig';
// import axios from 'axios';
import { useParams } from 'react-router-dom';
import { exportedZipCode } from './landing_page'; 

export function DynamicQuestionPage(props) {
  // const [errorMessage, setErrorMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [dataSourceLink, setDataSourceLink] = useState({ text: '', link: '' });
  const [image, setImage] = useState("");
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [selectedChoices_Q1, setSelectedChoicesQ1] = useState([]);
  const navigate = useNavigate();
  // const navigate = useNavigate();
  const location = useLocation();
  const codeForZip = new URLSearchParams(location.search).get('zip');
  const [lastAnsweredQuestionIndex, setLastAnsweredQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [unitIndexes, setUnitIndex] = useState({});
  const [formulaValues, setFormulaValue] = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { questionIndex } = useParams();
  useEffect(() => {
    setCurrentQuestionIndex(questionIndex ? parseInt(questionIndex, 10) : 0);
  }, [questionIndex]);
  const [fact, setFact] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  // const [totalFootprint, setTotalFootprint] = useState(0); // Initialize totalFootprint
  // const [ans, updateAns] = useState(1);
  let formulaQuestionInput = 0;
  const zip = props.location?.state?.zip || "";
  const familySize = props.location?.state?.familySize || "";
  let finalFootPrint = 0;
  let finalTrees = 0;
  // let finalFormulaVal = 0;
  let formulaValue = 0;
  console.log("familyMembers", familySize);
  const [selectedUnit, setSelectedUnit] = useState('');  // State for selected unit
  // const [selectedFormula, setSelectedFormula] = useState(''); // State for selected formula
  const [unitChoices, setUnitChoices] = useState([]);   // Choices specific to the selected unit
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [numberOfTrees, setNumberOfTrees] = useState(0);
  const currentQuestionNumber = currentQuestionIndex + 1;
  const progressPercentage = currentQuestionNumber === totalQuestions ? 100 : ((currentQuestionNumber - 1) / totalQuestions) * 100;
  // console.log(questions[currentQuestionIndex]);

  useEffect(() => {
    fetchActiveQuestions();
    fetchRandomFact();
    fetchRandomImage();
    fetchTotalQuestions();
    // renderDataSourceLink();
  }, [currentQuestionIndex]);

  // useEffect(() => {
  //   renderDataSourceLink();
  // }, [currentQuestionIndex]); // Trigger the function when currentQuestionIndex changes

  useEffect(() => {
    // Load answers, carbon footprint, and number of trees from cookies on component mount
    const storedAnswers = getCookie('answers') || '{}';
    const storedCarbonFootprint = parseFloat(getCookie('carbonFootprint')) || 0;
    const storedNumberOfTrees = parseInt(getCookie('numberOfTrees')) || 0;
    const storedSelectedChoices = JSON.parse(getCookie('selectedChoices')) || [];


    setAnswers(JSON.parse(storedAnswers));
    setCarbonFootprint(storedCarbonFootprint);
    setNumberOfTrees(storedNumberOfTrees);

    // ... existing code ...
  }, []);
  
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  const zipcodeurl = getParameterByName('zip');
  console.log(zipcodeurl);

  const fetchActiveQuestions = async () => {
    try {
      const response = await axiosInstance.get('/api/questionsuser');
      if (response.data) {
        console.log("Questions Data:", response.data);
        setQuestions(response.data);
      }
    } catch (error) {
      console.error('Error fetching active questions:', error);
    }
  };

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

  const fetchTotalQuestions = async () => {
    const response = await axiosInstance.get('/api/totalquestions');
    setTotalQuestions(response.data);
  };

  const calculateFormula = async (formulaName,zipcode="") => {
    // Make an API call to calculate the formula
    try {
      const response = await axiosInstance.post(
        "http://localhost:3000/api/calculateFormula",
        {
          formulaName,
          zipcode,
        }
      );

      // Get the result from the response
      const result = response.data.result;

      console.log(
        `Formula "${formulaName}" calculated successfully! Result:`,
        result
      );

      return result;

      // You can do further processing with the result if needed
    } catch (error) {
      console.error(`Error calculating formula "${formulaName}":`, error);
    }
  };

  const handleProceed = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      const currentQuestionId = questions[currentQuestionIndex]?.id; // Add this line
      // Transform the answers object to the desired format
      console.log("questions", questions);
      console.log("answers", answers);
      const formattedAnswers = Object.entries(answers).map(([id, value]) => ({ id: Number(id), value }));
      const formattedUnitIndex = Object.entries(unitIndexes).map(([id, unitIndex]) => ({ id: Number(id), unitIndex }));
      const formattedFormulaValues = Object.entries(formulaValues).map(([id, formulaVal]) => ({ id: Number(id), formulaVal }));
      // Fetch and update the carbon footprint here based on the submitted answer
      await handleSubmitAnswers(formattedAnswers, formattedUnitIndex, formattedFormulaValues);
      setLastAnsweredQuestionIndex(currentQuestionIndex);
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);

       // Set the cookies with a one-minute expiration
  const oneMinuteFromNow = new Date(Date.now() + 5 * 60 * 1000).toUTCString();
  document.cookie = `answers=${JSON.stringify(answers)}; expires=${oneMinuteFromNow}; path=/`;
  document.cookie = `carbonFootprint=${carbonFootprint}; expires=${oneMinuteFromNow}; path=/`;
  document.cookie = `numberOfTrees=${numberOfTrees}; expires=${oneMinuteFromNow}; path=/`;
      navigate(`/question/${currentQuestionIndex + 1}?zip=${zipcodeurl}`);
    } else {
      // Calculate the footprint for the last question
      const formattedAnswers = Object.entries(answers).map(([id, value]) => ({ id: Number(id), value }));
      const formattedUnitIndex = Object.entries(unitIndexes).map(([id, index]) => ({ id: Number(id), index }));
      const formattedFormulaValues = Object.entries(formulaValues).map(([id, formulaVal]) => ({ id: Number(id), formulaVal }));

      await handleSubmitAnswers(formattedAnswers, formattedUnitIndex, formattedFormulaValues); // Calculate for the last question

      // Now, after calculating the footprint for the last question, assign it to lastQuestionFootprint
      const lastQuestionFootprint = carbonFootprint;
      setLastAnsweredQuestionIndex(currentQuestionIndex);

      // Log the lastQuestionFootprint
      console.log('lastQuestionFootprint:', lastQuestionFootprint);

       // Set the cookies for the last question
       const oneMinuteFromNow = new Date(Date.now() + 5 * 60 * 1000).toUTCString();
       document.cookie = `answers=${JSON.stringify(answers)}; expires=${oneMinuteFromNow}; path=/`;
       document.cookie = `carbonFootprint=${finalFootPrint}; expires=${oneMinuteFromNow}; path=/`;
       document.cookie = `numberOfTrees=${finalTrees}; expires=${oneMinuteFromNow}; path=/`;

      // Navigate to the FinalPage with the updated state

      navigate(`/FinalPage?zip=${zipcodeurl}`, {
        state: {
          zip: zip,
          familySize: familySize,
          answers: answers,
          carbonFootprint: finalFootPrint, // Include the last question's footprint
          numberOfTrees: finalTrees,
          lastAnsweredQuestionIndex: lastAnsweredQuestionIndex, // Include lastAnsweredQuestionIndex
        },
      });
    }
  }
  

  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  function getCookie(name) {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith(cookieName)) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null;
  }
  const handleSubmitAnswers = async (answers, unitIndexes, formulaValues) => {
    setSelectedUnit(null);
    console.log("answers to post", answers);
    try {
      const response = await axiosInstance.post('/api/calculateFootprint', { answersArr: answers, unitIndexArr: unitIndexes, formulaValArr: formulaValues });
      console.log("response", response);
      const data = response.data;

      if (data) {
        // Update the state with the received data
        setCarbonFootprint(data.carbonFootprint);
        setNumberOfTrees(data.numberOfTrees);
        console.log("Updated Footprint:", data.carbonFootprint);
        finalFootPrint = data.carbonFootprint;
        console.log("Final footprint", finalFootPrint);
        finalTrees = data.numberOfTrees;

      }
    } catch (error) {
      console.error("Error fetching calculation results:", error);
    }
  }

  useEffect(() => {
    // When you navigate back to the same question, set the selected choice index based on the answer
    const currentQuestionId = questions[currentQuestionIndex]?.id;
    const selectedChoice = answers[currentQuestionId];
    setSelectedChoiceIndex(selectedChoice);
  }, [currentQuestionIndex, answers]);


  const handleInputChange = (event) => {

    console.log("event in inputchnage", event);
    console.log("event type", event.target.type);

    const currentQuestionId = questions[currentQuestionIndex]?.id;
    if (!currentQuestionId) return;

    let newAnswerValue = event.target.value;
    formulaQuestionInput = questions[currentQuestionIndex]?.questionType === 2 ? event.target.value : 0;


    // If the event target is a radio input, save its value directly
    if (event.target.type === "radio") {
      const choiceIndex = +event.target.getAttribute("id").slice(event.target.getAttribute("id").lastIndexOf("-") + 1); // Get the index of the selected choice
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestionId]: choiceIndex, // Use the ref value instead of the choice
      }));
      return;
    }

    // If the event target is a checkbox input, handle it for choiceAns = 3
    if (event.target.type === "checkbox") {

      console.log("attribute id ----->", event.target.getAttribute("id"));
      console.log("attribute inner index --->", event.target.getAttribute("data-index"));

      const innerIndex = event.target.getAttribute("data-index") ? +event.target.getAttribute("data-index") : +event.target.getAttribute("id").slice(event.target.getAttribute("id").lastIndexOf("-") + 1);


      const currentSelectedChoices = event.target.getAttribute("data-index") ? [...selectedChoices_Q1] : [...selectedChoices];

      if (event.target.checked) {
        // Add innerIndex to selectedChoices if checked
        currentSelectedChoices.push(innerIndex);
      } else {
        // Remove innerIndex from selectedChoices if unchecked
        const indexToRemove = currentSelectedChoices.indexOf(innerIndex);
        if (indexToRemove !== -1) {
          currentSelectedChoices.splice(indexToRemove, 1);
        }
      }

      console.log("checkbox choices", currentSelectedChoices);
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestionId]: currentSelectedChoices, // Use the ref value instead of the choice
      }));

      if (event.target.getAttribute("data-index")) {
        setSelectedChoicesQ1(currentSelectedChoices);
      }
      else {
        setSelectedChoices(currentSelectedChoices);
      }


      return;
    }

    // Handle text inputs for questionType 1 or 2
    if ([1, 2].includes(questions[currentQuestionIndex]?.questionType)) {
      newAnswerValue = newAnswerValue.replace(/[^0-9.]/g, ''); // Accept only numeric values and dot
      if (newAnswerValue.length > 5) {
        newAnswerValue = newAnswerValue.slice(0, 5);
      }
    }

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionId]: newAnswerValue
    }));

  };

  const handleUnitSelection = async (unit, choiceIndex) => {
    if (selectedUnit === unit && selectedChoiceIndex === choiceIndex) {
      // Deselect the unit and choice
      setSelectedUnit(null);
      setSelectedChoiceIndex(null);
      setUnitChoices([]);
    } else {
      setSelectedUnit(unit);
      console.log("selected unit", unit);
      setSelectedChoiceIndex(choiceIndex);



      // Fetch the choices based on the selected unit
      const unitsIndex = questions[currentQuestionIndex]?.selectedUnits.indexOf(unit);
      console.log("unitsIndex", unitsIndex);
      if (unitsIndex >= 0) {
        formulaValue = await calculateFormula((questions[currentQuestionIndex]?.selectedFormulas[unitsIndex]),codeForZip);
        setUnitIndex((prevUnitIndexes) => ({
          ...prevUnitIndexes,
          [questions[currentQuestionIndex]?.id]: unitsIndex, // Use the ref value instead of the choice
        }));
        setFormulaValue((prevFormulaValues) => ({
          ...prevFormulaValues,
          [questions[currentQuestionIndex]?.id]: formulaValue, // Use the ref value instead of the choice
        }));
        console.log("formula value", formulaValue);
        console.log("zip value", zip);
        const choices = questions[currentQuestionIndex]?.choices;
        if (choices !== null) {
          try {
            const choicesString = JSON.stringify(choices);
            const parsedChoices = JSON.parse(choicesString);
            const unitChoices = parsedChoices[unitsIndex];
            setUnitChoices(unitChoices || []);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            setUnitChoices([]); // Set an empty array or handle the error as needed
          }
        } else {
          // Handle the case where choices are null
          setUnitChoices([]); // Set an empty array
        }
      } else {
        console.error("Unit not found in selectedUnits.");
        setUnitChoices([]); // Set an empty array if the unit is not found
      }
    }
  };

  const navigateToHome = () => {
    navigate('/');
  }

  // Naviagtion if user clicks on previous page
  const handlelandingpage = () => {
    setSelectedUnit(null);      // to set the choices null 
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    } else {
      // If it's the first question, go back to landing page or any other desired action
      navigate('/');
    }
  };

  const handleadmin = () => {
    navigate('/admin'); // Use navigate to go to the desired route
  };

  const handleaboutus = () => {
    navigate('/aboutus'); // Use navigate to go to the desired route
  };
  const handleContactUs = () => {
    navigate('/ContactUs'); // Use navigate to go to the desired route
  };
  

  const fetchDataForZipcode = async () => {
    try {
      const response = await axiosInstance.post('/api/utilityzipcode', { zipcode: zipcodeurl });
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
      if (questiontext.toLowerCase().includes("elec")) {
        questionUtility = "Electricity";
      } else if (questiontext.toLowerCase().includes("gas") || questiontext.toLowerCase().includes("hydrogen") || questiontext.toLowerCase().includes("pallets") || questiontext.toLowerCase().includes("coal")) {
        questionUtility = "Gas";
      } else if (questiontext.toLowerCase().includes("bike") || questiontext.toLowerCase().includes("car") || questiontext.toLowerCase().includes("commute") || questiontext.includes("mileage") || questiontext.includes("transport") || questiontext.includes("vehicle")) {
        questionUtility = "Gas";
      } else if (questiontext.includes("Water") || questiontext.includes("Diet") || questiontext.includes("eat")) {
        questionUtility = "Food";
      } else if (questiontext.toLowerCase().includes("shop")) {
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
          text: `Our calculations are sourced from ${data.Sources} for your zipcode ${zipcodeurl}.`,
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
  
  
  const handleMouseEnter = async () => {
    try {
      const { link, text } = await renderDataSourceLink();
      setDataSourceLink({ link, text });
      setShowTooltip(true);
    } catch (error) {
      console.error("Error on mouse enter:", error);
    }
  };
  
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  
  const handleClick = async () => {
    try {
      const { link } = await renderDataSourceLink();
      window.location.href = link;
    } catch (error) {
      console.error("Error on button click:", error);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    } else {
      // If it's the first question, go back to landing page or any other desired action
      navigate('/', { state: { zip: zip, familySize: familySize, answers: answers } });
    }
  };

  const roundedPercentage = parseFloat(progressPercentage.toFixed(2));

  let parsedChoices = {};
  try {
    parsedChoices = typeof questions[currentQuestionIndex]?.choices === "string"
      ? JSON.parse(questions[currentQuestionIndex]?.choices)
      : questions[currentQuestionIndex]?.choices;
  } catch (error) {
    console.error("Failed to parse choices:", error);
  }

  const unitSpecificChoices = (selectedUnit && parsedChoices) ? parsedChoices[selectedUnit] || [] : [];

  const fetchCarbonFootprintAndTrees = async () => {
    try {
      // You should adjust the structure of the 'answers' payload according to how you've structured your state and components
      const answers = [ /* An array or object of the user's answers. E.g., { id: 1, value: 10 }, ... */];

      const response = await axiosInstance.post('/api/calculateFootprint', answers);

      if (response.status === 200) {
        const { carbonFootprint, numberOfTrees } = response.data;
        setCarbonFootprint(carbonFootprint);
        setNumberOfTrees(numberOfTrees);

        // If you have a way to navigate to the FinalPage after this, invoke that logic here.
        // For instance, if you're using react-router, you'd navigate to the FinalPage route.
      } else {
        console.error("Failed to calculate carbon footprint and trees.");
      }
    } catch (error) {
      console.error("Error fetching carbon footprint and trees:", error);
    }
  };



  return (
    <div style={{ background: 'white' }}>
      {/* <button onClick={()=>{console.log(calculateFormula("GallonToCforPropane"))}}>Click</button> */}
      {/* <div style={{ width: '1178px', height: '5px', left: '128px', top: '106px', position: 'absolute' }}>
        <div style={{ left: '614px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer' }}onClick={navigateToHome}>Home</div>
        <div style={{ left: '0px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 800, wordWrap: 'break-word', cursor: 'pointer' }}>OFFSET CRBN</div>
        <div style={{ left: '711px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer' }}>About Us</div>
        <div style={{width: '110px', height: '29px', left: '829.50px', top: '0px', position: 'absolute', background: '#A7C8A3'}}></div>
        <div style={{ left: '837px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer' }}>Calculator</div>
        <div style={{ left: '1070px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer' }}onClick={handleContactUs}>Contact Us</div>
    </div> */}
      <nav className="nav-bar" style={{ borderBottom: '1px solid #000', display: 'flex', width: '100%' }}>
        <div className="leftnav">
          <img className="mainlogo" src="/logo2.png" alt="OFFSET CRBN" />
        </div>
        <div className="rightnav">
          <a href="#" onClick={navigateToHome}>Home</a>
          <a href="#" onClick={handleaboutus} >About Us</a>
          <a href="#" className="selected">Calculator</a>
          {/* <a href="#">Admin</a> */}
          <a href="#" onClick={handleContactUs}>Contact Us</a>
        </div>

      </nav>

      {/* <div style={{ width: '1522px', height: '100px', left: '-10px', top: '975px', position: 'absolute', background: '#ff9d76', border: '1px black solid', backdropFilter: 'blur(4px)' }}></div> */}
      {/* <div style={{ width: '1500px', height: '0px', left: '0px', top: '0px', position: 'absolute' }}></div> */}
      <div style={{ width: '700px', height: '700px', left: '50px', position: 'absolute' }}>
        {/* <div style={{ width: '885px', height: '655px', left: '1px', top: '0px', position: 'absolute', background: 'rgba(217, 217, 217, 0.12)', borderRadius: '30px' }}></div> */}
        <div style={{ width: '885px', height: '675px', left: '1px', top: '10vh', position: 'absolute', background: 'rgba(217, 217, 217, 0.12)', borderRadius: '30px', overflow: 'hidden' }}>
          <video autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
            <source src="https://video.wixstatic.com/video/11062b_a05955ed1c70427da0c0da8b85a42836/1080p/mp4/file.mp4" type="video/mp4" />
          </video>
        </div>

        <div style={{ width: '885px', height: '17px', left: '0px', top: '30px', position: 'absolute' }}>
          <div style={{ width: '885px', height: '17px', left: '0px', top: '0px', position: 'absolute', background: '#EAE4E3', borderRadius: '10px' }}></div>
          <div style={{ width: `${progressPercentage * 8.85}px`, height: '17px', left: '0px', top: '0px', position: 'absolute', background: '#ff9d76', borderRadius: '10px' }}></div>
          <div style={{ width: '58px', height: '16px', left: '427px', top: '0px', position: 'absolute', color: 'black', fontSize: '14px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word' }}>{roundedPercentage}%</div>
        </div>
        <div style={{ left: '400px', top: '10px', position: 'absolute', color: 'black', fontSize: '14px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word' }}>
          Progress Bar<br />
        </div>
        <div style={{ width: '200px', height: '56px', left: '244px', top: '407px', position: 'absolute' }}>
          <div style={{ display: 'block', width: '184.66px', height: '56px', left: '0px', top: '0px', position: 'absolute', background: 'black', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '300px', border: '1px black solid', textAlign: 'center', lineHeight: '56px', textDecoration: 'none', color: 'white ' }}>
            <div style={{ width: '171.05px', left: '10px', top: '0px', position: 'absolute', color: 'white', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word', cursor: 'pointer' }} onClick={handlelandingpage}>Previous Page</div>
          </div>
        </div>
        <div style={{ width: '496px', height: '496px', cursor: 'pointer' }}>
          <div style={{ width: '185px', height: '56px', left: '460px', top: '406px', position: 'absolute', background: 'black', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '300px', border: '1px black solid' }}>
            <div style={{ left: '12px', top: '15px', position: 'absolute', color: 'white', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word' }} onClick={handleProceed}>Submit & Proceed</div>
          </div>
          <div style={{ width: '322px', height: '136px', left: '480px', top: '499px', position: 'absolute', background: '#D9D9D9', borderRadius: '15px' }}>
            <div style={{ width: '237px', height: '23px', left: '50px', top: '15px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word' }}>Your carbon footprint</div>
            <div style={{ width: '119px', height: '40px', left: '181px', top: '220px', position: 'absolute' }}>
              <div style={{ left: '-80px', top: '-156px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '32px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 700, wordWrap: 'break-word' }}>{carbonFootprint}</div>
              <div style={{ width: '60px', height: '26px', left: '25px', top: '-146px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word' }}>lbs</div>
            </div>
          </div>
          <div style={{ width: '327px', height: '136px', left: '100px', top: '499px', position: 'absolute', background: '#D9D9D9', borderRadius: '15px' }}>
            <img style={{ width: '75px', height: '75px', left: '239px', top: '45px', position: 'absolute', mixBlendMode: 'color-burn' }} src="/Tree.png" alt="Tree" />
          </div>
        </div>
        <div style={{ width: '683px', height: '167px', left: '102px', top: '120px', position: 'absolute' }}></div>
        <div style={{ width: '685px', height: '200px', left: '100px', top: '152px', position: 'absolute' }}>
          <div style={{ width: '1.41px', height: '24px', left: '443.48px', top: '148px', position: 'absolute' }}></div>

          <div style={{
            width: '409.62px', height: '50px', left: '137.69px', top: '0px', position: 'absolute',
            textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word'
          }}>
            {questions[currentQuestionIndex]?.questionContent}
          </div>

          {questions[currentQuestionIndex]?.questionType === 1 && (!questions[currentQuestionIndex]?.choiceAns || questions[currentQuestionIndex]?.choiceAns === "1" || questions[currentQuestionIndex]?.choiceAns === "null" || questions[currentQuestionIndex]?.choiceAns === "NULL" || questions[currentQuestionIndex]?.choiceAns === "") && (
            <input
              type="text"
              style={{ width: '402.53px', height: '66px', left: '141.24px', top: '106px', position: 'absolute', background: 'white', borderRadius: '300px', border: 'none', paddingLeft: '15px', fontSize: '20px' }}
              placeholder="Enter amount here"
              value={answers[questions[currentQuestionIndex]?.id] || ''}
              onChange={handleInputChange}

            />
          )}

          {questions[currentQuestionIndex]?.questionType === 1 && questions[currentQuestionIndex]?.choiceAns === "2" && (
            <div style={{
              width: '409.62px', marginTop: '88px', left: '137.69px', position: 'absolute', textAlign: 'left',
            }}>
              {questions[currentQuestionIndex]?.choices.map((innerChoices, outerIndex) => (
                innerChoices.map((choice, innerIndex) => (
                  <div key={outerIndex + '-' + innerIndex} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <input type="radio" id={`choice-${outerIndex}-${innerIndex}`} name="choice" value={choice} data-index={innerIndex} style={{ marginRight: '10px' }} onChange={handleInputChange} checked={innerIndex === selectedChoiceIndex ? true : false} />
                    <label htmlFor={`choice-${outerIndex}-${innerIndex}`}>{choice}</label>
                  </div>
                ))
              ))}
            </div>
          )}

          {questions[currentQuestionIndex]?.questionType === 1 && questions[currentQuestionIndex]?.choiceAns === "3" && (
            <div style={{
              width: '409.62px',
              marginTop: '88px',
              left: '137.69px',
              position: 'absolute',
              textAlign: 'left',
            }}>
              {questions[currentQuestionIndex]?.choices.map((innerChoices, outerIndex) => (
                innerChoices.map((choice, innerIndex) => (
                  <div key={outerIndex + '-' + innerIndex} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id={`choice-${outerIndex}-${innerIndex}`}
                      name="choice"
                      value={choice}
                      data-index={innerIndex}
                      style={{ marginRight: '10px' }}
                      onChange={handleInputChange}

                    />
                    <label htmlFor={`choice-${outerIndex}-${innerIndex}`}>{choice}</label>
                  </div>
                ))
              ))}
            </div>
          )}

{
            questions[currentQuestionIndex]?.questionType === 2 && (
              <div style={{ width: '400px', marginTop: '60px', left: '137.69px', position: 'absolute', display: 'flex', justifyContent: 'space-around' }}>
                {questions[currentQuestionIndex]?.selectedUnits.map((unit, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '10px',
                      border: '1px solid',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      backgroundColor: selectedUnit === unit ? 'lightgreen' : 'white',
                      margin: '5px' // Add some spacing between units
                    }}
                    onClick={() => handleUnitSelection(unit)}
                  >
                    {unit}
                  </div>
                ))}
              </div>
            )
          }

          {
            questions[currentQuestionIndex]?.questionType === 2 && (questions[currentQuestionIndex]?.choiceAns === "1" || !questions[currentQuestionIndex]?.choiceAns || questions[currentQuestionIndex]?.choiceAns === "null" || questions[currentQuestionIndex]?.choiceAns === "NULL") && (
              <input
                type="text"
                style={{ width: '402.53px', height: '66px', left: '141.24px', top: '160px', position: 'absolute', background: 'white', borderRadius: '300px', border: 'none', paddingLeft: '15px', fontSize: '20px' }}
                placeholder="Enter value here for selected units"
                value={answers[questions[currentQuestionIndex]?.id] || ''}
                onChange={handleInputChange}
              />
            )
          }

          {
            questions[currentQuestionIndex]?.questionType === 2 && selectedUnit && questions[currentQuestionIndex]?.choiceAns === "2" && (
              <div style={{ width: '400px', marginTop: '125px', left: '137.69px', position: 'absolute', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {Array.isArray(unitChoices) && unitChoices.length > 0 && unitChoices.map((choice, index) => (
                    <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                      <input type="radio" id={`choice-${index}`} name="choice" value={choice} style={{ marginRight: '10px' }} onChange={handleInputChange} />
                      <label htmlFor={`choice-${index}`}>{choice}</label>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          {
            questions[currentQuestionIndex]?.questionType === 2 && selectedUnit && questions[currentQuestionIndex]?.choiceAns === "3" && (
              <div style={{ width: '400px', marginTop: '125px', left: '137.69px', position: 'absolute', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {Array.isArray(unitChoices) && unitChoices.length > 0 ? (
                    unitChoices.map((choice, index) => (
                      <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          id={`choice-${index}`}
                          name="choice"
                          value={choice}
                          style={{ marginRight: '10px' }}
                          onChange={handleInputChange} // Pass the choice to the handler
                        />
                        <label htmlFor={`choice-${index}`}>{choice}</label>
                      </div>
                    ))
                  ) : null}
                </div>
              </div>
            )
          }

          {/* Displaying the label/category for the question */}
          <div style={{
            width: '300px', height: '40px', left: '500px', top: '-60px', position: 'absolute',
            textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word'
          }}>
            Category: {questions[currentQuestionIndex]?.label}
          </div>
        </div>
        <div style={{ width: '237px', height: '23px', left: '148px', top: '512px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word' }}>No. of Trees to be planted</div>
        <div style={{ width: '155px', height: '40px', left: '222px', top: '573px', position: 'absolute' }}>
          <div style={{ left: '10px', top: '-10px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '32px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 700, wordWrap: 'break-word' }}>{numberOfTrees}</div>

        </div>
      </div>
      <div style={{ width: '260px', height: '655px', left: '1028px', top: '225px', position: 'absolute' }}>
        {/* <div style={{ width: '285px', height: '655px', left: '0px', top: '0px', position: 'absolute', background: 'rgba(217, 217, 217, 0.12)', borderRadius: '30px' }}></div> */}
        <img style={{ width: '265px', height: '154px', left: '0px', top: '-110px', position: 'absolute' }} src="/First_Question.png" alt="First Question" />
        {/* <div style={{ width: '265px', height: '403px', left: '12px', top: '197px', position: 'absolute', background: '#A3C7A0', borderRadius: '30px' }}></div>
    <div style={{ width: '231px', height: '331px', left: '31px', top: '241px', position: 'absolute', color: 'white', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word' }}>{fact}</div> */}
        <div style={{ width: '265px', height: '500px', left: '0px', top: '65px', position: 'absolute', overflow: 'hidden' }}>
          <img src={image} alt="Background Image" style={{ width: '100%', height: '100%', borderTopLeftRadius: '30px', borderTopRightRadius: '30px' }} />
          <div style={{ position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, overflowWrap: 'break-word', bottom: '10px', backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '10px', borderRadius: '0 0 30px 30px' }}>
            {fact}
          </div>
        </div>
      </div>

      {/* <div style={{ position: 'absolute', bottom: '-150px', left: '1025px' }}>
  <button
    className="info-button"
    onMouseEnter={() => {
      const { link, text } = renderDataSourceLink();
      console.log(`Calling renderDataSourceLink. Link: ${link}, Text: ${text}`);
      setShowTooltip(true);
    }}
    onMouseLeave={() => setShowTooltip(false)}
    onClick={() => {
      const { link } = renderDataSourceLink();
      window.location.href = link;
    }}
  >
    Data Sources
  </button>
  {showTooltip && (
    <div className="tooltip">
      {renderDataSourceLink().text}
    </div>
  )}
</div> */}

<div style={{ position: 'absolute', bottom: '-150px', left: '1025px' }}>
      <button
        className="info-button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        Data Sources
      </button>
      {showTooltip && (
        <div className="tooltip">
          {dataSourceLink.text}
        </div>
      )}
    </div>


      <div style={{ width: '100%', height: '30px', left: '0px', position: 'absolute', top: '900px', background: 'rgb(255, 87, 1)', backdropFilter: 'blur(4px)' }}></div>
      {/* <div style={{ left: '1110px', top: '106px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer' }}onClick={handleadmin}>Admin</div> */}
    </div>
    

  );
}

export default DynamicQuestionPage;