import numpy as np
import pickle
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalAveragePooling2D
from sklearn.metrics.pairwise import cosine_similarity

# --- Model Initialization ---
# We load the model once when the module is imported to avoid reloading it on every request.
# This improves performance significantly.

try:
    # Use MobileNetV2 pre-trained on ImageNet
    base_model = MobileNetV2(weights='imagenet', include_top=False)
    # Add a pooling layer to get a fixed-size feature vector
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    # Create the final model
    model = Model(inputs=base_model.input, outputs=x)
    print("✅ MobileNetV2 model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

def extract_features(image_path):
    """
    Extracts a feature vector from an image using the pre-trained MobileNetV2 model.

    Args:
        image_path (str): The file path to the image.

    Returns:
        numpy.ndarray: A flattened feature vector for the image, or None if the model isn't loaded.
    """
    if model is None:
        print("❌ Model is not available. Cannot extract features.")
        return None

    # Load and resize the image to the model's expected input size (224x224)
    img = image.load_img(image_path, target_size=(224, 224))

    # Convert the image to a numpy array
    img_array = image.img_to_array(img)

    # Expand dimensions to create a "batch" of 1 image
    expanded_img_array = np.expand_dims(img_array, axis=0)

    # Preprocess the image for the MobileNetV2 model
    preprocessed_img = preprocess_input(expanded_img_array)

    # Use the model to predict (extract) the features
    features = model.predict(preprocessed_img)

    # Flatten the features to a 1D vector
    flattened_features = features.flatten()

    return flattened_features

def find_most_similar(target_features, all_images_from_db):
    """
    Finds the most similar image from the database based on cosine similarity.

    Args:
        target_features (numpy.ndarray): The feature vector of the user's uploaded image.
        all_images_from_db (list): A list of Image objects from the database.

    Returns:
        tuple: A tuple containing the best matching Image object and its similarity score.
               Returns (None, 0) if no images are in the database.
    """
    if not all_images_from_db:
        return (None, 0)

    # Unpickle the feature vectors for all training images
    db_features = [pickle.loads(img.features) for img in all_images_from_db]

    # Stack them into a single numpy array for efficient calculation
    db_features_stack = np.vstack(db_features)

    # Reshape target features for cosine_similarity function (expects 2D array)
    target_features_reshaped = target_features.reshape(1, -1)

    # Calculate cosine similarity between the target and all database images
    similarities = cosine_similarity(target_features_reshaped, db_features_stack)

    # Find the index of the highest similarity score
    best_match_index = np.argmax(similarities)

    # Get the highest score
    highest_similarity_score = similarities[0, best_match_index]

    # Get the corresponding Image object
    best_match_image = all_images_from_db[best_match_index]

    return (best_match_image, highest_similarity_score)
