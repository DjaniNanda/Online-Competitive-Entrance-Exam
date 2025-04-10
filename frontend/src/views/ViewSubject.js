import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import Swal from "sweetalert2";

function Subject() {
    const [display, setDisplay] = useState({ display: "none" });
    const [subjects, setSubjects] = useState([]);
    const [subject, setSubject] = useState({ title: "", duration: "", created_at: "", question_count: "" }); // Added duration
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null); // State for error handling
    const history = useHistory();

    useEffect(() => {
        async function getAllSubjects() {
            try {
                const response = await axios.get("http://127.0.0.1:8000/subject/");
                setSubjects(response.data);
            } catch (err) {
                console.error("Error fetching subjects:", err);
                setError("Failed to fetch subjects.");
            }
        }
        getAllSubjects();
    }, []);

    const date = new Date();
    const d = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    const t = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    const handleInput = (e) => {
        setSubject({ ...subject, [e.target.name]: e.target.value });
    };

    async function handleAddNewSubject() {
        try {
            await axios.post("http://127.0.0.1:8000/subject/", { ...subject, created_at: `${d} ${t}` });
            history.push("/ViewSubject");
            setDisplay({ display: "none" });
            Swal.fire({
                title: "Subject Successfully Created",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error("Error adding subject:", err);
            Swal.fire({
                title: "Subject Was Not Created",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    }

    async function deleteSubject(id) {
        try {
            await axios.delete(`http://127.0.0.1:8000/subject/${id}/`);
            setSubjects(subjects.filter(subject => subject.id !== id));
        } catch (err) {
            console.error("Error deleting subject:", err);
            setError("Failed to delete subject.");
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
                <div style={{ marginTop: '116px', marginLeft: "200px", backgroundColor: "#C3B091", paddingBottom: '300px' }}>
                    <h2>Subject List</h2>
                    {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error messages */}
                    <table style={{ border: '2px solid black', borderCollapse: 'collapse', width: '900px', marginBottom: '40px',margintop: '40px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Subject Name</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Subject Creation Date</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Total Questions</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Duration</th> {/* New column for duration */}
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((data, i) => (
                                <tr key={i}>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{data.title}</td>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{data.created_at}</td>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{data.question_count}</td>
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{data.duration}</td> {/* Display duration */}
                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                        <NavLink exact to={`/AdminDashboard/Subject/Details/${data.id}`} style={{ margin: '5px' }}>
                                            <button style={buttonStyle}>Details</button>
                                        </NavLink>
                                        <NavLink exact to={`/AdminDashboard/Subject/ViewQuestion/${data.id}`} style={{ margin: '5px' }}>
                                            <button style={buttonStyle}>View Question</button>
                                        </NavLink>
                                        <NavLink exact to={`/AdminDashboard/Subject/AddQuestion/${data.id}`} style={{ margin: '5px' }}>
                                            <button style={buttonStyle}>Add Question</button>
                                        </NavLink>
                                        <button onClick={() => deleteSubject(data.id)} style={{ ...buttonStyle, margin: '5px' }}>Delete</button>
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
                            Add Subject
                        </button>
                    </div>
                    <div style={display}>
                        <label htmlFor="" style={{ margin: '5px' }}>Enter Subject Name:</label>
                        <input onChange={handleInput} name="title" type="text" placeholder="Enter Subject Name" />
                        <label htmlFor="" style={{ margin: '5px' }}>Enter Duration (HH:MM:SS):</label>
                        <input onChange={handleInput} name="duration" type="text" placeholder="Enter Duration" /> {/* Added duration input */}
                        <div style={{ margin: '20px' }}>
                            <button onClick={handleAddNewSubject} style={{ ...buttonStyle, backgroundColor: 'lightgreen', margin: '5px' }}>Add</button>
                            <button onClick={() => setDisplay({ display: "none" })} style={{ ...buttonStyle, backgroundColor: '#f95f40', margin: '5px' }}>Close</button>
                        </div>
                    </div>
                </div>
            </center>
        </>
    );
}

export default Subject;