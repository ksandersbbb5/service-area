import React from "react";
import BBBServiceAreaMap from "./BBBServiceAreaMap";
import logoUrl from "./assets/bluechatlogo.png"; // import as module so path is always correct

export default function App() {
  const styles = {
    app: {
      fontFamily: "Verdana, Geneva, sans-serif",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center", // centers the row contents
      flexWrap: "wrap",         // allows wrapping on small screens
      gap: "10px",
      padding: "10px 20px",
      borderBottom: "1px solid #ddd",
      textAlign: "center",
    },
    logo: {
      height: 50,
      width: "auto",
      // keep on left in first row
      order: 0,
    },
    // spacer mirrors the logo so the title is truly centered on wide screens
    spacer: {
      height: 50,
      width: 50,
      flex: "0 0 auto",
      order: 2,
    },
    title: {
      margin: 0,
      fontSize: "1.5rem",
      // force the title to take the full line on small screens
      flex: "1 1 100%",
      order: 1,
    },
    main: {
      textAlign: "center",
      marginTop: 20,
    },
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <img src={logoUrl} alt="BBB Logo" style={styles.logo} />
        <h1 style={styles.title}>BBB in E. MA, ME, RI & VT Service Area Map</h1>
        <div aria-hidden="true" style={styles.spacer} />
      </header>

      <main style={styles.main}>
        <BBBServiceAreaMap />
      </main>
    </div>
  );
}
