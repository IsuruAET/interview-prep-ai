// import { useNavigate } from "react-router-dom";
import heroImg from "../assets/images/hero-img.png";
import { APP_FEATURES } from "../utils/data";
import { useState } from "react";
import { LuSparkles } from "react-icons/lu";
import Modal from "../components/Modal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";

const LandingPage = () => {
  // const navigate = useNavigate();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {};

  return (
    <>
      <div className="w-full min-h-full bg-[#FFFCEF]">
        <div className="w-[500px] h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0" />

        <div className="container mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-24 sm:pb-[200px] relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-8 sm:mb-16 gap-4">
            <div className="text-lg sm:text-xl text-black font-bold truncate">
              Interview Prep AI
            </div>

            <button
              className="bg-linear-to-r from-[#FF9324] to-[#E99A4B] text-xs sm:text-sm font-semibold text-white px-4 sm:px-7 py-2 sm:py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
              onClick={() => setOpenAuthModal(true)}
            >
              <span className="hidden sm:inline">Login / Sign Up</span>
              <span className="sm:hidden">Login</span>
            </button>
          </header>

          {/* Hero Content */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0">
            <div className="w-full md:w-1/2 md:pr-4">
              <div className="flex items-center justify-left mb-3 sm:mb-2">
                <div className="flex items-center gap-2 text-xs sm:text-[13px] text-amber-600 font-semibold bg-amber-100 px-2 sm:px-3 py-1 rounded-full border border-amber-300">
                  <LuSparkles className="text-sm" /> AI Powered
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl text-black font-medium mb-4 sm:mb-6 leading-tight">
                Ace Interviews with <br />
                <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,#FF9324_0%,#FCD760_100%)] bg-size-[200%_200%] animate-text-shine font-semibold">
                  AI-Powered
                </span>{" "}
                Learning
              </h1>
            </div>

            <div className="w-full md:w-1/2">
              <p className="text-sm sm:text-base md:text-[17px] text-gray-900 md:mr-20 mb-4 sm:mb-6 leading-relaxed">
                Get role-specific questions, expand answers when you need them,
                dive deeper into concepts, and organize everything your way.
                From preparation to mastery - your ultimate interview toolkit is
                here.
              </p>

              <button
                className="bg-black text-xs sm:text-sm font-semibold text-white px-5 sm:px-7 py-2 sm:py-2.5 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer w-full sm:w-auto"
                onClick={handleCTA}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full min-h-full relative z-10">
        <div>
          <section className="flex items-center justify-center -mt-20 sm:-mt-32 md:-mt-36 px-4">
            <img
              src={heroImg}
              alt="Hero Image"
              className="w-full max-w-[90vw] sm:max-w-[80vw] rounded-xl border border-amber-300"
            />
          </section>
        </div>

        <div className="w-full min-h-full bg-[#FFFCEF] mt-6 sm:mt-10">
          <div className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-12 sm:pb-20">
            <section className="mt-5">
              <h2 className="text-xl sm:text-2xl font-medium text-center mb-8 sm:mb-12">
                Features That Make You Shine
              </h2>

              <div className="flex flex-col items-center gap-6 sm:gap-8">
                {/* First 3 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full">
                  {APP_FEATURES.slice(0, 3).map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-[#FFFEF8] p-4 sm:p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                    >
                      <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Remaining 2 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl">
                  {APP_FEATURES.slice(3, 5).map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-[#FFFEF8] p-4 sm:p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                    >
                      <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="text-xs sm:text-sm bg-gray-50 text-secondary text-center p-4 sm:p-5 mt-5">
          Made with ❤️... Happy Coding
        </div>
      </div>

      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" ? (
            <Login setCurrentPage={setCurrentPage} />
          ) : (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;
