export const generateInterviewQuestionsPrompt = (
  role: string,
  experience: string,
  topicsToFocus: string[],
  numberOfQuestions: number
) => {
  return `
    You are an AI trained to generate technical interview questions and answers.

    Task:
    - Role: ${role}
    - Candidate Experience: ${experience}
    - Focus Topics: ${topicsToFocus.join(", ")}
    - Write ${numberOfQuestions} interview questions.
    - For each question, generate a detailed but beginner-friendly answer.
    - If the answer needs a code example, add a small code block inside.
    - Keep formatting very clean.
    - Return a pure JSON array like:
    [
      {
        question: "Question 1",
        answer: "Answer 1",
      },
      {
        question: "Question 2",
        answer: "Answer 2",
      },
      ...
    ]
    Important: Do NOT add any extra text. Only return valid JSON.
  `;
};

export const generateConceptExplanationPrompt = (question: string) => {
  return `
    You are an AI trained to generate explanations for a given interview question.

    Task:
    - Explain the following interview question and it's concept in depth as if you're teaching a beginner developer.
    - Question: ${question}
    - After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
    - If the explanation includes a code example, provide a small code block.
    - Keep the formatting very clean and clear.
    - Return the result as a valid JSON object in the following format:
    {
      title: "Title of the concept",
      explanation: "Explanation of the concept",
    }

    Important: Do NOT add any extra text. Only return valid JSON.
  `;
};
