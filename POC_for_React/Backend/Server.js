const express = require("express");
const multer = require("multer");
const tf = require("@tensorflow/tfjs-node");
const path = require("path");

const app = express();
const PORT = 5000;

const upload = multer();
const modelPath = "E:/Machine Learning/Projects/image Classification of Breast Cancer/POC for node and react js/Backend/Tumor_classifier_model.keras";
// const modelPath = path.join("E:\Machine Learning\Projects\image Classification of Breast Cancer\POC for node and react js\Backend\Tumor_classifier_model.keras", "Tumor_classifier_model.keras");
let model;
tf.loadLayersModel(`file://${modelPath}/model.json`).then((loadedModel) => {
    model = loadedModel;
    console.log("Model loaded successfully!");
});

const preprocessImage = (buffer) => {
    const tensor = tf.node.decodeImage(buffer, 3)
        .resizeBilinear([224, 224])
        .div(tf.scalar(255.0))
        .expandDims(0);
    return tensor;
};

app.post("/predict", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const imageBuffer = req.file.buffer;
        const preprocessedImage = preprocessImage(imageBuffer);

        const prediction = model.predict(preprocessedImage).dataSync()[0];
        const threshold = 0.5;

        res.json({
            prediction,
            result: prediction > threshold ? "Positive" : "Negative",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
