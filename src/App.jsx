import React from "react";
import BBBServiceAreaMap from "./BBBServiceAreaMap";

export default function App() {
  return (
    <div>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <img
          src="/bluechatlogo.png"
          alt="BBB Logo"
          style={{ height: "50px" }}
        />
        <h1
          style={{
            flexGrow: 1,
            textAlign: "center",
            margin: 0,
            fontSize: "1.5rem",
          }}
        >
          BBB in E. MA, ME, RI & VT Service Area Map
        </h1>
        {/* Spacer div to balance layout */}
        <div style={{ width: "50px" }}></div>
      </header>

      <main style={{ textAlign: "center", marginTop: "20px" }}>
        <BBBServiceAreaMap />
      </main>
    </div>
  );
}
