import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

function CountdownNavLink() {
  const [currentExamSession, setCurrentExamSession] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [isLinkActive, setIsLinkActive] = useState(false);

  useEffect(() => {
    const fetchLatestExamSession = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/latest-exam-session/');
        setCurrentExamSession(response.data);
      } catch (error) {
        console.error('Error fetching latest exam session:', error);
      }
    };

    fetchLatestExamSession();
  }, []);

  useEffect(() => {
    if (!currentExamSession || !currentExamSession.end_time) return;

    const endDate = new Date(currentExamSession.end_time);

    let intervalId;
    const checkCountdown = () => {
      const now = new Date();
      const timeDiff = endDate - now;

      if (timeDiff <= 0) {
        setIsLinkActive(true);
        setCountdown('RESULTS ARE NOW AVAILABLE!');
        clearInterval(intervalId);
      } else {
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    checkCountdown(); // Initial check
    intervalId = setInterval(checkCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [currentExamSession]);

  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '105px',
        marginLeft: '200px',
        backgroundColor: '#C3B091',
        padding: '200px',
        paddingBottom: '320px',
      }}
    >
      {isLinkActive ? (
        <NavLink
          to="/result" // Change to your results URL
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: 'lightgreen',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          View Results
        </NavLink>
      ) : (
        <div>
          <h3>Results will be available in: {countdown}</h3>
        </div>
      )}
    </div>
  );
}

export default CountdownNavLink;