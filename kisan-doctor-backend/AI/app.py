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

# ==================================
# LOAD MODEL
# ==================================

interpreter = tf.lite.Interpreter(
    model_path="crop_model.tflite"
)

interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

print("\n========================")
print("MODEL LOADED")
print("========================")
print("INPUT SHAPE:", input_details[0]["shape"])
print("OUTPUT SHAPE:", output_details[0]["shape"])
print("========================\n")

UPLOAD_FOLDER = "../uploads"

# ==================================
# PREDICT FUNCTION
# ==================================

def predict_image(image_path, selected_crop=None):

    img = Image.open(image_path).convert("RGB")
    img = img.resize((224, 224))

    img_array = np.array(
        img,
        dtype=np.float32
    ) / 255.0

    img_array = np.expand_dims(
        img_array,
        axis=0
    )

    print("\n========================")
    print("IMAGE SHAPE")
    print(img_array.shape)
    print("========================")

    interpreter.set_tensor(
        input_details[0]["index"],
        img_array
    )

    interpreter.invoke()

    prediction = interpreter.get_tensor(
        output_details[0]["index"]
    )

    print("\n========================")
    print("RAW PREDICTION")
    print(prediction)
    print("========================")

    predicted_index = int(np.argmax(prediction))

    confidence = float(
        np.max(prediction)
    ) * 100

    disease = labels[predicted_index]

    predicted_crop = disease.split("/")[0].strip().lower()

    if selected_crop:

        selected_crop = selected_crop.strip().lower()

        if predicted_crop != selected_crop:

            return {
                "success": False,
                "error": "wrong_crop",
                "selectedCrop": selected_crop.title(),
                "detectedCrop": predicted_crop.title(),
                "message": f"You selected {selected_crop.title()}, but the uploaded image appears to be {predicted_crop.title()}."
            }

    print("PREDICTED INDEX:", predicted_index)
    print("PREDICTED CLASS:", disease)
    print("CONFIDENCE:", round(confidence, 2))

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
        "confidence": round(confidence, 2),

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

# ==================================
# HOME
# ==================================

@app.route("/")
def home():
    return "AgroVision AI Backend Running"

# ==================================
# PREDICT API
# ==================================

@app.route("/predict", methods=["POST"])
def predict():

    print("\n========== FLASK PREDICT ==========")

    if "image" not in request.files:
        return jsonify({
            "error": "No image uploaded"
        }), 400

    file = request.files["image"]
    selected_crop = request.form.get("crop")

    if file.filename == "":
        return jsonify({
            "error": "No filename"
        }), 400

    os.makedirs(
        UPLOAD_FOLDER,
        exist_ok=True
    )

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    file.save(file_path)

    print("Saved:", file_path)

    try:

        result = predict_image(file_path, selected_crop)

        if result.get("error") == "wrong_crop":
            return jsonify(result), 400

        return jsonify(result)

    except Exception as e:

        print("\nPrediction Error:")
        print(e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if os.path.exists(file_path):
            os.remove(file_path)
            print("Deleted:", file_path)
    
            

# ==================================
# RUN SERVER
# ==================================

if __name__ == "__main__":

    print("\n==============================")
    print("AGROVISION AI SERVER STARTED")
    print("==============================")
    print("http://127.0.0.1:5001")
    print("==============================\n")

    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5001)),
        debug=True
    )