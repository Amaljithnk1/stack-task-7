import axios from "axios";

const getTextColorBasedOnBackground = (backgroundColor) => {
  const rgb = parseInt(backgroundColor.substring(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 128 ? "dark" : "light";
};

const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("Profile")) {
    req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem("Profile")).token}`;
  }
  return req;
});

export const logIn = (authData) => API.post("/user/login", authData);
export const signUp = (authData) => API.post("/user/signup", authData);

// New function for forgot password
export const forgotPassword = (email) => API.post("/user/forgotpassword", { email: email });


// New function for reset password
export const resetPassword = (token, newPassword) => API.post(`/user/resetpassword/${token}`, { newPassword: newPassword });

// Existing functions for Q5, Q11, Q12
export const postQuestion = (questionData) => API.post("/questions/Ask", questionData);
export const getAllQuestions = () => API.get("/questions/get");
export const deleteQuestion = (id) => API.delete(`/questions/delete/${id}`);
export const voteQuestion = (id, value) => API.patch(`/questions/vote/${id}`, { value });
export const postAnswer = (id, noOfAnswers, answerBody, userAnswered) =>
  API.patch(`/answer/post/${id}`, { noOfAnswers, answerBody, userAnswered });
export const deleteAnswer = (id, answerId, noOfAnswers) =>
  API.patch(`/answer/delete/${id}`, { answerId, noOfAnswers });
export const getAllUsers = () => API.get("/user/getAllUsers");
export const updateProfile = (id, updateData) =>
  API.patch(`/user/update/${id}`, updateData);
export const getLoginHistory = (userId) => API.get(`/user/${userId}/login-history`);

// New weather-related functions
export const getWeather = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=b1bbd8b3263f772003ed78cea79bfdef&q=${latitude},${longitude}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
};

export const fetchUserDataWithWeather = async (userId) => {
  try {
    const userResponse = await API.get(`/user/${userId}`);
    const weatherResponse = await getWeather(
      userResponse.data.latitude,
      userResponse.data.longitude
    );

    const textColor = getTextColorBasedOnBackground(weatherResponse.current.condition.rgb);
    

    return { user: userResponse.data, weather: weatherResponse, textColor };
  } catch (error) {
    console.error("Error fetching user data with weather:", error);
    throw error;
  }
};

// New function for reset password email
export const sendResetEmail = (email) => API.post("/user/send-reset-email", { email });

export default API;
