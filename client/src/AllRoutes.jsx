// AllRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home/Home";
import Auth from "./Pages/Auth/Auth";
import Questions from "./Pages/Questions/Questions";
import AskQuestion from "./Pages/AskQuestion/AskQuestion";
import DisplayQuestion from "./Pages/Questions/DisplayQuestion";
import Tags from "./Pages/Tags/Tags";
import Users from "./Pages/Users/Users";
import UserProfile from "./Pages/UserProfile/UserProfile";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import PublicSpace from "./Pages/PublicSpace/PublicSpace"; // Add the import statement

const AllRoutes = ({ slideIn, handleSlideIn }) => {
  return (
    <Routes>
      <Route path="/" element={<Home slideIn={slideIn} handleSlideIn={handleSlideIn} />} />
      <Route path="/Auth" element={<Auth />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/AskQuestion" element={<AskQuestion />} />
      <Route path="/Questions" element={<Questions slideIn={slideIn} handleSlideIn={handleSlideIn} />} />
      <Route path="/Questions/:id" element={<DisplayQuestion slideIn={slideIn} handleSlideIn={handleSlideIn} />} />
      <Route path="/Tags" element={<Tags slideIn={slideIn} handleSlideIn={handleSlideIn} />} />
      <Route path="/Users" element={<Users slideIn={slideIn} handleSlideIn={handleSlideIn} />} />
      <Route path="/Users/:id" element={<UserProfile slideIn={slideIn} handleSlideIn={handleSlideIn} />} />

      {/* Add the new route for PublicSpace */}
      <Route path="/PublicSpace" element={<PublicSpace slideIn={slideIn} handleSlideIn={handleSlideIn} />} />
    </Routes>
  );
};

export default AllRoutes;
