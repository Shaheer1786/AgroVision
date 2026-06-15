import os
import numpy as np
from PIL import Image
import tensorflow as tf
from sklearn.metrics import confusion_matrix, classification_report

# ==================================
# LABELS (MATCH TRAINING ORDER)
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
# CHANGE THIS PATH
# ==================================

VAL_PATH = r"C:\Users\MISS.PC\Desktop\KisanDoctor\Val"

# ==================================
# LOAD MODEL
# ==================================

interpreter = tf.lite.Interpreter(
    model_path="crop_model.tflite"
)

interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

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

    arr = np.expand_dims(arr, axis=0)

    interpreter.set_tensor(
        input_details[0]["index"],
        arr
    )

    interpreter.invoke()

    pred = interpreter.get_tensor(
        output_details[0]["index"]
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
            print("Error:", image_path)
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
print("=" * 50)
print("OVERALL RESULTS")
print("=" * 50)

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
print("=" * 50)
print("PER-CLASS ACCURACY")
print("=" * 50)

for label in labels:

    total_images = class_total[label]

    if total_images == 0:
        continue

    acc = (
        class_correct[label]
        / total_images
    ) * 100

    print(
        f"{label:<35} "
        f"{acc:.2f}%"
    )

# ==================================
# CLASSIFICATION REPORT
# ==================================

print("\n")
print("=" * 50)
print("CLASSIFICATION REPORT")
print("=" * 50)

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
print("=" * 50)
print("CONFUSION MATRIX")
print("=" * 50)

print(cm)
print("\nWHEAT ONLY")

for i, label in enumerate(labels):
    if "wheat" in label:
        print(label)
        print(cm[i])
        print()