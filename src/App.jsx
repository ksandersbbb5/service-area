import React from "react";
import BBBServiceAreaMap from "./BBBServiceAreaMap";
import "./index.css"; // make sure this is imported so Verdana applies globally

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <img
          src="/bluechatlogo.png"
          alt="BBB Logo"
          className="bbb-logo"
        />
        <h1 className="app-title">
          BBB in E. MA, ME, RI & VT Service Area Map
        </h1>
      </header>

      <main className="app-main">
        <BBBServiceAreaMap />
      </main>
    </div>
  );
}
