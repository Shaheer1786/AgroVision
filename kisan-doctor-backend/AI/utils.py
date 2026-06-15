import cv2
import numpy as np

def preprocess_image(image_path):
    img = cv2.imread(image_path)

    if img is None:
        return None

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224, 224))
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=0)

    return img