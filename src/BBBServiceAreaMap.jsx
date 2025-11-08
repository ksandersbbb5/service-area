import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Import PNG pins from local assets ---
import bluePinUrl from "./assets/pins/bbb-blue-pin.png";
import redPinUrl from "./assets/pins/red-pin.png";

// --- Create custom icons using imported URLs ---
const capitalIcon = new L.Icon({
  iconUrl: bluePinUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const selectedZipIcon = new L.Icon({
  iconUrl: redPinUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// --- New England state metadata (capitals only, NH removed) ---
const stateInfo = {
  MA: { name: "Massachusetts", capital: { name: "Boston", coords: [42.3601, -71.0589] } },
  ME: { name: "Maine", capital: { name: "Augusta", coords: [44.3106, -69.7795] } },
  RI: { name: "Rhode Island", capital: { name: "Providence", coords: [41.824, -71.4128] } },
  VT: { name: "Vermont", capital: { name: "Montpelier", coords: [44.2601, -72.5754] } },
};

// --- Google Sheet CSV data source ---
const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRXoaqswBMLcSrhngyOK4xxHG_5131cdiarnJrTcfJ7YZiCFnzaGDj0z5qvTuQ5P4lB3rB_1u1EnX1h/pub?gid=2052220952&single=true&output=csv";

export default function BBBServiceAreaMap() {
  const [rows, setRows] = useState([]);
  const [zip, setZip] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  // --- Load service area data ---
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

  // --- Handle ZIP search ---
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
    <div
      style={{
        padding: "1em",
        maxWidth: "1200px",
        margin: "auto",
        fontFamily: "Verdana, Geneva, sans-serif",
      }}
    >
      {/* ZIP search bar */}
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
        <button
          onClick={handleSearch}
          style={{
            padding: "0.5em 1em",
            fontSize: "1em",
            cursor: "pointer",
          }}
        >
          Find Location
        </button>
      </div>

      {/* Error message */}
      <div
        style={{
          margin: "1em 0",
          textAlign: "center",
          minHeight: "1.5em",
          color: error ? "#C62828" : undefined,
          fontWeight: "bold",
        }}
      >
        {error}
      </div>

      {/* Map */}
      <MapContainer
        center={[43.7, -70.5]} // middle of New England
        zoom={7}
        minZoom={6}
        maxZoom={10}
        maxBounds={[
          [40.9, -75.5], // southwest corner (around CT)
          [47.5, -66.8], // northeast corner (top of ME)
        ]}
        maxBoundsViscosity={1.0}
        style={{
          height: "500px",
          width: "100%",
          margin: "auto",
          borderRadius: "12px",
          boxShadow: "0 2px 12px #aaa",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* State capitals (BBB blue pins, NH removed) */}
        {Object.values(stateInfo).map((info) => (
          <Marker
            key={info.capital.name}
            position={info.capital.coords}
            icon={capitalIcon}
          >
            <Popup>{info.capital.name} (Capital)</Popup>
          </Marker>
        ))}

        {/* Selected ZIP (red pin) */}
        {selected && (
          <Marker position={selected.coords} icon={selectedZipIcon}>
            <Popup>{selected.city}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
