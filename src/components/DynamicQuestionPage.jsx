import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosconfig';
import axios from 'axios';

export function DynamicQuestionPage(props) {
    const [image, setImage] = useState("");
    const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);
    const [selectedChoices, setSelectedChoices] = useState([]);
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [fact, setFact] = useState("");
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [totalFootprint, setTotalFootprint] = useState(0); // Initialize totalFootprint
    const [ans,updateAns] = useState(1);
    let formulaQuestionInput = 0;
    const zip = props.location?.state?.zip || "";
    const familySize = props.location?.state?.familySize || "";
    let finalFootPrint = 0;
    let finalTrees = 0;
    let finalFormulaVal = 0;
    let formulaValue = 0;
    console.log("familyMembers",familySize);
    const [selectedUnit, setSelectedUnit] = useState('');  // State for selected unit
    const [unitChoices, setUnitChoices] = useState([]);   // Choices specific to the selected unit
    const [carbonFootprint, setCarbonFootprint] = useState(0);
    const [numberOfTrees, setNumberOfTrees] = useState(0);
    const currentQuestionNumber = currentQuestionIndex + 1;
    const progressPercentage = (currentQuestionNumber / totalQuestions) * 100;
    console.log(questions[currentQuestionIndex]);

    useEffect(() => {
        fetchActiveQuestions();
        fetchRandomFact();
        fetchRandomImage();
        fetchTotalQuestions();
    }, [currentQuestionIndex]);

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
                setImage(imgResponse.data.img_name);
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

    const calculateFormula = async (formulaName) => {
        // Make an API call to calculate the formula
        try {
          const response = await axiosInstance.post(
            "/api/calculateFormula",
            {
              formulaName,
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
          // Transform the answers object to the desired format
          console.log("questions",questions);
          const formattedAnswers = Object.entries(answers).map(([id, value]) => ({ id: Number(id), value}));
      
          // Fetch and update the carbon footprint here based on the submitted answer
          await handleSubmitAnswers(formattedAnswers);
      
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
          // Calculate the footprint for the last question
          const formattedAnswers = Object.entries(answers).map(([id, value]) => ({ id: Number(id), value}));
          await handleSubmitAnswers(formattedAnswers); // Calculate for the last question
      
          // Now, after calculating the footprint for the last question, assign it to lastQuestionFootprint
          const lastQuestionFootprint = carbonFootprint;
      
          // Log the lastQuestionFootprint
          console.log('lastQuestionFootprint:', lastQuestionFootprint);
            
          // Navigate to the FinalPage with the updated state
    
          navigate('/FinalPage', {
            state: {
              zip: zip,
              familySize: familySize,
              answers: answers,
              carbonFootprint: finalFootPrint, // Include the last question's footprint
              numberOfTrees: finalTrees,
            },
          });
          
        }
      }
      const handleSubmitAnswers = async (answers) => {
        console.log("answers to post",answers);
        try {
            const response = await axiosInstance.post('/api/calculateFootprint', answers);
            console.log("response",response);
            const data = response.data;
            
            if (data) {
                // Update the state with the received data
                setCarbonFootprint(data.carbonFootprint);
                setNumberOfTrees(data.numberOfTrees);
                console.log("Updated Footprint:", data.carbonFootprint);
                finalFootPrint = data.carbonFootprint;
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
    
        const currentQuestionId = questions[currentQuestionIndex]?.id;
        if (!currentQuestionId) return;
    
        let newAnswerValue = event.target.value;
        formulaQuestionInput = questions[currentQuestionIndex]?.questionType === 2 ? event.target.value : 0 ; 
    
    
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
            
            const innerIndex = +event.target.getAttribute("data-index");
            const currentSelectedChoices = [...selectedChoices];
    
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
    
            console.log("checkbox choices",currentSelectedChoices);
            setAnswers((prevAnswers) => ({
                ...prevAnswers,
                [currentQuestionId]: currentSelectedChoices, // Use the ref value instead of the choice
            }));
            
            setSelectedChoices(currentSelectedChoices);
    
            return;
        }
    
        // Handle text inputs for questionType 1 or 2
        if ([1,2].includes(questions[currentQuestionIndex]?.questionType)) {
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
          setSelectedChoiceIndex(choiceIndex);
      
          // Fetch the choices based on the selected unit
          const unitsIndex = questions[currentQuestionIndex]?.selectedUnits.indexOf(unit);
          if (unitsIndex >= 0) {
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
              console.error("Choices are null.");
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
        const answers = [ /* An array or object of the user's answers. E.g., { id: 1, value: 10 }, ... */ ];
        
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
            <button onClick={()=>{console.log(calculateFormula("GallonToCforPropane"))}}>Click</button>
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
                    <a href="#" onClick={handlelandingpage}>Home</a>
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
                            <div style={{ left: '-80px', top: '-140px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '32px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 700, wordWrap: 'break-word' }}>{carbonFootprint}</div>
                            <div style={{ width: '60px', height: '26px', left: '25px', top: '-129px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word' }}>lbs</div>
                        </div>
                    </div>
                    <div style={{ width: '327px', height: '136px', left: '100px', top: '499px', position: 'absolute', background: '#D9D9D9', borderRadius: '15px' }}>
                        <img style={{ width: '75px', height: '86px', left: '239px', top: '31px', position: 'absolute', mixBlendMode: 'color-burn' }} src="Tree.png" alt="Tree" />
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
                            width: '409.62px', marginTop: '88px', left: '137.69px', position: 'absolute',textAlign: 'left',
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
            checked={selectedChoices.includes(innerIndex)}
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
    <div style={{ width: '400px', marginTop: '165px', left: '137.69px', position: 'absolute', display: 'flex', justifyContent: 'space-between' }}>
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
    <div style={{ width: '400px', marginTop: '165px', left: '137.69px', position: 'absolute', display: 'flex', justifyContent: 'space-between' }}>
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
                onChange={() => handleUnitSelection(choice)} // Pass the choice to the handler
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
                <img style={{ width: '265px', height: '154px', left: '0px', top: '-140px', position: 'absolute' }} src="First_Question.png" alt="First Question" />
                {/* <div style={{ width: '265px', height: '403px', left: '12px', top: '197px', position: 'absolute', background: '#A3C7A0', borderRadius: '30px' }}></div>
    <div style={{ width: '231px', height: '331px', left: '31px', top: '241px', position: 'absolute', color: 'white', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word' }}>{fact}</div> */}
                <div style={{ width: '265px', height: '500px', left: '0px', top: '65px', position: 'absolute', overflow: 'hidden' }}>
                    <img src={image} alt="Background Image" style={{ width: '100%', height: '100%', borderTopLeftRadius: '30px', borderTopRightRadius: '30px' }} />
                    <div style={{ position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, overflowWrap: 'break-word', bottom: '10px', backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '10px', borderRadius: '0 0 30px 30px' }}>
                        {fact}
                    </div>
                </div>
            </div>
            <div style={{ width: '100%', height: '30px', left: '0px', position: 'absolute', top: '900px', background: '#ff9d76', backdropFilter: 'blur(4px)' }}></div>
            {/* <div style={{ left: '1110px', top: '106px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer' }}onClick={handleadmin}>Admin</div> */}
        </div>

    );
}

export default DynamicQuestionPage;

