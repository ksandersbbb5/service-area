import React from "react";
import BBBServiceAreaMap from "./BBBServiceAreaMap";
import logoUrl from "./assets/bluechatlogo.png"; // imported as module

export default function App() {
  const styles = {
    app: { fontFamily: "Verdana, Geneva, sans-serif" },
    header: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px 20px",
      borderBottom: "1px solid #ddd",
    },
    logo: {
      position: "absolute",
      left: 20,
      top: 10,
      height: 50,
      width: "auto",
    },
    title: {
      margin: 0,
      fontSize: "1.5rem",
      textAlign: "center",
    },
    main: { textAlign: "center", marginTop: 20 },
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <img src={logoUrl} alt="BBB Logo" style={styles.logo} />
        <h1 style={styles.title}>BBB in E. MA, ME, RI & VT Service Area Map</h1>
      </header>
      <main style={styles.main}>
        <BBBServiceAreaMap />
      </main>
    </div>
  );
}
