CDC25 - Astronaut Risk Assessment System
Overview

CDC25 is an astronaut risk assessment and mission duration prediction system built for the Carolina Data Challenge 2025. It combines machine learning with a web interface to give real-time mission planning insights for space agencies.

Features

Mission Duration Prediction: Ensemble ML model (Random Forest, Gradient Boosting, Neural Network, SVR)

Risk Factor Analysis: Scores based on age, experience, mission complexity

Recommendations: Contextual mission planning suggestions

Web Dashboard: React frontend with visualizations and real-time predictions

API Backend: Flask server with endpoints for predictions, health, and analytics

Installation
Backend
cd src/backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

Frontend
cd src/frontend
npm install
npm start

Quick Start

Backend runs at http://localhost:8000

Frontend runs at http://localhost:3000

Access the app at http://localhost:3000

Usage
API Example
import requests

data = {"name": "Test Astronaut", "age": 42, "nationality": "USA", "missions": 3, "space_time": 200}
response = requests.post("http://localhost:8000/api/predict", json=data)
print(response.json())

Key Endpoints

POST /api/predict — Submit astronaut data for risk assessment

GET /api/model/status — Model status and metrics

GET /api/visualizations — Charts and analytics

GET /api/health — System health check

Project Team

Caleb Han — Full-stack development, ML integration

Ethan Tran — Data analysis and model development

Erae Ko — Frontend development and UI/UX

Jeffery Liu — Backend architecture and API design
