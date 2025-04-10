import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faHourglass } from '@fortawesome/free-solid-svg-icons';
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

function ManageCandidate() {
    const [totalApprovedCandidates, setTotalApprovedCandidates] = useState(0);
    const [totalPendingCandidates, setTotalPendingCandidates] = useState(0);

    useEffect(() => {
        const fetchCandidateCounts = async () => {
            try {
                const approvedResponse = await axios.get('http://127.0.0.1:8000/api/candidate/approved/count/');
                const pendingResponse = await axios.get('http://127.0.0.1:8000/api/candidate/pending/count/');
                
                setTotalApprovedCandidates(approvedResponse.data.total_approved_candidates);
                setTotalPendingCandidates(pendingResponse.data.total_pending_candidates);
            } catch (error) {
                console.error('Error fetching candidate counts:', error);
            }
        };

        fetchCandidateCounts();
    }, []);

    return (
        <div style={{ marginTop: '116px', marginLeft: "200px", display: 'flex', backgroundColor: "#C3B091" }}>
            <div className="col-md-4 col-xl-3" style={{ margin: "50px" }}>
                <Link className="nav-link" to="/ActivatedCandidate" style={linkStyle}>
                    <div 
                        className="card bg-c-green order-card" 
                        style={{
                            ...cardStyle,
                            backgroundColor: '#3c8fa2',
                            marginBottom: "330px"
                        }}
                    >
                        <div className="card-block">
                            <h4 className="m-b-20">Total Approved Candidates</h4>
                            <h2 className="text-right">{totalApprovedCandidates}</h2>
                            <FontAwesomeIcon icon={faUserCheck} className="f-left" />
                        </div>
                    </div>
                </Link>
            </div>

            <div className="col-md-4 col-xl-3" style={{ margin: "50px" }}>
                <Link className="nav-link" to="/CandidateActivation" style={linkStyle}>
                    <div 
                        className="card bg-c-green order-card" 
                        style={{
                            ...cardStyle,
                            backgroundColor: '#c73b0e',
                        }}
                    >
                        <div className="card-block">
                            <h4 className="m-b-20">Total Pending Candidates</h4>
                            <h2 className="text-right">{totalPendingCandidates}</h2>
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

export default ManageCandidate;