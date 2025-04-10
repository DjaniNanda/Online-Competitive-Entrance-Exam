import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const linkStyle = {
    textDecoration: 'none',
    display: 'block',
    transition: 'all 0.3s ease',
};

const cardStyle = {
    color: 'white',
    width: "300px",
    height: "103px",
    padding: "20px",
    transition: 'all 0.3s ease',
};

function ManageExamSession() {
    return (
        <div style={{ marginTop: '116px', marginLeft: "200px", display: 'flex', backgroundColor: "#C3B091" }}>
            <div className="col-md-4 col-xl-3" style={{ margin: "50px" }}>
                <Link className="nav-link" to="/CreateExamSession" style={linkStyle}>
                    <div 
                        className="card bg-c-green order-card" 
                        style={{
                            ...cardStyle,
                            backgroundColor: '#3c8fa2',
                            marginBottom: "330px",
                        }}
                    >
                        <div className="card-block">
                            <h4 className="m-b-20">Add Exam Session</h4>
                            <FontAwesomeIcon icon={faPlus} className="f-left" />
                        </div>
                    </div>
                </Link>
            </div>

            <div className="col-md-4 col-xl-3" style={{ margin: "50px" }}>
                <Link className="nav-link" to="/ViewExamSession" style={linkStyle}>
                    <div 
                        className="card bg-c-green order-card" 
                        style={{
                            ...cardStyle,
                            backgroundColor: '#73756d',
                        }}
                    >
                        <div className="card-block">
                            <h4 className="m-b-20">View Exam Sessions</h4>
                            <FontAwesomeIcon icon={faEye} className="f-left" />
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

export default ManageExamSession;