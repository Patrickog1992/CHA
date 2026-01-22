import React, { useState } from 'react';
import { Quiz } from './components/Quiz';
import { Loading } from './components/Loading';
import { SalesPage } from './components/SalesPage';
import { INITIAL_ANSWERS, Answers } from './types';

function App() {
  const [view, setView] = useState<'quiz' | 'loading' | 'sales'>('quiz');
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);

  const handleQuizComplete = () => {
    setView('loading');
  };

  const handleLoadingFinished = () => {
    setView('sales');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      {view === 'quiz' && (
        <Quiz 
          answers={answers} 
          setAnswers={setAnswers} 
          onComplete={handleQuizComplete} 
        />
      )}
      
      {view === 'loading' && (
        <Loading onFinished={handleLoadingFinished} />
      )}

      {view === 'sales' && (
        <SalesPage answers={answers} />
      )}
    </div>
  );
}

export default App;