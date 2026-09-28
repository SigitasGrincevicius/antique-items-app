import { apiSlice } from "../../api/apiSlice";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";

function LogoutButton() {
   const dispatch = useAppDispatch();

   function handleLogout() {
      dispatch(logout()); // Clear the user and token
      dispatch(apiSlice.util.resetApiState()); // Clear cached API data
   }

   return <button onClick={handleLogout}>Log out</button>
}

export default LogoutButton;