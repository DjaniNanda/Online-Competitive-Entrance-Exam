import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CandidateActivation = () => {
    const [candidates, setCandidates] = useState([]);
    const [hoveredButtonId, setHoveredButtonId] = useState(null); // State for tracking hovered button

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/candidates/'); // Update API endpoint
                setCandidates(response.data);
            } catch (error) {
                console.error('Error fetching candidates:', error);
            }
        };

        fetchCandidates();
    }, []);

    const activateCandidate = async (id) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/candidates/activate/${id}/`); // Update API endpoint
            setCandidates(candidates.filter(candidate => candidate.id !== id)); // Remove activated candidate from list
        } catch (error) {
            console.error('Error activating candidate:', error);
        }
    };

    const deleteCandidate = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/candidates/activate/${id}/`); // Update API endpoint
            setCandidates(candidates.filter(candidate => candidate.id !== id)); // Remove deleted candidate from list
        } catch (error) {
            console.error('Error deleting candidate:', error);
        }
    };

    return (
        <>
        <div style={{ marginTop: '116px', marginLeft: "200px", backgroundColor: "#C3B091", padding: '20px', paddingBottom: '400px' }}>
            <h1>Pending Candidates</h1> {/* Update title */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Photo</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Full Name</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>CNI</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Required Diploma</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Birth Certificate</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map((candidate) => (
                        <tr key={candidate.id}>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                <img src={candidate.image} alt={candidate.username} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{candidate.fullname || candidate.full_name}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{candidate.email}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {candidate.cni && (
                                    <a href={candidate.cni} target="_blank" rel="noopener noreferrer">View</a>
                                )}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {candidate.require_diploma && (
                                    <a href={candidate.require_diploma} target="_blank" rel="noopener noreferrer">View</a>
                                )}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {candidate.birth_certificate && (
                                    <a href={candidate.birth_certificate} target="_blank" rel="noopener noreferrer">View</a>
                                )}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                <button
                                    onClick={() => activateCandidate(candidate.id)}
                                    onMouseEnter={() => setHoveredButtonId(candidate.id)}
                                    onMouseLeave={() => setHoveredButtonId(null)}
                                    style={{
                                        backgroundColor: hoveredButtonId === candidate.id ? '#555' : '#333',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        padding: '5px 10px',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s',
                                    }}>
                                    Activate
                                </button>
                                <button
                                    onClick={() => deleteCandidate(candidate.id)}
                                    style={{
                                        backgroundColor: '#d9534f',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        padding: '5px 10px',
                                        marginLeft: '10px',
                                        cursor: 'pointer',
                                    }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default CandidateActivation;