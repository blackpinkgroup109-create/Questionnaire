/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QuestionType = 'choice' | 'text' | 'rating' | 'longtext';

export interface Option {
  id: string;
  label: string;
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  description?: string;
  options?: Option[];
  placeholder?: string;
  required?: boolean;
}

export const SURVEY_QUESTIONS: Question[] = [
  {
    id: 'name',
    type: 'text',
    question: "What's your name?",
    description: "We'd love to know who we're talking to.",
    placeholder: "Type your name here...",
    required: true
  },
  {
    id: 'role',
    type: 'choice',
    question: "What is your primary role?",
    description: "Select the option that best describes your daily work.",
    options: [
      { id: '1', label: 'Designer', value: 'designer' },
      { id: '2', label: 'Developer', value: 'developer' },
      { id: '3', label: 'Product Manager', value: 'pm' },
      { id: '4', label: 'Business Owner', value: 'owner' },
      { id: '5', label: 'Other', value: 'other' }
    ],
    required: true
  },
  {
    id: 'team_size',
    type: 'rating',
    question: "How would you rate your team's current productivity?",
    description: "On a scale of 1 to 5, where 1 is low and 5 is high.",
    required: true
  },
  {
    id: 'challenge',
    type: 'longtext',
    question: "What's the biggest challenge you're facing right now?",
    description: "Feel free to be as detailed as you like.",
    placeholder: "Describe your challenge...",
    required: false
  }
];
