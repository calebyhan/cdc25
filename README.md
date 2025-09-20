# CDC25 - Astronaut Risk Assessment System

## 🚀 Project Overview

CDC25 is a comprehensive astronaut risk assessment and mission duration prediction system built for the Carolina Data Challenge 2025. The project combines advanced machine learning with an intuitive web interface to provide real-time mission planning insights for space agencies and astronaut safety teams.

### Key Components
1. **ML-Powered Risk Assessment**: Advanced ensemble models predict mission duration and assess astronaut risk factors
2. **Interactive Web Dashboard**: React-based frontend for real-time predictions and data visualization
3. **RESTful API Backend**: Flask server with integrated machine learning pipeline
4. **Comprehensive Analytics**: Statistical analysis and visualization tools for mission planning

## 🎯 Features

### Risk Assessment & Prediction
- **Mission Duration Prediction**: Ensemble ML model (Random Forest + Gradient Boosting + Neural Network + SVR)
- **Risk Factor Analysis**: Multi-dimensional risk scoring based on age, experience, and mission complexity
- **Confidence Intervals**: Statistical uncertainty quantification for predictions
- **Smart Recommendations**: Contextual mission planning suggestions

### Interactive Web Interface
- **Real-time Predictions**: Submit astronaut data and get instant risk assessments
- **Data Visualizations**: Dynamic charts showing risk distributions and mission analytics
- **Model Status Monitoring**: Live ML model performance metrics
- **Responsive Design**: Modern UI built with React and Chakra UI

### API & Backend
- **RESTful Endpoints**: Complete API for predictions, visualizations, and system health
- **Data Processing Pipeline**: Automated feature engineering and validation
- **Model Management**: Dynamic model training and status monitoring
- **Error Handling**: Robust error management and logging

## 🛠 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- Virtual environment (recommended)

### Backend Setup
```bash
# Navigate to project directory
cd /path/to/cdc25

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start the Flask backend server
cd src/backend
python app.py
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd src/frontend

# Install Node.js dependencies
npm install

# Start the React development server
npm start
```

### Quick Start
1. **Start Backend**: Flask server runs on `http://localhost:8000`
2. **Start Frontend**: React app runs on `http://localhost:3000`
3. **Access Application**: Open `http://localhost:3000` in your browser
4. **Test Predictions**: Use the risk assessment form to submit astronaut data

## 📈 Usage Examples

### Web Interface
1. **Risk Assessment**: Enter astronaut details (name, age, nationality, missions, space time)
2. **View Predictions**: Get mission duration predictions with confidence intervals
3. **Analyze Risk Factors**: Review detailed risk breakdowns and recommendations
4. **Explore Data**: Access interactive visualizations and model metrics

### API Integration
```python
import requests

# Make a prediction request
data = {
    "name": "Test Astronaut",
    "age": 42,
    "nationality": "USA", 
    "missions": 3,
    "space_time": 200
}

response = requests.post("http://localhost:8000/api/predict", json=data)
prediction = response.json()

print(f"Predicted duration: {prediction['predicted_duration_hours']} hours")
print(f"Risk level: {prediction['risk_level']}")
```

### Model Status Check
```bash
# Check ML model status
curl http://localhost:8000/api/model/status

# Get system health
curl http://localhost:8000/api/health

# Fetch visualization data
curl http://localhost:8000/api/visualizations
```

## 🔬 Technical Architecture

### Machine Learning Pipeline
- **Ensemble Model**: Stacking regressor combining Random Forest, Gradient Boosting, MLP, and SVR
- **Feature Engineering**: Age, experience, nationality, and space time processing
- **Risk Scoring**: Multi-factor risk assessment with interpretable outputs
- **Model Validation**: Cross-validation with R² = 0.67 and RMSE = 70.66 hours

### Backend Technology
- **Framework**: Flask with CORS support
- **ML Libraries**: scikit-learn, pandas, numpy
- **Data Processing**: Automated cleaning and feature engineering
- **API Design**: RESTful endpoints with comprehensive error handling

### Frontend Technology
- **Framework**: React with functional components and hooks
- **UI Library**: Chakra UI for modern, responsive design
- **State Management**: React hooks for local state
- **API Integration**: Axios for HTTP requests

### Data Sources
- **Primary Dataset**: `data/Social_Science.csv` (astronaut mission records)
- **Synthetic Data**: Generated fallback data for demonstration
- **Real-time Processing**: Dynamic feature extraction and encoding

## 🎖 Project Team

**Team CDC25**
- **Caleb Han** - Full-stack development, ML integration
- **Ethan Tran** - Data analysis and model development  
- **Erae Ko** - Frontend development and UI/UX
- **Jeffery Liu** - Backend architecture and API design

## 📊 Key API Endpoints

### Prediction & Analysis
- `POST /api/predict` - Submit astronaut data for risk assessment
- `GET /api/model/status` - Get ML model information and metrics
- `GET /api/visualizations` - Fetch charts and analytics data
- `GET /api/health` - System health check

### Information & Testing
- `GET /api` - API documentation and endpoints
- `GET /api/about` - Project and team information
- `GET /api/astronauts` - Sample astronaut data

## 🚀 Deployment & Production

### Current Status
- **Development**: Fully functional local development environment
- **Testing**: Comprehensive error handling and validation
- **Documentation**: Complete API documentation and usage guides

### Production Considerations
- **Containerization**: Docker support for consistent deployments
- **Database**: Optional database integration for data persistence
- **Scaling**: Load balancing for high-traffic scenarios
- **Monitoring**: Application performance monitoring integration

## 📝 Project Structure

```
cdc25/
├── README.md                          # Project documentation
├── requirements.txt                   # Python dependencies
├── data/
│   └── Social_Science.csv            # Astronaut mission dataset
├── src/
│   ├── backend/                      # Flask API server
│   │   ├── app.py                    # Main Flask application
│   │   ├── models.py                 # ML models and prediction logic
│   │   └── data.py                   # Data processing utilities
│   └── frontend/                     # React web application
│       ├── package.json              # Node.js dependencies
│       ├── src/
│       │   ├── App.js               # Main React component
│       │   ├── components/          # UI components
│       │   └── services/            # API integration
│       └── build/                    # Production build files
└── testing/
    └── mission_duration_analysis.ipynb  # Jupyter notebook analysis
```

## 🔧 Development Notes

### Model Performance
- **Training R²**: 0.8758 (excellent fit on training data)
- **Testing R²**: 0.6668 (good generalization)
- **RMSE**: 70.66 hours (reasonable prediction accuracy)
- **Features**: Age, Missions, Space_time, Nationality_encoded

### Known Issues & Limitations
- **Data Dependency**: Model performance depends on training data quality
- **Feature Scope**: Limited to basic astronaut characteristics
- **Scalability**: Current implementation optimized for demonstration

### Future Enhancements
- **Advanced Features**: Health metrics, psychological profiles, mission complexity
- **Real-time Data**: Integration with live mission data feeds
- **Enhanced UI**: More sophisticated visualizations and dashboards
- **Mobile Support**: Responsive design optimization for mobile devices

## 📄 License

This project is developed for the Carolina Data Challenge 2025 hackathon competition.

---

**CDC25 - Empowering safer space exploration through intelligent risk assessment**

*Built with ❤️ for the Carolina Data Challenge 2025*
