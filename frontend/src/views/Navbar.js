import { useContext, useState } from 'react';
import {jwtDecode} from "jwt-decode";
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import iaiImage from './images/iai.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faChalkboardTeacher, faBook, faQuestionCircle, faBlackboard, faPen,faDisplay } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
    const { user, logoutUser, authTokens } = useContext(AuthContext);
  
  const [hovered, setHovered] = useState(null); // State to track hovered link

  let userGroups = [];
  if (authTokens) {
      const decoded = jwtDecode(authTokens.access);
      userGroups = decoded.groups ; // Assuming groups are part of the JWT payload
  }

  // Function to handle mouse enter and leave
  const handleMouseEnter = (index) => setHovered(index);
  const handleMouseLeave = () => setHovered(null);

  // Check user roles
  const isCandidate = userGroups.includes("candidate");
  const isTeacher = userGroups.includes("teacher");
  const isAdmin = userGroups.includes("admin");
  return (
      <div>
          <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#C3B091", position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '10px 20px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
              <div className="container-fluid">
                  <a className="navbar-brand" href="#">
                      <img style={{ width: "90px", padding: "6px", borderRadius: "50%", border: "2px solid #fff" }} src={iaiImage} alt="Description" />
                  </a>
                  
                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                  </button>
                  
                  <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                      <ul className="navbar-nav">
                          {!authTokens && 
                              <>
                                  <li className="nav-item">
                                      <Link 
                                          className="nav-link text-white" 
                                          to="/" 
                                          style={{ padding: "0 10px", backgroundColor: hovered === 0 ? 'rgba(255, 255, 255, 0.2)' : 'transparent', transition: 'background-color 0.3s', width: '100px', height: "50px" }}
                                          onMouseEnter={() => handleMouseEnter(0)}
                                          onMouseLeave={handleMouseLeave}
                                      >
                                          Home
                                      </Link>
                                  </li>
                                  <li className="nav-item">
                                      <Link 
                                          className="nav-link text-white" 
                                          to="/login" 
                                          style={{ padding: "0 10px", backgroundColor: hovered === 1 ? 'rgba(255, 255, 255, 0.2)' : 'transparent', transition: 'background-color 0.3s', width: '100px', height: "50px" }}
                                          onMouseEnter={() => handleMouseEnter(1)}
                                          onMouseLeave={handleMouseLeave}
                                      >
                                          Login
                                      </Link>
                                  </li>

                                  <li className="nav-item">
                                      <Link 
                                          className="nav-link text-white" 
                                          to="/result" 
                                          style={{ padding: "0 10px", backgroundColor: hovered === 4 ? 'rgba(255, 255, 255, 0.2)' : 'transparent', transition: 'background-color 0.3s', width: '100px', height: "50px" }}
                                          onMouseEnter={() => handleMouseEnter(4)}
                                          onMouseLeave={handleMouseLeave}
                                      >
                                          Result
                                      </Link>
                                  </li>

                                  <li className="nav-item">
                                      <Link 
                                          className="nav-link text-white" 
                                          to="/register" 
                                          style={{ padding: "0 10px", backgroundColor: hovered === 2 ? 'rgba(255, 255, 255, 0.2)' : 'transparent', transition: 'background-color 0.3s', width: '100px', height: "50px" }}
                                          onMouseEnter={() => handleMouseEnter(2)}
                                          onMouseLeave={handleMouseLeave}
                                      >
                                          Register
                                      </Link>
                                  </li>
                              </>
                          }
                          {authTokens && 
                              <>
                              {!isCandidate &&(<>
                              
                                <li className="nav-item">
                                      <Link 
                                          className="nav-link text-white" 
                                          to="/dashboard" 
                                          style={{ padding: "0 10px", backgroundColor: hovered === 3 ? 'rgba(255, 255, 255, 0.2)' : 'transparent', transition: 'background-color 0.3s', width: '100px', height: "50px" }}
                                          onMouseEnter={() => handleMouseEnter(3)}
                                          onMouseLeave={handleMouseLeave}
                                      >
                                          Dashboard
                                      </Link>
                                  </li>
                              </>)}
                                 
                                  <li className="nav-item">
                                      <a 
                                          className="nav-link text-white" 
                                          onClick={logoutUser} 
                                          style={{ cursor: "pointer", padding: "0 10px", backgroundColor: hovered === 4 ? 'rgba(255, 255, 255, 0.2)' : 'transparent', transition: 'background-color 0.3s', width: '100px', height: "50px" }}
                                          onMouseEnter={() => handleMouseEnter(4)}
                                          onMouseLeave={handleMouseLeave}
                                      >
                                          Logout
                                      </a>
                                  </li>
                              </>
                          }   
                      </ul>
                  </div>
              </div>
          </nav>
          {authTokens && 
              <div style={{ padding: "10px", backgroundColor: "#C3B091", marginTop: "10px", position: 'fixed', top: 105, zIndex: 1000, padding: '10px 20px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', width: '80%', maxWidth: '200px', height: "600px" }}>
                  <ul className="navbar-nav">
                      {!isCandidate && !isTeacher && (
                          <>
                              <li className="nav-item">
                                  <Link 
                                      className="nav-link text-white" 
                                      to="/ManageTeacher" 
                                      style={{ cursor: "pointer", padding: "20px 10px", backgroundColor: hovered === 5 ? 'rgba(255, 255, 255, 0.2)' : 'transparent', transition: 'background-color 0.3s' }}
                                      onMouseEnter={() => handleMouseEnter(5)}
                                      onMouseLeave={handleMouseLeave}
                                  >
                                      <FontAwesomeIcon icon={faChalkboardTeacher} className="f-left" style={{ fontSize: '15px', marginRight: "10px" }} />
                                      Administrator Section
                                  </Link>
                              </li>
                              <li className="nav-item">
                                  <Link 
                                      className="nav-link text-white" 
                                      to="/ManageCandidate" 
                                      style={{ padding: "20px 10px", backgroundColor: hovered === 6 ? 'rgba(255, 255, 255, 0.2)' : 'transparent', transition: 'background-color 0.3s' }}
                                      onMouseEnter={() => handleMouseEnter(6)}
                                      onMouseLeave={handleMouseLeave}
                                  >
                                      <FontAwesomeIcon icon={faUserGraduate} className="f-left" style={{ fontSize: '15px', marginRight: "10px" }} />
                                      Candidate Section
                                  </Link>
                              </li>
                         
                      
                      
                              <li className="nav-item">
                                  <Link 
                                      className="nav-link text-white" 
                                      to="/ManageExamSession" 
                                      style={{ padding: "20px 10px", backgroundColor: hovered === 7 ? 'rgba(255, 255, 255, 0.2)' : 'transparent', transition: 'background-color 0.3s' }}
                                      onMouseEnter={() => handleMouseEnter(7)}
                                      onMouseLeave={handleMouseLeave}
                                  >
                                      <FontAwesomeIcon icon={faBlackboard} className="f-left" style={{ fontSize: '15px', marginRight: "10px" }} />
                                      Manage Exam Session
                                  </Link>
                              </li>
                              </>
                              )}
                              {!isCandidate && (
                                      <>
                              <li className="nav-item">
                                  <Link 
                                      className="nav-link text-white" 
                                      to="/managesubject" 
                                      style={{ padding: "20px 10px", backgroundColor: hovered === 8 ? 'rgba(255, 255, 255, 0.2)' : 'transparent', transition: 'background-color 0.3s' }}
                                      onMouseEnter={() => handleMouseEnter(8)}
                                      onMouseLeave={handleMouseLeave}
                                  >
                                      <FontAwesomeIcon icon={faBook} className="f-left" style={{ fontSize: '15px', marginRight: "10px" }} />
                                      Manage Subjects
                                  </Link>
                              </li>
                              <li className="nav-item">
                                  <Link 
                                      className="nav-link text-white" 
                                      to="/managequestion" 
                                      style={{ padding: "20px 10px", backgroundColor: hovered === 9 ? 'rgba(255, 255, 255, 0.2)' : 'transparent', transition: 'background-color 0.3s' }}
                                      onMouseEnter={() => handleMouseEnter(9)}
                                      onMouseLeave={handleMouseLeave}
                                  >
                                      <FontAwesomeIcon icon={faQuestionCircle} className="f-left" style={{ fontSize: '15px', marginRight: "10px" }} />
                                      Manage Questions
                                  </Link>
                              </li>
                          </>
                      )}
                      {!isTeacher && !isCandidate &&  (
                          <li className="nav-item">
                              <Link 
                                  className="nav-link text-white" 
                                  to="/exam" 
                                  style={{ padding: "20px 10px", backgroundColor: hovered === 10 ? 'rgba(255, 255, 255, 0.2)' : 'transparent', transition: 'background-color 0.3s' }}
                                  onMouseEnter={() => handleMouseEnter(10)}
                                  onMouseLeave={handleMouseLeave}
                              >
                                  <FontAwesomeIcon icon={faPen} className="f-left" style={{ fontSize: '15px', marginRight: "10px" }} />
                                  Exams
                              </Link>
                          </li>
                      )}
                      {!isCandidate && (
                      <Link 
                                  className="nav-link text-white" 
                                  to="/result" 
                                  style={{ padding: "20px 10px", backgroundColor: hovered === 11 ? 'rgba(255, 255, 255, 0.2)' : 'transparent', transition: 'background-color 0.3s' }}
                                  onMouseEnter={() => handleMouseEnter(11)}
                                  onMouseLeave={handleMouseLeave}
                              >
                                  <FontAwesomeIcon icon={faDisplay} className="f-left" style={{ fontSize: '15px', marginRight: "10px" }} />
                                  Result
                              </Link>
                      )}
                  </ul>
              </div>
          }
      </div>
  );
}

export default Navbar;


