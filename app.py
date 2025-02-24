from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from collections import defaultdict
import nltk
from nltk.tokenize import WordPunctTokenizer
from nltk.corpus import stopwords
import string
import traceback
import re

# Download necessary NLTK resources
try:
    nltk.download('punkt')
    nltk.download('stopwords')
except Exception as e:
    print("NLTK resource download error:", e)

# Use the WordPunctTokenizer explicitly
tokenizer = WordPunctTokenizer()

# Multinomial Naive Bayes class (no changes)
class MultinomialNaiveBayes:
    def __init__(self):
        self.class_priors = {}
        self.word_probs = {}

    def fit(self, X, y):
        class_docs = defaultdict(list)
        for features, label in zip(X, y):
            class_docs[label].append(features)

        total_docs = len(y)
        self.class_priors = {label: len(class_docs[label]) / total_docs for label in class_docs}

        self.word_probs = {}
        for label, docs in class_docs.items():
            word_counts = np.sum(docs, axis=0)
            total_count = np.sum(word_counts)
            self.word_probs[label] = (word_counts + 1) / (total_count + len(vocabulary))

    def predict(self, X):
        predictions = []
        for features in X:
            class_scores = {}
            for label in self.class_priors:
                prior = self.class_priors[label]
                likelihood = np.sum(np.log(self.word_probs[label]) * features)
                class_scores[label] = np.log(prior) + likelihood
            predictions.append(max(class_scores, key=class_scores.get))
        return predictions

# Load trained models and mappings
model = joblib.load("symptom_classifier.pkl")
vectorizer = joblib.load("vectorizer.pkl")
department_to_tests = joblib.load("department_to_tests.pkl")
symptom_to_tests = joblib.load("symptom_to_tests.pkl")

# Flask app setup
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # Frontend running at localhost:5173

@app.route('/')
def home():
    return "Welcome to the Symptom Classifier!"


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received data:", data)

        symptoms_list = data.get('symptoms')
        if not symptoms_list or not isinstance(symptoms_list, list):
            return jsonify({"error": "Invalid input format for symptoms, should be a list."}), 400

        print("Symptoms list:", symptoms_list)

        matched_symptoms = []
        valid_symptoms = [s.lower() for s in symptom_to_tests.keys()]

        for symptom in symptoms_list:
            # Expanded regular expression to remove common irrelevant phrases and words
            cleaned_symptom = re.sub(r'\b(i have|i am|and am sick|i feel|i am suffering from|im suffering with|im ill from|i am sick with|im|i think|hello|i got|i am feeling)\b', '', symptom.lower())
            cleaned_symptom = re.sub(r'\s+', ' ', cleaned_symptom).strip()  # Remove extra spaces

            if cleaned_symptom in valid_symptoms:
                matched_symptoms.append(cleaned_symptom)
            else:
                # Tokenization and cleaning if direct match fails
                tokens = tokenizer.tokenize(cleaned_symptom)  # Use the tokenizer directly
                stop_words = set(stopwords.words('english'))
                cleaned_tokens = [
                    token for token in tokens
                    if token not in stop_words and token not in string.punctuation and len(token) > 2
                ]
                matched_symptoms.extend([token for token in cleaned_tokens if token in valid_symptoms])

        if not matched_symptoms:
            return jsonify({"error": "No valid symptoms found in the input text."}), 400

        print("Matched symptoms:", matched_symptoms)

        response = []
        for symptom in matched_symptoms:
            try:
                symptom_vec = vectorizer.transform([symptom]).toarray()
                department = model.predict(symptom_vec)[0]
                recommended_tests = symptom_to_tests.get(symptom, [])
                if not recommended_tests:
                    recommended_tests = ["No tests available for this symptom"]

                response.append({
                    'symptom': symptom,
                    'department': department,
                    'recommended_tests': recommended_tests
                })
            except Exception as e:
                print(f"Error processing symptom {symptom}: {e}")
                response.append({'symptom': symptom, 'error': f"Error predicting department: {str(e)}"})

        return jsonify(response)

    except Exception as e:
        print("Error occurred:", e)
        print(traceback.format_exc())  # Logs full stack trace for detailed error messages
        return jsonify({"error": "Internal server error, please try again later."}), 500


if __name__ == '__main__':
    app.run(port=5000)
