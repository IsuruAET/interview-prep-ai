import { LuX } from "react-icons/lu";

const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed top-[56px] sm:top-[64px] right-0 z-40 h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] w-full sm:w-[90vw] md:w-[40vw] lg:w-[35vw] max-w-md md:max-w-none transform overflow-y-auto border-l border-gray-200 bg-white p-3 sm:p-4 shadow-2xl shadow-cyan-800/10 transition-transform duration-300 ease-out ${
          isOpen
            ? "translate-x-0 pointer-events-auto"
            : "translate-x-full pointer-events-none"
        }`}
        tabIndex={-1}
        aria-labelledby="drawer-right-label"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h5
            id="drawer-right-label"
            className="flex items-center text-sm sm:text-base font-semibold text-black truncate pr-2"
          >
            {title}
          </h5>

          {/* Close Button */}
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center shrink-0"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <LuX className="text-lg" />
          </button>
        </div>

        {/* Body Content */}
        <div className="mx-1 sm:mx-3 mb-6 text-xs sm:text-sm">{children}</div>
      </div>
    </>
  );
};

export default Drawer;
