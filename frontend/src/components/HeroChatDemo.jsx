import React, { useState } from 'react';
import Btn, { C } from './Button.jsx';
export default function HeroChatDemo() {
  return (
    <div className="float-anim" style={{ position:"relative" }}>
      <div className="dm" style={{ position:"absolute", top:-28, right:24, fontSize:12, color:"#666", transform:"rotate(1.5deg)", whiteSpace:"nowrap" }}>↙ AI correction in action</div>
      <div className="nb" style={{ padding:24, background:C.white, maxWidth:460, marginLeft:"auto" }}>
        {/* header */}
        <div style={{ display:"flex", alignItems:"center", gap:12, paddingBottom:16, borderBottom:`2px solid ${C.ink}`, marginBottom:20 }}>
          <div style={{ width:40, height:40, background:C.blue, border:`2px solid ${C.ink}`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontFamily:"Space Grotesk", fontWeight:700, fontSize:13 }}>CC</div>
          <div>
            <div className="sg" style={{ fontSize:15, fontWeight:700, letterSpacing:"-.01em" }}>Chato Coach</div>
            <div className="dm" style={{ fontSize:11, color:"#777" }}>Level B2 • Active</div>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:C.green, display:"inline-block" }}/>
            <span className="dm" style={{ fontSize:10, color:"#777" }}>ONLINE</span>
          </div>
        </div>
        {/* user msg */}
        <div style={{ alignSelf:"flex-end", display:"flex", flexDirection:"column", gap:14, alignItems:"flex-end" }}>
          <div style={{ background:C.blue, color:"#fff", padding:"11px 15px", border:`2px solid ${C.ink}`, boxShadow:`3px 3px 0 ${C.ink}`, maxWidth:"82%", fontSize:14, lineHeight:1.5, alignSelf:"flex-end" }}>
            I goes to the store yesterday to buy some apples.
          </div>
          {/* ai msg */}
          <div style={{ background:C.white, padding:"11px 15px", border:`2px solid ${C.ink}`, boxShadow:`3px 3px 0 ${C.ink}`, maxWidth:"90%", display:"flex", flexDirection:"column", gap:10, alignSelf:"flex-start" }}>
            <div style={{ fontSize:14, lineHeight:1.5 }}>
              I{" "}<span style={{ background:C.yellow, padding:"0 4px", border:`1px solid ${C.ink}`, fontWeight:700 }}>went</span>{" "}to the store yesterday to buy some apples.
            </div>
            <div style={{ border:`2px dashed ${C.ink}`, background:C.yellowDim, padding:"8px 12px", display:"flex", flexDirection:"column", gap:4 }}>
              <div className="dm" style={{ fontSize:10, letterSpacing:".1em", color:C.blue, fontWeight:500 }}>✏ GRAMMAR RULE</div>
              <div style={{ fontSize:12, color:"#333", lineHeight:1.4 }}>Use <strong>"went"</strong> not "goes" — past tense for completed actions.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}