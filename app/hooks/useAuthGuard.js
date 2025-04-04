import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

/**
 * Custom hook to protect routes that require authentication
 * @param {boolean} redirectIfAuth - If true, redirects to Home if authenticated (for auth pages)
 * @returns {boolean} isAuthenticated - Whether the user is authenticated
 */
const useAuthGuard = (redirectIfAuth = false) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigation = useNavigation();

  useEffect(() => {
    if (redirectIfAuth) {
      // For auth screens - redirect to Home if already authenticated
      if (isAuthenticated) {
        navigation.navigate("Main");
      }
    } else {
      // For protected screens - redirect to Auth if not authenticated
      if (!isAuthenticated) {
        navigation.navigate("Auth");
      }
    }
  }, [isAuthenticated, navigation, redirectIfAuth]);

  return isAuthenticated;
};

export default useAuthGuard;
