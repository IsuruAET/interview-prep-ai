import DashboardLayout from "../components/layouts/DashboardLayout";

const AboutMe = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-4 px-4 sm:px-6 md:px-0">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-2">
            About Me
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 mb-6 sm:mb-8">
            Get to know me better
          </p>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed space-y-4">
                <p>
                  Hello, my name is Isuru Godakanda, but most people call me Izzy.
                  I'm a Technical Lead with over six years of professional experience in software engineering, and my core strength lies in React front-end development and full-stack web engineering.
                </p>

                <p>
                  I'm originally from Sri Lanka, and I recently moved to Australia as a TR dependent. I've been here for about three months, and I'm currently continuing my role with my company, Aeturnum, which is a US-based service software company.
                </p>

                <p>
                  Most of my career has been focused on building, refactoring, and scaling React applications. I've worked extensively with React, TypeScript, Redux, MUI, and modern frontend architecture patterns, where my main responsibilities include improving UI performance, fixing long-standing critical issues, enhancing UX, and aligning frontend systems with best practices.
                </p>

                <p>
                  Alongside React development, I actively work as a MERN stack developer, and I have hands-on experience with Node.js, databases, API integrations, and full-stack performance optimization. I enjoy designing clean component architectures, reusable UI systems, and scalable frontend foundations that teams can easily maintain and extend.
                </p>

                <p>
                  In recent years, I've also been deeply involved in AI and LLM-driven initiatives, especially from a web developer's perspective. I focus on how frontend and full-stack engineers can adapt to AI development—integrating AI APIs, using prompt engineering effectively, and building AI-powered web applications. I've done extensive R&D on AI tools like Cursor AI and GitHub Copilot, and I actively explore how these tools can improve developer productivity and solution quality.
                </p>

                <p>
                  Another area I'm passionate about is web performance optimization—not just on the frontend, but across the backend and database layers as well. I strongly believe that performance, UX, and security go hand in hand, so I always pay close attention to accessibility, authentication, authorization, and secure frontend practices when building applications.
                </p>

                <p>
                  What really defines me as an engineer is my mindset. I genuinely enjoy resolving critical problems, breaking down complex issues, and finding practical, long-term solutions. I'm a self-managed and highly responsible person, comfortable owning features end-to-end, doing deep R&D when needed, and continuously improving both myself and the systems I work on.
                </p>

                <p>
                  Overall, I see myself as someone who combines strong React frontend expertise, full-stack thinking, and a modern AI-driven development approach to build scalable, high-quality web applications. I'm always eager to learn, adapt, and contribute where I can make the biggest impact.
                </p>

                <p>
                  Thank you for taking the time to listen, and I look forward to connecting and building great things together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AboutMe;

