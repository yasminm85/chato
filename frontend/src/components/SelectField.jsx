import React from "react"

export function SelectField({ label, id, opts, value, onChange, }) {
  return (
    <div>
      {label && <label className="fl-lbl" htmlFor={id}>{label}</label>}
      <div style={{ position:"relative" }}>
        <select 
          id={id} 
          name={id} 
          value={value} 
          onChange={onChange} 
          className="inp" 
          style={{ appearance:"none", cursor:"pointer", paddingRight:36 }}
        >
          {opts.map(o => <option key={o.v} value={o.v} disabled={o.d}>{o.l}</option>)}
        </select>
        <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", fontSize:12 }}>▾</span>
      </div>
    </div>
  )
}