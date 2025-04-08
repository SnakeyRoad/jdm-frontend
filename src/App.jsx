import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginForm from './components/Login/LoginForm';
import KidWelcome from './components/Welcome/KidWelcome';
import TaskWrapper from './components/Tasks/TaskWrapper';
import CompletionScreen from './components/Completion/CompletionScreen';
import DoctorDashboard from './components/DoctorView/DoctorDashboard';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { useScoreContext } from './contexts/ScoreContext';
import { playClickSound, playCelebrationSound } from './utils/soundEffects';

// Define the CMAS tasks
const CMAS_TASKS = [
  {
    id: 0,
    title: "Task 1: Head Lift",
    instruction: "How many seconds could you hold your head up?",
    type: "choice",
    maxPoints: 5,
    options: [
      { label: "Unable to lift head", value: 0 },
      { label: "1-9 seconds", value: 1 },
      { label: "10-29 seconds", value: 2 },
      { label: "30-59 seconds", value: 3 },
      { label: "1-2 minutes", value: 4 },
      { label: "More than 2 minutes", value: 5 }
    ]
  },
  {
    id: 1,
    title: "Task 2: Leg Raise / Touch Object",
    instruction: "Can you lift your leg and touch the object (examiner's hand)?",
    type: "choice",
    maxPoints: 2,
    options: [
      { label: "Unable to lift leg", value: 0 },
      { label: "Can lift leg but can't touch object", value: 1 },
      { label: "Can touch the object", value: 2 }
    ]
  },
  {
    id: 2,
    title: "Task 3: Straight Leg Lift / Duration",
    instruction: "How long could you hold your leg straight?",
    type: "choice",
    maxPoints: 5,
    options: [
      { label: "Unable to lift leg", value: 0 },
      { label: "1-9 seconds", value: 1 },
      { label: "10-29 seconds", value: 2 },
      { label: "30-59 seconds", value: 3 },
      { label: "1-2 minutes", value: 4 },
      { label: "More than 2 minutes", value: 5 }
    ]
  },
  {
    id: 3,
    title: "Task 4: Supine to Prone",
    instruction: "How difficult was it to turn from your back to your stomach?",
    type: "choice",
    maxPoints: 3,
    options: [
      { label: "Could not turn fully", value: 0 },
      { label: "Turned but couldn't free right arm", value: 1 },
      { label: "Freed arm with difficulty", value: 2 },
      { label: "No difficulty", value: 3 }
    ]
  },
  {
    id: 4,
    title: "Task 5: Sit-ups",
    instruction: "Which sit-up positions could you do?",
    type: "multiselect",
    maxPoints: 6,
    options: [
      { label: "Hands on thighs with counterbalance", value: 1, id: "sit1" },
      { label: "Hands on thighs without counterbalance", value: 1, id: "sit2" },
      { label: "Arms crossed with counterbalance", value: 1, id: "sit3" },
      { label: "Arms crossed without counterbalance", value: 1, id: "sit4" },
      { label: "Hands behind head with counterbalance", value: 1, id: "sit5" },
      { label: "Hands behind head without counterbalance", value: 1, id: "sit6" }
    ]
  },
  {
    id: 5,
    title: "Task 6: Supine to Sit",
    instruction: "How difficult was it to move from lying down to sitting up?",
    type: "choice",
    maxPoints: 3,
    options: [
      { label: "Unable to sit up", value: 0 },
      { label: "Much difficulty", value: 1 },
      { label: "Some difficulty", value: 2 },
      { label: "No difficulty", value: 3 }
    ]
  },
  {
    id: 6,
    title: "Task 7: Arm Raise / Straighten",
    instruction: "How high could you raise your arms?",
    type: "choice",
    maxPoints: 3,
    options: [
      { label: "Cannot raise to shoulder", value: 0 },
      { label: "To shoulder, not above head", value: 1 },
      { label: "Above head, not fully extended", value: 2 },
      { label: "Fully extended above head", value: 3 }
    ]
  },
  {
    id: 7,
    title: "Task 8: Arm Raise / Duration",
    instruction: "How long could you hold your arms up?",
    type: "choice",
    maxPoints: 4,
    options: [
      { label: "Unable to hold", value: 0 },
      { label: "1-9 seconds", value: 1 },
      { label: "10-29 seconds", value: 2 },
      { label: "30-59 seconds", value: 3 },
      { label: "60+ seconds", value: 4 }
    ]
  },
  {
    id: 8,
    title: "Task 9: Floor Sit",
    instruction: "How difficult was it to sit on the floor from standing?",
    type: "choice",
    maxPoints: 3,
    options: [
      { label: "Unable to do it", value: 0 },
      { label: "Much difficulty (needed chair)", value: 1 },
      { label: "Some difficulty", value: 2 },
      { label: "No difficulty", value: 3 }
    ]
  },
  {
    id: 9,
    title: "Task 10: All Fours Maneuver",
    instruction: "What could you do on your hands and knees?",
    type: "choice",
    maxPoints: 4,
    options: [
      { label: "Could not get on hands and knees", value: 0 },
      { label: "Barely maintained position", value: 1 },
      { label: "Maintained position but couldn't crawl", value: 2 },
      { label: "Could crawl", value: 3 },
      { label: "Could crawl and extend a leg", value: 4 }
    ]
  },
  {
    id: 10,
    title: "Task 11: Floor Rise",
    instruction: "How did you stand up from kneeling?",
    type: "choice",
    maxPoints: 4,
    options: [
      { label: "Could not stand up", value: 0 },
      { label: "Used a chair to stand", value: 1 },
      { label: "Used hands on body", value: 2 },
      { label: "No hands, some difficulty", value: 3 },
      { label: "No difficulty", value: 4 }
    ]
  },
  {
    id: 11,
    title: "Task 12: Chair Rise",
    instruction: "How did you stand up from the chair?",
    type: "choice",
    maxPoints: 4,
    options: [
      { label: "Could not stand up", value: 0 },
      { label: "Needed hands on chair", value: 1 },
      { label: "Used hands on knees/thighs", value: 2 },
      { label: "No hands, some difficulty", value: 3 },
      { label: "No difficulty", value: 4 }
    ]
  },
  {
    id: 12,
    title: "Task 13: Stool Step",
    instruction: "How did you step up onto the stool?",
    type: "choice",
    maxPoints: 3,
    options: [
      { label: "Could not step up", value: 0 },
      { label: "Needed table or hand support", value: 1 },
      { label: "Hand on knee/thigh", value: 2 },
      { label: "No support needed", value: 3 }
    ]
  },
  {
    id: 13,
    title: "Task 14: Pick-Up",
    instruction: "How difficult was it to pick up the pencil from the floor?",
    type: "choice",
    maxPoints: 3,
    options: [
      { label: "Could not pick it up", value: 0 },
      { label: "Much difficulty (needed support)", value: 1 },
      { label: "Some difficulty (brief support)", value: 2 },
      { label: "No difficulty", value: 3 }
    ]
  }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const { clearScores, setScoreForTask } = useScoreContext();

  const handleLogin = (username, role) => {
    setIsAuthenticated(true);
    setUsername(username);
    setUserRole(role);
    if (role === 'kid') {
      clearScores();
    }
    playClickSound(); // Play sound on login
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setUserRole('');
    clearScores();
    playClickSound(); // Play sound on logout
  };

  const handleTaskComplete = (taskId, score) => {
    // Save the score
    setScoreForTask(taskId, score, CMAS_TASKS[taskId].maxPoints);
    playClickSound(); // Play click sound
    
    // If this was the last task, play a celebration sound
    if (taskId === CMAS_TASKS.length - 1) {
      playCelebrationSound();
    }
  };

  return (
    <Router>
      <div className="app-container min-h-screen flex flex-col">
        <Header username={username} onLogout={handleLogout} />
        <main className="flex-grow p-4">
          <Routes>
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  userRole === 'doctor' ? (
                    <DoctorDashboard username={username} allTasks={CMAS_TASKS} />
                  ) : (
                    <KidWelcome username={username} />
                  )
                ) : (
                  <LoginForm onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/task/:taskId" 
              element={
                isAuthenticated && userRole === 'kid' ? (
                  <TaskWrapper 
                    tasks={CMAS_TASKS} 
                    onComplete={handleTaskComplete} 
                  />
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
            <Route 
              path="/complete" 
              element={
                isAuthenticated && userRole === 'kid' ? (
                  <CompletionScreen username={username} allTasks={CMAS_TASKS} />
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
            <Route 
              path="/doctor-dashboard" 
              element={
                isAuthenticated && userRole === 'doctor' ? (
                  <DoctorDashboard username={username} allTasks={CMAS_TASKS} />
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
