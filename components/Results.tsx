
import React from 'react';
import { Question, User } from '../types.ts';

interface ResultsProps {
  questions: Question[];
  answers: number[];
  user: User;
  onBack: () => void;
}

const Results: React.FC<ResultsProps> = ({ questions, answers, user, onBack }) => {
  const score = questions.reduce((acc, q, idx) => (q.correctAnswer === answers[idx] ? acc + 1 : acc), 0);
  const percentage = (score / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8 animate-in zoom-in duration-500">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 text-white p-10 text-center relative">
          <h2 className="text-sm uppercase tracking-widest text-red-500 font-bold mb-2">Training Session Saved to Cloud</h2>
          <div className="text-6xl font-bold mb-2">{score}/{questions.length}</div>
          <p className="text-slate-400">Score has been recorded for Sensei review.</p>
        </div>

        <div className="p-8 md:p-10 space-y-10">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Review (English/Bengali)</h3>
            
            <div className="grid gap-6">
              {questions.map((q, idx) => {
                const isCorrect = answers[idx] === q.correctAnswer;
                return (
                  <div key={idx} className={`p-6 rounded-2xl border-l-8 ${isCorrect ? 'border-green-500 bg-green-50/30' : 'border-red-500 bg-red-50/30'}`}>
                    <div className="flex flex-col gap-2">
                      <h4 className="font-bold text-slate-800">{q.question}</h4>
                      <p className="text-sm font-semibold text-red-700">{q.questionBengali}</p>
                      
                      <div className="mt-4 p-4 bg-white rounded-xl shadow-sm space-y-2 border border-slate-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Your Answer:</span>
                          <span className={isCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                            {q.options[answers[idx]] || 'None'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="flex justify-between text-sm pt-2 border-t border-slate-50">
                            <span className="text-slate-400">Correct Answer:</span>
                            <span className="text-green-600 font-bold">{q.options[q.correctAnswer]}</span>
                          </div>
                        )}
                        <div className="mt-3 pt-3 border-t border-slate-50">
                          <p className="text-xs text-slate-500 leading-relaxed italic">{q.explanation}</p>
                          <p className="text-xs text-red-600 mt-1">{q.explanationBengali}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={onBack}
            className="w-full px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg transition-all active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
