import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./Calendar.css";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad = (n) => String(n).padStart(2, "0");

function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [entries, setEntries] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [outfitId, setOutfitId] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const monthKey = `${year}-${pad(month + 1)}`;

  const loadEntries = async () => {
    try {
      const res = await api.get(`/api/calendar?month=${monthKey}`);
      setEntries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    api
      .get("/api/outfits")
      .then((res) => setOutfits(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    loadEntries();
    setSelectedDate(null);
  }, [monthKey]);

  const entryByDate = {};
  entries.forEach((e) => {
    entryByDate[e.date] = e;
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const goPrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const goNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleSelectDay = (day) => {
    const dateStr = `${monthKey}-${pad(day)}`;
    const existing = entryByDate[dateStr];
    setSelectedDate(dateStr);
    setOutfitId(existing?.outfit?._id || "");
    setNote(existing?.note || "");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!outfitId) {
      setError("Please choose an outfit for this day.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/api/calendar", {
        outfit: outfitId,
        date: selectedDate,
        note,
      });
      await loadEntries();
      setSelectedDate(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save plan");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    const existing = entryByDate[selectedDate];
    if (!existing) return;
    try {
      await api.delete(`/api/calendar/${existing._id}`);
      await loadEntries();
      setSelectedDate(null);
    } catch (err) {
      console.error(err);
    }
  };

  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
    today.getDate()
  )}`;

  const chosenOutfit = outfits.find((o) => o._id === outfitId);
  const previewItems = chosenOutfit
    ? chosenOutfit.items.filter(Boolean).slice(0, 4)
    : [];

  return (
    <div className="app-shell calendar-page">
      <Navbar />

      <div className="cal-content">
        <div className="cal-head">
          <div>
            <p className="cal-eyebrow">Plan ahead</p>
            <h1 className="cal-title">Style Calendar</h1>
            <p className="cal-sub">
              Pick tomorrow's look today. Tap any day to plan an outfit.
            </p>
          </div>
          <div className="month-nav">
            <button className="month-btn" onClick={goPrev}>&larr;</button>
            <span className="month-label">
              {MONTH_NAMES[month]} {year}
            </span>
            <button className="month-btn" onClick={goNext}>&rarr;</button>
          </div>
        </div>

        <div className="cal-grid">
          {WEEKDAYS.map((d) => (
            <div className="cal-weekday" key={d}>{d}</div>
          ))}

          {cells.map((day, i) => {
            if (day === null) {
              return <div className="cal-cell empty" key={`e${i}`} />;
            }
            const dateStr = `${monthKey}-${pad(day)}`;
            const entry = entryByDate[dateStr];
            const firstItem = entry?.outfit?.items?.filter(Boolean)[0];

            let cls = "cal-cell";
            if (dateStr === todayStr) cls += " today";
            if (dateStr === selectedDate) cls += " selected";

            return (
              <div className={cls} key={dateStr} onClick={() => handleSelectDay(day)}>
                <span className="cal-day">{day}</span>
                {entry && (
                  <div className={firstItem ? "cal-entry" : "cal-entry no-photo"}>
                    {firstItem && <img src={firstItem.imageUrl} alt="" />}
                    <span className="cal-entry-name">
                      {entry.outfit?.name || "Outfit removed"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <form className="plan-card" onSubmit={handleSave}>
            <div className="plan-preview">
              {previewItems.length === 0 ? (
                <div className="plan-preview-empty">
                  Choose an outfit to preview it here
                </div>
              ) : (
                previewItems.map((item) => (
                  <img key={item._id} src={item.imageUrl} alt={item.name} />
                ))
              )}
            </div>

            <div>
              <h2 className="plan-title">Plan this day</h2>
              <p className="plan-date">{selectedDate}</p>

              {error && <p className="error-text">{error}</p>}

              {outfits.length === 0 ? (
                <p className="empty-text">
                  You have no saved outfits yet. <Link to="/outfits">Create one first</Link>.
                </p>
              ) : (
                <>
                  <div className="cal-field">
                    <label>Outfit</label>
                    <select value={outfitId} onChange={(e) => setOutfitId(e.target.value)}>
                      <option value="">Choose an outfit</option>
                      {outfits.map((o) => (
                        <option key={o._id} value={o._id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="cal-field">
                    <label>Note (optional)</label>
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g. Farewell party"
                    />
                  </div>

                  <div className="plan-actions">
                    <button type="submit" className="primary-btn" disabled={saving}>
                      {saving ? "Saving..." : "Save Plan"}
                    </button>
                    {entryByDate[selectedDate] && (
                      <button type="button" className="cal-remove" onClick={handleRemove}>
                        Remove plan
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Calendar;