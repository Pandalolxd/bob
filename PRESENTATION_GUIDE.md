# AI Place Recognition - Presentation Guide

This guide is designed to help you explain your project to your teacher and classmates in a clear, professional, and confident way.

---

## 1. Project Overview
**What is it?**
A web application that identifies landmarks or buildings from a photo. It uses Artificial Intelligence (specifically "Computer Vision") to "look" at an image and compare it to a database of known locations.

---

## 2. The "Brain" - How the Machine Learning Works
This is the most important part to explain to your teacher. We use a technique called **Feature Extraction**.

### A. The Model: MobileNetV2
*   **What it is:** We use a pre-trained AI model called **MobileNetV2**.
*   **The Analogy:** Think of MobileNetV2 as a "Professional Art Critic" that has seen millions of different images (cars, dogs, trees, buildings).
*   **What it does:** Instead of looking at pixels, it looks for *patterns*—shapes, textures, and edges.

### B. Feature Extraction (The Digital Fingerprint)
*   When you upload a photo, the AI doesn't see "The Eiffel Tower." It sees a long list of numbers (a "vector").
*   This list of numbers is like a **Digital Fingerprint**. Every unique place has a slightly different fingerprint.
*   **In the code:** This happens in `ml_core.py` in the `extract_features` function.

### C. Cosine Similarity (The Matching Process)
*   **How it decides:** Once we have the "fingerprint" of your uploaded photo, we compare it to all the "fingerprints" we already have in our database.
*   We use a math formula called **Cosine Similarity**.
*   **Simple explanation:** It measures how "close" two fingerprints are. If the fingerprints are 90% similar, we say "That's a match!"
*   **In the code:** This happens in `ml_core.py` in the `find_most_similar` function.

---

## 3. The Tech Stack (What you built it with)
*   **Frontend (The Face):** HTML5, CSS3 (Modern UI), and JavaScript. We used "Feather Icons" for the design.
*   **Backend (The Engine):** **Flask** (a Python web framework). It handles the requests and communicates with the AI logic.
*   **Database:** **SQLite** with **SQLAlchemy**. It stores the names of the places, their descriptions, and their "Digital Fingerprints."
*   **AI Libraries:** **TensorFlow/Keras** (to run the MobileNetV2 model) and **NumPy** (for the math).

---

## 4. The Workflows

### The Admin Side (Setting up the Data)
1.  The Admin logs in.
2.  They create a "Place" (e.g., "The Library").
3.  They upload "Training Images." For each image, the AI generates a "Digital Fingerprint" and saves it to the database.
4.  They can also upload "Old Photos" for the historical slideshow.

### The User Side (Identifying a Place)
1.  The User uploads a photo or uses their camera.
2.  The website sends that photo to the Python backend.
3.  The backend extracts the "fingerprint" and finds the best match in the database.
4.  If a match is found, it slides out a beautiful result page with the name, a similarity score, a description, and a historical slideshow.

---

## 5. FAQ (Be Ready for These!)

**Q: Why use MobileNetV2 specifically?**
*   **A:** It's designed to be fast and efficient. It can run on phones or small servers without needing a massive supercomputer, which makes it perfect for a web app.

**Q: What happens if I upload a picture of a cat?**
*   **A:** The AI will still generate a "fingerprint" for the cat, but when it compares it to the "fingerprints" of buildings in the database, the similarity score will be very low (e.g., 0.2). Our code has a **threshold (0.6)**; if the score is lower than that, it says "Could not identify the place."

**Q: Where are the images stored?**
*   **A:** The actual image files are stored in the `uploads/` folder, while the image names and their AI "fingerprints" are stored in the SQLite database.

**Q: Can it recognize a place it hasn't seen before?**
*   **A:** No. It can only recognize places that an Admin has already added and "trained" the system on by uploading images.

---

## 6. Suggested 5-7 Minute Presentation Script

### Minute 1: Intro & Demo
*   "Hello everyone! Today I’m showing you my AI Place Recognition project."
*   "The goal is simple: You take a photo of a landmark, and the AI tells you what it is, gives you a history of the place, and shows you some old historical photos."
*   *(Action: Show the home page and do a quick upload if you have a demo image ready)*.

### Minute 2-3: The "How" (Machine Learning)
*   "People often ask: 'Does the AI just compare pixels?' The answer is no."
*   "I used **MobileNetV2**. Think of this as the AI's 'eyes'. When it looks at an image, it ignores things like lighting or small changes and instead creates a **Digital Fingerprint**—a list of numbers that represents the unique features of that building."
*   "When you upload a photo, the system creates a new fingerprint and compares it to all the fingerprints in our database using **Cosine Similarity**—which is just a fancy way of saying it calculates how 'close' two fingerprints are."

### Minute 4: The Admin & Data
*   "Behind the scenes, we have an Admin panel. This is where the 'learning' happens."
*   "To add a new place, I upload several photos of it. The AI extracts the fingerprints for each one and saves them. This way, the system can recognize the building from different angles."

### Minute 5: Technology Stack
*   "Technically, this is a full-stack Python application."
*   "I used **Flask** for the web server, **TensorFlow** for the AI model, and **SQLAlchemy** for the database. The frontend is built with modern CSS and JavaScript to make it look like a professional mobile app."

### Minute 6-7: Conclusion & Questions
*   "What I learned: The hardest part wasn't the AI—it was making sure the AI and the website talked to each other smoothly."
*   "In the future, I could add more places or even GPS coordinates so it only searches for buildings near you."
*   "Does anyone have any questions?"
