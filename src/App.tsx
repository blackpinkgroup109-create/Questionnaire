/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { SURVEY_QUESTIONS, type Question } from './types';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(-1); // -1 is Welcome, SURVEY_QUESTIONS.length is Success
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [direction, setDirection] = useState(0);

  const totalSteps = SURVEY_QUESTIONS.length;
  const progress = currentStep === -1 ? 0 : ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    setDirection(1);
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((prev) => prev - 1);
  };

  const updateAnswer = (questionId: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const isStepValid = () => {
    if (currentStep === -1) return true;
    const question = SURVEY_QUESTIONS[currentStep];
    if (!question.required) return true;
    return !!answers[question.id];
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  };

  return (
    <div id="survey-container" className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Progress Bar Container */}
      <div className="fixed top-0 left-0 w-full p-6 z-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
              {currentStep === -1 ? 'Getting Started' : currentStep >= totalSteps ? 'Complete' : `Step ${currentStep + 1} of ${totalSteps}`}
            </span>
            <span className="text-xs font-mono font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-black rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "circOut" }}
            />
          </div>
        </div>
      </div>

      <main className="w-full max-w-2xl flex-grow flex flex-col justify-center relative">
        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === -1 ? (
            <motion.div
              key="welcome"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="space-y-8 text-center"
            >
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Help us build your future.</h1>
                <p className="text-xl text-gray-500 max-w-lg mx-auto">
                  Take a moment to answer 4 quick questions. It helps us tailor the experience just for you.
                </p>
              </div>
              <button 
                id="start-survey"
                onClick={handleNext}
                className="btn-primary mx-auto"
              >
                Let's Start
                <ChevronRight size={20} />
              </button>
            </motion.div>
          ) : currentStep < totalSteps ? (
            <motion.div
              key={SURVEY_QUESTIONS[currentStep].id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
                  {SURVEY_QUESTIONS[currentStep].question}
                </h2>
                {SURVEY_QUESTIONS[currentStep].description && (
                  <p className="text-lg text-gray-500">
                    {SURVEY_QUESTIONS[currentStep].description}
                  </p>
                )}
              </div>

              <div className="space-y-6">
                {SURVEY_QUESTIONS[currentStep].type === 'text' && (
                  <input
                    type="text"
                    placeholder={SURVEY_QUESTIONS[currentStep].placeholder}
                    value={answers[SURVEY_QUESTIONS[currentStep].id] || ''}
                    onChange={(e) => updateAnswer(SURVEY_QUESTIONS[currentStep].id, e.target.value)}
                    className="input-field"
                    autoFocus
                  />
                )}

                {SURVEY_QUESTIONS[currentStep].type === 'choice' && (
                  <div className="grid gap-3">
                    {SURVEY_QUESTIONS[currentStep].options?.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => updateAnswer(SURVEY_QUESTIONS[currentStep].id, option.value)}
                        className={`choice-card flex items-center justify-between ${
                          answers[SURVEY_QUESTIONS[currentStep].id] === option.value ? 'choice-card-selected' : ''
                        }`}
                      >
                        <span className="text-lg font-medium">{option.label}</span>
                        {answers[SURVEY_QUESTIONS[currentStep].id] === option.value && (
                          <CheckCircle2 size={24} className="text-black" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {SURVEY_QUESTIONS[currentStep].type === 'rating' && (
                  <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[var(--color-border)]">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => updateAnswer(SURVEY_QUESTIONS[currentStep].id, num)}
                        className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl font-semibold transition-all ${
                          answers[SURVEY_QUESTIONS[currentStep].id] === num
                            ? 'bg-black text-white scale-110 shadow-lg'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                )}

                {SURVEY_QUESTIONS[currentStep].type === 'longtext' && (
                  <textarea
                    rows={4}
                    placeholder={SURVEY_QUESTIONS[currentStep].placeholder}
                    value={answers[SURVEY_QUESTIONS[currentStep].id] || ''}
                    onChange={(e) => updateAnswer(SURVEY_QUESTIONS[currentStep].id, e.target.value)}
                    className="input-field resize-none py-4"
                  />
                )}
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button 
                  id="prev-button"
                  onClick={handleBack}
                  className="btn-secondary"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <button 
                  id="next-button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="btn-primary flex-grow"
                >
                  {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="space-y-8 text-center"
            >
              <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight">You're all set!</h2>
                <p className="text-xl text-gray-500 max-w-lg mx-auto">
                  Thank you for your feedback. We've recorded your responses and will be in touch shortly.
                </p>
              </div>
              <div className="pt-8 flex flex-col items-center gap-4">
                <button 
                  id="reset-survey"
                  onClick={() => {
                    setCurrentStep(-1);
                    setAnswers({});
                  }}
                  className="text-gray-400 hover:text-black font-medium tracking-wide uppercase text-xs"
                >
                  Start Over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-8 text-center text-gray-400 text-xs tracking-widest uppercase pointer-events-none">
        Powered by SurveyFlow &copy; 2026
      </footer>

      {/* Decorative background elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] aspect-square bg-gray-100 rounded-full blur-[100px] -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[30%] aspect-square bg-gray-50 rounded-full blur-[80px] -z-10" />
    </div>
  );
}
