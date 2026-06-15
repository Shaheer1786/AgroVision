import tensorflow as tf

model = tf.keras.models.load_model("best_phase2.keras")

print("Input Shape :", model.input_shape)
print("Output Shape:", model.output_shape)

model.summary()