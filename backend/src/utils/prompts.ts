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
    - Return a pure JSON object with a "questions" array like:
    {
      "questions": [
        {
          "question": "Question 1",
          "answer": "Answer 1"
        },
        {
          "question": "Question 2",
          "answer": "Answer 2"
        }
      ]
    }
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

export const generateCoverLetterPrompt = (
  profileDescription: string,
  companyDescription: string
) => {
  return `
    You are an AI assistant specialized in writing professional cover letters.

    Task:
    Write a polite, simple, and readable cover letter based on the following information:

    Candidate Profile:
    ${profileDescription}

    Company and Job Requirements:
    ${companyDescription}

    Instructions:
    1. Write a professional cover letter that is polite, concise, and easy to read.
    2. Highlight the candidate's experience and skills that directly match the company's requirements.
    3. If the candidate has experience with technologies that are similar or related to the required technologies (even if not exact matches), mention these alternative technologies and explain how they demonstrate transferable skills.
    4. Keep the tone professional but warm and enthusiastic.
    5. Structure the letter with:
       - A brief introduction expressing interest
       - Body paragraphs highlighting relevant experience and skills
       - A closing paragraph expressing eagerness to contribute
    6. Do not make up information that is not in the profile description.
    7. Keep the letter between 200-400 words.
    8. Return the result as a valid JSON object in the following format:
    {
      "coverLetter": "The complete cover letter text here"
    }

    Important: Do NOT add any extra text. Only return valid JSON.
  `;
};
