import React, { useState, useContext,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faChalkboardTeacher, faBook, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import AuthContext from '../context/AuthContext';

const cardStyle = {
    color: 'white',
    width: "250px",
    height: "100px",
    padding: "20px",
    transition: 'all 0.3s ease',
};

function Dashboard() {
    const [totalSubjects, setTotalSubjects] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const [totalCandidates, setTotalCandidates] = useState(0);
    const [isTeacher, setIsTeacher] = useState(false);
    const { authTokens } = useContext(AuthContext);
  
    useEffect(() => {
        let userGroups = [];
        if (authTokens) {
            const decoded = jwtDecode(authTokens.access);
            userGroups = decoded.groups;
        }
        const isTeacher = userGroups.includes("teacher");
        setIsTeacher(isTeacher);

        async function fetchCounts() {
            try {
                const [subjectResponse, questionResponse, candidateResponse, teacherResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/subject/count/'),
                    axios.get('http://127.0.0.1:8000/api/question/count/'),
                    axios.get('http://127.0.0.1:8000/api/candidate/count/'),
                    axios.get('http://127.0.0.1:8000/api/teacher/count/')
                ]);

                setTotalSubjects(subjectResponse.data.total_subjects);
                setTotalQuestions(questionResponse.data.total_questions);
                setTotalCandidates(candidateResponse.data.total_candidates);
                setTotalTeachers(teacherResponse.data.total_teachers);
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        }

        fetchCounts();
    }, [authTokens]);

    return (
        <div style={{ marginTop: '116px', marginLeft: "200px", display: 'flex', backgroundColor: "#C3B091", paddingBottom: "100px" }}>
            {isTeacher ? (
                <>
                    <div className="col-md-4 col-xl-3" style={{ margin: "70px", marginBottom: "300px" }}>
                        <div 
                            className="card bg-c-blue order-card" 
                            style={{
                                ...cardStyle,
                                backgroundColor: '#891ea8'
                            }}
                        >
                            <div className="card-block">
                                <h6 className="m-b-20">Total Subjects</h6>
                                <FontAwesomeIcon icon={faBook} className="f-left" style={{ fontSize: '26px' }} />
                                <h2 className="text-right"><span>{totalSubjects}</span></h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 col-xl-3" style={{ margin: "70px" }}>
                        <div 
                            className="card bg-c-yellow order-card" 
                            style={{
                                ...cardStyle,
                                backgroundColor: '#c73b0e'
                            }}
                        >
                            <div className="card-block">
                                <h6 className="m-b-20">Available Questions</h6>
                                <FontAwesomeIcon icon={faQuestionCircle} className="f-left" style={{ fontSize: '26px' }} />
                                <h2 className="text-right"><span>{totalQuestions}</span></h2>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="col-md-4 col-xl-3" style={{ marginTop: "60px" }}>
                        <div 
                            className="card bg-c-pink order-card" 
                            style={{
                                ...cardStyle,
                                backgroundColor: '#3c8fa2',
                                marginBottom: "270px"
                            }}
                        >
                            <div className="card-block">
                                <h6 className="m-b-20">Registered Candidates</h6>
                                <FontAwesomeIcon icon={faUserGraduate} className="f-left" style={{ fontSize: '26px' }} />
                                <h2 className="text-right"><span>{totalCandidates}</span></h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 col-xl-3" style={{ marginTop: "60px" }}>
                        <div 
                            className="card bg-c-green order-card" 
                            style={{
                                ...cardStyle,
                                backgroundColor: '#774db7'
                            }}
                        >
                            <div className="card-block">
                                <h6 className="m-b-20">Total Teachers</h6>
                                <FontAwesomeIcon icon={faChalkboardTeacher} className="f-left" style={{ fontSize: '26px' }} />
                                <h2 className="text-right"><span>{totalTeachers}</span></h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 col-xl-3" style={{ marginTop: "60px" }}>
                        <div 
                            className="card bg-c-blue order-card" 
                            style={{
                                ...cardStyle,
                                backgroundColor: '#891ea8'
                            }}
                        >
                            <div className="card-block">
                                <h6 className="m-b-20">Total Subjects</h6>
                                <FontAwesomeIcon icon={faBook} className="f-left" style={{ fontSize: '26px' }} />
                                <h2 className="text-right"><span>{totalSubjects}</span></h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 col-xl-3" style={{ marginTop: "60px" }}>
                        <div 
                            className="card bg-c-yellow order-card" 
                            style={{
                                ...cardStyle,
                                backgroundColor: '#c73b0e'
                            }}
                        >
                            <div className="card-block">
                                <h6 className="m-b-20">Available Questions</h6>
                                <FontAwesomeIcon icon={faQuestionCircle} className="f-left" style={{ fontSize: '26px' }} />
                                <h2 className="text-right"><span>{totalQuestions}</span></h2>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <style jsx>{`
                .card {
                    transition: all 0.3s ease;
                }
                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                    filter: brightness(110%);
                }
            `}</style>
        </div>
    );
}

export default Dashboard;