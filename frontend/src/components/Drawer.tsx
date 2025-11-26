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
    <div
      className={`fixed top-[64px] right-0 z-40 h-[calc(100vh-64px)] w-full md:w-[40vw] transform overflow-y-auto border-l border-gray-200 bg-white p-4 shadow-2xl shadow-cyan-800/10 transition-transform duration-300 ease-out ${
        isOpen
          ? "translate-x-0 pointer-events-auto"
          : "translate-x-full pointer-events-none"
      }`}
      tabIndex={-1}
      aria-labelledby="drawer-right-label"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h5
          id="drawer-right-label"
          className="flex items-center text-base font-semibold text-black"
        >
          {title}
        </h5>

        {/* Close Button */}
        <button
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center"
          onClick={onClose}
        >
          <LuX className="text-lg" />
        </button>
      </div>

      {/* Body Content */}
      <div className="mx-3 mb-6 text-sm">{children}</div>
    </div>
  );
};

export default Drawer;
