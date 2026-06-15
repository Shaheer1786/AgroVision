import os
import numpy as np
from PIL import Image
import tensorflow as tf
from sklearn.metrics import confusion_matrix, classification_report

# ==================================
# LABELS (TRAINING ORDER)
# ==================================

labels = [
    "cotton/Bacterial Blight",
    "cotton/Curl Virus",
    "cotton/Fusarium Wilt",
    "cotton/Healthy",

    "rice/Bacterial Leaf Blight",
    "rice/Brown Spot",
    "rice/Healthy",
    "rice/Leaf Smut",

    "wheat/Brown Rust",
    "wheat/Healthy",
    "wheat/Mildew",
    "wheat/Septoria"
]

# ==================================
# FOLDER MAP
# ==================================

folder_map = {
    "Cotton_bacterial_blight": "cotton/Bacterial Blight",
    "Cotton_curl_virus": "cotton/Curl Virus",
    "Cotton_fussarium_wilt": "cotton/Fusarium Wilt",
    "Cotton_healthy": "cotton/Healthy",

    "Rice_Bacterial_leaf_blight": "rice/Bacterial Leaf Blight",
    "Rice_Brown_spot": "rice/Brown Spot",
    "Rice_Healthy": "rice/Healthy",
    "Rice_Leaf_smut": "rice/Leaf Smut",

    "Wheat_Brown_Rust": "wheat/Brown Rust",
    "Wheat_Healthy": "wheat/Healthy",
    "Wheat_Mildew": "wheat/Mildew",
    "Wheat_Septoria": "wheat/Septoria"
}

# ==================================
# CHANGE THIS IF NEEDED
# ==================================

VAL_PATH = r"C:\Users\MISS.PC\Desktop\KisanDoctor\Val"

# ==================================
# LOAD KERAS MODEL
# ==================================

print("\nLoading Keras Model...\n")

model = tf.keras.models.load_model(
    "best_phase2.keras"
)

print("Model Loaded Successfully!")
print("Input Shape :", model.input_shape)
print("Output Shape:", model.output_shape)

# ==================================
# PREDICT FUNCTION
# ==================================

def predict_image(image_path):

    img = Image.open(image_path).convert("RGB")

    img = img.resize((224, 224))

    arr = np.array(
        img,
        dtype=np.float32
    ) / 255.0

    arr = np.expand_dims(
        arr,
        axis=0
    )

    pred = model.predict(
        arr,
        verbose=0
    )

    idx = np.argmax(pred)

    return labels[idx]

# ==================================
# EVALUATION
# ==================================

y_true = []
y_pred = []

class_correct = {}
class_total = {}

for label in labels:
    class_correct[label] = 0
    class_total[label] = 0

print("\nRunning Evaluation...\n")

for folder in os.listdir(VAL_PATH):

    folder_path = os.path.join(
        VAL_PATH,
        folder
    )

    if not os.path.isdir(folder_path):
        continue

    actual_label = folder_map[folder]

    print("Testing:", actual_label)

    for image_name in os.listdir(folder_path):

        image_path = os.path.join(
            folder_path,
            image_name
        )

        try:

            predicted = predict_image(
                image_path
            )

            y_true.append(actual_label)
            y_pred.append(predicted)

            class_total[actual_label] += 1

            if predicted == actual_label:
                class_correct[actual_label] += 1

        except Exception as e:

            print("ERROR:", image_path)
            print(e)

# ==================================
# OVERALL ACCURACY
# ==================================

correct = sum(
    1 for a, b in zip(y_true, y_pred)
    if a == b
)

total = len(y_true)

accuracy = (
    correct / total
) * 100

print("\n")
print("=" * 60)
print("OVERALL RESULTS")
print("=" * 60)

print("Total Images :", total)
print("Correct      :", correct)
print(
    "Accuracy     :",
    round(accuracy, 2),
    "%"
)

# ==================================
# PER CLASS ACCURACY
# ==================================

print("\n")
print("=" * 60)
print("PER-CLASS ACCURACY")
print("=" * 60)

for label in labels:

    total_images = class_total[label]

    if total_images == 0:
        continue

    acc = (
        class_correct[label]
        / total_images
    ) * 100

    print(
        f"{label:<35}"
        f"{acc:.2f}%"
    )

# ==================================
# CLASSIFICATION REPORT
# ==================================

print("\n")
print("=" * 60)
print("CLASSIFICATION REPORT")
print("=" * 60)

print(
    classification_report(
        y_true,
        y_pred,
        labels=labels
    )
)

# ==================================
# CONFUSION MATRIX
# ==================================

cm = confusion_matrix(
    y_true,
    y_pred,
    labels=labels
)

print("\n")
print("=" * 60)
print("CONFUSION MATRIX")
print("=" * 60)

print(cm)