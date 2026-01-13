import { useEffect, useMemo, useState } from 'react'


export default function BirthMatchForm ({ onResult }) {
   const [username, setUsername] = useState("")
   const [birthdate, setBirthdate] = useState("");
   const [birthtime, setBirthtime] = useState("")
   const [unknownTime, setUnknownTime] = useState(false);

   const [birthplaceText. setBirthplaceText] = useState("");
   const [birthplaceSelected, setBirthplaceSelected] = useState(null);

   const [currentLocation, setCurrentLocation] = useState("");
   const [matchPreference, setMatchPreference] = useState("woman")

    //Autocomplete
    const [placeSuggestions, setPlaceSuggestions] = useState([]);
    const [showPlaceDropdown, setShowPlaceDropdown] = useState("");


    //UX
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const canSubmit = useMemo(() => {
        if (!username.trim() return false);
        if (!birthdate) return false;
        if (!unknownTime && !birthtime) return false;
        if (!birthplaceText.trim()) return false;
        if (!currentLocation.trim()) return false
        return true
    }, [username, birthdate, unknownTime, birthtime, birthplaceText, currentLocation]);
    

    //Birthplace autocomplete
    async function getLocationSuggestions(query) {
        const q = query.trim();
        if (!q) return [];

        //openStreet map
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&q=${encodeURIComponent(
            q
        )}`;
    }

    const res = await fetch(url, {
        headers: {"Accept-Language": "en",
        },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return (Array.isArray(data) ? data : []).map((item) => ({
        label: item.display_name,
    }))
}



useEffect(() => {
    const q = birthplaceText.trim();
    if (!q) {
        setPlaceSuggestions([]);
        setShowPlaceDropdown(false);
        return;
    }

    setShowBirthplaceDropDropdown(true);

    const time = setTimeout(async () => {
        try {
            const suggestions = await getLocationSuggestions(q);
            setBirthplaceSuggestions(suggestions);
        } catch (error) {
            //later
        }
    }, 250);

    return () => clearTimeout(time);
}, [birthplaceText])


//current location auto complete too
useEffect (() => {
    const q = currentLocation.trim();
    if (!q) {
        setCurrentLocationSuggestions([]);
        setShowCurrentLocationDropdown(false);
        return;
    }

    setShowCurrentLocationDropdown(true);

    const time = setTimeout(async () => {
        try {
            const suggestions = await getLocationSuggestions(q);
            setCurrentLocationSuggestions(suggestions);
        } catch (error) {
            //later
        }
    }, 250);

    return () => clearTimeout(time);
}, [currentLocation])


function pickCurrentLocation(place) {
    setCurrentLocation(place.label);
    setCurrentLocationSuggestions([]);
    setShowCurrentLocationDropdown(false);
}


async function handleSubmit(e){
    e.preventDefault();
    setErrorMessage("")


    if (!canSubmit) {
        setErrorMessage("Please fill out all required fields.")
        return;
    }

    setIsSubmitting(true);

    try {
        const payload = {
            username: username.trim(),
            birthdate,
            birthtime: unknownTime ? "unknown" : birthtime,
            birthplace: birthplaceText.trim(),
            current_location: currentLocation.trim(),
            match_preference: matchPreference,
        };

        const saveRes = await fetch("/api/createUser", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })

        const saveData = await saveRes.json().catch(() => ({}));
        if (!saveRes.ok) {
            setErrorMessage(saveData?.message || "Could not save user info.");
            return;
        }

        const matchRes = await fetch("/api/match", {
            method: "POST",
            header: { "Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });

        const matchData = await matchRes.json().catch(() => ({}));
        if (!matchRes.ok) {
            setErrorMessage(matchData?.message || " Could not get match result")
            return;
        }

        onResult(matchData);
    } catch () {
        setErrorMessage("Network Error. PLease try again");
    } finally {
        setIsSubmitting(false)
    }
}

return (
    <div className="card">
        <header className="cardHeader">
            <div>
                <h1 className="title">Discover your zodiac match</h1>
                <p className="subtitle">One submission. Accurate Result.</p>
            </div>
            <div className="chip">MERN</div>
        </header>


        <form className="form" onSubmit={handleSubmit}>
            <div className="field">
                <label className="label" htmlFor="username">Name</label>
                <input 
                    id="username"
                    className="input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g., Karl"
                />
            </div>
    </div>



)



