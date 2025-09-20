# data.py - Data processing and feature engineering for CDC25 mission analysis
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.preprocessing import StandardScaler, LabelEncoder, RobustScaler
from sklearn.model_selection import train_test_split

def clean_data(df):
    """Clean and preprocess the astronaut mission data"""
    data = df.copy()
    
    # Handle missing values
    if 'Name' in data.columns:
        data = data.dropna(subset=['Name'])
    
    # Standardize column names
    column_mapping = {
        'name': 'Name',
        'age': 'Age', 
        'nationality': 'Nationality',
        'missions': 'Missions',
        'space_time': 'Space_time'
    }
    
    for old_col, new_col in column_mapping.items():
        if old_col in data.columns and new_col not in data.columns:
            data[new_col] = data[old_col]
    
    # Data type conversions
    numeric_columns = ['Age', 'Missions', 'Space_time']
    for col in numeric_columns:
        if col in data.columns:
            data[col] = pd.to_numeric(data[col], errors='coerce')
    
    # Remove outliers
    for col in numeric_columns:
        if col in data.columns:
            Q1 = data[col].quantile(0.25)
            Q3 = data[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            data = data[(data[col] >= lower_bound) & (data[col] <= upper_bound)]
    
    return data

def create_features(df):
    """Create additional features for machine learning"""
    data = df.copy()
    
    # Age-based features
    if 'Age' in data.columns:
        data['Age_squared'] = data['Age'] ** 2
        data['Age_group'] = pd.cut(data['Age'], 
                                 bins=[0, 30, 40, 50, 100], 
                                 labels=['Young', 'Middle', 'Senior', 'Veteran'])
    
    # Experience-based features
    if 'Missions' in data.columns:
        data['Experience_level'] = pd.cut(data['Missions'],
                                        bins=[0, 1, 3, 5, 100],
                                        labels=['Rookie', 'Novice', 'Experienced', 'Expert'])
        data['Missions_squared'] = data['Missions'] ** 2
    
    # Space time features
    if 'Space_time' in data.columns:
        data['Space_time_log'] = np.log1p(data['Space_time'])
        data['Space_time_per_mission'] = data['Space_time'] / (data['Missions'] + 1)
    
    # Interaction features
    if 'Age' in data.columns and 'Missions' in data.columns:
        data['Age_Experience_ratio'] = data['Age'] / (data['Missions'] + 1)
        data['Experience_per_year'] = data['Missions'] / (data['Age'] - 20)  # Assuming career starts at 20
    
    return data

def encode_categorical_features(df, categorical_columns=None):
    """Encode categorical features for machine learning"""
    if categorical_columns is None:
        categorical_columns = ['Nationality', 'Age_group', 'Experience_level']
    
    data = df.copy()
    encoders = {}
    
    for col in categorical_columns:
        if col in data.columns:
            le = LabelEncoder()
            data[f'{col}_encoded'] = le.fit_transform(data[col].astype(str))
            encoders[col] = le
    
    return data, encoders

def scale_features(X_train, X_test=None, scaler_type='standard'):
    """Scale numerical features"""
    if scaler_type == 'standard':
        scaler = StandardScaler()
    elif scaler_type == 'robust':
        scaler = RobustScaler()
    else:
        raise ValueError("scaler_type must be 'standard' or 'robust'")
    
    X_train_scaled = scaler.fit_transform(X_train)
    
    if X_test is not None:
        X_test_scaled = scaler.transform(X_test)
        return X_train_scaled, X_test_scaled, scaler
    
    return X_train_scaled, scaler

def validate_input_data(data):
    """Validate input data for predictions"""
    required_fields = ['name', 'age', 'nationality', 'missions', 'space_time']
    
    errors = []
    
    # Check required fields
    for field in required_fields:
        if field not in data:
            errors.append(f"Missing required field: {field}")
    
    if errors:
        return False, errors
    
    # Validate data types and ranges
    try:
        age = float(data['age'])
        if age < 18 or age > 80:
            errors.append("Age must be between 18 and 80")
    except (ValueError, TypeError):
        errors.append("Age must be a valid number")
    
    try:
        missions = int(data['missions'])
        if missions < 0 or missions > 20:
            errors.append("Missions must be between 0 and 20")
    except (ValueError, TypeError):
        errors.append("Missions must be a valid integer")
    
    try:
        space_time = float(data['space_time'])
        if space_time < 0 or space_time > 10000:
            errors.append("Space time must be between 0 and 10000 hours")
    except (ValueError, TypeError):
        errors.append("Space time must be a valid number")
    
    # Validate nationality
    valid_nationalities = [
        'USA', 'Russia', 'Japan', 'ESA', 'Canada', 'China', 
        'India', 'France', 'Germany', 'Italy', 'UK', 'Other'
    ]
    if data['nationality'] not in valid_nationalities:
        errors.append(f"Nationality must be one of: {', '.join(valid_nationalities)}")
    
    # Validate name
    if not isinstance(data['name'], str) or len(data['name'].strip()) == 0:
        errors.append("Name must be a non-empty string")
    
    return len(errors) == 0, errors

def prepare_data_for_training(df):
    """Prepare data for model training"""
    # Clean the data
    clean_df = clean_data(df)
    
    # Create features
    featured_df = create_features(clean_df)
    
    # Encode categorical features
    encoded_df, encoders = encode_categorical_features(featured_df)
    
    # Select features for training
    numerical_features = [
        'Age', 'Missions', 'Space_time', 'Age_squared', 'Missions_squared',
        'Space_time_log', 'Space_time_per_mission', 'Age_Experience_ratio'
    ]
    
    categorical_encoded_features = [
        'Nationality_encoded', 'Age_group_encoded', 'Experience_level_encoded'
    ]
    
    # Filter features that exist in the dataframe
    available_features = []
    for feature in numerical_features + categorical_encoded_features:
        if feature in encoded_df.columns:
            available_features.append(feature)
    
    X = encoded_df[available_features]
    
    # Assume target variable exists
    if 'Mission_Duration_Hours' in encoded_df.columns:
        y = encoded_df['Mission_Duration_Hours']
    else:
        # Create synthetic target for demonstration
        y = np.random.normal(200, 50, len(encoded_df))
    
    return X, y, encoders, available_features
