import { useState } from "react";
import { saveAs } from "file-saver";

function App() {
  const [form, setForm] = useState({
    square_footage: 2000,
    bedrooms: 3,
    bathrooms: 2,
    windows: 10,
    doors: 5,
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const handleEstimate = async () => {
    const res = await fetch("https://homebuilder-api.onrender.com/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult(data);
  };

  const handleExport = () => {
    if (!result) return;
    const content = [
      "MATERIALS:",
      ...Object.entries(result.materials).map(
        ([k, v]) => `${k}: $${v.toFixed(2)}`
      ),
      "",
      "LABOR:",
      ...Object.entries(result.labor).map(
        ([k, v]) => `${k}: $${v.toFixed(2)}`
      ),
      "",
      `TOTAL: $${result.total_cost.toFixed(2)}`,
      "",
      "SCHEDULE:",
      ...result.schedule,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "estimate.txt");
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 24 }}>
      <h1>Home Builder Estimator</h1>
      {Object.entries(form).map(([key, val]) => (
        <div key={key} style={{ marginBottom: 10 }}>
          <label>{key.replace("_", " ")}:</label>
          <input
            type="number"
            name={key}
            value={val}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
      ))}
      <button onClick={handleEstimate} style={{ width: "100%", padding: 12 }}>
        Estimate
      </button>

      {result && (
        <div style={{ marginTop: 24 }}>
          <h2>Materials</h2>
          <ul>
            {Object.entries(result.materials).map(([k, v]) => (
              <li key={k}>
                {k}: ${v.toFixed(2)}
              </li>
            ))}
          </ul>
          <h2>Labor</h2>
          <ul>
            {Object.entries(result.labor).map(([k, v]) => (
              <li key={k}>
                {k}: ${v.toFixed(2)}
              </li>
            ))}
          </ul>
          <h2>Schedule</h2>
          <ul>
            {result.schedule.map((task, i) => (
              <li key={i}>{task}</li>
            ))}
          </ul>
          <button onClick={handleExport}>Export Estimate</button>
        </div>
      )}
    </div>
  );
}

export default App;
