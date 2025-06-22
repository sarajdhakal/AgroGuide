from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

# Load model and scaler
model = joblib.load("model.pkl")
# or use standscaler.pkl if that's correct
scaler = joblib.load("minmaxscaler.pkl")


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

        # Scale the input
        input_scaled = scaler.transform(input_data)

        # Predict using the model
        prediction = model.predict(input_scaled)

        return jsonify({'recommended_crop': prediction[0]})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
