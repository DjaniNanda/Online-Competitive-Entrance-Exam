import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute"; // Custom route for protected routes
import { AuthProvider } from './context/AuthContext'; // Context provider for authentication
import { ExamSessionProvider } from './context/SessionContext';
import { ApiProvider } from './context/ApiContext';

import Homepage from './views/Homepage.js'; // Importing views for routing

import Registerpage from './views/Registerpage';
import Loginpage from './views/Loginpage';
import Dashboard from './views/Dashboard';
import Navbar from './views/Navbar';
import ViewExamSession from './views/ViewExamSession';
import CreateExamSession from './views/CreateExamSession';
import ManageExamSession from './views/ManageExamSession';
import Exam from './views/Exam';
import ManageSubject from './views/ManageSubject';
import ViewSubject from './views/ViewSubject';
import CreateSubject from './views/CreateSubject';
import ManageQuestion from './views/ManageQuestion';
import ViewQuestion from './views/ViewQuestion';
import CreateQuestion from './views/CreateQuestion';
import ManageCandidate from './views/ManageCandidate'
import ActivatedCandidate from './views/ActivatedCandidate'
import CandidateActivation from './views/CandidateActivation';
import ManageTeacher from './views/ManageTeacher';
import TeacherActivation from './views/TeacherActivation';
import ActivatedTeacher from './views/ActivatedTeacher';
import Test from './views/Test'
import ResultButton from './views/ResultButton'
import Result from './views/Result'

function App() {
  return (
    <Router>
      <ApiProvider>
      <AuthProvider>
      <ExamSessionProvider>
        <Navbar /> {/* Navigation bar shared across all routes */}
        <Switch>
          {/* Private routes that require authentication */}
          <PrivateRoute component={Dashboard} path="/dashboard" exact />
          <PrivateRoute component={ManageExamSession} path="/manageExamSession" exact />
          <PrivateRoute component={CreateExamSession} path="/createExamSession" exact />
          <PrivateRoute component={ViewExamSession} path="/viewExamSession" exact />
          <PrivateRoute component={Exam} path="/exam" exact />
          <PrivateRoute component={ManageSubject} path="/manageSubject" exact />
          <PrivateRoute component={CreateSubject} path="/createSubject" exact />
          <PrivateRoute component={ViewSubject} path="/viewSubject" exact />
          <PrivateRoute component={ManageQuestion} path="/manageQuestion" exact />
          <PrivateRoute component={CreateQuestion} path="/createQuestion" exact />
          <PrivateRoute component={ViewQuestion} path="/viewQuestion" exact />
          <PrivateRoute component={ManageCandidate} path="/manageCandidate" exact />
          <PrivateRoute component={ActivatedCandidate} path="/activatedCandidate" exact />
          <PrivateRoute component={CandidateActivation} path="/candidateActivation" exact />
          <PrivateRoute component={ManageTeacher} path="/manageTeacher" exact />
          <PrivateRoute component={TeacherActivation} path="/teacherActivation" exact />
          <PrivateRoute component={ActivatedTeacher} path="/activatedTeacher" exact />
          <PrivateRoute component={Test} path="/test" exact />
          <PrivateRoute component={ResultButton} path="/ResultButton" exact />
          <Route component={Result} path="/Result" exact />
          {/* Public routes */}
          <Route component={Loginpage} path="/login" />
          <Route component={Registerpage} path="/register" exact />
          <Route component={Homepage} path="/" exact />
        </Switch>
        </ExamSessionProvider>
      </AuthProvider>
      </ApiProvider>
    </Router>
  );
}

export default App;