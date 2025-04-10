import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faHourglass } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const linkStyle = {
    textDecoration: 'none',
    display: 'block',
    transition: 'all 0.3s ease',
};

const cardStyle = {
    color: 'white',
    width: "300px",
    height: "103px",
    padding: "10px",
    transition: 'all 0.3s ease',
};

function ManageTeacher() {
    const [totalApprovedTeachers, setTotalApprovedTeachers] = useState(0);
    const [totalPendingTeachers, setTotalPendingTeachers] = useState(0);

    useEffect(() => {
        const fetchTeacherCounts = async () => {
            try {
                const approvedResponse = await axios.get('http://127.0.0.1:8000/api/teacher/approved/count/');
                const pendingResponse = await axios.get('http://127.0.0.1:8000/api/teacher/pending/count/');
                
                setTotalApprovedTeachers(approvedResponse.data.total_approved_teachers);
                setTotalPendingTeachers(pendingResponse.data.total_pending_teachers);
            } catch (error) {
                console.error('Error fetching teacher counts:', error);
            }
        };

        fetchTeacherCounts();
    }, []);

    return (
        <div style={{ marginTop: '116px', marginLeft: "200px", display: 'flex', backgroundColor: "#C3B091" }}>
            <div className="col-md-4 col-xl-3" style={{ margin: "50px" }}>
                <Link className="nav-link" to="/ActivatedTeacher" style={linkStyle}>
                    <div 
                        className="card bg-c-green order-card" 
                        style={{
                            ...cardStyle,
                            backgroundColor: '#3c8fa2',
                            marginBottom: "330px"
                        }}
                    >
                        <div className="card-block">
                            <h4 className="m-b-20">Total Approved Teachers</h4>
                            <h2 className="text-right">{totalApprovedTeachers}</h2>
                            <FontAwesomeIcon icon={faChalkboardTeacher} className="f-left" />
                        </div>
                    </div>
                </Link>
            </div>

            <div className="col-md-4 col-xl-3" style={{ margin: "50px" }}>
                <Link className="nav-link" to="/TeacherActivation" style={linkStyle}>
                    <div 
                        className="card bg-c-green order-card" 
                        style={{
                            ...cardStyle,
                            backgroundColor: '#c73b0e',
                        }}
                    >
                        <div className="card-block">
                            <h4 className="m-b-20">Total Pending Teachers</h4>
                            <h2 className="text-right">{totalPendingTeachers}</h2>
                            <FontAwesomeIcon icon={faHourglass} className="f-left" />
                        </div>
                    </div>
                </Link>
            </div>

            <style jsx>{`
                .nav-link:hover .card {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                }
                .nav-link:hover .card.bg-c-green {
                    filter: brightness(110%);
                }
            `}</style>
        </div>
    );
}

export default ManageTeacher;