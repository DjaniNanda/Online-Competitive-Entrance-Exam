import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink,useHistory } from "react-router-dom";

function ExamSession() {
    const [display, setDisplay] = useState({ display: "none" });
    const [examSessions, setExamSessions] = useState([]);
    const [examSession, setExamSession] = useState({
        name: "",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
    });
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null); // State for error handling
    const history = useHistory();

    useEffect(() => {
        async function getAllExamSessions() {
            try {
                const response = await axios.get("http://127.0.0.1:8000/exam-session/");
                setExamSessions(response.data);
            } catch (err) {
                console.error("Error fetching exam sessions:", err);
                setError("Failed to fetch exam sessions.");
            }
        }
        getAllExamSessions();
    }, []);

    const handleInput = (e) => {
        setExamSession({ ...examSession, [e.target.name]: e.target.value });
    };

    async function handleAddNewExamSession() {
        try {
            await axios.post("http://127.0.0.1:8000/exam-session/", examSession);
            setStatus(true);
            setDisplay({ display: "none" });
            setExamSession({ name: "", start_date: "", end_date: "",  start_time: "",end_time: "" }); // Reset input fields
            history.push("/ViewExamSession");
        } catch (err) {
            console.error("Error adding exam session:", err);
            setError("Failed to add exam session.");
        }
    }

    async function deleteExamSession(id) {
        try {
            await axios.delete(`http://127.0.0.1:8000/exam-session/${id}/`);
            setStatus(true);
            // Optionally refresh the sessions
            setExamSessions(examSessions.filter(session => session.id !== id));
        } catch (err) {
            console.error("Error deleting exam session:", err);
            setError("Failed to delete exam session.");
        }
    }

    const buttonStyle = {
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        padding: '5px 5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    };

    return (
        <>
            <center>
                <div style={{ marginTop: '116px', marginLeft: "200px", backgroundColor: "#C3B091", paddingBottom: '270px' }}>
                    <h2>Exam Session List</h2>
                    {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error messages */}
                    <table style={{ border: '2px solid black', borderCollapse: 'collapse', width: '800px', marginBottom: '40px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Session Name</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Start Date</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>End Date</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Start Time</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>End Time</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examSessions.map((session, i) => (
                                <tr key={i}>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{session.name}</td>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{session.start_date}</td>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{session.end_date}</td>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{session.start_time}</td>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{session.end_time}</td>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                        <NavLink exact to={`/AdminDashboard/ExamSession/Details/${session.id}`} style={{ margin: '5px' }}>
                                            <button style={buttonStyle}>Details</button>
                                        </NavLink>
                                        <button onClick={() => deleteExamSession(session.id)} style={{ ...buttonStyle, margin: '5px' }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ margin: '20px' }}>
                        <button 
                            onClick={() => setDisplay({ display: "block" })} 
                            style={{ ...buttonStyle, backgroundColor: "lightgreen" }} 
                        >
                            Add Exam Session
                        </button>
                    </div>
                    <div style={display}>
                        <label htmlFor="" style={{ margin: '5px' }}>Enter Session Name:</label>
                        <input onChange={handleInput} name="name" type="text" placeholder="Enter Session Name" />
                        <label htmlFor="" style={{ margin: '5px' }}>Start Date:</label>
                        <input onChange={handleInput} name="start_date" type="date" required />
                        <label htmlFor="" style={{ margin: '5px' }}>End Date:</label>
                        <input onChange={handleInput} name="end_date" type="date" required />
                        <label htmlFor="" style={{ margin: '5px' }}>Start Time:</label>
                        <input onChange={handleInput} name="start_time" type="time" required />

                        <label htmlFor="" style={{ margin: '5px' }}>End Time:</label>
                        <input onChange={handleInput} name="end_time" type="time" required />
                        <div style={{ margin: '20px' }}>
                            <button onClick={handleAddNewExamSession} style={{ ...buttonStyle, backgroundColor: 'lightgreen', margin: '5px' }}>Add</button>
                            <button onClick={() => setDisplay({ display: "none" })} style={{ ...buttonStyle, backgroundColor: '#f95f40', margin: '5px' }}>Close</button>
                        </div>
                    </div>
                </div>
            </center>
        </>
    );
}

export default ExamSession;