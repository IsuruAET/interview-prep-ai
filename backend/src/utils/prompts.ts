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

export const generateMatchAnalysisPrompt = (
  profileDescription: string,
  companyDescription: string
) => {
  return `
    You are an AI assistant specialized in analyzing job-candidate compatibility.

    Task:
    Analyze how well the candidate's profile matches the job requirements and provide:
    1. A match percentage (0-100) based ONLY on information explicitly stated in the candidate's profile
    2. A brief summary (2-3 sentences) explaining the match level based ONLY on the provided profile

    Candidate Profile:
    ${profileDescription}

    Company and Job Requirements:
    ${companyDescription}

    CRITICAL RULES - STRICTLY FOLLOW:
    1. ONLY use information that is EXPLICITLY stated in the candidate profile above
    2. DO NOT assume, infer, or guess any skills, experiences, or qualifications not mentioned
    3. DO NOT add any information that is not in the profile description
    4. If a skill or requirement is not mentioned in the profile, it does NOT count as a match
    5. Be honest, realistic, and CONSERVATIVE - if information is missing, significantly lower the match percentage
    6. Only count skills/technologies/experiences that are clearly stated in the profile

    MATCH PERCENTAGE GUIDELINES - BE STRICT:
    1. Identify ALL key requirements from the job description (technologies, skills, experience types, domains)
    2. Count how many of these key requirements are EXPLICITLY mentioned in the candidate profile
    3. Calculate percentage based on: (matched requirements / total key requirements) * 100
    4. BE CONSERVATIVE: If critical/core requirements are missing, the percentage should be LOW (below 50%)
    5. If multiple important requirements are missing, percentage should be 30-50% even if some skills match
    6. Only give 70%+ if MOST key requirements are met and only minor ones are missing
    7. Only give 80%+ if almost ALL requirements are met
    8. Give 40% or less if fundamental/core requirements are missing from the profile

    Instructions:
    1. Calculate match percentage (0-100) using STRICT guidelines above:
       - List key requirements from job description
       - Check which are EXPLICITLY in the profile
       - Calculate: (matches / total) * 100
       - If core/critical requirements are missing, cap at 50% maximum
    2. Write a brief summary (2-3 sentences) that:
       - Only references skills and experiences EXPLICITLY stated in the profile
       - Clearly states what matches and what's missing
       - Explains why the percentage is what it is (e.g., "missing X, Y, Z requirements")
    3. Be honest, realistic, and CONSERVATIVE in your assessment
    4. Return the result as a valid JSON object in the following format:
    {
      "matchPercentage": 45,
      "matchSummary": "Brief 2-3 sentence summary explaining the match based ONLY on profile information, clearly stating what's missing"
    }

    Important: Do NOT add any extra text. Only return valid JSON. Do NOT fabricate any information. BE STRICT with percentages.
  `;
};

export const generateCoverLetterPrompt = (
  profileDescription: string,
  companyDescription: string
) => {
  return `
    You are an AI assistant specialized in writing professional cover letters.

    Task:
    Write a polite, simple, and readable cover letter based ONLY on the information provided below.

    Candidate Profile:
    ${profileDescription}

    Company and Job Requirements:
    ${companyDescription}

    CRITICAL RULES - STRICTLY FOLLOW:
    1. ONLY mention skills, experiences, technologies, projects, or qualifications that are EXPLICITLY stated in the candidate profile above
    2. DO NOT assume, infer, guess, or fabricate any information not present in the profile
    3. DO NOT add any skills, technologies, companies, projects, or experiences that are not explicitly mentioned in the profile
    4. DO NOT make up specific project names, company names, or achievements unless they are in the profile
    5. If something is not mentioned in the profile, do NOT include it in the cover letter
    6. You may mention similar/related technologies ONLY if they are explicitly stated in the profile (e.g., if profile says "React" and job requires "Vue", you can mention the React experience from the profile, but do NOT claim Vue experience)
    7. Be truthful and accurate - only write about what the candidate has actually stated

    Instructions:
    1. Write a professional cover letter that is polite, concise, and easy to read.
    2. Highlight ONLY the candidate's experiences and skills from the profile that match the company's requirements.
    3. Only mention technologies/tools from the profile - do not assume knowledge of related technologies unless explicitly stated.
    4. Keep the tone professional but warm and enthusiastic.
    5. Structure the letter with:
       - A brief introduction expressing interest
       - Body paragraphs highlighting relevant experience and skills FROM THE PROFILE ONLY
       - A closing paragraph expressing eagerness to contribute
    6. If the profile doesn't mention something required by the job, simply don't mention it - do not fabricate it.
    7. Keep the letter between 200-400 words.
    8. Return the result as a valid JSON object in the following format:
    {
      "coverLetter": "The complete cover letter text here"
    }

    IMPORTANT REMINDERS:
    - Every skill, technology, experience, or qualification mentioned must be EXPLICITLY stated in the candidate profile
    - Do NOT make assumptions or add information not in the profile
    - Do NOT add any extra text. Only return valid JSON.
    - Do NOT fabricate any information whatsoever.
  `;
};
