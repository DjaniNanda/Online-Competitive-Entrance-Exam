import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useExamSession } from '../context/SessionContext';

function ExamSessionForm() {
    const { setCurrentExamSession } = useExamSession(); // Extract setCurrentSession
    const [name, setName] = useState('');
    const [start_date, setStartDate] = useState('');
    const [start_time, setStartTime] = useState('');
    const [end_date, setEndDate] = useState('');
    const [end_time, setEndTime] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const examSession = { name, start_date, start_time, end_date, end_time };
        console.log(examSession);
        

        try {
            await axios.post('http://127.0.0.1:8000/exam-session/', examSession);
            setCurrentExamSession(examSession); // Set current session in context
            history.push("/createexamsession");
            Swal.fire({
                title: "Exam Session Successfully Created",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error('Error creating exam session:', error);
            Swal.fire({
                title: "Exam Session Was Not Created",
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
        <div style={{ marginTop: '116px', marginLeft: "200px", display: 'flex', backgroundColor: "#C3B091", paddingBottom: '60px' }}>
            <form onSubmit={handleSubmit} style={{ marginLeft: "260px", marginTop: "15px", width: "300px" }}>
                <center><h1>Add Exam Session</h1></center>
                <div className="form-outline mb-4" style={{ marginBottom: "40px", marginTop: "20px" }}>
                    <label htmlFor="examSessionName"><h4>Exam Session Name</h4></label>
                    <input
                        type="text"
                        id="examSessionName"
                        placeholder="Example: January2024"
                        className="form-control form-control-lg"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-outline mb-4" style={{ marginBottom: "40px", marginTop: "20px" }}>
                    <label htmlFor="startDate"><h4>Start Date</h4></label>
                    <input
                        type="date"
                        id="startDate"
                        className="form-control form-control-lg"
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-outline mb-4" style={{ marginBottom: "40px", marginTop: "20px" }}>
                    <label htmlFor="endDate"><h4>End Date</h4></label>
                    <input
                        type="date"
                        id="endDate"
                        className="form-control form-control-lg"
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-outline mb-4" style={{ marginBottom: "40px", marginTop: "20px" }}>
                    <label htmlFor="startTime"><h4>Start Time</h4></label>
                    <input
                        type="time"
                        id="startTime"
                        className="form-control form-control-lg"
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-outline mb-4" style={{ marginBottom: "40px", marginTop: "20px" }}>
                    <label htmlFor="endTime"><h4>End Time</h4></label>
                    <input
                        type="time"
                        id="endTime"
                        className="form-control form-control-lg"
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>

                <div className="pt-1 mb-4" style={{ marginBottom: "50px", marginTop: "20px" }}>
                    <button
                        className="btn btn-dark btn-lg btn-block"
                        type="submit"
                    >
                        Add Exam Session
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ExamSessionForm;