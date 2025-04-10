import {useState, useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { BiUser } from 'react-icons/bi'
import { API_URL } from '../config/index';

function Registerpage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [fullname, setFullname] = useState("");
  const [gender, setGender] = useState(null);
  const [dob, setDob] = useState(null);
  const [image, setImage] = useState(null);
  const [cni, setCni] = useState(null);
  const [require_diploma, setRequirediploma] = useState(null);
  const [birth_certificate, setBirthcertificate] = useState(null);
  const [group, setGroup] = useState("");
  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
      e.preventDefault();

      const profileData = new FormData();
      profileData.append("email", email);
      profileData.append("username", username);
      profileData.append("password", password);
      profileData.append("password2", password2);
      profileData.append("fullname", fullname);
      profileData.append("gender", gender);
      profileData.append("dob", dob);
      profileData.append("image", image);
      profileData.append("cni", cni);
      profileData.append("require_diploma", require_diploma);
      profileData.append("birth_certificate", birth_certificate);
      profileData.append('groups', group);

    await registerUser(
        profileData
    );
  };



  return (
    <div style={{ marginTop: '110px',}}>
      <>
        <section className="vh-200" style={{ backgroundColor: "#C3B091" }}>
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col col-xl-7">
                <div className="card" style={{ borderRadius: "1rem" }}>
                  <div className="row g-0">
                    
                    <div className="col-md-8 col-lg-12 mx-auto d-flex align-items-center">
                      <div className="card-body p-4 p-lg-5 text-black">
                        <form encType="multipart/form-data" onSubmit={handleSubmit}  >
                          <div className="d-flex align-items-center mb-3 pb-1">
                            <i
                              className="fas fa-cubes fa-2x me-3"
                              style={{ color: "#ff6219" }}
                            />
                            <h1 className="main__title">Register <BiUser /> </h1>

                          </div>
                          
                          
                        <div className="form-outline mb-4">
                          <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="Email"
                            onChange={e => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Username"
                            onChange={e => setUsername(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Password"
                            onChange={e => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Confirm Password"
                            onChange={e => setPassword2(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Fullname"
                            onChange={e => setFullname(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-4">
            <label htmlFor="gender"><h4>Gender</h4></label>
            <div>
              <label>
                <input
                  id="gender-male"
                  type="radio"
                  value="1"
                  checked={gender === '1'}
                  onChange={e => setGender(e.target.value)}
                /> Male
              </label>
              <label>
                <input
                  id="gender-female"
                  type="radio"
                  value="0"
                  checked={gender === '0'}
                  onChange={e => setGender(e.target.value)}
                /> Female
              </label>
            </div>
          </div>
          <div className="form-outline mb-4">
            <label htmlFor="dob"><h4>Date Of Birth</h4></label>
            <input
              id="dob"
              type="date"
              className="form-control form-control-lg"
              onChange={e => setDob(e.target.value)}
              required
            />
          </div>
          <div className="form-outline mb-4">
            <label htmlFor="image"><h4>Image</h4></label>
            <input
              id="image"
              type="file"
              className="form-control form-control-lg"
              onChange={e => setImage(e.target.files[0])}
            />
          </div>
          <div className="form-outline mb-4">
            <label htmlFor="cni"><h4>National Certificate Of Identity</h4></label>
            <input
              id="cni"
              type="file"
              className="form-control form-control-lg"
              onChange={e => setCni(e.target.files[0])}
            />
          </div>
          <div className="form-outline mb-4">
            <label htmlFor="require_diploma"><h4>Required Diploma</h4></label>
            <input
              id="require_diploma"
              type="file"
              className="form-control form-control-lg"
              onChange={e => setRequirediploma(e.target.files[0])}
            />
          </div>
          <div className="form-outline mb-4">
            <label htmlFor="birth_certificate"><h4>Birth Certificate</h4></label>
            <input
              id="birth_certificate"
              type="file"
              className="form-control form-control-lg"
              onChange={e => setBirthcertificate(e.target.files[0])}
            />
          </div>
          <div className="form-outline mb-4">
            <label htmlFor="group"><h4>Group:</h4></label><br/>
            <select id="group" value={group} onChange={(e) => setGroup(e.target.value)} required>
              <option value="">Select Group</option>
              <option value="1">Candidate</option>
              <option value="2">Administrator</option>
            </select>
          </div>

                          <div className="pt-1 mb-4">
                            <button
                              className="btn btn-dark btn-lg btn-block"
                              type="submit"
                            >
                              Register
                            </button>
                          </div>

                          <form
                                action={`${API_URL}/create-checkout-session`}
                                method='POST'
                              >
                                <button
                                    className='btn btn-lg btn-block'
                                    type='submit'
                                    style={{
                                        backgroundColor: '#f95f40',
                                        color: 'white',
                                        border: 'none',
                                        transition: 'background-color 0.3s ease', // Smooth transition
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#ff8a6d'; // Lighter shade on hover
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#f95f40'; // Original color
                                    }}
                                >
                                    Make Payment
                                </button>
                              </form>

                          <a className="small text-muted" href="#!">
                            Forgot password?
                          </a>
                          <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                            Already have an account?{" "}
                            <Link to="/login" >
                              Login Now
                            </Link>
                          </p>
                          <a href="#!" className="small text-muted">
                            Terms of use.
                          </a>
                          <a href="#!" className="small text-muted">
                            Privacy policy
                          </a>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>

    </div>
  )
}

export default Registerpage