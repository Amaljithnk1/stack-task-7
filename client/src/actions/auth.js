import * as api from "../api";
import { setCurrentUser } from "./currentUser";
import { fetchAllUsers } from "./users";

export const signup = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(authData);
    dispatch({ type: "AUTH", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
    dispatch(fetchAllUsers());
    navigate("/");
  } catch (error) {
    console.error("Error during signup:", error);
  }
};

export const login = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.logIn(authData);
    dispatch({ type: "AUTH", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
    navigate("/");
  } catch (error) {
    console.error("Error during login:", error);
  }
};

// Use forgotPassword and resetPassword to resolve the warning
export const forgotPasswordAction = (email) => async (dispatch) => {
  try {
    await api.forgotPassword(email);
    // Handle success or dispatch additional actions if needed
  } catch (error) {
    console.error("Error during forgot password:", error);
    // Handle error (e.g., display an error message to the user)
  }
};

export const resetPasswordAction = (token, newPassword) => async (dispatch) => {
  try {
    await api.resetPassword(token, newPassword);
    // Handle success or dispatch additional actions if needed
  } catch (error) {
    console.error("Error during password reset:", error);
    // Handle error (e.g., display an error message to the user)
  }
};
