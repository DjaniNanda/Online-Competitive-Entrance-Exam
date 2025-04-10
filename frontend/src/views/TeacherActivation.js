import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeacherActivation = () => {
    const [teachers, setTeachers] = useState([]);
    const [hoveredButtonId, setHoveredButtonId] = useState(null); // State for tracking hovered button

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/teachers/');
                setTeachers(response.data);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };

        fetchTeachers();
    }, []);

    const activateTeacher = async (id) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/teachers/activate/${id}/`);
            setTeachers(teachers.filter(teacher => teacher.id !== id)); // Remove activated teacher from list
        } catch (error) {
            console.error('Error activating teacher:', error);
        }
    };

    const deleteTeacher = async (id) => {
        
            try {
                await axios.delete(`http://127.0.0.1:8000/api/teachers/activate/${id}/`);
                setTeachers(teachers.filter(teacher => teacher.id !== id)); // Remove deleted teacher from list
            } catch (error) {
                console.error('Error deleting teacher:', error);
            }
        
    };

    return (
        <>
        <div style={{ marginTop: '116px', marginLeft: "200px", backgroundColor: "#C3B091", padding: '20px' , paddingBottom: '380px'}}>
            <h1>Pending Administrator</h1>
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
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                <button
                                    onClick={() => activateTeacher(teacher.id)}
                                    onMouseEnter={() => setHoveredButtonId(teacher.id)}
                                    onMouseLeave={() => setHoveredButtonId(null)}
                                    style={{
                                        backgroundColor: hoveredButtonId === teacher.id ? '#555' : '#333',
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
                                    onClick={() => deleteTeacher(teacher.id)}
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

export default TeacherActivation;