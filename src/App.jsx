import React from "react";
import BBBServiceAreaMap from "./BBBServiceAreaMap";

export default function App() {
  return (
    <div>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 20px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <img
          src="/bluechatlogo.png"
          alt="BBB Logo"
          style={{ height: "50px", marginRight: "15px" }}
        />
        <h1 style={{ margin: 0 }}>BBB New England Service Area Map</h1>
      </header>

      <main style={{ textAlign: "center", marginTop: "20px" }}>
        <BBBServiceAreaMap />
      </main>
    </div>
  );
}
