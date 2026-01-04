import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { loadAllQuestions, type InterviewQuestion, type QuestionTopic } from '../utils/parseQuestions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { LuChevronDown, LuChevronUp, LuCode } from 'react-icons/lu';
import Loader from '../components/Loader/Loader';

const ITEMS_PER_PAGE = 10;

const InterviewQuestions = () => {
  const [allQuestions, setAllQuestions] = useState<InterviewQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<InterviewQuestion[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<QuestionTopic>('all');
  // Start with only 10 items displayed - infinite scroll will load more
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Load questions on mount
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Add a visual timeout indicator
        timeoutId = setTimeout(() => {
          if (isMounted) {
            console.warn('Loading is taking longer than expected...');
          }
        }, 3000);
        
        console.log('Starting to load questions...');
        const questions = await loadAllQuestions();
        
        clearTimeout(timeoutId);
        
        if (!isMounted) return;
        
        console.log('Successfully loaded questions:', questions.length);
        
        if (questions.length === 0) {
          setError('No questions were found in the markdown files.');
        } else {
          // Store all questions, but only display first 10 initially
          setAllQuestions(questions);
          console.log(`Loaded ${questions.length} total questions. Displaying first ${ITEMS_PER_PAGE} only.`);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (!isMounted) return;
        
        console.error('Error loading questions:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to load questions. Please refresh the page.';
        setError(errorMessage);
        setAllQuestions([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchQuestions();
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Filter questions based on selected topic
  useEffect(() => {
    if (!allQuestions.length) return;
    
    // Show loading indicator when filter changes
    setIsFiltering(true);
    
    // Small delay to show loading indicator and ensure smooth transition
    const filterTimer = setTimeout(() => {
      let filtered: InterviewQuestion[] = [];
      
      if (selectedTopic === 'all') {
        filtered = allQuestions;
      } else {
        filtered = allQuestions.filter((q) => q.topic === selectedTopic);
      }
      
      setFilteredQuestions(filtered);
      setDisplayedCount(ITEMS_PER_PAGE); // Reset displayed count when filter changes
      setIsLoadingMore(false); // Reset loading state when filter changes
      setIsFiltering(false); // Hide loading indicator
      
      console.log(`Filtered to ${selectedTopic}: ${filtered.length} questions`);
    }, 300); // Small delay for smooth UX
    
    return () => clearTimeout(filterTimer);
  }, [selectedTopic, allQuestions]);

  // Get displayed questions - only show the first N items (starts with 10)
  const displayedQuestions = useMemo(() => {
    // Only slice the questions we need to display
    return filteredQuestions.slice(0, displayedCount);
  }, [filteredQuestions, displayedCount]);

  // Infinite scroll observer - only loads when user scrolls to bottom
  useEffect(() => {
    // Only set up observer if there are more items to load
    if (displayedCount >= filteredQuestions.length || filteredQuestions.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Only load more when the trigger element is actually visible (user scrolled to bottom)
        if (entries[0].isIntersecting && displayedCount < filteredQuestions.length && !isLoadingMore) {
          // Set loading state
          setIsLoadingMore(true);
          
          // Small delay to show loading indicator
          setTimeout(() => {
            setDisplayedCount((prev) => {
              const next = Math.min(prev + ITEMS_PER_PAGE, filteredQuestions.length);
              console.log(`Loading more: ${prev} -> ${next} items`);
              setIsLoadingMore(false);
              return next;
            });
          }, 300); // Small delay to show the loading indicator
        }
      },
      { 
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px' // Only trigger when actually at the bottom
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [displayedCount, filteredQuestions.length, isLoadingMore]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    // Use capture phase for faster response
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [isDropdownOpen]);

  const topicOptions: { value: QuestionTopic; label: string }[] = [
    { value: 'all', label: 'All Topics' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'react', label: 'React' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
  ];

  const selectedOption = topicOptions.find((opt) => opt.value === selectedTopic);

  const getTopicColor = (topic: QuestionTopic) => {
    switch (topic) {
      case 'javascript':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'typescript':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'react':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'frontend':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'backend':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="container mx-auto pt-4 pb-20 sm:pb-4 px-4 md:px-0">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Questions</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-20 sm:pb-4 px-4 md:px-0">
        {/* Sticky Header with Filter */}
        <div className="sticky top-[56px] sm:top-[64px] z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 -mx-4 md:-mx-0 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 mb-4 sm:mb-6 shadow-sm">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
              {/* Title - Smaller on mobile */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                Interview Questions
              </h1>
              
              {/* Filter Section - Compact on mobile */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Dropdown Filter - Smaller on mobile */}
                <div className="relative inline-block" ref={dropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen((prev) => !prev);
                    }}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9324] focus:ring-offset-1 transition-all text-xs sm:text-sm font-medium"
                  >
                    <span className="font-medium text-gray-700 whitespace-nowrap">
                      {selectedOption?.label}
                    </span>
                    <LuChevronDown
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1.5 sm:mt-2 w-40 sm:w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-[60] overflow-hidden">
                      {topicOptions.map((option, index) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTopic(option.value);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 sm:px-4 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-sm transition-colors ${
                            index === 0 ? 'rounded-t-lg' : ''
                          } ${
                            index === topicOptions.length - 1 ? 'rounded-b-lg' : 'border-b border-gray-100'
                          } ${
                            selectedTopic === option.value
                              ? 'bg-[#FF9324] text-white hover:bg-[#E99A4B]'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Question Count - Compact on mobile */}
                <p className="text-xs sm:text-sm md:text-base text-gray-600 whitespace-nowrap font-medium">
                  {filteredQuestions.length > 0 ? (
                    <>
                      <span className="hidden sm:inline">
                        {displayedQuestions.length} of {filteredQuestions.length}
                      </span>
                      <span className="sm:hidden">
                        {displayedQuestions.length}/{filteredQuestions.length}
                      </span>
                      {displayedCount < filteredQuestions.length && !isFiltering && (
                        <span className="ml-1 sm:ml-2 text-gray-400 hidden sm:inline">
                          (Scroll for more)
                        </span>
                      )}
                    </>
                  ) : (
                    <span>Loading...</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions List - Only renders displayedQuestions (starts with 10) */}
        {isFiltering ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-[3px] border-[#FF9324] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Filtering questions...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedQuestions.length > 0 ? (
              displayedQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 md:p-6"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FF9324] text-white text-xs sm:text-sm font-semibold flex-shrink-0">
                      {question.number}
                    </span>
                    <span
                      className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getTopicColor(
                        question.topic
                      )}`}
                    >
                      {question.topic.charAt(0).toUpperCase() + question.topic.slice(1)}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 leading-tight">
                    {question.title}
                  </h2>
                </div>
              </div>

              {/* Answer */}
              <div className="mt-3 sm:mt-4 prose prose-slate max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      const language = match ? match[1] : '';
                      const isInline = !className;

                      return !isInline ? (
                        <CodeBlock
                          code={String(children).trim()}
                          language={language}
                        />
                      ) : (
                        <code
                          className="px-1.5 py-0.5 bg-gray-100 rounded text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    p: ({ children }) => (
                      <p className="mb-3 text-sm sm:text-base text-gray-700 leading-relaxed">
                        {children}
                      </p>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-xl sm:text-2xl font-bold mb-3 mt-4 text-gray-900">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg sm:text-xl font-semibold mb-2 mt-3 text-gray-900">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base sm:text-lg font-semibold mb-2 mt-3 text-gray-900">
                        {children}
                      </h3>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-3 space-y-1 text-sm sm:text-base text-gray-700">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-3 space-y-1 text-sm sm:text-base text-gray-700">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-sm sm:text-base text-gray-700">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-900">{children}</strong>
                    ),
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {question.answer}
                </ReactMarkdown>
              </div>
            </div>
              ))
            ) : (
              !isLoading && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No questions to display.</p>
                </div>
              )
            )}
          </div>
        )}

        {/* Infinite Scroll Trigger - Only visible when there are more items to load and not filtering */}
        {!isFiltering && displayedCount < filteredQuestions.length && filteredQuestions.length > 0 && (
          <div 
            ref={observerTarget} 
            className="h-20 flex items-center justify-center py-4"
            aria-label="Scroll to load more"
          >
            {isLoadingMore ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#FF9324] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500">Loading more questions...</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Scroll to load more questions...</p>
            )}
          </div>
        )}

        {/* End of List Message */}
        {displayedCount >= filteredQuestions.length && filteredQuestions.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>You've reached the end of the list!</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredQuestions.length === 0 && allQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">Failed to load questions.</p>
            <p className="text-gray-400 text-sm">Please check the console for errors.</p>
          </div>
        )}
        
        {!isLoading && filteredQuestions.length === 0 && allQuestions.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No questions found for the selected topic.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <LuCode className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-mono text-gray-600">{language || 'code'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {isExpanded ? 'Collapse' : 'Expand'}
          </span>
          {isExpanded ? (
            <LuChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <LuChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </button>
      {isExpanded && (
        <SyntaxHighlighter
          language={language || 'javascript'}
          style={oneLight}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
        >
          {code}
        </SyntaxHighlighter>
      )}
    </div>
  );
};

export default InterviewQuestions;

