
import React, { useState, useEffect } from 'react';
import { User, BeltColor, Question, QuizResult } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import QuizEngine from './components/QuizEngine';
import Results from './components/Results';
import AdminPortal from './components/AdminPortal';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'auth' | 'dash' | 'quiz' | 'results' | 'admin'>('auth');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('dojo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentScreen('dash');
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('dojo_user', JSON.stringify(userData));
    setCurrentScreen('dash');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dojo_user');
    setCurrentScreen('auth');
  };

  const startQuiz = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    setUserAnswers([]);
    setCurrentScreen('quiz');
  };

  const saveToCloud = (answers: number[]) => {
    if (!user) return;
    
    const score = questions.reduce((acc, q, idx) => (q.correctAnswer === answers[idx] ? acc + 1 : acc), 0);
    
    const newResult: QuizResult = {
      id: Math.random().toString(36).substr(2, 9),
      studentName: user.name,
      belt: user.belt,
      score,
      total: questions.length,
      timestamp: Date.now(),
      details: questions.map((q, idx) => ({
        question: q.question,
        userAnswer: q.options[answers[idx]] || "No Answer",
        correctAnswer: q.options[q.correctAnswer],
        isCorrect: answers[idx] === q.correctAnswer
      }))
    };

    // Simulate Cloud Persistence
    const cloudData = JSON.parse(localStorage.getItem('dojo_cloud_data') || '[]');
    localStorage.setItem('dojo_cloud_data', JSON.stringify([newResult, ...cloudData]));
    
    setUserAnswers(answers);
    setCurrentScreen('results');
  };

  const backToDash = () => {
    setCurrentScreen('dash');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {currentScreen === 'auth' && (
        <Login 
          onLogin={handleLogin} 
          onOpenAdmin={() => setCurrentScreen('admin')} 
        />
      )}
      
      {currentScreen === 'admin' && (
        <AdminPortal onBack={() => setCurrentScreen('auth')} />
      )}
      
      {user && (
        <>
          {currentScreen === 'dash' && (
            <Dashboard 
              user={user} 
              onLogout={handleLogout} 
              onStartQuiz={startQuiz} 
            />
          )}
          {currentScreen === 'quiz' && (
            <QuizEngine 
              questions={questions} 
              onFinish={saveToCloud} 
              onCancel={backToDash}
            />
          )}
          {currentScreen === 'results' && (
            <Results 
              questions={questions} 
              answers={userAnswers} 
              onBack={backToDash}
              user={user}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
