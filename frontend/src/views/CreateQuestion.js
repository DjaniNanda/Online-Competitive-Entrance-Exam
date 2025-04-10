import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

function QuestionForm() {
    const [exam_session_id, setExamSessionId] = useState('');
    const [subject_id, setSubjectId] = useState('');
    const [title, setTitle] = useState('');
    const [answers, setAnswers] = useState(['']); // Initialize as an array of strings
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
    const [ExamSessions, setExamSessions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [examSessionResponse, subjectResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/exam-session/'),
                    axios.get('http://127.0.0.1:8000/subject/')
                ]);
                
                setExamSessions(examSessionResponse.data);
                setSubjects(subjectResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire({
                    title: "Failed to fetch data",
                    icon: "error",
                    toast: true,
                    timer: 6000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const question = {
            exam_session_id,
            subject_id,
            title,
            answers: answers.map((answer_text, index) => ({
                answer_text, // Use answer_text instead of text
                is_right: index === correctAnswerIndex
            })) // Send as objects with answer_text and is_correct
        };

        console.log("Submitting question:", question);
        try {
            await axios.post(`http://127.0.0.1:8000/question/${subject_id}/`, question);
            history.push("/CreateQuestion");
            Swal.fire({
                title: "Question Successfully Created",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error('Error creating question:', error);
            Swal.fire({
                title: "Question Was Not Created",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value; // Update the answer string directly
        setAnswers(newAnswers);
    };

    const addAnswer = () => {
        if (answers.length < 10) { // Limit to 10 answers
            setAnswers([...answers, '']); // Add a new empty string
        }
    };

    return (
        <div style={{ marginTop: '116px', marginLeft: "200px", display: 'flex', backgroundColor: "#C3B091", paddingBottom: '280px' }}>
            <form onSubmit={handleSubmit} style={{ marginLeft: "260px", marginTop: "15px", width: "300px" }}>
                <center><h1>Add Question</h1></center>

                <div className="form-outline mb-4">
                    <label htmlFor="examSession"><h4>Exam Session</h4></label>
                    <select
                        id="examSession"
                        className="form-control form-control-lg"
                        value={exam_session_id}
                        onChange={(e) => setExamSessionId(e.target.value)}
                        required
                    >
                        <option value="">Select Exam Session</option>
                        {ExamSessions.map((session) => (
                            <option key={session.id} value={session.id}>
                                {session.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-outline mb-4">
                    <label htmlFor="subject"><h4>Subject</h4></label>
                    <select
                        id="subject"
                        className="form-control form-control-lg"
                        value={subject_id}
                        onChange={(e) => setSubjectId(e.target.value)}
                        required
                    >
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-outline mb-4">
                    <label htmlFor="questionTitle"><h4>Question Title</h4></label>
                    <input
                        type="text"
                        id="questionTitle"
                        placeholder="Enter Question Title"
                        className="form-control form-control-lg"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <h4>Answers</h4>
                {answers.map((answer_text, index) => (
                    <div key={index} className="form-outline mb-4" style={{ marginBottom: "20px", marginTop: "10px" }}>
                        <input
                            type="text"
                            placeholder={`Answer Option ${index + 1}`}
                            className="form-control form-control-lg"
                            value={answer_text} // Access the string directly
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            required
                        />
                    </div>
                ))}

                <div style={{ marginBottom: '20px' }}>
                    <label><h4>Correct Answer:</h4></label>
                    {answers.map((answer_text, index) => (
                        <div key={index}>
                            <input
                                type="radio"
                                name="correctAnswer"
                                value={index}
                                checked={correctAnswerIndex === index}
                                onChange={() => setCorrectAnswerIndex(index)}
                            />
                            <label>{answer_text}</label> {/* Access the string directly */}
                        </div>
                    ))}
                </div>

                <button type="button" onClick={addAnswer} style={{ marginBottom: '20px', backgroundColor: 'lightblue', border: 'none', padding: '10px', borderRadius: '5px' }}>
                    Add Another Answer Option
                </button>

                <div className="pt-1 mb-4">
                    <button type="submit" className="btn btn-success" style={{ marginTop: '20px' }}>Submit Question</button>
                </div>
            </form>
        </div>
    );
}

export default QuestionForm;