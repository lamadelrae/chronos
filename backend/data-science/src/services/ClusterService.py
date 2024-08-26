from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import seaborn as sns; sns.set() # plot styling
import pandas as pd
import numpy as np
import joblib

def cluster_products(sales_data):
    # Convert nested JSON to DataFrame with all attributes
    records = [
        {
            "product": product["name"],
            "year": int(sale["year"]),
            "month": month_data["month"],
            "sales_quantity": month_data["quantity"],
            "unit_price": month_data["price"],
            "total_sales": sale["quantity"]  # Total sales quantity for the year
        }
        for product in sales_data
        for sale in product["sales"]
        for month_data in sale["months"]
    ]
    
    df = pd.DataFrame(records)

    # Prepare data for clustering
    features = ['unit_price', 'sales_quantity', 'year', 'month', 'total_sales']
    X = df[features]
    
    # Normalize the data
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Apply K-Means clustering
    kmeans = KMeans(n_clusters=3, random_state=42)
    df['cluster'] = kmeans.fit_predict(X_scaled)
    
    # Save the KMeans model and scaler
    joblib.dump(kmeans, 'models/kmeans_model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    
    return df

def train_cluster_model(df_cluster, cluster):
    # Use relevant features for training
    X = df_cluster[['year', 'month', 'unit_price']]
    y = df_cluster['sales_quantity']
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Save the model in the "models" directory
    joblib.dump(model, 'models/cluster_model_{}.pkl'.format(cluster))

def predict_for_cluster(df_cluster):
    # kmeans = joblib.load('models/kmeans_model.pkl')
    # scaler = joblib.load('models/scaler.pkl')

    predictions = []

    unique_products = df_cluster['product'].unique()

    for product in unique_products:
        product_data = df_cluster[df_cluster['product'] == product]
        product_prediction = {
            "name": str(product),
            "sales": []
        }

        unique_years = product_data['year'].unique()

        for year in unique_years:
            year_data = product_data[product_data['year'] == year]
            year_sales = {
                "year": int(year),
                "quantity": 0,  # This will be updated with the sum of monthly predictions
                "months": []
            }

            total_quantity = 0

            for _, row in year_data.iterrows():
                X = [[int(row['year']), int(row['month']), float(row['unit_price'])]]
                cluster = row['cluster']

                model = joblib.load(f'models/cluster_model_{cluster}.pkl')
                prediction = int(np.round(model.predict(X)[0]).astype(int))

                year_sales["months"].append({
                    "month": int(row['month']),
                    "quantity": prediction
                })
                total_quantity += prediction

            year_sales["quantity"] = total_quantity
            product_prediction["sales"].append(year_sales)

        predictions.append(product_prediction)

    return predictions

def plot_sales_one_by_one(df):
    products = df['product'].unique()
    
    for product_name in products:
        product_data = df[df['product'] == product_name]
        
        # Create a new figure for each product
        plt.figure(figsize=(10, 6))
        
        # Plot sales quantity by month for the current product
        plt.bar(product_data['month'], product_data['sales_quantity'], color='blue')
        plt.title(f"Sales for {product_name}")
        plt.xlabel('Month')
        plt.ylabel('Sales Quantity')
        plt.xticks(range(1, 13))
        plt.grid(True, axis='y')
        
        # Display the plot
        plt.show()