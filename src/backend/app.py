# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import random
import traceback

# Import our ML models and data processing
from models import predict_mission_risk, get_model_status, generate_visualization_data
from data import validate_input_data

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
    model_status = get_model_status()
    return jsonify({
        'name': 'CDC25 Astronaut Risk API',
        'version': '1.0.0',
        'status': 'running',
        'model_info': f"ML Model v{model_status.get('model_version', '1.0.0')} - {'Trained' if model_status.get('is_trained', False) else 'Not Trained'}",
        'endpoints': {
            'GET /api/predict': 'Get prediction endpoint info',
            'POST /api/predict': 'Make risk prediction',
            'GET /api/model/status': 'Get ML model status',
            'GET /api/visualizations': 'Get data for charts and visualizations'
        }
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
                {'name': 'Jeffery Liu', 'role': 'Team Member'}
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

# Enhanced prediction endpoint with real ML model
@app.route('/api/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'GET':
        return jsonify({
            'message': 'Send POST request with astronaut data for mission duration prediction',
            'model_info': 'Advanced ensemble ML model (Random Forest + Gradient Boosting + Neural Network + SVR)',
            'required_fields': ['name', 'age', 'nationality', 'missions', 'space_time'],
            'example': {
                'name': 'Test Astronaut',
                'age': 42,
                'nationality': 'USA',
                'missions': 2,
                'space_time': 150
            },
            'output': {
                'prediction': 'Mission duration in hours and days',
                'risk_assessment': 'Risk level and factors',
                'recommendations': 'Mission planning recommendations'
            }
        })

    # POST request - Real ML prediction
    try:
        data = request.json or {}

        # Validate required fields
        required_fields = ['name', 'age', 'nationality', 'missions', 'space_time']
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({
                'error': 'Missing required fields',
                'missing_fields': missing_fields,
                'required_fields': required_fields
            }), 400

        # Make prediction using the ML model
        prediction_result = predict_mission_risk(data)

        # Check for prediction errors
        if 'error' in prediction_result:
            return jsonify({
                'error': 'Prediction failed',
                'details': prediction_result['error']
            }), 500

        # Return successful prediction
        return jsonify({
            'status': 'success',
            'astronaut': prediction_result['astronaut'],
            'risk_score': prediction_result['risk_assessment']['risk_score'],
            'risk_level': prediction_result['risk_assessment']['risk_level'],
            'risk_factors': prediction_result['risk_factors'],  # Fixed: now at top level
            'predicted_duration_hours': prediction_result['prediction']['duration_hours'],
            'predicted_duration_days': prediction_result['prediction']['duration_days'],
            'confidence_interval_hours': prediction_result['prediction']['confidence_interval_hours'],
            'recommendations': prediction_result['recommendations'],
            'model_version': prediction_result['model_info']['version'],
            'timestamp': prediction_result['timestamp']
        })

    except Exception as e:
        # Detailed error logging
        error_details = traceback.format_exc()
        print(f"Prediction error: {error_details}")

        return jsonify({
            'error': 'Internal server error during prediction',
            'message': str(e),
            'type': 'prediction_error'
        }), 500

# Model status endpoint
@app.route('/api/model/status')
def model_status():
    try:
        status = get_model_status()
        return jsonify({
            'model_status': 'ready' if status.get('is_trained') else 'training',
            'model_info': status,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'error': 'Failed to get model status',
            'details': str(e)
        }), 500

# Health check
@app.route('/api/health')
def health():
    try:
        model_status = get_model_status()
        return jsonify({
            'status': 'Healthy',
            'app': 'CDC25',
            'components': {
                'api_server': 'running',
                'ml_model': 'ready' if model_status.get('is_trained') else 'training',
                'data_processing': 'operational'
            },
            'model_info': {
                'version': model_status.get('model_version', 'unknown'),
                'predictions_made': model_status.get('prediction_count', 0),
                'training_score': model_status.get('training_score')
            },
            'uptime': 'Running',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'status': 'Degraded',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500


# Add this endpoint after the health check endpoint

# Data visualization endpoint with real ML-generated data
@app.route('/api/visualizations')
def get_visualizations():
    try:
        # Get ML-generated visualization data
        viz_data = generate_visualization_data()
        return jsonify(viz_data)
    except Exception as e:
        # Fallback to static data if ML data generation fails
        print(f"Visualization error: {e}")
        return jsonify({
            'error': 'Using fallback data',
            'statistics': {
                'total_astronauts': 100,
                'total_missions': 75,
                'countries': 10,
                'avg_risk_score': 0.45
            },
            'charts': {
                'age_distribution': [
                    {'age_group': '25-35', 'count': 45},
                    {'age_group': '36-45', 'count': 35},
                    {'age_group': '46-55', 'count': 15},
                    {'age_group': '56+', 'count': 5}
                ],
                'nationality_distribution': [
                    {'name': 'USA', 'value': 40},
                    {'name': 'Russia', 'value': 25},
                    {'name': 'Japan', 'value': 15},
                    {'name': 'ESA', 'value': 12},
                    {'name': 'Other', 'value': 8}
                ]
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

    # Initialize ML model
    try:
        print("🤖 Initializing ML model...")
        model_info = get_model_status()
        if model_info.get('is_trained'):
            print(f"✅ ML Model v{model_info.get('model_version')} ready!")
            print(f"📊 Training score: R² = {model_info.get('training_score', {}).get('r2_score', 'N/A')}")
        else:
            print("⚠️ ML Model not trained")
    except Exception as e:
        print(f"❌ ML Model initialization failed: {e}")

    print("🎯 Key endpoints:")
    print("   • POST /api/predict - Mission duration prediction")
    print("   • GET /api/model/status - ML model information")
    print("   • GET /api/visualizations - Data analytics")
    print("   • GET /api/health - System health check")

    app.run(debug=True, host='0.0.0.0', port=8000)
