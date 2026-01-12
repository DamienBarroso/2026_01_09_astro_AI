import { useState } from 'react'

export default function App() {
    const [form, setForm] = useState({
        name: "",
        preference: "",
        month: "January",
        day: "1",
        year: "2000",
        time: "12:00",
        place: "",
    })

    const [mode, setMode] = useState("center");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [showResult, setShowResult] = useState(false);

    function onChange(e) {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value }))
    }

    async function onSubmit(e){
        e.preventDefault();

        setMode("left");
        setShowResult(true);
        setLoading(true);
        setResult("");

        try {
            const res = await fetch("/api/match", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            })

            const data = await res.json();
            setResult(data?.result || JSON.stringify(data, null, 1))
        } catch (error) {
            setResult("Could not reach server. Make sure backend is running on 3000")
        }   finally {
            setLoading(false);
        }
    }

    function closeResult() {
        setShowResult(false);
    }

    return (
        <div className="page">

        </div>
    )
}


