import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { BiLogInCircle } from "react-icons/bi"

function Loginpage() {
  const {loginUser} = useContext(AuthContext)
  const handleSubmit = e => {
    e.preventDefault();
    const { email, password } = e.target.elements; // Access elements directly
    const emailValue = email.value;
    const passwordValue = password.value;

    console.log('Email:', emailValue);
    console.log('Password:', passwordValue);
    console.log('loginUser function:', loginUser);

    if (emailValue.length > 0) {
        console.log('Calling loginUser');
        loginUser(emailValue, passwordValue);
    } else {
        console.log('Email length is 0, not calling loginUser');
    }
};

  return (
    <div>
      <>
      <section className="vh-100" style={{ backgroundColor: "#C3B091" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-6">
              <div className="card" style={{ borderRadius: "1rem"}}>
                <div className="row g-0">
                  <div className="col-md-8 col-lg-12 mx-auto d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={handleSubmit} role="form">
                    <div className="d-flex align-items-center mb-3 pb-1">
                      <i
                        className="fas fa-cubes fa-2x me-3"
                        style={{ color: "black" }}
                      />
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <i
                          className="fas fa-cubes fa-2x me-3"
                          style={{ color: "black" }}
                        />
                        <h1 className="main__title">Login <BiLogInCircle /></h1>

                      </div>
                    </div>
                    <div className="form-outline mb-4">
                      <input
                        type="email"
                        placeholder="email"
                        className="form-control form-control-lg"
                        name='email'
                      /> 
                    </div>
                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        placeholder="password"
                        className="form-control form-control-lg"
                        name='password'
                      />
                    </div>
                    <div className="pt-1 mb-4">
                      <button
                        className="btn btn-dark btn-lg btn-block"
                        type="submit"
                      >
                        Login
                      </button>
                    </div>
                    <a className="small text-muted" href="#!">
                      Forgot password?
                    </a>
                    <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                      Don't have an account?{" "}
                      <Link to="/register" >
                        Register Now 
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

export default Loginpage