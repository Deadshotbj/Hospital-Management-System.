import requests

url = 'http://127.0.0.1:5000/predict'
symptoms = ["fever"]  # Only symptom descriptions should be included

response = requests.post(url, json={"symptoms": symptoms})

print(response.json())
