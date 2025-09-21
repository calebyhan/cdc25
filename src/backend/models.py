# models.py - Machine Learning models for CDC25 mission duration prediction
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, VotingRegressor, StackingRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.svm import SVR
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.preprocessing import StandardScaler, LabelEncoder
import warnings
warnings.filterwarnings('ignore')


MODEL_STATE = {
    'is_trained': False,
    'model': None,
    'scaler': None,
    'label_encoders': {},
    'feature_names': [],
    'model_version': '1.0.0',
    'training_score': {},
    'prediction_count': 0,
    'last_updated': None
}

def load_and_prepare_data():
    """Load and prepare the astronaut mission data for training"""
    try:

        data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'Social_Science.csv')

        if not os.path.exists(data_path):
            print(f"Warning: Data file not found at {data_path}")
            return create_synthetic_data()

        df = pd.read_csv(data_path)


        df_clean = df.dropna(subset=['Name', 'Year', 'Mission'])


        df_clean['Age'] = df_clean.get('Age', np.random.randint(25, 60, len(df_clean)))
        df_clean['Missions'] = df_clean.groupby('Name').cumcount() + 1
        df_clean['Space_time'] = df_clean.get('Space_time', np.random.randint(50, 500, len(df_clean)))


        np.random.seed(42)
        base_duration = np.random.normal(200, 50, len(df_clean))
        age_factor = (df_clean['Age'] - 35) * -2
        experience_factor = df_clean['Missions'] * 10
        space_time_factor = df_clean['Space_time'] * 0.5

        df_clean['Mission_Duration_Hours'] = np.maximum(
            base_duration + age_factor + experience_factor + space_time_factor,
            24
        )

        return df_clean

    except Exception as e:
        print(f"Error loading data: {e}")
        return create_synthetic_data()

def create_synthetic_data():
    """Create synthetic astronaut data for demonstration"""
    np.random.seed(42)
    n_samples = 200

    names = [f"Astronaut_{i}" for i in range(n_samples)]
    ages = np.random.randint(25, 60, n_samples)
    nationalities = np.random.choice(['USA', 'Russia', 'Japan', 'ESA', 'Canada', 'China'], n_samples)
    missions = np.random.randint(1, 8, n_samples)
    space_time = np.random.randint(50, 1000, n_samples)


    mission_types = np.random.choice(['ISS Expedition', 'Space Shuttle', 'Commercial Crew', 'Lunar Mission'], n_samples)
    roles = np.random.choice(['commander', 'pilot', 'mission_specialist', 'flight_engineer'], n_samples)
    launch_weather = np.random.choice(['Clear', 'Partly Cloudy', 'Overcast', 'Poor'], n_samples)
    manufacturers = np.random.choice(['SpaceX', 'Boeing', 'Roscosmos', 'Other'], n_samples)
    mission_complexity = np.random.uniform(0.1, 1.0, n_samples)
    success_probability = np.random.uniform(0.7, 0.99, n_samples)
    military = np.random.choice([True, False], n_samples)


    experience_levels = ['Junior' if m < 2 else 'Senior' if m > 4 else 'Intermediate' for m in missions]
    age_groups = ['Young' if a < 35 else 'Senior' if a > 50 else 'Middle' for a in ages]
    career_stages = ['Early' if m < 3 else 'Experienced' if m > 5 else 'Mid' for m in missions]


    base_duration = np.random.normal(200, 50, n_samples)
    age_factor = (ages - 35) * -2
    experience_factor = missions * 15
    space_time_factor = space_time * 0.3


    complexity_factor = mission_complexity * 100
    role_factor = [20 if r == 'commander' else 10 if r == 'pilot' else 0 for r in roles]
    weather_factor = [10 if w == 'Poor' else 5 if w == 'Overcast' else 0 for w in launch_weather]

    mission_duration = np.maximum(
        base_duration + age_factor + experience_factor + space_time_factor +
        complexity_factor + role_factor + weather_factor,
        24
    )

    return pd.DataFrame({
        'Name': names,
        'Age': ages,
        'Nationality': nationalities,
        'Missions': missions,
        'Space_time': space_time,
        'Mission_Type': mission_types,
        'Role': roles,
        'Launch_Weather': launch_weather,
        'Manufacturer': manufacturers,
        'Mission_Complexity': mission_complexity,
        'Success_Probability': success_probability,
        'Military': military,
        'Experience_Level': experience_levels,
        'Age_Group': age_groups,
        'Career_Stage': career_stages,
        'Mission_Duration_Hours': mission_duration
    })

def prepare_features(df):
    """Prepare features for machine learning"""
    features_df = df.copy()


    numerical_features = ['Age', 'Missions', 'Space_time', 'Mission_Complexity', 'Success_Probability']


    boolean_features = ['Military']
    for bool_feature in boolean_features:
        if bool_feature in features_df.columns:
            features_df[f'{bool_feature}_numeric'] = features_df[bool_feature].astype(int)
            numerical_features.append(f'{bool_feature}_numeric')

    categorical_features = ['Nationality', 'Mission_Type', 'Role', 'Launch_Weather',
                           'Manufacturer', 'Experience_Level', 'Age_Group', 'Career_Stage']


    for cat_feature in categorical_features:
        if cat_feature in features_df.columns:
            le = LabelEncoder()
            features_df[f'{cat_feature}_encoded'] = le.fit_transform(features_df[cat_feature].astype(str))
            MODEL_STATE['label_encoders'][cat_feature] = le


    available_numerical = [f for f in numerical_features if f in features_df.columns]
    available_categorical = [f'{cat}_encoded' for cat in categorical_features if cat in features_df.columns]
    feature_columns = available_numerical + available_categorical

    X = features_df[feature_columns]
    y = features_df['Mission_Duration_Hours']

    MODEL_STATE['feature_names'] = feature_columns

    return X, y

def train_model():
    """Train the ensemble machine learning model"""
    try:
        print("Loading and preparing data...")
        df = load_and_prepare_data()

        print(f"Dataset shape: {df.shape}")

        X, y = prepare_features(df)

        print(f"Features: {MODEL_STATE['feature_names']}")

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        print("Training ensemble model...")

        rf = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
        gb = GradientBoostingRegressor(n_estimators=100, random_state=42, max_depth=6)
        mlp = MLPRegressor(hidden_layer_sizes=(100, 50), random_state=42, max_iter=500)
        svr = SVR(kernel='rbf', C=100, gamma='scale')

        base_models = [
            ('rf', rf),
            ('gb', gb),
            ('mlp', mlp),
            ('svr', svr)
        ]

        final_estimator = Ridge(alpha=1.0)

        stacking_model = StackingRegressor(
            estimators=base_models,
            final_estimator=final_estimator,
            cv=5
        )

        stacking_model.fit(X_train_scaled, y_train)

        y_pred_train = stacking_model.predict(X_train_scaled)
        y_pred_test = stacking_model.predict(X_test_scaled)

        train_r2 = r2_score(y_train, y_pred_train)
        test_r2 = r2_score(y_test, y_pred_test)
        train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
        test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))

        print(f"Training R2 Score: {train_r2:.4f}")
        print(f"Testing R2 Score: {test_r2:.4f}")
        print(f"Training RMSE: {train_rmse:.2f} hours")
        print(f"Testing RMSE: {test_rmse:.2f} hours")

        MODEL_STATE.update({
            'is_trained': True,
            'model': stacking_model,
            'scaler': scaler,
            'training_score': {
                'r2_score': test_r2,
                'rmse': test_rmse,
                'train_r2': train_r2,
                'train_rmse': train_rmse
            },
            'last_updated': datetime.now().isoformat()
        })

        print("Model training completed successfully!")

        return True

    except Exception as e:
        print(f"Model training failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def predict_mission_risk(astronaut_data):
    """Make risk prediction for an astronaut"""
    try:
        if not MODEL_STATE['is_trained']:
            print("Training model...")
            if not train_model():
                return {'error': 'Model training failed'}

        input_data = {
            'Age': astronaut_data['age'],
            'Missions': astronaut_data['missions'],
            'Space_time': astronaut_data['space_time'],
            'Nationality': astronaut_data['nationality'],
            'Mission_Type': astronaut_data.get('mission_type', 'ISS Expedition'),
            'Role': astronaut_data.get('role', 'mission_specialist'),
            'Launch_Weather': astronaut_data.get('launch_weather', 'Clear'),
            'Manufacturer': astronaut_data.get('manufacturer', 'Other'),
            'Mission_Complexity': astronaut_data.get('mission_complexity', 0.5),
            'Success_Probability': astronaut_data.get('success_probability', 0.9),
            'Military': astronaut_data.get('military', False),
            'Experience_Level': astronaut_data.get('experience_level', 'Intermediate'),
            'Age_Group': astronaut_data.get('age_group', 'Middle'),
            'Career_Stage': astronaut_data.get('career_stage', 'Mid')
        }

        input_df = pd.DataFrame([input_data])

        if 'Military' in input_df.columns:
            input_df['Military_numeric'] = input_df['Military'].astype(int)

        for cat_feature, encoder in MODEL_STATE['label_encoders'].items():
            if cat_feature in input_df.columns:
                try:
                    input_df[f'{cat_feature}_encoded'] = encoder.transform(input_df[cat_feature].astype(str))
                except ValueError:
                    input_df[f'{cat_feature}_encoded'] = 0

        X_input = input_df[MODEL_STATE['feature_names']]

        X_input_scaled = MODEL_STATE['scaler'].transform(X_input)

        duration_pred = MODEL_STATE['model'].predict(X_input_scaled)[0]

        base_uncertainty = MODEL_STATE['training_score']['rmse']
        confidence_interval = [
            max(24, duration_pred - 1.96 * base_uncertainty),
            duration_pred + 1.96 * base_uncertainty
        ]

        age = astronaut_data['age']
        missions = astronaut_data['missions']
        space_time = astronaut_data['space_time']

        mission_complexity = input_data['Mission_Complexity']
        success_probability = input_data['Success_Probability']
        role = input_data['Role']
        launch_weather = input_data['Launch_Weather']
        military = input_data['Military']

        age_risk = max(0, (age - 50) * 0.02) if age > 50 else 0
        inexperience_risk = max(0, (3 - missions) * 0.1) if missions < 3 else 0
        long_duration_risk = max(0, (duration_pred - 300) * 0.001) if duration_pred > 300 else 0

        complexity_risk = max(0, (mission_complexity - 0.7) * 0.3) if mission_complexity > 0.7 else 0
        probability_risk = max(0, (0.9 - success_probability) * 0.5) if success_probability < 0.9 else 0
        role_risk = 0.1 if role == 'commander' else 0.05 if role == 'pilot' else 0
        weather_risk = 0.15 if launch_weather == 'Poor' else 0.08 if launch_weather == 'Overcast' else 0
        military_bonus = -0.05 if military else 0  # Military experience reduces risk

        total_risk = (age_risk + inexperience_risk + long_duration_risk +
                     complexity_risk + probability_risk + role_risk + weather_risk + military_bonus)
        risk_score = min(1.0, max(0.05, total_risk))

        if risk_score < 0.3:
            risk_level = 'Low'
        elif risk_score < 0.6:
            risk_level = 'Medium'
        else:
            risk_level = 'High'

        risk_factors = []
        if age_risk > 0:
            risk_factors.append(f"Age-related risk: {age} years old (score: {round(age_risk, 3)})")
        if inexperience_risk > 0:
            risk_factors.append(f"Limited experience: {missions} missions completed (score: {round(inexperience_risk, 3)})")
        if long_duration_risk > 0:
            risk_factors.append(f"Extended mission duration: {round(duration_pred, 1)} hours (score: {round(long_duration_risk, 3)})")
        if complexity_risk > 0:
            risk_factors.append(f"High mission complexity: {round(mission_complexity, 2)} (score: {round(complexity_risk, 3)})")
        if probability_risk > 0:
            risk_factors.append(f"Lower success probability: {round(success_probability, 2)} (score: {round(probability_risk, 3)})")
        if role_risk > 0:
            risk_factors.append(f"Leadership role responsibility: {role} (score: {round(role_risk, 3)})")
        if weather_risk > 0:
            risk_factors.append(f"Adverse launch conditions: {launch_weather} (score: {round(weather_risk, 3)})")
        if military_bonus < 0:
            risk_factors.append(f"Military experience advantage (score: {round(military_bonus, 3)})")

        if risk_score >= 0.6:
            risk_factors.append("High overall risk profile - requires enhanced monitoring")
        elif risk_score >= 0.4:
            risk_factors.append("Moderate risk profile - standard protocols with additional precautions")
        else:
            risk_factors.append("Low risk profile - standard mission protocols apply")

        if len([f for f in risk_factors if not f.startswith("Low risk") and not f.startswith("Moderate risk") and not f.startswith("High overall")]) == 0:
            risk_factors.append("No significant risk factors identified")

        recommendations = []
        if age > 50:
            recommendations.append("Consider additional health monitoring for older astronaut")
        if missions < 3:
            recommendations.append("Provide additional training and mentorship")
        if duration_pred > 300:
            recommendations.append("Plan for extended mission support and regular check-ins")
        if mission_complexity > 0.7:
            recommendations.append("Enhanced mission planning and contingency protocols for high complexity")
        if success_probability < 0.85:
            recommendations.append("Additional risk mitigation measures and backup plans required")
        if role in ['commander', 'pilot']:
            recommendations.append("Leadership training and stress management protocols")
        if launch_weather in ['Poor', 'Overcast']:
            recommendations.append("Monitor weather conditions and consider launch delay if necessary")
        if not military:
            recommendations.append("Additional stress and emergency response training recommended")
        if risk_score > 0.6:
            recommendations.append("Implement enhanced safety protocols")

        if not recommendations:
            recommendations.append("Standard mission protocols apply")

        MODEL_STATE['prediction_count'] += 1

        return {
            'astronaut': {
                'name': astronaut_data['name'],
                'age': age,
                'nationality': astronaut_data['nationality'],
                'missions': missions,
                'space_time': space_time,
                'mission_type': input_data['Mission_Type'],
                'role': input_data['Role'],
                'launch_weather': input_data['Launch_Weather'],
                'manufacturer': input_data['Manufacturer'],
                'mission_complexity': input_data['Mission_Complexity'],
                'success_probability': input_data['Success_Probability'],
                'military': input_data['Military'],
                'experience_level': input_data['Experience_Level'],
                'age_group': input_data['Age_Group'],
                'career_stage': input_data['Career_Stage']
            },
            'prediction': {
                'duration_hours': round(duration_pred, 1),
                'duration_days': round(duration_pred / 24, 1),
                'confidence_interval_hours': [round(ci, 1) for ci in confidence_interval]
            },
            'risk_assessment': {
                'risk_score': round(risk_score, 3),
                'risk_level': risk_level,
            },
            'risk_factors': risk_factors,
            'recommendations': recommendations,
            'model_info': {
                'version': MODEL_STATE['model_version'],
                'confidence': round(MODEL_STATE['training_score'].get('r2_score', 0.8), 3)
            },
            'timestamp': datetime.now().isoformat()
        }

    except Exception as e:
        import traceback
        return {
            'error': f'Prediction failed: {str(e)}',
            'traceback': traceback.format_exc()
        }

def get_model_status():
    """Get current model status and information"""
    return {
        'is_trained': MODEL_STATE['is_trained'],
        'model_version': MODEL_STATE['model_version'],
        'feature_names': MODEL_STATE['feature_names'],
        'training_score': MODEL_STATE['training_score'],
        'prediction_count': MODEL_STATE['prediction_count'],
        'last_updated': MODEL_STATE['last_updated'],
        'model_type': 'Stacking Ensemble (RF + GB + MLP + SVR)'
    }

def generate_visualization_data():
    """Generate data for visualizations"""
    try:
        df = load_and_prepare_data()

        age_bins = pd.cut(df['Age'], bins=[0, 30, 40, 50, 100], labels=['Under 30', '30-39', '40-49', '50+'])
        age_dist = age_bins.value_counts().to_dict()

        nationality_dist = df['Nationality'].value_counts().to_dict()

        df['Risk_Category'] = pd.cut(df['Mission_Duration_Hours'],
                                   bins=[0, 150, 250, 500],
                                   labels=['Low', 'Medium', 'High'])
        risk_dist = df['Risk_Category'].value_counts().to_dict()

        experience_stats = df.groupby('Missions').agg({
            'Mission_Duration_Hours': 'mean',
            'Age': 'mean'
        }).round(2).to_dict('index')

        return {
            'statistics': {
                'total_astronauts': len(df['Name'].unique()),
                'total_missions': len(df),
                'avg_mission_duration': round(df['Mission_Duration_Hours'].mean(), 1),
                'countries': len(df['Nationality'].unique())
            },
            'charts': {
                'age_distribution': [{'age_group': k, 'count': v} for k, v in age_dist.items()],
                'nationality_distribution': [{'name': k, 'value': v} for k, v in nationality_dist.items()],
                'risk_distribution': [{'risk_level': k, 'count': v} for k, v in risk_dist.items()],
                'experience_analysis': [
                    {
                        'missions': k,
                        'avg_duration': v['Mission_Duration_Hours'],
                        'avg_age': v['Age']
                    } for k, v in experience_stats.items()
                ]
            },
            'model_metrics': MODEL_STATE['training_score'] if MODEL_STATE['is_trained'] else {},
            'timestamp': datetime.now().isoformat()
        }

    except Exception as e:
        return {
            'error': f'Visualization data generation failed: {str(e)}',
            'fallback': True
        }

if __name__ == "__main__":
    print("Training model...")
    train_model()
