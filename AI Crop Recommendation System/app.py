from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

# Load model and scalers
model = joblib.load("model.pkl")
minmaxscaler = joblib.load("minmaxscaler.pkl")
standscaler = joblib.load("standscaler.pkl")


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        # Extract values from request
        input_data = np.array([[
            data['N'], data['P'], data['K'],
            data['temperature'], data['humidity'],
            data['ph'], data['rainfall']
        ]])

        # Apply both scalers in the same order as during training
        input_minmax = minmaxscaler.transform(input_data)
        input_scaled = standscaler.transform(input_minmax)

        # Predict probabilities
        probabilities = model.predict_proba(input_scaled)[0]
        top3_indices = np.argsort(probabilities)[::-1][:3]
        top3_labels = model.classes_[top3_indices]
        top3_probs = probabilities[top3_indices]

        # Format response with risk levels
        result = {
            "Low Risk": f"{top3_labels[0]} ({top3_probs[0]:.2f})",
            "Medium Risk": f"{top3_labels[1]} ({top3_probs[1]:.2f})",
            "High Risk": f"{top3_labels[2]} ({top3_probs[2]:.2f})"
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
