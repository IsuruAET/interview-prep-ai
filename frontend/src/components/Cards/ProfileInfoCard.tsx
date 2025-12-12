import { useAuthContext } from "../../context/AuthContext";

const ProfileInfoCard = () => {
  const { user, handleLogout } = useAuthContext();

  const onClickLogout = () => {
    handleLogout();
  };

  return (
    user && (
      <div className="flex items-center gap-2 sm:gap-3">
        <img
          src={user?.profileImageUrl}
          alt="profile"
          className="w-9 h-9 sm:w-11 sm:h-11 bg-gray-300 rounded-full shrink-0"
        />
        <div className="hidden sm:block min-w-0">
          <div className="text-sm sm:text-[15px] text-black font-bold leading-3 truncate max-w-[120px] md:max-w-none">
            {user?.fullName || ""}
          </div>
          <button
            onClick={onClickLogout}
            className="text-amber-600 text-xs sm:text-sm font-semibold cursor-pointer hover:underline"
          >
            Logout
          </button>
        </div>
        <button
          onClick={onClickLogout}
          className="text-amber-600 text-xs font-semibold cursor-pointer hover:underline sm:hidden"
          title="Logout"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default ProfileInfoCard;
