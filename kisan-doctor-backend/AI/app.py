from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import tensorflow as tf
import numpy as np
import os

from labels import labels
from recommendations import recommendations

app = Flask(__name__)
CORS(app)

# -----------------------------------
# Load Model
# -----------------------------------

interpreter = tf.lite.Interpreter(
    model_path="crop_model.tflite"
)

interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

print("\n========================")
print("MODEL LOADED")
print("========================")

print("INPUT SHAPE:")
print(input_details[0]["shape"])

print("OUTPUT SHAPE:")
print(output_details[0]["shape"])

print("========================\n")

UPLOAD_FOLDER = "../uploads"

# -----------------------------------
# Predict Function
# -----------------------------------

def predict_image(image_path):

    # Load image
    img = Image.open(image_path).convert("RGB")

    # Resize
    img = img.resize((224, 224))

    # Normalize
    img_array = np.array(
        img,
        dtype=np.float32
    ) / 255.0

    # Add batch dimension
    img_array = np.expand_dims(
        img_array,
        axis=0
    )

    print("\n========================")
    print("IMAGE SHAPE")
    print(img_array.shape)
    print("========================\n")

    # Set input tensor
    interpreter.set_tensor(
        input_details[0]["index"],
        img_array
    )

    # Run inference
    interpreter.invoke()

    prediction = interpreter.get_tensor(
        output_details[0]["index"]
    )

    print("\n========================")
    print("RAW PREDICTION")
    print(prediction)
    print("========================\n")

    predicted_index = np.argmax(
        prediction
    )

    confidence = float(
        np.max(prediction)
    ) * 100

    disease = labels[
        predicted_index
    ]

    print("PREDICTED INDEX:")
    print(predicted_index)

    print("PREDICTED CLASS:")
    print(disease)

    print("CONFIDENCE:")
    print(confidence)

    recommendation = recommendations.get(
        disease,
        {
            "treatment_en": "Treatment information not available",
            "treatment_ur": "علاج کی معلومات دستیاب نہیں",
            "prevention_en": "Prevention information not available",
            "prevention_ur": "بچاؤ کی معلومات دستیاب نہیں"
        }
    )

    return {
        "disease": disease,
        "confidence": round(
            confidence,
            2
        ),

        "treatment_en":
            recommendation.get(
                "treatment_en",
                "Treatment information not available"
            ),

        "treatment_ur":
            recommendation.get(
                "treatment_ur",
                "علاج کی معلومات دستیاب نہیں"
            ),

        "prevention_en":
            recommendation.get(
                "prevention_en",
                "Prevention information not available"
            ),

        "prevention_ur":
            recommendation.get(
                "prevention_ur",
                "بچاؤ کی معلومات دستیاب نہیں"
            )
    }
# -----------------------------------
# API Route
# -----------------------------------

@app.route(
    "/predict",
    methods=["POST"]
)
def predict():

    if "image" not in request.files:

        return jsonify({
            "error":
            "No image uploaded"
        }), 400

    file = request.files["image"]

    os.makedirs(
        UPLOAD_FOLDER,
        exist_ok=True
    )

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    file.save(file_path)

    result = predict_image(
        file_path
    )

    return jsonify(result)

# -----------------------------------
# Run App
# -----------------------------------

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )