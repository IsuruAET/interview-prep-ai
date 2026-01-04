export type QuestionTopic = 'javascript' | 'typescript' | 'react' | 'frontend' | 'backend' | 'all';

export interface InterviewQuestion {
  id: string;
  topic: QuestionTopic;
  title: string;
  answer: string;
  number: number;
}

// Load and parse all questions from JSON files
export async function loadAllQuestions(): Promise<InterviewQuestion[]> {
  try {
    // Import JSON files directly - Vite handles JSON imports natively
    const [jsData, tsData, reactData, frontendData, backendData] = await Promise.all([
      import('../assets/interview-questions/javascript-interview-questions.json'),
      import('../assets/interview-questions/typescript-interview-questions.json'),
      import('../assets/interview-questions/react-interview-questions.json'),
      import('../assets/interview-questions/frontend-interview-questions.json'),
      import('../assets/interview-questions/backend-interview-questions.json'),
    ]);

    // Extract the default export (JSON imports return the data as default)
    const jsQuestions = (jsData.default || jsData) as InterviewQuestion[];
    const tsQuestions = (tsData.default || tsData) as InterviewQuestion[];
    const reactQuestions = (reactData.default || reactData) as InterviewQuestion[];
    const frontendQuestions = (frontendData.default || frontendData) as InterviewQuestion[];
    const backendQuestions = (backendData.default || backendData) as InterviewQuestion[];

    console.log('Loaded questions from JSON:', {
      js: jsQuestions.length,
      ts: tsQuestions.length,
      react: reactQuestions.length,
      frontend: frontendQuestions.length,
      backend: backendQuestions.length,
      total: jsQuestions.length + tsQuestions.length + reactQuestions.length + frontendQuestions.length + backendQuestions.length,
    });

    return [...jsQuestions, ...tsQuestions, ...reactQuestions, ...frontendQuestions, ...backendQuestions];
  } catch (error) {
    console.error('Error loading questions from JSON:', error);
    throw new Error('Failed to load questions. Please refresh the page.');
  }
}

