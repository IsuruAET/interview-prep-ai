import { Link } from "react-router-dom";
import ProfileInfoCard from "../Cards/ProfileInfoCard";

const Navbar = () => {
  return (
    <div className="h-16 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-2.5 px-4 md:px-0 sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between gap-5">
        <div className="flex items-center gap-6">
          <Link to="/dashboard">
            <h2 className="text-lg md:text-xl font-medium text-black leading-5">
              Interview Prep AI
            </h2>
          </Link>
          <Link
            to="/cover-letter"
            className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors"
          >
            Cover Letter
          </Link>
        </div>

        <ProfileInfoCard />
      </div>
    </div>
  );
};

export default Navbar;
