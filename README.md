# CDC25 - Astronaut Risk Assessment System

## Overview
CDC25 is an astronaut risk assessment and mission duration prediction system built for the **Carolina Data Challenge 2025**.  
It combines **machine learning** with an **interactive web dashboard** to provide real-time mission planning insights.

## Features
- **Mission Duration Prediction**: Ensemble ML model (Random Forest, Gradient Boosting, Neural Network, SVR)  
- **Risk Factor Analysis**: Multi-dimensional scoring based on age, experience, and mission complexity  
- **Smart Recommendations**: Context-aware planning suggestions  
- **Interactive Dashboard**: React frontend with real-time predictions and visualizations  
- **API Backend**: Flask server with endpoints for predictions, health checks, and analytics  

## Installation

### Backend
```bash
cd src/backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

## Frontend
cd src/frontend  
npm install  
npm start  

## Quick Start
- **Backend**: runs at http://localhost:8000  
- **Frontend**: runs at http://localhost:3000  
- **Access App**: open http://localhost:3000 in your browser  


## Team
**Team CDC25**  
- **Caleb Han** — Full-stack development, ML integration  
- **Ethan Tran** — Data analysis and model development  
- **Erae Ko** — Frontend development and UI/UX  
- **Jeffery Liu** — Backend architecture and API design  
