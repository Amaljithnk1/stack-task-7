// ResetPassword.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { resetPassword } from "../../api";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {

      setIsSubmitting(true);
      await resetPassword(token, data.newPassword);
      setResetSuccess(true);
      // Reset the form after successful submission
      reset();
    } catch (error) {
      console.error("Error resetting password:", error);
      // Handle error (e.g., display an error message to the user)
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div>
      <h2>Reset Password</h2>
      {resetSuccess ? (
        <p>Password reset successfully. You can now log in with your new password.</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            {...register("newPassword", {
              required: "New password is required",
            })}
          />
          {errors.newPassword && <p>{errors.newPassword.message}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
