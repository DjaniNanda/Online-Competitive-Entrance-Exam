import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

function Question() {
    const [display, setDisplay] = useState({ display: "none" });
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState({ title: "", created_at: "", subject_id: "", exam_session: "", answers: [] });
    const [error, setError] = useState(null);
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        async function getAllQuestions() {
            try {
                const response = await axios.get("http://127.0.0.1:8000/question/detail/");
                setQuestions(response.data);
            } catch (err) {
                console.error("Error fetching questions:", err);
                setError("Failed to fetch questions.");
            }
        }
        getAllQuestions();
    }, []);

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

    const handleInput = (e) => {
        setQuestion({ ...question, [e.target.name]: e.target.value });
    };

    const handleAnswerChange = (index, e) => {
        const newAnswers = [...question.answers];
        newAnswers[index].answer_text = e.target.value;
        setQuestion({ ...question, answers: newAnswers });
    };

    const toggleCorrectAnswer = (index) => {
        const newAnswers = [...question.answers];
        newAnswers[index].is_right = !newAnswers[index].is_right;
        setQuestion({ ...question, answers: newAnswers });
    };

    const addAnswerField = () => {
        setQuestion((prevQuestion) => ({
            ...prevQuestion,
            answers: [...prevQuestion.answers, { answer_text: "", is_right: false }]
        }));
    };

    async function handleAddNewQuestion() {
        try {
            await axios.post("http://127.0.0.1:8000/question/", question);
            setDisplay({ display: "none" });
            setQuestion({ title: "", created_at: "", subject_id: "", exam_session: "", answers: [] });
             // Refresh the questions list
        } catch (err) {
            console.error("Error adding question:", err);
            setError("Failed to add question.");
        }
    }

    async function deleteQuestion(id) {
        try {
            await axios.delete(`http://127.0.0.1:8000/question/detail/${id}/`);
            setQuestions(questions.filter(q => q.id !== id));
        } catch (err) {
            console.error("Error deleting question:", err);
            setError("Failed to delete question.");
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
                    <h2>Question List</h2>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <table style={{ border: '2px solid black', borderCollapse: 'collapse', width: '800px', marginBottom: '40px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Question</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Answers</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Correct Answer</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Subject</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Exam Session</th>
                                <th style={{ border: '1px solid black', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((data, i) => {
                                // Find the correct answer
                                const correctAnswer = data.answers.find(answer => answer.is_right);
                                return (
                                    <tr key={i}>
                                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{data.title}</td>
                                        <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                            {Array.isArray(data.answers) && data.answers.length > 0 
                                                ? data.answers.map(answer => answer.answer_text).join(", ") 
                                                : "No answers available"}
                                        </td>
                                        <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                            {correctAnswer ? correctAnswer.answer_text : "No correct answer"}
                                        </td>
                                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{data.subject.title}</td>
                                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{data.exam_session.name}</td>
                                        <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                            <NavLink exact to={`/ViewQuestionAnswer/${data.id}`} style={{ margin: '5px' }}>
                                                <button style={buttonStyle}>Details</button>
                                            </NavLink>
                                            <NavLink exact to={`/AdminDashboard/Question/Edit/${data.id}`} style={{ margin: '5px' }}>
                                                <button style={buttonStyle}>Edit</button>
                                            </NavLink>
                                            <button onClick={() => deleteQuestion(data.id)} style={{ ...buttonStyle, margin: '5px' }}>Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div style={{ margin: '20px' }}>
                        <button 
                            onClick={() => setDisplay({ display: "block" })} 
                            style={{ ...buttonStyle, backgroundColor: "lightgreen" }} 
                        >
                            Add Question
                        </button>
                    </div>
                    <div style={display}>
                        <label style={{ margin: '5px' }}>Enter Question Title:</label>
                        <input onChange={handleInput} name="title" type="text" placeholder="Enter Question Title" />
                        <label style={{ margin: '5px' }}>Select Subject:</label>
                        <select onChange={handleInput} name="subject_id">
                            <option value="">Select Subject</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>{subject.title}</option>
                            ))}
                        </select>
                        <label style={{ margin: '5px' }}>Enter Exam Session:</label>
                        <input onChange={handleInput} name="exam_session" type="text" placeholder="Enter Exam Session" />
                        <label style={{ margin: '5px' }}>Answers:</label>
                        {question.answers.map((answer, index) => (
                            <div key={index}>
                                <input 
                                    type="text" 
                                    value={answer.answer_text} 
                                    onChange={(e) => handleAnswerChange(index, e)} 
                                    placeholder={`Answer ${index + 1}`} 
                                />
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={answer.is_right} 
                                        onChange={() => toggleCorrectAnswer(index)} 
                                    />
                                    Correct Answer
                                </label>
                            </div>
                        ))}
                        <button onClick={addAnswerField} style={{ margin: '5px' }}>Add Answer</button>

                        <div style={{ margin: '20px' }}>
                            <button onClick={handleAddNewQuestion} style={{ ...buttonStyle, backgroundColor: 'lightgreen', margin: '5px' }}>Add</button>
                            <button onClick={() => setDisplay({ display: "none" })} style={{ ...buttonStyle, backgroundColor: '#f95f40', margin: '5px' }}>Close</button>
                        </div>
                    </div>
                </div>
            </center>
        </>
    );
}

export default Question;