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
import ChatBubble from './components/common/ChatBubble'; // adjust path if needed


// Define the CMAS tasks
const CMAS_TASKS = [
  {
    id: 0,
    title: "Task 1: Head Lift",
    instruction: "How long can you hold your head up?",
    type: "choice",
    maxPoints: 5,
    options: [
      { label: "Can't lift head", value: 0 },
      { label: "1-9 seconds", value: 1 },
      { label: "10-29 seconds", value: 2 },
      { label: "30-59 seconds", value: 3 },
      { label: "1-2 minutes", value: 4 },
      { label: "More than 2 minutes", value: 5 }
    ]
  },
  {
    id: 1,
    title: "Task 2: Leg Raise & touch",
    instruction: "Can you lift your leg and touch something in front of you?",
    type: "choice",
    maxPoints: 2,
    options: [
      { label: "Can't lift leg", value: 0 },
      { label: "Can lift leg but not touch", value: 1 },
      { label: "Can touch", value: 2 }
    ]
  },
  {
    id: 2,
    title: "Task 3: Hold leg up",
    instruction: "How long can you hold up your leg straight?",
    type: "choice",
    maxPoints: 5,
    options: [
      { label: "Can't to lift leg", value: 0 },
      { label: "1-9 seconds", value: 1 },
      { label: "10-29 seconds", value: 2 },
      { label: "30-59 seconds", value: 3 },
      { label: "1-2 minutes", value: 4 },
      { label: "More than 2 minutes", value: 5 }
    ]
  },
  {
    id: 3,
    title: "Task 4: Roll over",
    instruction: "Can you roll over from your back to stomach?",
    type: "choice",
    maxPoints: 3,
    options: [
      { label: "Can't roll fully", value: 0 },
      { label: "Rolled but arm stuck", value: 1 },
      { label: "Rolled with difficulty", value: 2 },
      { label: "No problem at all", value: 3 }
    ]
  },
  {
    id: 4,
    title: "Task 5: Sit-ups",
    instruction: "Which sit-up positions can you do?",
    type: "multiselect",
    maxPoints: 6,
    options: [
      { label: "Hands on thighs with help", value: 1, id: "sit1" },
      { label: "Hands on thighs without help", value: 1, id: "sit2" },
      { label: "Arms crossed with help", value: 1, id: "sit3" },
      { label: "Arms crossed without help", value: 1, id: "sit4" },
      { label: "Hands behind head with help", value: 1, id: "sit5" },
      { label: "Hands behind head without help", value: 1, id: "sit6" }
    ]
  },
  {
    id: 5,
    title: "Task 6: Supine to Sit",
    instruction: "How hard was it to sit up from lying down?",
    type: "choice",
    maxPoints: 3,
    options: [
      { label: "Can't sit up", value: 0 },
      { label: "Was very hard", value: 1 },
      { label: "Was a bit hard", value: 2 },
      { label: "Easy", value: 3 }
    ]
  },
  {
    id: 6,
    title: "Task 7: Arm Raise / Straighten",
    instruction: "How high can you lift your arms?",
    type: "choice",
    maxPoints: 3,
    options: [
      { label: "Can't lift above shoulders", value: 0 },
      { label: "To my shoulder, not above my head", value: 1 },
      { label: "Above head, but not all the way", value: 2 },
      { label: "All the way up over my head", value: 3 }
    ]
  },
  {
    id: 7,
    title: "Task 8: Arm Raise / Duration",
    instruction: "How long can you hold your arms up?",
    type: "choice",
    maxPoints: 4,
    options: [
      { label: "I can't hold them up", value: 0 },
      { label: "1-9 seconds", value: 1 },
      { label: "10-29 seconds", value: 2 },
      { label: "30-59 seconds", value: 3 },
      { label: "1 minute or more", value: 4 }
    ]
  },
  {
    id: 8,
    title: "Task 9: Floor Sit",
    instruction: "How hard was it to sit down on the floor from standing?",
    type: "choice",
    maxPoints: 3,
    options: [
      { label: "Can't do it", value: 0 },
      { label: "Was hard and needed help", value: 1 },
      { label: "A bit hard", value: 2 },
      { label: "Easy", value: 3 }
    ]
  },
  {
    id: 9,
    title: "Task 10: All Fours Maneuver",
    instruction: "What could you do on your hands and knees?",
    type: "choice",
    maxPoints: 4,
    options: [
      { label: "Can't not get on hands and knees", value: 0 },
      { label: "Can't stay for long on hand and knees", value: 1 },
      { label: "Can stay in position but can't crawl", value: 2 },
      { label: "Can crawl", value: 3 },
      { label: "Can crawl and stretch a leg", value: 4 }
    ]
  },
  {
    id: 10,
    title: "Task 11: Floor Rise",
    instruction: "How did you get up from kneeling?",
    type: "choice",
    maxPoints: 4,
    options: [
      { label: "Can not stand up", value: 0 },
      { label: "Needed help of a chair to stand", value: 1 },
      { label: "Used hands on body", value: 2 },
      { label: "No hands, bit hard", value: 3 },
      { label: "Easily got up with no help", value: 4 }
    ]
  },
  {
    id: 11,
    title: "Task 12: Chair Rise",
    instruction: "How did you stand up from a chair?",
    type: "choice",
    maxPoints: 4,
    options: [
      { label: "Can not stand up", value: 0 },
      { label: "Needed hands on chair", value: 1 },
      { label: "Used hands on knees or thighs", value: 2 },
      { label: "No hands, bit hard", value: 3 },
      { label: "Easily stood up", value: 4 }
    ]
  },
  {
    id: 12,
    title: "Task 13: Stool Step",
    instruction: "How did you step onto a stool?",
    type: "choice",
    maxPoints: 3,
    options: [
      { label: "Can't not step up", value: 0 },
      { label: "Needed table or hand support", value: 1 },
      { label: "Pushed on leg to help", value: 2 },
      { label: "No help needed", value: 3 }
    ]
  },
  {
    id: 13,
    title: "Task 14: Pick-Up",
    instruction: "Was it hard to pick up pencil from the floor?",
    type: "choice",
    maxPoints: 3,
    options: [
      { label: "Can't pick it up", value: 0 },
      { label: "Was very hard", value: 1 },
      { label: "A little hard", value: 2 },
      { label: "No problem at all", value: 3 }
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
        <Header username={username} onLogout={handleLogout} userRole={userRole} />

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
        <main className="flex-grow p-4">
          <Routes>
            {/* routes here */}
          </Routes>
        </main>
        <Footer />
        {isAuthenticated && userRole === 'kid' && <ChatBubble />}
      </div>
    </Router>
  );
}

export default App;
