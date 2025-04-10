import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivatedCandidate = () => {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/candidates/activate/'); // Update API endpoint
                setCandidates(response.data);
            } catch (error) {
                console.error('Error fetching candidates:', error);
            }
        };

        fetchCandidates();
    }, []);

    return (
        <>
        <div style={{ marginTop: '116px', marginLeft: "200px", backgroundColor: "#C3B091", padding: '20px', paddingBottom: '450px' }}>
            <h1>Activated Candidates</h1> {/* Update title */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Photo</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Full Name</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>CNI</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Required Diploma</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Birth Certificate</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default ActivatedCandidate;