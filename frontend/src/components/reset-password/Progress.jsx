import Btn, { C } from '../Button.jsx';

export const ProgressBar = ({ currentStep }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
    {[1, 2, 3].map((s) => (
      <div key={s} style={{
        height: 6, width: 32, borderRadius: 10,
        background: s === currentStep ? C.blue : s < currentStep ? C.green : "#E0E0E0",
        transition: "background 0.3s ease"
      }} />
    ))}
  </div>
);