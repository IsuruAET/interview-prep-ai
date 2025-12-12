import { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import RoleInfoHeader from "../components/InterviewPrep/RoleInfoHeader";
import QuestionCard from "../components/Cards/QuestionCard";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import AIResponsePreview from "../components/InterviewPrep/AIResponsePreview";
import Drawer from "../components/Drawer";
import SkeletonLoader from "../components/Loader/SkeletonLoader";
import ButtonSpinner from "../components/Loader/ButtonSpinner";
import { useGetSessionById } from "../hooks/useSessions";
import { useGenerateQuestions, useGenerateExplanation } from "../hooks/useAI";
import {
  useAddQuestionsToSession,
  useUpdateQuestionPinStatus,
} from "../hooks/useQuestions";
import { formatDate } from "../utils/helper";
import axios from "axios";

interface Explanation {
  title: string;
  explanation: string;
}

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const {
    data: sessionData,
    isLoading: isSessionLoading,
    refetch,
  } = useGetSessionById(sessionId);
  const generateQuestionsMutation = useGenerateQuestions();
  const generateExplanationMutation = useGenerateExplanation();
  const addQuestionsToSessionMutation = useAddQuestionsToSession();
  const updateQuestionPinMutation = useUpdateQuestionPinStatus();

  const [errorMsg, setErrorMsg] = useState("");
  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [isUpdateLoaded, setIsUpdateLoaded] = useState(false);

  // Generate concept Explanation
  const generateConceptExplanation = async (question: string) => {
    if (!sessionId || !sessionData) return;

    setErrorMsg("");
    setOpenLeanMoreDrawer(true);
    setExplanation(null);

    try {
      const response = await generateExplanationMutation.mutateAsync({
        question,
        role: sessionData.role,
        experience: sessionData.experience,
        topicsToFocus: sessionData.topicsToFocus,
      });
      setExplanation(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMsg(
          error.response?.data?.message || "Failed to generate explanation"
        );
      } else {
        setErrorMsg("Failed to generate explanation");
      }
    }
  };

  // Pin Question
  const toggleQuestionPinStatus = async (questionId: string) => {
    if (!questionId) return;

    try {
      await updateQuestionPinMutation.mutateAsync(questionId);
      refetch();
    } catch {
      // Errors handled via hook toast
    }
  };

  // Add more questions to a session
  const uploadMoreQuestions = async () => {
    if (!sessionId || !sessionData) return;

    setIsUpdateLoaded(true);
    try {
      // Generate 10 more questions
      const questions = await generateQuestionsMutation.mutateAsync({
        role: sessionData.role,
        experience: sessionData.experience,
        topicsToFocus: sessionData.topicsToFocus,
        numberOfQuestions: 10,
      });

      // Add questions to session
      await addQuestionsToSessionMutation.mutateAsync({
        sessionId,
        questions: questions.map((q) => ({
          question: q.question,
          answer: q.answer,
        })),
      });

      refetch();
    } catch {
      // Errors handled via hook toast
    } finally {
      setIsUpdateLoaded(false);
    }
  };

  // Get questions array from session data
  const questions = Array.isArray(sessionData?.questions)
    ? sessionData.questions
    : [];

  // Sort questions: pinned first, then by creation date
  const sortedQuestions = [...questions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (isSessionLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
          <SkeletonLoader />
        </div>
      </DashboardLayout>
    );
  }

  if (!sessionData) {
    return (
      <DashboardLayout>
        <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
          <p className="text-center text-gray-500 mt-10">Session not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData.role || ""}
        topicsToFocus={sessionData.topicsToFocus || ""}
        experience={sessionData.experience || "-"}
        questions={questions.length || "-"}
        description={sessionData.description || ""}
        lastUpdated={formatDate(sessionData.updatedAt)}
      />

      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <h2 className="text-base sm:text-lg font-semibold color-black">Interview Q & A</h2>

        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div
            className={`col-span-12 ${
              openLeanMoreDrawer ? "md:col-span-7 lg:col-span-8" : "md:col-span-12 lg:col-span-8"
            }`}
          >
            <AnimatePresence>
              {sortedQuestions.map((data, index) => {
                return (
                  <motion.div
                    key={data._id || index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.1,
                      damping: 15,
                    }}
                    layout // This is the key prop that animates position changes
                    layoutId={`question-${data._id || index}`} // Helps framer track specific items
                  >
                    <>
                      <QuestionCard
                        question={data.question}
                        answer={data.answer}
                        onLearnMore={() =>
                          generateConceptExplanation(data.question)
                        }
                        isPinned={data.isPinned}
                        onTogglePin={() => toggleQuestionPinStatus(data._id)}
                      />

                      {sortedQuestions.length === index + 1 && (
                        <div className="flex items-center justify-center mt-4 sm:mt-5">
                          <button
                            className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white font-medium bg-black px-4 sm:px-5 py-1.5 sm:py-2 rounded text-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={
                              isUpdateLoaded ||
                              generateQuestionsMutation.isPending
                            }
                            onClick={uploadMoreQuestions}
                          >
                            {isUpdateLoaded ||
                            generateQuestionsMutation.isPending ? (
                              <ButtonSpinner />
                            ) : (
                              <LuListCollapse className="text-base sm:text-lg" />
                            )}{" "}
                            Load More
                          </button>
                        </div>
                      )}
                    </>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <Drawer
            isOpen={openLeanMoreDrawer}
            onClose={() => setOpenLeanMoreDrawer(false)}
            title={
              !generateExplanationMutation.isPending && explanation?.title
                ? explanation.title
                : undefined
            }
          >
            {errorMsg && (
              <p className="flex gap-2 text-sm text-amber-600 font-medium">
                <LuCircleAlert className="mt-1" /> {errorMsg}
              </p>
            )}
            {generateExplanationMutation.isPending && <SkeletonLoader />}
            {!generateExplanationMutation.isPending && explanation && (
              <AIResponsePreview content={explanation?.explanation} />
            )}
          </Drawer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
