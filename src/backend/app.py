# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import random

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Test data
TEST_ASTRONAUTS = [
    {
        'id': 1,
        'name': 'John Smith',
        'age': 42,
        'experience_years': 8,
        'mission_count': 3
    },
    {
        'id': 2,
        'name': 'Sarah Johnson',
        'age': 38,
        'experience_years': 5,
        'mission_count': 2
    }
]

@app.route('/')
def home():
    return jsonify({
        'message': '🚀 CDC25 Server is Running!',
        'test_endpoints': {
            'GET /': 'This message',
            'GET /api': 'API info',
            'GET /api/about': 'About the project',
            'GET /api/astronauts': 'Get test astronauts',
            'POST /api/predict': 'Test prediction (send JSON)',
            'GET /api/health': 'Health check'
        },
        'timestamp': datetime.now().isoformat()
    })

# API info
@app.route('/api')
def api_info():
    return jsonify({
        'name': 'CDC25 Astronaut Risk API',
        'version': '1.0.0',
        'status': 'running'
    })

# Update the about endpoint in app.py
@app.route('/api/about')
def about():
    return jsonify({
        'project': 'CDC25',
        'title': 'Astronaut Risk Assessment',
        'hackathon': 'Carolina Data Challenge',
        'description': 'ML app for astronaut mission risk prediction',
        'team': {
            'name': 'CDC25 Team',
            'members': [
                {'name': 'Caleb Han', 'role': 'Team Member'},
                {'name': 'Ethan Tran', 'role': 'Team Member'},
                {'name': 'Erae Ko', 'role': 'Team Member'},
                {'name': 'Jeffery Lin', 'role': 'Team Member'}
            ]
        },
        'technologies': {
            'backend': ['Python', 'Flask', 'scikit-learn'],
            'frontend': ['React', 'JavaScript'],
            'deployment': ['TBD']
        }
    })

# Get test astronauts
@app.route('/api/astronauts')
def get_astronauts():
    return jsonify({
        'astronauts': TEST_ASTRONAUTS,
        'count': len(TEST_ASTRONAUTS)
    })

# Test prediction endpoint
@app.route('/api/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'GET':
        return jsonify({
            'message': 'Send POST request with astronaut data',
            'example': {
                'name': 'Test Astronaut',
                'age': 40,
                'experience_years': 5
            }
        })
    
    # POST request
    try:
        data = request.json or {}
        
        # Simulate a prediction
        risk_score = round(random.uniform(0.1, 0.9), 2)
        
        return jsonify({
            'status': 'success',
            'input_data': data,
            'prediction': {
                'risk_score': risk_score,
                'risk_level': 'Low' if risk_score < 0.3 else 'Medium' if risk_score < 0.7 else 'High',
                'confidence': round(random.uniform(0.7, 0.95), 2)
            },
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Health check
@app.route('/api/health')
def health():
    return jsonify({
        'status': 'Healthy',
        'app': 'CDC25',
        'uptime': 'Just started',
        'timestamp': datetime.now().isoformat()
    })


# Add this endpoint after the health check endpoint

# Data visualization endpoint
@app.route('/api/visualizations')
def get_visualizations():
    return jsonify({
        'risk_distribution': {
            'labels': ['Low Risk', 'Medium Risk', 'High Risk'],
            'data': [45, 35, 20],
            'colors': ['#4CAF50', '#FFC107', '#F44336']
        },
        'mission_success_by_experience': {
            'labels': ['0-2 years', '3-5 years', '6-10 years', '10+ years'],
            'success_rates': [82, 89, 94, 97],
            'mission_counts': [15, 28, 42, 35]
        },
        'risk_factors': {
            'labels': ['Age', 'Experience', 'Health', 'Mission Type', 'Duration'],
            'impact_scores': [0.25, 0.35, 0.20, 0.15, 0.05]
        },
        'astronaut_demographics': {
            'age_groups': {
                '25-35': 12,
                '36-45': 18,
                '46-55': 8,
                '56+': 2
            },
            'nationalities': {
                'USA': 15,
                'Russia': 8,
                'Japan': 5,
                'ESA': 7,
                'Other': 5
            }
        },
        'mission_trends': {
            'years': [2019, 2020, 2021, 2022, 2023, 2024],
            'missions': [12, 10, 15, 18, 22, 25],
            'success_rates': [95, 93, 96, 97, 98, 99]
        }
    })

# Test error handling
@app.route('/api/test-error')
def test_error():
    raise Exception("This is a test error!")

# 404 handler
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': '404 - Endpoint not found'}), 404

# Error handler
@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': '500 - Internal server error', 'details': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting CDC25 Server...")
    print("📍 Server running at http://localhost:8000")
    print("📍 Test the API at http://localhost:8000/api")
    app.run(debug=True, host='0.0.0.0', port=8000)

