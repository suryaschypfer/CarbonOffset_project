import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosconfig';


export function DynamicQuestionPage(props) {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [fact, setFact] = useState("");
    const [image, setImage] = useState("");
    const [totalQuestions, setTotalQuestions] = useState(0);

    const zip = props.location?.state?.zip || "";
    const familySize = props.location?.state?.familySize || "";

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

    const handleSubmitAnswers = async (answers) => {
        try {
            const response = await axiosInstance.post('/api/calculateFootprint', answers);
            const data = response.data;

            if (data) {
                // Update the state with the received data
                setCarbonFootprint(data.carbonFootprint);
                setNumberOfTrees(data.numberOfTrees);
                console.log("Updated Footprint:", data.carbonFootprint);

            }
        } catch (error) {
            console.error("Error fetching calculation results:", error);
        }
    }


    const handleInputChange = (event) => {
        const currentQuestionId = questions[currentQuestionIndex]?.id;
        if (!currentQuestionId) return;

        let newAnswerValue = event.target.value;

        // If the event target is a radio input, save its value directly
        if (event.target.type === "radio") {
            const choiceIndex = event.target.getAttribute("data-index"); // Get the index of the selected choice
            const refValue = questions[currentQuestionIndex]?.refs[choiceIndex]; // Get the corresponding ref value
            setAnswers((prevAnswers) => ({
                ...prevAnswers,
                [currentQuestionId]: refValue, // Use the ref value instead of the choice
            }));
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
            [currentQuestionId]: newAnswerValue,
        }));
    };









    const handleUnitSelection = (unit) => {
        setSelectedUnit(unit);

        // If it's not questionType=2 and choiceAns=2, simply set the choices as they are
        if (questions[currentQuestionIndex]?.questionType !== 2 || questions[currentQuestionIndex]?.choiceAns !== "2") {
            setUnitChoices(questions[currentQuestionIndex]?.choices || []);
            return;
        }

        // For questionType=2 and choiceAns=2, parse choices
        let parsedChoices = [];
        try {
            parsedChoices = JSON.parse(questions[currentQuestionIndex]?.choices || '{}');
            setUnitChoices(parsedChoices[unit] || []);
        } catch (error) {
            console.error("Error parsing choices JSON:", error);
        }
    }





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
    const handleContactUs = () => {
        navigate('/ContactUs'); // Use navigate to go to the desired route
    };
    const handleProceed = async () => {
        if (currentQuestionIndex < questions.length - 1) {
            // Transform the answers object to the desired format
            const formattedAnswers = Object.entries(answers).map(([id, value]) => ({ id: Number(id), value }));

            // Fetch and update the carbon footprint here based on the submitted answer
            await handleSubmitAnswers(formattedAnswers);
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            // If it's the last question, navigate to the FinalPage
            setCarbonFootprint(carbonFootprint); // Replace with your actual carbon footprint value
            setNumberOfTrees(numberOfTrees); // Replace with your actual number of trees value

            // Navigate to the FinalPage with query parameters
            navigate(`/FinalPage?carbonFootprint=${carbonFootprint}&numberOfTrees=${numberOfTrees}`);
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
                    <a href="#">About Us</a>
                    <a href="#" className="selected">Calculator</a>
                    <a href="#">Admin</a>
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
                            width: '409.62px', marginTop: '88px', left: '137.69px', position: 'absolute',
                            textAlign: 'left',
                        }}>
                            {questions[currentQuestionIndex]?.choices.map((innerChoices, outerIndex) => (
                                innerChoices.map((choice, innerIndex) => (
                                    <div key={outerIndex + '-' + innerIndex} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                        <input type="radio" id={`choice-${outerIndex}-${innerIndex}`} name="choice" value={choice} style={{ marginRight: '10px' }} onChange={handleInputChange} />
                                        <label htmlFor={`choice-${outerIndex}-${innerIndex}`}>{choice}</label>
                                    </div>
                                ))
                            ))}
                        </div>
                    )}

                    {
                        questions[currentQuestionIndex]?.questionType === 2 && (
                            <div style={{ width: '400px', marginTop: '60px', left: '137.69px', position: 'absolute', display: 'flex', justifyContent: 'space-around' }}>
                                {['Miles/Week', 'Miles/Year', 'Gallon', '1000 cubic feet', 'KWH', 'Therms', 'Dollars'].map(unit => (
                                    <div
                                        key={unit}
                                        style={{
                                            padding: '10px',
                                            border: '1px solid',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            backgroundColor: selectedUnit === unit ? 'lightgreen' : 'white'
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

                                {/* Left Side */}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {unitSpecificChoices.slice(0, 2).map((choice, index) => (
                                        <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                            <input type="radio" id={`choice-${index}`} name="choice" value={choice} style={{ marginRight: '10px' }} onChange={handleInputChange} />
                                            <label htmlFor={`choice-${index}`}>{choice}</label>
                                        </div>
                                    ))}
                                </div>

                                {/* Right Side */}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {unitSpecificChoices.slice(2, 4).map((choice, index) => (
                                        <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                            <input type="radio" id={`choice-${index + 2}`} name="choice" value={choice} style={{ marginRight: '10px' }} onChange={handleInputChange} />
                                            <label htmlFor={`choice-${index + 2}`}>{choice}</label>
                                        </div>
                                    ))}
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