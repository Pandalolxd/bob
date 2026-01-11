import os
import pickle
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from werkzeug.utils import secure_filename
import ml_core # Import our ML logic

# --- App Initialization & Config ---
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
instance_path = os.path.join(basedir, 'instance')
uploads_path = os.path.join(basedir, 'uploads')
os.makedirs(instance_path, exist_ok=True)
os.makedirs(uploads_path, exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(instance_path, 'project.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'a-very-secret-key-that-should-be-changed'
app.config['UPLOAD_FOLDER'] = uploads_path
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

db = SQLAlchemy(app)

# --- Database Models ---
class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    images = db.relationship('Image', backref='place', lazy=True, cascade="all, delete-orphan")

class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(100), nullable=False)
    features = db.Column(db.PickleType, nullable=False)
    place_id = db.Column(db.Integer, db.ForeignKey('place.id'), nullable=False)

# --- Helper Functions ---
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- User Routes ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files: return jsonify({'error': 'No image file provided.'}), 400
    file = request.files['image']
    if file.filename == '' or not allowed_file(file.filename): return jsonify({'error': 'Invalid or no file selected.'}), 400

    filename = secure_filename(file.filename)
    user_image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(user_image_path)

    try:
        user_features = ml_core.extract_features(user_image_path)
        if user_features is None: raise ValueError("Feature extraction failed.")

        all_training_images = Image.query.all()
        if not all_training_images: return jsonify({'error': 'No training data available.'}), 500

        best_match, score = ml_core.find_most_similar(user_features, all_training_images)

        if score > 0.6: # Similarity threshold
            result_place = Place.query.get(best_match.place_id)
            return jsonify({
                'success': True,
                'place_name': result_place.name,
                'description': result_place.description,
                'similarity': f"{score:.2f}" # Include the score
            })
        else:
            return jsonify({'success': False, 'message': 'Could not identify the place.'})
    finally:
        os.remove(user_image_path) # Clean up user's temp file

# --- Admin Auth ---
ADMIN_USERNAME = 'danice'
ADMIN_PASSWORD = 'danice'

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_logged_in' not in session: return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['username'] == ADMIN_USERNAME and request.form['password'] == ADMIN_PASSWORD:
            session['admin_logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            flash("Invalid credentials.", "danger")
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('login'))

# --- Admin CRUD Routes ---
@app.route('/admin/dashboard')
@admin_required
def admin_dashboard():
    places = Place.query.all()
    return render_template('admin_dashboard.html', places=places)

@app.route('/admin/places/add', methods=['GET', 'POST'])
@admin_required
def add_place():
    if request.method == 'POST':
        new_place = Place(name=request.form['name'], description=request.form['description'])
        db.session.add(new_place)
        db.session.commit()
        flash(f"Place '{new_place.name}' added.", "success")
        return redirect(url_for('admin_dashboard'))
    return render_template('add_place.html')

@app.route('/admin/places/manage/<int:place_id>', methods=['GET', 'POST'])
@admin_required
def manage_place(place_id):
    place = Place.query.get_or_404(place_id)
    if request.method == 'POST':
        files = request.files.getlist('images')
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(path)

                features = ml_core.extract_features(path)
                pickled_features = pickle.dumps(features)

                new_image = Image(filename=filename, features=pickled_features, place_id=place.id)
                db.session.add(new_image)
        db.session.commit()
        flash(f"Images uploaded for '{place.name}'.", "success")
        return redirect(url_for('manage_place', place_id=place.id))
    return render_template('manage_place.html', place=place)

@app.route('/admin/places/delete/<int:place_id>', methods=['POST'])
@admin_required
def delete_place(place_id):
    place = Place.query.get_or_404(place_id)
    # Also delete associated image files, checking if they exist first
    for image in place.images:
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
        if os.path.exists(image_path):
            os.remove(image_path)
    db.session.delete(place)
    db.session.commit()
    flash(f"Place '{place.name}' and all its images have been deleted.", "success")
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/images/delete/<int:image_id>', methods=['POST'])
@admin_required
def delete_image(image_id):
    image = Image.query.get_or_404(image_id)
    place_id_ref = image.place_id
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
    if os.path.exists(image_path):
        os.remove(image_path)
    db.session.delete(image)
    db.session.commit()
    flash(f"Image '{image.filename}' has been deleted.", "success")
    return redirect(url_for('manage_place', place_id=place_id_ref))

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Create tables if they don't exist
    app.run(debug=True, host='0.0.0.0', port=25570)
