import React from "react";
import BBBServiceAreaMap from "./BBBServiceAreaMap";

export default function App() {
  return (
    <div>
      <div style={{position: "relative"}}>
        <h1 style={{textAlign: "center"}}>BBB New England Service Area Map</h1>
        <img 
          src="/bluechatlogo.png" 
          alt="BBB Logo" 
          style={{
            position: "absolute",
            top: "10px",
            right: "20px",
            height: "50px",
            width: "auto"
          }}
        />
      </div>
      <BBBServiceAreaMap />
    </div>
  );
}
