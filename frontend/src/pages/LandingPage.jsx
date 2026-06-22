import React, {useState, useEffect} from "react";
import Btn, {C} from '../components/Button.jsx';
import HeroChatDemo from '../components/HeroChatDemo.jsx';
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <div>
      {/* HERO */}
      <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", borderBottom:`3px solid ${C.ink}`, overflow:"hidden" }}>

        {/* layer 1 — ghost letterform */}
        <div className="prlx" style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", zIndex:0, transform:`translateY(${scrollY*0.35}px)` }}>
          <div className="sg" style={{ fontSize:"clamp(140px,24vw,310px)", fontWeight:800, color:"transparent", WebkitTextStroke:"2px rgba(13,12,12,0.055)", letterSpacing:"-.04em", userSelect:"none", lineHeight:1, whiteSpace:"nowrap" }}>CHATO</div>
        </div>

        {/* layer 2 — geometric deco */}
        <div className="prlx" style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:1, transform:`translateY(${scrollY*0.15}px)` }}>
          <div style={{ position:"absolute", top:"8%", right:"4%", width:180, height:180, backgroundImage:"radial-gradient(circle,rgba(13,12,12,.2) 1.5px,transparent 1.5px)", backgroundSize:"18px 18px" }}/>
          <div style={{ position:"absolute", bottom:"22%", right:"18%", width:60, height:60, border:`3px solid ${C.blue}`, transform:"rotate(15deg)", opacity:.25 }}/>
          <div style={{ position:"absolute", top:"62%", right:"6%", width:42, height:42, border:`3px solid ${C.yellow}`, borderRadius:"50%", opacity:.7 }}/>
          <div style={{ position:"absolute", bottom:"5%", left:"2%", width:120, height:120, backgroundImage:"radial-gradient(circle,rgba(13,12,12,.12) 1.5px,transparent 1.5px)", backgroundSize:"16px 16px" }}/>
          <div style={{ position:"absolute", top:"14%", left:"3%", width:32, height:32, background:C.yellow, border:`2px solid ${C.ink}`, transform:"rotate(-8deg)", opacity:.5 }}/>
        </div>

        {/* layer 3 — content */}
        <div className="prlx" style={{ position:"relative", zIndex:2, width:"100%", padding:"0 40px", transform:`translateY(${scrollY*0.05}px)` }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center", padding:"100px 0 80px" }}>
            {/* left */}
            <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
              <div className="tag" style={{ alignSelf:"flex-start" }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:C.ink, display:"inline-block", flexShrink:0 }}/>
                FUN LEARNING WITH CHATO
              </div>
              <h1 className="sg" style={{ fontSize:"clamp(42px,5.5vw,78px)", fontWeight:800, lineHeight:1.02, letterSpacing:"-.04em" }}>
                Chat with the<br/>World, <span className="hl">Perfectly.</span>
              </h1>
              <p style={{ fontSize:17, lineHeight:1.65, color:"#4A4A4A", maxWidth:460 }}>
                Connect with friends across the globe while effortlessly improving your English. Have fun conversations while our AI provides helpful, unobtrusive grammar tips.
              </p>
              <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                <Btn sz="lg" onClick={() => navigate("/signup")}>Try for Free →</Btn>
                <Btn v="ghost" sz="lg" onClick={() => navigate("/login")}>Sign In</Btn>
              </div>
              <div style={{ display:"flex", gap:32, borderTop:`3px solid ${C.ink}`, paddingTop:24 }}>
                {[{n:"50K+",l:"ACTIVE CHATTERS"},{n:"120+",l:"COUNTRIES"},{n:"B2→C1",l:"AVG PROGRESS"}].map(s => (
                  <div key={s.n}>
                    <div className="sg" style={{ fontSize:26, fontWeight:800, lineHeight:1, letterSpacing:"-.02em" }}>{s.n}</div>
                    <div className="dm" style={{ fontSize:10, color:"#888", marginTop:4, letterSpacing:".05em" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* right */}
            <HeroChatDemo />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:"80px 40px", borderBottom:`3px solid ${C.ink}` }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div className="dm" style={{ fontSize:11, letterSpacing:".1em", color:C.blue, marginBottom:12 }}></div>
            <h2 className="sg" style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:800, letterSpacing:"-.03em", lineHeight:1.1 }}>Connect and Chat</h2>
            <p style={{ fontSize:17, color:"#555", marginTop:16, maxWidth:480, margin:"16px auto 0", lineHeight:1.6 }}>
              Meet new people or catch up with friends, all while getting helpful AI tips to perfect your English.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:20 }}>
            {[
              { icon:"⇌", title:"Random Matching", desc:"Let our system pair you with interesting people from around the world for spontaneous conversations.", bg:C.yellow },
              { icon:"◎", title:"Online Friends", desc:"Easily see who is online and start chatting with your existing friends instantly.", bg:C.white },
              { icon:"✎", title:"AI Corrections", desc:"Receive subtle, non-intrusive grammar tips mid-conversation that help you improve naturally.", bg:C.bluePale },
              { icon:"◈", title:"Track Progress", desc:"See your improvement over time with clear metrics on grammar accuracy and vocabulary range.", bg:C.white },
            ].map((f,i) => (
              <div key={i} className="nb" style={{ padding:32, background:f.bg }}>
                <div className="sg" style={{ fontSize:30, marginBottom:16 }}>{f.icon}</div>
                <h3 className="sg" style={{ fontSize:20, fontWeight:700, letterSpacing:"-.02em", marginBottom:10 }}>{f.title}</h3>
                <p style={{ fontSize:15, color:"#444", lineHeight:1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"80px 40px", background:C.ink }}>
        <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center", display:"flex", flexDirection:"column", gap:32, alignItems:"center" }}>
          <h2 className="sg" style={{ fontSize:"clamp(36px,5vw,64px)", fontWeight:800, letterSpacing:"-.03em", lineHeight:1.06, color:C.paper }}>
            Ready to chat with the world,{" "}<span style={{ color:C.yellow }}>perfectly?</span>
          </h2>
          <Btn v="yellow" sz="lg" onClick={() => navigate("/signup")}>Create Free Account →</Btn>
        </div>
      </section>
    </div>
  )
}