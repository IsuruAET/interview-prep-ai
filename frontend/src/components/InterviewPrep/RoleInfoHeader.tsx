interface RoleInfoHeaderProps {
  role: string;
  topicsToFocus: string;
  experience: string | number;
  questions: string | number;
  description?: string;
  lastUpdated: string;
}

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  lastUpdated,
}: RoleInfoHeaderProps) => {
  return (
    <div className="bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-10">
        <div className="min-h-[150px] sm:h-[180px] md:h-[200px] flex flex-col justify-center relative z-10 py-4 sm:py-0">
          <div className="flex items-start">
            <div className="grow min-w-0 pr-4">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl sm:text-2xl font-medium truncate">
                    {role}
                  </h2>
                  <p className="text-xs sm:text-sm text-medium text-gray-900 mt-1 wrap-break-word">
                    {topicsToFocus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
            <div className="text-[9px] sm:text-[10px] font-semibold text-white bg-black px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
              Exp: {experience} {Number(experience) === 1 ? "yr" : "yrs"}
            </div>

            <div className="text-[9px] sm:text-[10px] font-semibold text-white bg-black px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
              Q: {questions}
            </div>

            <div className="text-[9px] sm:text-[10px] font-semibold text-white bg-black px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
              {lastUpdated}
            </div>
          </div>
        </div>

        <div className="hidden md:block w-[30vw] lg:w-[25vw] h-[200px] items-center justify-center bg-white overflow-hidden absolute top-0 right-0">
          <div className="w-16 h-16 bg-lime-400 blur-[65px] animate-blob1" />
          <div className="w-16 h-16 bg-teal-400 blur-[65px] animate-blob2" />
          <div className="w-16 h-16 bg-cyan-300 blur-[45px] animate-blob3" />
          <div className="w-16 h-16 bg-fuchsia-200 blur-[45px] animate-blob1" />
        </div>
      </div>
    </div>
  );
};

export default RoleInfoHeader;
