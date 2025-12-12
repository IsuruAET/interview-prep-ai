import { useEffect, useRef, useState } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from "react-icons/lu";
import AIResponsePreview from "../InterviewPrep/AIResponsePreview";

interface QuestionCardProps {
  question: string;
  answer: string;
  isPinned: boolean;
  onLearnMore: () => void;
  onTogglePin: () => void;
}

const QuestionCard = ({
  question,
  answer,
  isPinned,
  onLearnMore,
  onTogglePin,
}: QuestionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      if (isExpanded) {
        const contentHeight = contentRef.current?.scrollHeight;
        setHeight((contentHeight ?? 0) + 10);
      } else {
        setHeight(0);
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="bg-white rounded-lg mb-4 overflow-hidden py-3 sm:py-4 px-3 sm:px-5 shadow-xl shadow-gray-100/70 border border-gray-100/60 group">
        <div className="flex items-start justify-between cursor-pointer gap-2 sm:gap-4">
          <div className="flex items-start gap-2 sm:gap-3.5 min-w-0 flex-1">
            <span className="text-xs sm:text-sm md:text-[15px] font-semibold text-gray-400 leading-[18px] shrink-0">
              Q
            </span>

            <h3
              className="text-xs sm:text-sm md:text-[14px] font-medium text-gray-800 wrap-break-word"
              onClick={toggleExpand}
            >
              {question}
            </h3>
          </div>

          <div className="flex items-center justify-end ml-2 sm:ml-4 relative shrink-0">
            <div
              className={`flex gap-1 sm:gap-2 ${
                isExpanded ? "flex" : "hidden sm:group-hover:flex"
              }`}
            >
              <button
                className="flex items-center gap-1 sm:gap-2 text-xs text-indigo-800 font-medium bg-indigo-50 px-2 sm:px-3 py-1 mr-1 sm:mr-2 rounded text-nowrap border border-indigo-50 hover:border-indigo-200 cursor-pointer"
                onClick={onTogglePin}
                title={isPinned ? "Unpin" : "Pin"}
              >
                {isPinned ? (
                  <LuPinOff className="text-xs" />
                ) : (
                  <LuPin className="text-xs" />
                )}
                <span className="hidden sm:inline">Pin</span>
              </button>

              <button
                className="flex items-center gap-1 sm:gap-2 text-xs text-cyan-800 font-medium bg-cyan-50 px-2 sm:px-3 py-1 mr-1 sm:mr-2 rounded text-nowrap border border-cyan-50 hover:border-cyan-200 cursor-pointer"
                onClick={() => {
                  setIsExpanded(true);
                  onLearnMore();
                }}
                title="Learn More"
              >
                <LuSparkles className="text-sm" />
                <span className="hidden sm:inline md:hidden">More</span>
                <span className="hidden md:inline">Learn More</span>
              </button>
            </div>

            <button
              className="text-gray-400 hover:text-gray-500 cursor-pointer shrink-0"
              onClick={toggleExpand}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <LuChevronDown
                size={18}
                className={`transform transition-transform duration-300 sm:w-5 sm:h-5 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: `${height}px` }}
        >
          <div
            className="mt-3 sm:mt-4 text-gray-700 bg-gray-50 px-3 sm:px-5 py-2 sm:py-3 rounded-lg"
            ref={contentRef}
          >
            <AIResponsePreview content={answer} />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionCard;
