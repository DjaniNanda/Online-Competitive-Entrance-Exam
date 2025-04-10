import {createContext, useState, useEffect} from "react";
import {jwtDecode} from "jwt-decode";
import {useHistory} from "react-router-dom";
const swal = require('sweetalert2')

const AuthContext = createContext();

export default AuthContext

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("accessToken") && localStorage.getItem("refreshToken") 
    ? { access: localStorage.getItem("accessToken"), refresh: localStorage.getItem("refreshToken") } 
    : null
);
    

const [user, setUser] = useState(() => 
    authTokens ? jwtDecode(authTokens.access) : null
);


    const [loading, setLoading] = useState(true);

    const history = useHistory();

    const loginUser = async (email, password) => {
        const response = await fetch("http://127.0.0.1:8000/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
    
        const data = await response.json();
        console.log(data);
    
        if (response.status === 200) {
            console.log("Logged In");
            setAuthTokens(data);
            
            // Decode the JWT token
            const decodedUser = jwtDecode(data.access);
            setUser(decodedUser);
            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);
    
            // Check if the user is a candidate
            if (decodedUser.groups && decodedUser.groups.includes("candidate")) {
                history.push("/exam"); // Redirect to the exam page
            } else {
                history.push("/dashboard"); // Redirect to the dashboard
            }
    
            swal.fire({
                title: "Login Successful",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
    
        } else {    
            console.log(response.status);
            console.log("There was a server issue");
            swal.fire({
                title: "Username or password does not exist",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const registerUser = async ( profileData) => {
        const response = await fetch("http://127.0.0.1:8000/register/", {
            method: "POST",
            
            body: 
                profileData
            
            
        });
    
        if (response.status === 201) {
            history.push("/login");
            swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } else {
            console.log(response.status);
            console.log("There was a server issue");
            swal.fire({
                title: "An Error Occurred " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    }
    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        history.push("/login")
        swal.fire({
            title: "YOu have been logged out...",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        })
    }

    const contextData = {
        user, 
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
    }

    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access))
        }
        setLoading(false)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )

}