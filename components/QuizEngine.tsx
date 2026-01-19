
import React, { useState, useEffect } from 'react';
import { Question } from '../types.ts';

interface QuizEngineProps {
  questions: Question[];
  onFinish: (answers: number[]) => void;
  onCancel: () => void;
}

const QuizEngine: React.FC<QuizEngineProps> = ({ questions, onFinish, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    onFinish(answers);
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pt-12">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <button 
            onClick={onCancel}
            className="text-slate-400 hover:text-red-600 text-[10px] font-bold uppercase mb-2 flex items-center gap-1 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Abort Session
          </button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-2 h-6 bg-yellow-600 rounded-full"></span>
            Golden Shoto Inquiry
          </h2>
        </div>
        <div className={`text-3xl font-mono font-black ${timeLeft < 15 ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden shadow-inner">
        <div 
          className="bg-yellow-600 h-full transition-all duration-700 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl border border-slate-100 min-h-[550px] flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 relative">
        <div className="absolute top-8 right-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          Rank Examination Mode
        </div>
        
        <div className="mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug mb-3">
            {currentQuestion.question}
          </h3>
          <p className="text-xl font-bold text-yellow-600 leading-relaxed italic">
            {currentQuestion.questionBengali}
          </p>
        </div>

        <div className="grid gap-4 mt-auto">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full p-5 text-left rounded-2xl border-2 transition-all group flex items-start gap-5 ${
                answers[currentIndex] === idx
                  ? 'border-yellow-600 bg-yellow-50 shadow-md'
                  : 'border-slate-50 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                answers[currentIndex] === idx ? 'bg-yellow-600 text-white' : 'bg-white text-slate-400 group-hover:bg-slate-200'
              }`}>
                {idx + 1}
              </span>
              <div>
                <p className={`font-bold text-lg ${answers[currentIndex] === idx ? 'text-yellow-900' : 'text-slate-700'}`}>{option}</p>
                <p className="text-sm font-medium text-slate-500 mt-1">{currentQuestion.optionsBengali[idx]}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <button
            onClick={next}
            disabled={answers[currentIndex] === undefined}
            className="px-12 py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center gap-3 uppercase tracking-widest text-sm"
          >
            {currentIndex === questions.length - 1 ? 'Submit Answers' : 'Proceed'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizEngine;
