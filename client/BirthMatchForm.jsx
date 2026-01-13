import React, { useEffect, useRef, useState } from "react";

export default function BirthMatchForm({ onResult }) {
  // Backend fields
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [birthtime, setBirthtime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);

  const [birthplace, setBirthplace] = useState("");
  const [current_location, setCurrentLocation] = useState("");
  const [match_preference, setMatchPreference] = useState("any");

  // Autocomplete (birthplace)
  const [birthplaceQuery, setBirthplaceQuery] = useState("");
  const [birthplaceSuggestions, setBirthplaceSuggestions] = useState([]);
  const [showBirthplaceSuggestions, setShowBirthplaceSuggestions] = useState(false);

  // Autocomplete (current location)
  const [currentLocationQuery, setCurrentLocationQuery] = useState("");
  const [currentLocationSuggestions, setCurrentLocationSuggestions] = useState([]);
  const [showCurrentLocationSuggestions, setShowCurrentLocationSuggestions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const birthplaceTimer = useRef(null);
  const currentLocTimer = useRef(null);

  // --- helpers
  async function fetchPlaceSuggestions(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
      query
    )}`;

    const resp = await fetch(url, {
      headers: {
        "Accept-Language": "en",
      },
    });

    if (!resp.ok) return [];
    const data = await resp.json();
    
    const allNames = Array.isArray(data) 
    ? data.map((x) => x.display_name).filter(Boolean) 
    : [];

  // Remove duplicates using Set
     return [...new Set(allNames)];
  }

  // --- autocomplete effects ---
  useEffect(() => {
    clearTimeout(birthplaceTimer.current);

    if (birthplaceQuery.trim().length < 3) {
      setBirthplaceSuggestions([]);
      return;
    }

    birthplaceTimer.current = setTimeout(async () => {
      const suggestions = await fetchPlaceSuggestions(birthplaceQuery.trim());
      setBirthplaceSuggestions(suggestions);
    }, 250);

    return () => clearTimeout(birthplaceTimer.current);
  }, [birthplaceQuery]);

  useEffect(() => {
    clearTimeout(currentLocTimer.current);

    if (currentLocationQuery.trim().length < 3) {
      setCurrentLocationSuggestions([]);
      return;
    }

    currentLocTimer.current = setTimeout(async () => {
      const suggestions = await fetchPlaceSuggestions(currentLocationQuery.trim());
      setCurrentLocationSuggestions(suggestions);
    }, 250);

    return () => clearTimeout(currentLocTimer.current);
  }, [currentLocationQuery]);

  // --- handlers ---
  function pickBirthplace(value) {
    setBirthplace(value);
    setBirthplaceQuery(value);
    setShowBirthplaceSuggestions(false);
  }

  function pickCurrentLocation(value) {
    setCurrentLocation(value);
    setCurrentLocationQuery(value);
    setShowCurrentLocationSuggestions(false);
  }

  function onUnknownTimeChange(e) {
    const checked = e.target.checked;
    setUnknownTime(checked);
    if (checked) setBirthtime("unknown");
    else setBirthtime("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    // Backend requires: username, birthdate, birthplace, birthtime
    if (!username.trim() || !birthdate.trim() || !birthplace.trim() || !birthtime.trim()) {
      setErrorMsg("Please fill: name, birthdate, birthtime (or unknown), and birthplace.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: username.trim(),
        birthdate: birthdate.trim(), // backend accepts string, stores into Date
        birthtime: birthtime.trim(),
        birthplace: birthplace.trim(),
        current_location: current_location.trim(),
        match_preference, // "man" | "woman" | "any"
      };


      const stringPayload = JSON.stringify(payload);
      console.log('stringPayload: ', stringPayload);

      const resp = await fetch("http://localhost:3000/api/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

          const data = await resp.json();

      if (!resp.ok) {
        setErrorMsg(data?.err || "Request failed. Check server console.");
        setLoading(false);
        return;
      }

      onResult(data);
    } catch (err) {
      setErrorMsg("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {errorMsg ? <div className="error">{errorMsg}</div> : null}

      <div className="field">
        <label className="label">Name (initial or nickname)</label>
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g., K"
        />
      </div>

      <div className="field">
        <label className="label">I prefer</label>
        <div className="radioRow">
          <label className="radio">
            <input
              type="radio"
              name="pref"
              value="man"
              checked={match_preference === "man"}
              onChange={() => setMatchPreference("man")}
            />
            Men
          </label>
          <label className="radio">
            <input
              type="radio"
              name="pref"
              value="woman"
              checked={match_preference === "woman"}
              onChange={() => setMatchPreference("woman")}
            />
            Women
          </label>
          <label className="radio">
            <input
              type="radio"
              name="pref"
              value="any"
              checked={match_preference === "any"}
              onChange={() => setMatchPreference("any")}
            />
            Any
          </label>
        </div>
      </div>

      <div className="grid2">
        <div className="field">
          <label className="label">Birthdate</label>
          <input
            className="input"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            placeholder="e.g., February 1, 1990"
          />
        </div>

        <div className="field">
          <label className="label">Birth time</label>

          <div className="timeRow">
            <input
              className="input"
              value={unknownTime ? "unknown" : birthtime}
              onChange={(e) => setBirthtime(e.target.value)}
              placeholder="e.g., 2:00 AM"
              disabled={unknownTime}
            />

            <label className="checkbox">
              <input type="checkbox" checked={unknownTime} onChange={onUnknownTimeChange} />
              Unknown
            </label>
          </div>
        </div>
      </div>

      {/* Birthplace with autocomplete */}
      <div className="field">
        <label className="label">Birthplace (city, country)</label>
        <div className="autoWrap">
          <input
            className="input"
            value={birthplaceQuery}
            onChange={(e) => {
              setBirthplaceQuery(e.target.value);
              setBirthplace(e.target.value);
              setShowBirthplaceSuggestions(true);
            }}
            onFocus={() => setShowBirthplaceSuggestions(true)}
            placeholder="Start typing… (e.g., New York)"
          />

          {showBirthplaceSuggestions && birthplaceSuggestions.length > 0 ? (
            <div className="suggestions">
              {birthplaceSuggestions.map((s) => (
                <button
                  type="button"
                  className="suggestion"
                  key={ s } // try making this unique index
                  onClick={() => pickBirthplace(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Current location with autocomplete */}
      <div className="field">
        <label className="label">Current location (city, country)</label>
        <div className="autoWrap">
          <input
            className="input"
            value={currentLocationQuery}
            onChange={(e) => {
              setCurrentLocationQuery(e.target.value);
              setCurrentLocation(e.target.value);
              setShowCurrentLocationSuggestions(true);
            }}
            onFocus={() => setShowCurrentLocationSuggestions(true)}
            placeholder="Start typing… (e.g., Paris)"
          />

          {showCurrentLocationSuggestions && currentLocationSuggestions.length > 0 ? (
            <div className="suggestions">
              {currentLocationSuggestions.map((s) => (
                <button
                  type="button"
                  className="suggestion"
                  key={ s } // try making this unique index
                  onClick={() => pickCurrentLocation(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
