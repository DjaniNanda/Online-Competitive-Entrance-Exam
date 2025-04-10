import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

function SubjectForm() {
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState(''); // New state for duration
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const subject = { title, duration }; // Include duration in the subject object

        try {
            await axios.post('http://127.0.0.1:8000/subject/', subject); // Update with your actual endpoint
            history.push("/CreateSubject"); // Redirect to subjects list or page
            Swal.fire({
                title: "Subject Successfully Created",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error('Error creating subject:', error);
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
    };

    return (
        <div style={{ marginTop: '116px', marginLeft: "200px", display: 'flex', backgroundColor: "#C3B091", paddingBottom: '370px' }}>
            <form onSubmit={handleSubmit} style={{ marginLeft: "260px", marginTop: "15px", width: "300px" }}>
                <center><h1>Add Subject</h1></center>
                
                <div className="form-outline mb-4" style={{ marginBottom: "40px", marginTop: "20px" }}>
                    <label htmlFor="subjectTitle"><h4>Subject Name</h4></label>
                    <input
                        type="text"
                        id="subjectTitle"
                        placeholder="Example: Mathematics"
                        className="form-control form-control-lg"
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-outline mb-4" style={{ marginBottom: "40px", marginTop: "20px" }}>
                    <label htmlFor="subjectDuration"><h4>Duration (HH:MM:SS)</h4></label>
                    <input
                        type="text"
                        id="subjectDuration"
                        placeholder="Example: 01:30:00"
                        className="form-control form-control-lg"
                        onChange={(e) => setDuration(e.target.value)}
                        required
                    />
                </div>

                <div className="pt-1 mb-4" style={{ marginBottom: "40px", marginTop: "20px" }}>
                    <button
                        className="btn btn-dark btn-lg btn-block"
                        type="submit"
                    >
                        Add Subject
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SubjectForm;