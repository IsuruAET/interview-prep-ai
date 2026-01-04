import { useState, useEffect } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { useGetUserInfo, useUpdateProfileDescription } from "../hooks/useAuth";
import { useGenerateCoverLetter } from "../hooks/useAI";
import ButtonSpinner from "../components/Loader/ButtonSpinner";
import { LuCopy, LuCheck } from "react-icons/lu";
import toast from "react-hot-toast";

const CoverLetter = () => {
  const { data: user } = useGetUserInfo();
  const updateProfile = useUpdateProfileDescription();
  const generateCoverLetter = useGenerateCoverLetter();

  const [profileDescription, setProfileDescription] = useState(
    () => user?.profileDescription || ""
  );
  const [companyDescription, setCompanyDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [matchPercentage, setMatchPercentage] = useState<number | null>(null);
  const [matchSummary, setMatchSummary] = useState("");
  const [copied, setCopied] = useState(false);

  // Load saved profile description
  useEffect(() => {
    if (user?.profileDescription) {
      // Defer state update to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setProfileDescription((prev) =>
          prev !== user.profileDescription
            ? user.profileDescription || prev
            : prev
        );
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [user?.profileDescription]);

  const handleSaveProfile = async () => {
    if (!profileDescription.trim()) {
      toast.error("Profile description cannot be empty");
      return;
    }

    try {
      await updateProfile.mutateAsync({ profileDescription });
      toast.success("Profile saved successfully!");
    } catch {
      // Error is handled by the hook
    }
  };

  const handleGenerate = async () => {
    if (!profileDescription.trim()) {
      toast.error("Please save your profile description first");
      return;
    }

    if (!companyDescription.trim()) {
      toast.error("Please enter company description");
      return;
    }

    try {
      const result = await generateCoverLetter.mutateAsync({
        companyDescription,
      });
      setCoverLetter(result.coverLetter);
      setMatchPercentage(result.matchPercentage);
      setMatchSummary(result.matchSummary);
    } catch {
      // Error is handled by the hook
    }
  };

  const handleCopy = async () => {
    if (!coverLetter) return;

    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      toast.success("Cover letter copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy cover letter");
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-4 px-4 sm:px-6 md:px-0">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-2">
            Cover Letter Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 mb-4 sm:mb-6">
            Save your profile once, then generate personalized cover letters for
            any company
          </p>

          <div className="space-y-4 sm:space-y-6">
            {/* Profile Description Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-black mb-2">
                Your Profile Description
              </h2>
              <p className="text-xs text-slate-600 mb-3 sm:mb-4">
                Enter your skills, experience, and background. This will be
                saved and used for all cover letter generations.
              </p>
              <textarea
                value={profileDescription}
                onChange={(e) => setProfileDescription(e.target.value)}
                placeholder="e.g., I am a Full Stack Developer with 5 years of experience in React, Node.js, and TypeScript. I have worked on multiple projects including e-commerce platforms and SaaS applications..."
                className="w-full min-h-[120px] sm:min-h-[150px] md:min-h-[200px] p-3 sm:p-4 text-xs sm:text-sm text-black bg-gray-50/50 rounded border border-gray-100 outline-none focus:border-orange-300 resize-y custom-scrollbar"
                disabled={updateProfile.isPending}
              />
              <button
                onClick={handleSaveProfile}
                disabled={updateProfile.isPending}
                className="btn-primary mt-4"
              >
                {updateProfile.isPending ? (
                  <>
                    <ButtonSpinner />
                    SAVING...
                  </>
                ) : (
                  "SAVE PROFILE"
                )}
              </button>
            </div>

            {/* Company Description Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-black mb-2">
                Company & Job Requirements
              </h2>
              <p className="text-xs text-slate-600 mb-3 sm:mb-4">
                Paste the job description, company information, and requirements
                here
              </p>
              <textarea
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                placeholder="e.g., We are looking for a Senior Full Stack Developer with experience in React, Node.js, and MongoDB. The ideal candidate should have 3+ years of experience in building scalable web applications..."
                className="w-full min-h-[120px] sm:min-h-[150px] md:min-h-[200px] p-3 sm:p-4 text-xs sm:text-sm text-black bg-gray-50/50 rounded border border-gray-100 outline-none focus:border-orange-300 resize-y custom-scrollbar"
                disabled={generateCoverLetter.isPending}
              />
              <button
                onClick={handleGenerate}
                disabled={
                  generateCoverLetter.isPending ||
                  !profileDescription.trim() ||
                  !companyDescription.trim()
                }
                className="btn-primary mt-4"
              >
                {generateCoverLetter.isPending ? (
                  <>
                    <ButtonSpinner />
                    GENERATING...
                  </>
                ) : (
                  "GENERATE COVER LETTER"
                )}
              </button>
            </div>

            {/* Generated Cover Letter Section */}
            {coverLetter && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6">
                {/* Match Analysis Section */}
                {matchPercentage !== null && (
                  <div className="mb-4 sm:mb-6 p-4 bg-linear-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3">
                      <h3 className="text-sm sm:text-base font-semibold text-black">
                        Job Match Analysis
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                          {matchPercentage}%
                        </div>
                        <div className="w-24 sm:w-32 h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              matchPercentage >= 80
                                ? "bg-green-500"
                                : matchPercentage >= 60
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${matchPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    {matchSummary && (
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {matchSummary}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                  <h2 className="text-base sm:text-lg font-semibold text-black truncate">
                    Generated Cover Letter
                  </h2>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-black rounded-md hover:bg-orange-600/15 hover:text-black transition-colors shrink-0"
                  >
                    {copied ? (
                      <>
                        <LuCheck
                          size={16}
                          className="sm:w-[18px] sm:h-[18px]"
                        />
                        <span className="hidden sm:inline">Copied!</span>
                      </>
                    ) : (
                      <>
                        <LuCopy size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-xs sm:text-sm text-slate-700 leading-relaxed p-3 sm:p-4 bg-gray-50/50 rounded border border-gray-100 custom-scrollbar max-h-[400px] sm:max-h-[500px] md:max-h-[600px] overflow-y-auto">
                    {coverLetter}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoverLetter;
