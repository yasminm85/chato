export const Header = ({ isEmailSent, isOtpSubmited }) => (
  <div style={{ textAlign: "center" }}>
    <h1 className="sg" style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 6 }}>
      Reset Password
    </h1>
    <p style={{ color: "#555", fontSize: 15 }}>
      {!isEmailSent && "Enter your email to receive an OTP code."}
      {isEmailSent && !isOtpSubmited && "Enter the 6-digit code sent to your email."}
      {isEmailSent && isOtpSubmited && "Create a new strong password."}
    </p>
  </div>
);