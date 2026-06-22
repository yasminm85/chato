import React, { useState } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi"

export function Field({
  label,
  type = 'text',
  id,
  placeholder,
  icon,
  value,
  onChange,
  required,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {label && (
        <label
          className="fl-lbl"
          htmlFor={id}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {icon && (
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: .45, pointerEvents: "none" }}>
            {icon}
          </span>
        )}
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          className={`inp${icon ? ' inp-icon' : ''}`}
          value={value}
          onChange={onChange}
          required={required}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 14,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              fontSize: 18,        
              color: "#0D0C0C",
              transition: "transform 0.1s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
    </div>
  );
}
