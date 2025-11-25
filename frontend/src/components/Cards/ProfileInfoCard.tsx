import { useAuthContext } from "../../context/AuthContext";

const ProfileInfoCard = () => {
  const { user, handleLogout } = useAuthContext();

  const onClickLogout = () => {
    handleLogout();
  };

  return (
    user && (
      <div className="flex items-center">
        <img
          src={user?.profileImageUrl}
          alt="profile"
          className="w-11 h-11 bg-gray-300 rounded-full mr-3"
        />
        <div>
          <div className="text-[15px] text-black font-bold leading-3">
            {user?.fullName || ""}
          </div>
          <button
            onClick={onClickLogout}
            className="text-amber-600 text-sm font-semibold cursor-pointer hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfoCard;
