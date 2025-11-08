import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Local image-based icons ONLY (no Leaflet defaults) ---
const cacheBust = "?v=3"; // bump to force-refresh CDN/browser

const centerIcon = new L.Icon({
  iconUrl: `/gray-pin.png${cacheBust}`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  // no shadowUrl on purpose to avoid extra requests
});

const capitalIcon = new L.Icon({
  iconUrl: `/bbb-blue-pin.png${cacheBust}`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const selectedZipIcon = new L.Icon({
  iconUrl: `/red-pin.png${cacheBust}`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// --- State metadata ---
const stateInfo = {
  MA: { name: "Massachusetts", center: [42.4072, -71.3824], capital: { name: "Boston", coords: [42.3601, -71.0589]} },
  ME: { name: "Maine", center: [45.2538, -69.4455], capital: { name: "Augusta", coords: [44.3106, -69.7795]} },
  NH: { name: "New Hampshire", center: [43.1939, -71.5724], capital: { name: "Concord", coords: [43.2081, -71.5376]} },
  RI: { name: "Rhode Island", center: [41.5801, -71.4774], capital: { name: "Providence", coords: [41.8240, -71.4128]} },
  VT: { name: "Vermont", center: [44.5588, -72.5778], capital: { name: "Montpelier", coords: [44.2601, -72.5754]} }
};

// --- Data source ---
const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRXoaqswBMLcSrhngyOK4xxHG_5131cdiarnJrTcfJ7YZiCFnzaGDj0z5qvTuQ5P4lB3rB_1u1EnX1h/pub?gid=2052220952&single=true&output=csv";

export default function BBBServiceAreaMap() {
  const [rows, setRows] = useState([]);
  const [zip, setZip] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(GOOGLE_SHEET_CSV_URL)
      .then((response) => response.text())
      .then((data) => {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => setRows(results.data),
        });
      })
      .catch(() => setError("Unable to load service area data right now."));
  }, []);

  const handleSearch = () => {
    const normalizedZip = zip.trim().padStart(5, "0");
    const found = rows.find(
      (row) => row.ZipCode && row.ZipCode.trim().padStart(5, "0") === normalizedZip
    );
    if (!found) {
      setError(`The ${zip} is out of our service area`);
      setSelected(null);
    } else {
      setError("");
      setSelected({
        city: found.City,
        coords: [parseFloat(found.Lat), parseFloat(found.Lon)],
      });
    }
  };

  return (
    <div style={{ padding: "1em", maxWidth: "1200px", margin: "auto", fontFamily: "Verdana, Geneva, sans-serif" }}>
      <div style={{ marginBottom: "1em", textAlign: "center" }}>
        <label htmlFor="zip-input" style={{ fontWeight: "bold", fontSize: "1.1em" }}>
          Enter Your Zip Code:
        </label>
        <input
          id="zip-input"
          style={{ width: "8em", margin: "0 1em", fontSize: "1em" }}
          placeholder="Zip Code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} style={{ padding: "0.5em 1em", fontSize: "1em", cursor: "pointer" }}>
          Find Location
        </button>
      </div>

      <div style={{ margin: "1em 0", textAlign: "center", minHeight: "1.5em", color: error ? "#C62828" : undefined, fontWeight: "bold" }}>
        {error}
      </div>

      <MapContainer
        center={[43.67, -71.6]}
        zoom={6}
        style={{
          height: "500px",
          width: "100%",
          margin: "auto",
          borderRadius: "12px",
          boxShadow: "0 2px 12px #aaa",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* State centers: neutral gray */}
        {Object.entries(stateInfo).map(([abbrev, info]) => (
          <Marker key={abbrev + "-center"} position={info.center} icon={centerIcon}>
            <Popup>
              <b>{info.name}</b>
            </Popup>
          </Marker>
        ))}

        {/* State capitals: BBB blue */}
        {Object.values(stateInfo).map((info) => (
          <Marker key={info.capital.name + "-capital"} position={info.capital.coords} icon={capitalIcon}>
            <Popup>{info.capital.name} (Capital)</Popup>
          </Marker>
        ))}

        {/* User-selected ZIP: red */}
        {selected && (
          <Marker position={selected.coords} icon={selectedZipIcon}>
            <Popup>{selected.city}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
