import { Link } from "react-router-dom";
import ProfileInfoCard from "../Cards/ProfileInfoCard";

const Navbar = () => {
  return (
    <div className="h-14 sm:h-16 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-2 sm:py-2.5 px-4 md:px-0 sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between gap-3 sm:gap-5">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0 flex-1">
          <Link to="/dashboard" className="min-w-0">
            <h2 className="text-base sm:text-lg md:text-xl font-medium text-black leading-5 truncate">
              Interview Prep AI
            </h2>
          </Link>
          <Link
            to="/cover-letter"
            className="text-xs sm:text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors whitespace-nowrap hidden sm:block"
          >
            Cover Letter
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/cover-letter"
            className="text-xs sm:text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors sm:hidden"
          >
            Cover Letter
          </Link>
          <ProfileInfoCard />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
