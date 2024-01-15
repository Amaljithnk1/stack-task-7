import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPassword } from "../../api"; // Adjust the import based on your folder structure

const ForgotPassword = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [emailNotRegistered, setEmailNotRegistered] = useState(false);

  const onSubmit = async (formData) => {
    try {
      if (!formData || !formData.email) {
        console.error("Invalid form data:", formData);
        // Add user feedback or handle the case where formData or formData.email is undefined
        return;
      }

      setIsSubmitting(true);
      await forgotPassword(formData.email); // Pass email as a string directly
      setResetEmailSent(true);
    } catch (error) {
      console.error("Error sending reset email:", error);
      if (error.response && error.response.status === 404) {
        // If the error status is 404, email is not registered
        setEmailNotRegistered(true);
      } else {
        // Handle other errors (e.g., display a general error message to the user)
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {resetEmailSent ? (
        <p>Reset email sent successfully. Check your email for further instructions.</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            {...register("email", {
              required: "Email is required",
              pattern: /^\S+@\S+$/i,
            })}
            onChange={(e) => setValue("email", e.target.value)}
          />
          {errors.email && <p>{errors.email.message}</p>}
          
          {emailNotRegistered && <p>Email is not registered. Please check your email or sign up.</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Email"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
