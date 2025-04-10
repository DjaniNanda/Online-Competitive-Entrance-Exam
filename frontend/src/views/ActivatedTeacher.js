import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivatedTeacher = () => {
    const [teachers, setTeachers] = useState([]);
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/teachers/activate/');
                setTeachers(response.data);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };

        fetchTeachers();
    }, []);

return (
    <>
        <div style={{ marginTop: '116px', marginLeft: "200px", backgroundColor: "#C3B091", padding: '20px', paddingBottom: '380px' }}>
            <h1>Active Administrator</h1>
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
                    {teachers.map((teacher) => (
                        <tr key={teacher.id}>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                <img src={teacher.image} alt={teacher.username} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{teacher.fullname || teacher.full_name}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{teacher.email}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {teacher.cni && (
                                    <a href={teacher.cni} target="_blank" rel="noopener noreferrer">View</a>
                                )}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {teacher.require_diploma && (
                                    <a href={teacher.require_diploma} target="_blank" rel="noopener noreferrer">View</a>
                                )}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {teacher.birth_certificate && (
                                    <a href={teacher.birth_certificate} target="_blank" rel="noopener noreferrer">View</a>
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

export default ActivatedTeacher;