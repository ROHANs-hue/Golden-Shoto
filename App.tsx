
import React, { useState, useEffect } from 'react';
import { User, Question, QuizResult } from './types.ts';
import Login from './components/Login.tsx';
import Dashboard from './components/Dashboard.tsx';
import QuizEngine from './components/QuizEngine.tsx';
import Results from './components/Results.tsx';
import AdminPortal from './components/AdminPortal.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'auth' | 'dash' | 'quiz' | 'results' | 'admin'>('auth');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('dojo_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setCurrentScreen('dash');
      } catch (e) {
        localStorage.removeItem('dojo_user');
      }
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('dojo_user', JSON.stringify(userData));
    setCurrentScreen('dash');
  };

  const handleUpdateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('dojo_user', JSON.stringify(userData));
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

    const cloudData = JSON.parse(localStorage.getItem('dojo_cloud_data') || '[]');
    localStorage.setItem('dojo_cloud_data', JSON.stringify([newResult, ...cloudData]));
    
    setUserAnswers(answers);
    setCurrentScreen('results');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 animate-fade-in">
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
              onUpdateUser={handleUpdateUser}
            />
          )}
          {currentScreen === 'quiz' && (
            <QuizEngine 
              questions={questions} 
              onFinish={saveToCloud} 
              onCancel={() => setCurrentScreen('dash')}
            />
          )}
          {currentScreen === 'results' && (
            <Results 
              questions={questions} 
              answers={userAnswers} 
              onBack={() => setCurrentScreen('dash')}
              user={user}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
