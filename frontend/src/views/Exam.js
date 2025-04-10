import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

function TimeRestrictedButton() {
    const [examSession, setExamSession] = useState(null);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [countdown, setCountdown] = useState('');
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [error, setError] = useState(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;

        const fetchData = async () => {
            try {
                const [sessionResponse, subjectsResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/latest-exam-session/'),
                    axios.get('http://127.0.0.1:8000/subject/')
                ]);
                
                if (isMounted.current) {
                    setExamSession(sessionResponse.data);
                    setSubjects(subjectsResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (isMounted.current) {
                    setCountdown('Error loading exam session.');
                    setError("Failed to fetch subjects.");
                }
            }
        };

        fetchData();

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (!examSession) return;

        const checkTimeInterval = () => {
            const { start_time, end_time } = examSession;

            if (!start_time || !end_time) {
                setCountdown('THE EXAM DATE HAS NOT BEEN PROGRAMMED.');
                setIsButtonEnabled(false);
                return;
            }

            const now = new Date();
            const start = new Date(start_time);
            const end = new Date(end_time);

            if (now >= start && now <= end) {
                setIsButtonEnabled(true);
                setCountdown('');
            } else if (now < start) {
                setIsButtonEnabled(false);
                const timeDiff = start - now;
                updateCountdown(timeDiff);
            } else {
                setIsButtonEnabled(false);
                setCountdown('THE EXAM IS FINISHED.');
            }
        };

        const updateCountdown = (timeDiff) => {
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        };

        const intervalId = setInterval(checkTimeInterval, 1000);
        checkTimeInterval();

        return () => clearInterval(intervalId);
    }, [examSession]);

    const showImportantInfo = () => {
        Swal.fire({
            title: 'VERY IMPORTANT',
            html: ` BE PREPARED TO TAKE THE EXAM WHEN YOU CLICK ON "GO TO TEST" BUTTON BECAUSE THERE WILL BE NO GOING BACK<br><br>
            ALSO PREPARE A STABLE CONNECTION <br/><br/>
            AND WHEN YOU CLICK ON THE BUTTON THE EXAM STARTS IMMEDIATELY AND IT GOES IN FULLSCREEN MODE. IF YOU GO OUT OF THE FULLSCREEN MODE, YOUR RESULT WILL BE SUBMITTED.`,
            icon: 'warning',
            confirmButtonText: 'I Understand',
        });
    };

    const handleGoToTest = (e) => {
        if (!isButtonEnabled || subjects.length === 0) {
            e.preventDefault();
            Swal.fire({
                title: isButtonEnabled ? "No Subjects Available" : "The Exam Is Not Available Yet.",
                text: isButtonEnabled ? "There are no subjects available for the exam." : "Please wait for the exam to start.",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } else {
            setIsButtonClicked(true);
        }
    };

    const buttonStyle = {
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '15px',
        padding: '15px 25px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        margin: '5px',
        textDecoration: 'none',
        display: 'inline-block',
    };

    if (!examSession) {
        return <div>Loading exam session...</div>;
    }

    return (
        <div style={{ marginTop: '116px', marginLeft: "200px", textAlign: 'center', backgroundColor: "#C3B091", padding: '20px' }}>
          
          <div style={{ marginTop: '20px', marginBottom: '40px'}}></div>
            <h1>Welcome to the {examSession.name} Session</h1>

            <div style={{ marginTop: '35px', marginBottom: '40px' }}>
                {isButtonClicked && (
                    <h3>YOU HAVE ALREADY TAKEN THE EXAM THANK YOU.</h3>
                )}
                {!isButtonClicked && isButtonEnabled && (
                    <h3>YOU CAN TAKE THE EXAM NOW!</h3>
                )}
                {!isButtonClicked && !isButtonEnabled && countdown && (
                    <h3>THE EXAM WILL START IN: {countdown}</h3>
                )}
            </div>

            <button
                onClick={showImportantInfo}
                style={{
                    padding: '15px 25px',
                    fontSize: '16px',
                    backgroundColor: '#f95f40',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    marginBottom: '40px',
                }}
            >
                VERY IMPORTANT CLICK HERE
            </button>


            <h2>Subjects</h2>
            {error && <div style={{ color: 'red', marginBottom: '30px' }}>{error}</div>}
            <table style={{ border: '2px solid black', borderCollapse: 'collapse', width: '100%', marginBottom: '50px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Subject Name</th>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Creation Date</th>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Total Questions</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject) => (
                        <tr key={subject.id}>
                            <td style={{ border: '1px solid black', padding: '10px' }}>{subject.title}</td>
                            <td style={{ border: '1px solid black', padding: '10px' }}>{subject.created_at}</td>
                            <td style={{ border: '1px solid black', padding: '10px' }}>{subject.question_count}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>

            
            <NavLink 
                to="/test"
                onClick={handleGoToTest}
                style={{
                    ...buttonStyle,
                    backgroundColor: isButtonEnabled ? '#4CAF50' : '#ccc',
                    cursor: isButtonEnabled && subjects.length > 0 ? 'pointer' : 'not-allowed',
                    marginLeft: '20px',
                    marginBottom: '50px',
                }}
            >
                Go to Test
            </NavLink>
        </div>
    );
}

export default TimeRestrictedButton;