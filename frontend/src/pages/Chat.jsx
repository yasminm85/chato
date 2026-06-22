import { useState, useEffect, useRef } from "react"

const C = {
  paper:"#FAFAF8", ink:"#0D0C0C", blue:"#1933CC", bluePale:"#D6DCFF",
  yellow:"#FFE04B", yellowDim:"#FFF9D4", gray:"#E8E4DC", grayMid:"#B8B2AA",
  green:"#00C27C", white:"#FFFFFF"
}

const CSS = `

`

/* ======== ATOMS ======== */







/* ======== LAYOUT SHELLS ======== */



/* ======== LANDING ======== */





/* ======== LOGIN ======== */



/* ======== SIGNUP ======== */



/* ======== CHAT ======== */

const INIT_MSGS = [
  {id:1,from:"user",text:"I goes to the store yesterday to buy some apples."},
  {id:2,from:"ai",text:"I went to the store yesterday to buy some apples.",rule:'Use past tense "went" — not "goes" — for completed past actions.'},
  {id:3,from:"them",name:"Sarah M.",text:"Oh interesting! What kind of apples?"},
  {id:4,from:"user",text:"I bought Fuji apples and some vegetables for dinner."},
]



/* ======== APP ROOT ======== */

export default function App() {
  const [page, setPage] = useState("landing")
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {page === "landing" && <><Navbar setPage={setPage}/><LandingPage setPage={setPage}/><Footer /></>}
      {page === "login"   && <LoginPage setPage={setPage}/>}
      {page === "signup"  && <SignupPage setPage={setPage}/>}
      {page === "chat"    && <ChatPage setPage={setPage}/>}
    </>
  )
}