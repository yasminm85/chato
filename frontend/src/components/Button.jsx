import React from "react"

export const C = {
  paper:"#FAFAF8", ink:"#0D0C0C", blue:"#1933CC", bluePale:"#D6DCFF",
  yellow:"#FFE04B", yellowDim:"#FFF9D4", gray:"#E8E4DC", grayMid:"#B8B2AA",
  green:"#00C27C", white:"#FFFFFF"
}

export default function Btn({ children, v="blue", sz="md", onClick, full, style }) {
  return (
    <button className={`btn btn-${v} btn-${sz}`} onClick={onClick}
      style={{ width: full ? "100%" : undefined, ...style }}>{children}</button>
  )
}

