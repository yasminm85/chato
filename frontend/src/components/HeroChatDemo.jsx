import React, { useState } from 'react';
import Btn, { C } from './Button.jsx';
export default function HeroChatDemo() {
  return (
    <div className="float-anim" style={{ position:"relative" }}>
      <div className="nb" style={{ padding:24, background:C.white, maxWidth:460, marginLeft:"auto" }}>
        
        <div style={{ alignSelf:"flex-end", display:"flex", flexDirection:"column", gap:14, alignItems:"flex-end" }}>
          <div style={{ background:C.blue, color:"#fff", padding:"11px 15px", border:`2px solid ${C.ink}`, boxShadow:`3px 3px 0 ${C.ink}`, maxWidth:"82%", fontSize:14, lineHeight:1.5, alignSelf:"flex-end" }}>
            I goes to the store yesterday to buy some apples.
          </div>

          <div style={{ background:C.white, padding:"11px 15px", border:`2px solid ${C.ink}`, boxShadow:`3px 3px 0 ${C.ink}`, maxWidth:"90%", display:"flex", flexDirection:"column", gap:10, alignSelf:"flex-start" }}>
            <div style={{ fontSize:14, lineHeight:1.5 }}>
              I{" "}<span style={{ background:C.yellow, padding:"0 4px", border:`1px solid ${C.ink}`, fontWeight:700 }}>went</span>{" "}to the store yesterday to buy some apples.
            </div>
            <div style={{ border:`2px dashed ${C.ink}`, background:C.yellowDim, padding:"8px 12px", display:"flex", flexDirection:"column", gap:4 }}>
              <div className="dm" style={{ fontSize:10, letterSpacing:".1em", color:C.blue, fontWeight:500 }}>GRAMMAR RULE</div>
              <div style={{ fontSize:12, color:"#333", lineHeight:1.4 }}>Use <strong>"went"</strong> not "goes" — past tense for completed actions.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}