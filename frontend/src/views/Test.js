import { useState, useEffect, useContext } from "react"; 
import Swal from 'sweetalert2';
import { ApiContext } from '../context/ApiContext';
import { jwtDecode } from "jwt-decode";
import { NavLink } from 'react-router-dom';

function Test() {
    const [subjects, setSubjects] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [error, setError] = useState(null);
    const apiClient = useContext(ApiContext);

    const [disabledIndices, setDisabledIndices] = useState([]);
    const [timers, setTimers] = useState({});
    const [activeTimer, setActiveTimer] = useState(null);
    const [startedSubjects, setStartedSubjects] = useState({});

    const token = localStorage.getItem("authTokens");
    let user_id = null;
    let user = null;

    if (token) {
        const decoded = jwtDecode(token);
        user_id = decoded.id;
        user = decoded.email;
    }

    useEffect(() => {
        async function getAllSubjects() {
            try {
                const response = await apiClient.get("/subject/");
                setSubjects(response.data);
                setDisabledIndices(Array(response.data.length).fill(false));
                
                const initialTimers = response.data.reduce((acc, subject) => {
                    acc[subject.id] = convertDurationToSeconds(subject.duration);
                    return acc;
                }, {});
                setTimers(initialTimers);
                
            } catch (err) {
                console.error("Error fetching subjects:", err);
                setError("Failed to fetch subjects.");
            }
        }
        getAllSubjects();
    }, [apiClient]);

    useEffect(() => {
        let interval;
        if (activeTimer) {
            interval = setInterval(() => {
                setTimers(prevTimers => {
                    const newTimers = { ...prevTimers };
                    if (newTimers[activeTimer] > 0) {
                        newTimers[activeTimer]--;
                    } else {
                        clearInterval(interval);
                        submitAnswers(activeTimer);
                        setActiveTimer(null);
                        setDisabledIndices(prev => {
                            const newDisabled = [...prev];
                            const index = subjects.findIndex(subject => subject.id === activeTimer);
                            newDisabled[index] = true;
                            return newDisabled;
                        });
                    }
                    return newTimers;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeTimer, subjects]);

    const convertDurationToSeconds = (duration) => {
        if (!duration) return 0;
        const parts = duration.split(':');
        const hours = parseInt(parts[0]) || 0;
        const minutes = parseInt(parts[1]) || 0;
        const seconds = parseInt(parts[2]) || 0;
        return hours * 3600 + minutes * 60 + seconds;
    };

    useEffect(() => {
        const enterFullScreen = async () => {
            const elem = document.documentElement; 
            if (elem.requestFullscreen) {
                await elem.requestFullscreen(); 
            } else if (elem.mozRequestFullScreen) {
                await elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                await elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                await elem.msRequestFullscreen();
            }
        };

        enterFullScreen().catch(err => {
            console.error("Error trying to enter full screen:", err);
            Swal.fire({
                title: "Failed to enter full screen.",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        });

        const handleFullScreenChange = () => {
            if (!document.fullscreenElement) {
                if (selectedSubjectId) {
                    submitAnswers(selectedSubjectId);
                }
                setDisabledIndices(Array(subjects.length).fill(true)); // Disable all buttons
            } else {
                setDisabledIndices(Array(subjects.length).fill(false)); // Enable buttons
            }
        };

        document.addEventListener("fullscreenchange", handleFullScreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullScreenChange);
        };
    }, [selectedSubjectId]);

    const handleStart = async (subjectId, index) => {
        if (activeTimer && activeTimer !== subjectId) {
            // Pause the current timer
            setActiveTimer(null);
        }

        if (!startedSubjects[subjectId]) {
            setStartedSubjects(prev => ({ ...prev, [subjectId]: true }));
        }

        setSelectedSubjectId(subjectId);
        setActiveTimer(subjectId);

        try {
            const response = await apiClient.get(`/question/${subjectId}/`);
            setQuestions(response.data);
            if (!startedSubjects[subjectId]) {
                setSelectedAnswers({});
            }
        } catch (err) {
            console.error("Error fetching questions:", err);
            Swal.fire({
                title: "Failed to fetch questions",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const submitAnswers = async (subjectId) => {
        if (!user) {
            Swal.fire({
                title: "You must be logged in to submit answers.",
                icon: "warning",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
            return;
        }

        try {
            await apiClient.post(`/submit/`, {
                user: user,
                user_id: user_id,
                subject_id: subjectId,
                answers: selectedAnswers,
            });
            Swal.fire({
                title: "Answers Submitted Successfully",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
            setQuestions([]);
            setSelectedSubjectId(null);
            setSelectedAnswers({});
            setActiveTimer(null);
            setDisabledIndices(prev => {
                const newDisabled = [...prev];
                const index = subjects.findIndex(subject => subject.id === subjectId);
                newDisabled[index] = true;
                return newDisabled;
            });
            setStartedSubjects(prev => ({ ...prev, [subjectId]: false }));
        } catch (err) {
            console.error("Error submitting answers:", err);
            Swal.fire({
                title: "Failed to submit answers",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const handleAnswerChange = (question_id, answer_id) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [question_id]: answer_id,
        }));
    };

    const exitFullScreenAndStopCamera = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => {
                console.error("Error exiting full screen:", err);
            });
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };


    const deactivateUser = async () => {
        try {
            await apiClient.post('/deactivate-user/', { user: user,
                                                        user_id: user_id, });
            Swal.fire({
                title: "User Deactivated Successfully",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error("Error deactivating user:", err);
            Swal.fire({
                title: "Failed to deactivate user",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    return (
        <>
            <div style={{ marginTop: '116px', marginLeft: "200px", backgroundColor: "#C3B091", paddingBottom: '300px' }}>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <center>
                    <table style={{ border: '2px solid black', borderCollapse: 'collapse', width: '800px', marginBottom: '40px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>No</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Subject Name</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Time Remaining</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((data, index) => (
                                <tr key={data.id}>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{data.id}</td>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{data.title}</td>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                        {formatTime(timers[data.id])}
                                    </td>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                        <button 
                                            onClick={() => handleStart(data.id, index)} 
                                            style={{ 
                                                margin: '10px', 
                                                padding: '8px', 
                                                backgroundColor: disabledIndices[index] ? 'gray' : (startedSubjects[data.id] ? 'orange' : 'lightgreen'), 
                                                border: 'none', 
                                                borderRadius: '5px', 
                                                cursor: disabledIndices[index] ? 'not-allowed' : 'pointer' 
                                            }}
                                            disabled={disabledIndices[index] || timers[data.id] === 0}
                                        >
                                            {disabledIndices[index] ? 'Completed' : (startedSubjects[data.id] ? 'Resume' : 'Start')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </center>
                {questions.length > 0 && (
                    <div style={{ paddingLeft: "40px" }}>
                        <h1>Questions for Subject No: {selectedSubjectId}</h1>
                        <form onSubmit={(e) => { e.preventDefault(); submitAnswers(selectedSubjectId); }}>
                            {questions.map((question) => (
                                <div key={question.id} style={{ marginBottom: '20px' }}>
                                    <h3>{question.title}</h3>
                                    {question.answers.map((answer) => (
                                        <div key={answer.id}>
                                            <h4>
                                                <label>
                                                    <input 
                                                        type="radio" 
                                                        name={`question-${question.id}`} 
                                                        value={answer.id} 
                                                        checked={selectedAnswers[question.id] === answer.id} 
                                                        onChange={() => handleAnswerChange(question.id, answer.id)} 
                                                    />
                                                    {answer.answer_text}
                                                </label>
                                            </h4>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <button type="submit" style={{ padding: '10px', backgroundColor: 'lightblue', border: 'none', borderRadius: '5px' }}>
                                Submit Answers
                            </button>
                        </form>
                    </div>
                )}

            <NavLink
                to="/resultbutton"
                onClick={() => {
                    exitFullScreenAndStopCamera();
                    deactivateUser();
                }}
                style={{
                    display: 'inline-block', // Ensure it behaves like a button
                    marginTop: '20px',
                    padding: '12px 20px',
                    fontSize: '16px',
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    cursor: 'pointer',
                }}
            >
                FINISH
            </NavLink>
            </div>
        </>
    );
}

export default Test;