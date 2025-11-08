import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const starIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Star-icon.png",
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});
const pinIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg",
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// States info (centers and capitals)
const stateInfo = {
  MA: { name: "Massachusetts", center: [42.4072, -71.3824], capital: { name: "Boston", coords: [42.3601, -71.0589]} },
  ME: { name: "Maine", center: [45.2538, -69.4455], capital: { name: "Augusta", coords: [44.3106, -69.7795]} },
  NH: { name: "New Hampshire", center: [43.1939, -71.5724], capital: { name: "Concord", coords: [43.2081, -71.5376]} },
  RI: { name: "Rhode Island", center: [41.5801, -71.4774], capital: { name: "Providence", coords: [41.8240, -71.4128]} },
  VT: { name: "Vermont", center: [44.5588, -72.5778], capital: { name: "Montpelier", coords: [44.2601, -72.5754]} }
};

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRXoaqswBMLcSrhngyOK4xxHG_5131cdiarnJrTcfJ7YZiCFnzaGDj0z5qvTuQ5P4lB3rB_1u1EnX1h/pub?gid=2052220952&single=true&output=csv";

export default function BBBServiceAreaMap() {
  const [rows, setRows] = useState([]);
  const [zip, setZip] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(GOOGLE_SHEET_CSV_URL)
      .then(response => response.text())
      .then(data => {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: results => setRows(results.data)
        });
      });
  }, []);

  const handleSearch = () => {
    const found = rows.find(
      row => row.ZipCode && row.ZipCode.trim() === zip.trim()
    );
    if (!found) {
      setError(
        <span style={{ color: "red", fontWeight: "bold" }}>
          The {zip} is out of our service area
        </span>
      );
      setSelected(null);
    } else {
      setError("");
      setSelected({
        city: found.City,
        coords: [parseFloat(found.Lat), parseFloat(found.Lon)]
      });
    }
  };

  return (
    <div style={{ padding: "1em", maxWidth: "1200px", margin: "auto" }}>
      <div style={{ marginBottom: "1em", textAlign: "center" }}>
        <label htmlFor="zip-input" style={{ fontWeight: "bold", fontSize: "1.2em" }}>
          Enter Your Zip Code:
        </label>
        <input
          id="zip-input"
          style={{ width: "8em", margin: "0 1em", fontSize: "1em" }}
          placeholder="Zip Code"
          value={zip}
          onChange={e => setZip(e.target.value)}
        />
        <button onClick={handleSearch} style={{ padding: "0.5em 1em", fontSize: "1em" }}>
          Find Location
        </button>
      </div>
      <div style={{ margin: "1em 0", textAlign: "center", minHeight: "2em" }}>{error}</div>
      <MapContainer
        center={[43.67, -71.6]}
        zoom={6}
        style={{ height: "500px", width: "100%", margin: "auto", borderRadius: "12px", boxShadow: "0 2px 12px #aaa" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {Object.entries(stateInfo).map(([abbrev, info]) => (
          <Marker key={abbrev + "-center"} position={info.center}>
            <Popup>
              <b>{info.name}</b>
            </Popup>
          </Marker>
        ))}
        {Object.values(stateInfo).map(info => (
          <Marker key={info.capital.name + "-capital"} position={info.capital.coords} icon={starIcon}>
            <Popup>
              {info.capital.name} (Capital)
            </Popup>
          </Marker>
        ))}
        {selected && (
          <Marker position={selected.coords} icon={pinIcon}>
            <Popup>{selected.city}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
