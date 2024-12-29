import React, { useState } from "react";
import axios from "axios";

function App() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:5000/predict", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResult(response.data.result);
        } catch (error) {
            console.error(error);
            setResult("Error occurred!");
        }
    };

    return (
        <div>
            <h1>Tumor Classifier</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button type="submit">Predict</button>
            </form>
            {result && <h2>Prediction: {result}</h2>}
        </div>
    );
}

export default App;
