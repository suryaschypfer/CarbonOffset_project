import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function Third_Question(props) {
    
    const navigate = useNavigate();
    const [question, setQuestion] = useState("");
    const [error, setError] = useState(null);
    const [userInputBillAmount, setUserInputBillAmount] = useState("");
    const [utilityData, setUtilityData] = useState(null);
    const [fact, setFact] = useState("");
    const [totalQuestions, setTotalQuestions] = useState(0);

    // Navigation functions
    const handlelandingpage = () => navigate('/');
    const handleadmin = () => navigate('/admin');
    const handlePreviousPage = () => navigate('/secondquestion');

    useEffect(() => {
        async function fetchData(endpoint, setStateFunction) {
            try {
                const response = await axios.get(endpoint);
                setStateFunction(response.data);
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            }
        }
        fetchData('/api/questions', data => setQuestion(data[2].questions));
        fetchData('/api/randomfact', data => setFact(data.fact));
        fetchData('/api/questions', data => setTotalQuestions(data.length));
        
    }, []);

    

    

    const currentQuestionNumber = 3;
    const progressPercentage = (currentQuestionNumber / totalQuestions) * 100;
    const roundedPercentage = parseFloat(progressPercentage.toFixed(2));
    

    


    
    


    

    // Rest of the component remains the same as First_Question...

    return (
        <div style={{  background: 'white' }}>
        
        <div style={{ width: '1178px', height: '5px', left: '128px', top: '106px', position: 'absolute' }}>
            <div style={{ left: '614px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer' }}onClick={handlelandingpage}>Home</div>
            <div style={{ left: '0px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 800, wordWrap: 'break-word', cursor: 'pointer' }}>OFFSET CRBN</div>
            <div style={{ left: '711px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer' }}>About Us</div>
            <div style={{ left: '837px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer' }}>Calculator</div>
            <div style={{ left: '1078px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer' }}>Contact Us</div>
        </div>
        <div style={{ width: '1522px', height: '100px', left: '-10px', top: '975px', position: 'absolute', background: '#9FC1A2', border: '1px black solid', backdropFilter: 'blur(4px)' }}></div>
        <div style={{ width: '1451px', height: '0px', left: '-5px', top: '134px', position: 'absolute', border: '1px black solid' }}></div>
        <div style={{ width: '916px', height: '848px', left: '128px', top: '225px', position: 'absolute' }}>
        <div style={{ width: '885px', height: '655px', left: '1px', top: '0px', position: 'absolute', background: 'rgba(217, 217, 217, 0.12)', borderRadius: '30px' }}></div>
        <div style={{ width: '885px', height: '17px', left: '0px', top: '38px', position: 'absolute' }}>
            <div style={{ width: '885px', height: '17px', left: '0px', top: '0px', position: 'absolute', background: '#EAE4E3', borderRadius: '10px' }}></div>
            <div style={{ width: `${progressPercentage * 8.85}px`, height: '17px', left: '0px', top: '0px', position: 'absolute', background: '#9FC1A2', borderRadius: '10px' }}></div>
            <div style={{ width: '58px', height: '16px', left: '427px', top: '0px', position: 'absolute', color: 'black', fontSize: '14px', fontFamily: 'Outfit', fontWeight: 600, wordWrap: 'break-word' }}>{roundedPercentage}%</div>
        </div>
        <div style={{ left: '400px', top: '18px', position: 'absolute', color: 'black', fontSize: '14px', fontFamily: 'Outfit', fontWeight: 600, wordWrap: 'break-word' }}>
            Progress Bar<br />
        </div>
        <div style={{ width: '200px', height: '56px', left: '244px', top: '407px', position: 'absolute' }}>
            <div style={{ display: 'block', width: '184.66px', height: '56px', left: '0px', top: '0px', position: 'absolute', background: 'rgba(97.05, 197.20, 240.12, 0.78)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '300px', border: '1px black solid', textAlign: 'center', lineHeight: '56px', textDecoration: 'none', color: 'black' }}>
                <div style={{ width: '171.05px', left: '10px', top: '0px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 400, wordWrap: 'break-word' , cursor: 'pointer' }}onClick={handlePreviousPage}>Previous Page</div>
            </div>
        </div>
        <div style={{ width: '496px', height: '496px', cursor: 'pointer' }}>
            <div style={{ width: '185px', height: '56px', left: '460px', top: '406px', position: 'absolute', background: 'rgba(97.05, 197.20, 240.12, 0.78)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '300px', border: '1px black solid' }}>
                <div style={{ left: '21px', top: '15px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 400, wordWrap: 'break-word' }}>Submit & Proceed</div>
            </div>
            <div style={{ width: '322px', height: '136px', left: '480px', top: '499px', position: 'absolute', background: '#D9D9D9', borderRadius: '15px' }}>
                <div style={{ width: '237px', height: '23px', left: '50px', top: '15px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 400, wordWrap: 'break-word' }}>Your carbon footprint</div>
                <div style={{ width: '119px', height: '40px', left: '181px', top: '220px', position: 'absolute' }}>
                    <div style={{ left: '-20px', top: '-140px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '32px', fontFamily: 'Outfit', fontWeight: 700, wordWrap: 'break-word' }}>0</div>
                    <div style={{ width: '60px', height: '26px', left: '25px', top: '-129px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 400, wordWrap: 'break-word' }}>lbs</div>
                </div>
            </div>
        </div>
        <div style={{ width: '327px', height: '136px', left: '100px', top: '499px', position: 'absolute', background: '#D9D9D9', borderRadius: '15px' }}></div>
        <div style={{ width: '683px', height: '167px', left: '102px', top: '120px', position: 'absolute' }}></div>
        <div style={{ width: '685px', height: '200px', left: '100px', top: '152px', position: 'absolute' }}>
            <div style={{ width: '1.41px', height: '24px', left: '443.48px', top: '148px', position: 'absolute' }}></div>
            <div style={{ width: '685px', height: '200px', left: '0px', top: '0px', position: 'absolute', background: '#84D2F3', borderRadius: '15px' }}></div>
            
            <div style={{ 
                width: '409.62px', height: '50px', left: '137.69px', top: '30px', position: 'absolute',
                textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 400, wordWrap: 'break-word' 
              }}>
                {question}
              </div>
                      <input type="text" style={{ width: '402.53px', height: '66px', left: '141.24px', top: '106px', position: 'absolute', background: 'white', borderRadius: '300px', border: 'none', paddingLeft: '15px', fontSize: '20px' }} placeholder="Enter amount here" value={userInputBillAmount} onChange={(e) => { const val=e.target.value.replace(/[^0-9]/g, '');  setUserInputBillAmount(val.length <= 5 ? val : val.slice(0, 5));}}/>
                      
        </div>
        <div style={{ width: '685px', height: '22px', left: '100px', top: '107px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 500, wordWrap: 'break-word' }}>Answering the below questions will help in determining your Carbon Footprint</div>
        <div style={{ width: '237px', height: '23px', left: '148px', top: '512px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 400, wordWrap: 'break-word' }}>Average carbon footprint of an individual</div>
        <div style={{ width: '155px', height: '40px', left: '222px', top: '573px', position: 'absolute' }}>
            <div style={{ left: '0px', top: '0px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '32px', fontFamily: 'Outfit', fontWeight: 700, wordWrap: 'break-word' }}>12000</div>
            <div style={{ width: '60px', height: '26px', left: '95px', top: '12px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 400, wordWrap: 'break-word' }}>lbs</div>
        </div>
    </div>
    <div style={{ width: '285px', height: '655px', left: '1028px', top: '225px', position: 'absolute' }}>
        <div style={{ width: '285px', height: '655px', left: '0px', top: '0px', position: 'absolute', background: 'rgba(217, 217, 217, 0.12)', borderRadius: '30px' }}></div>
        <img style={{ width: '265px', height: '154px', left: '12px', top: '22px', position: 'absolute' }} src="First_Question.png" alt="First Question" />
        <div style={{ width: '265px', height: '403px', left: '12px', top: '197px', position: 'absolute', background: '#A3C7A0', borderRadius: '30px' }}></div>
        <div style={{ width: '231px', height: '331px', left: '31px', top: '241px', position: 'absolute', color: 'white', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 400, wordWrap: 'break-word' }}>{fact}</div>
    </div>
    <div style={{ left: '1116px', top: '106px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: 'Outfit', fontWeight: 600, wordWrap: 'break-word', cursor: 'pointer' }}onClick={handleadmin}>Admin</div>
        </div>
    
      );
}

export default Third_Question;
