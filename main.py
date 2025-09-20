import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from collections import Counter

def load_and_clean_data():
    astronauts_df = pd.read_csv('data/Social_Science.csv')
    gdp_df = pd.read_csv('data/Life Expectancy vs GDP 1950-2018.csv')
    
    astronauts_df['Profile.Nationality'] = astronauts_df['Profile.Nationality'].str.replace('U.S.S.R/Russia', 'Russia')
    astronauts_df['Profile.Nationality'] = astronauts_df['Profile.Nationality'].str.replace('U.S.', 'United States')
    
    gdp_df['Country'] = gdp_df['Country'].str.replace('United States', 'United States')
    gdp_df['Country'] = gdp_df['Country'].str.replace('Russian Federation', 'Russia')
    
    return astronauts_df, gdp_df

def analyze_astronaut_countries(astronauts_df):
    astronaut_counts = astronauts_df['Profile.Nationality'].value_counts()
    return astronaut_counts

def get_latest_gdp_data(gdp_df, year=2018):
    latest_gdp = gdp_df[gdp_df['Year'] == year].copy()
    return latest_gdp

def merge_astronaut_gdp_data(astronaut_counts, gdp_data):
    astronaut_df = pd.DataFrame({
        'Country': astronaut_counts.index,
        'Astronaut_Count': astronaut_counts.values
    })
    
    merged_data = pd.merge(astronaut_df, gdp_data[['Country', 'GDP per capita', 'Population (historical estimates)']], 
                          on='Country', how='inner')
    
    merged_data['Total_GDP'] = merged_data['GDP per capita'] * merged_data['Population (historical estimates)']
    
    return merged_data

def create_visualizations(merged_data):
    plt.style.use('seaborn-v0_8')
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    
    # 1. Scatter plot: Astronaut Count vs GDP per capita
    sns.scatterplot(data=merged_data, x='GDP per capita', y='Astronaut_Count', 
                   s=100, alpha=0.7, ax=axes[0,0])
    axes[0,0].set_title('Astronaut Count vs GDP per Capita')
    axes[0,0].set_xlabel('GDP per Capita (USD)')
    axes[0,0].set_ylabel('Number of Astronauts')
    
    for i, row in merged_data.iterrows():
        axes[0,0].annotate(row['Country'], (row['GDP per capita'], row['Astronaut_Count']), 
                          xytext=(5, 5), textcoords='offset points', fontsize=8)
    
    # 2. Scatter plot: Astronaut Count vs Total GDP
    sns.scatterplot(data=merged_data, x='Total_GDP', y='Astronaut_Count', 
                   s=100, alpha=0.7, ax=axes[0,1])
    axes[0,1].set_title('Astronaut Count vs Total GDP')
    axes[0,1].set_xlabel('Total GDP (USD)')
    axes[0,1].set_ylabel('Number of Astronauts')
    axes[0,1].ticklabel_format(style='scientific', axis='x', scilimits=(0,0))
    
    for i, row in merged_data.iterrows():
        axes[0,1].annotate(row['Country'], (row['Total_GDP'], row['Astronaut_Count']), 
                          xytext=(5, 5), textcoords='offset points', fontsize=8)
    
    # 3. Bar plot: Top 10 countries by astronaut count
    top_10 = merged_data.nlargest(10, 'Astronaut_Count')
    sns.barplot(data=top_10, x='Astronaut_Count', y='Country', ax=axes[1,0])
    axes[1,0].set_title('Top 10 Countries by Astronaut Count')
    axes[1,0].set_xlabel('Number of Astronauts')
    
    # 4. Correlation heatmap
    corr_data = merged_data[['Astronaut_Count', 'GDP per capita', 'Total_GDP', 'Population (historical estimates)']]
    correlation_matrix = corr_data.corr()
    sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0, ax=axes[1,1])
    axes[1,1].set_title('Correlation Matrix')
    
    plt.tight_layout()
    plt.show()
    
    return correlation_matrix

def calculate_correlations(merged_data):
    gdp_per_capita_corr = merged_data['Astronaut_Count'].corr(merged_data['GDP per capita'])
    total_gdp_corr = merged_data['Astronaut_Count'].corr(merged_data['Total_GDP'])
    population_corr = merged_data['Astronaut_Count'].corr(merged_data['Population (historical estimates)'])
    
    print("Correlation Analysis:")
    print(f"Astronaut Count vs GDP per Capita: {gdp_per_capita_corr:.3f}")
    print(f"Astronaut Count vs Total GDP: {total_gdp_corr:.3f}")
    print(f"Astronaut Count vs Population: {population_corr:.3f}")
    
    return {
        'gdp_per_capita': gdp_per_capita_corr,
        'total_gdp': total_gdp_corr,
        'population': population_corr
    }

def main():
    print("Loading and cleaning data...")
    astronauts_df, gdp_df = load_and_clean_data()
    
    print("Analyzing astronaut countries...")
    astronaut_counts = analyze_astronaut_countries(astronauts_df)
    
    print("Getting latest GDP data...")
    latest_gdp = get_latest_gdp_data(gdp_df)
    
    print("Merging datasets...")
    merged_data = merge_astronaut_gdp_data(astronaut_counts, latest_gdp)
    
    print(f"Successfully merged data for {len(merged_data)} countries")
    print("\nTop 5 countries by astronaut count:")
    print(merged_data.nlargest(5, 'Astronaut_Count')[['Country', 'Astronaut_Count', 'GDP per capita']])
    
    print("\nCalculating correlations...")
    correlations = calculate_correlations(merged_data)
    
    print("\nCreating visualizations...")
    correlation_matrix = create_visualizations(merged_data)
    
    return merged_data, correlations

if __name__ == "__main__":
    merged_data, correlations = main()