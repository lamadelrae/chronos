from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, classification_report, confusion_matrix, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns; sns.set() # plot styling
import pandas as pd
import numpy as np
import joblib
from sklearn.decomposition import PCA
from sklearn.model_selection import KFold
from sklearn.metrics import silhouette_score

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
    
    # Determine the optimal number of clusters
    optimal_n_clusters = evaluate_clusters(X_scaled, max_clusters=50)
    
    # Apply K-Means clustering with the optimal number of clusters
    kmeans = KMeans(n_clusters=optimal_n_clusters, random_state=89)
    
    df['cluster'] = kmeans.fit_predict(X_scaled)
    
    # Visualize clusters
    plot_clusters(df, X_scaled)

    # Save the KMeans model and scaler
    joblib.dump(kmeans, 'models/kmeans_model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    
    return df

def evaluate_clusters(X_scaled, max_clusters=50):
    best_n_clusters = 0
    best_silhouette_score = -1
    
    for n_clusters in range(2, max_clusters + 1):
        kmeans = KMeans(n_clusters=n_clusters, random_state=89)
        labels = kmeans.fit_predict(X_scaled)
        
        silhouette_avg = silhouette_score(X_scaled, labels)
        print(f'Clusters number: {n_clusters}, Silhouette Score: {silhouette_avg}')
        
        if silhouette_avg > best_silhouette_score:
            best_silhouette_score = silhouette_avg
            best_n_clusters = n_clusters

    print(f'## Best cluster number: {best_n_clusters}, Silhouette Score: {best_silhouette_score}')

    return best_n_clusters

def plot_clusters(df, X_scaled):
    # Reduce dimensionality to 2D using PCA
    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_scaled)

    # Plot clusters
    plt.scatter(X_pca[:, 0], X_pca[:, 1], c=df['cluster'], cmap='viridis', s=50, alpha=0.6)
    plt.colorbar()
    plt.title('Clusters after PCA')
    plt.xlabel('PC1')
    plt.ylabel('PC2')
    plt.show()

def train_cluster_model(df_cluster, cluster):
    # Use relevant features for training
    X = pd.DataFrame(df_cluster[['year', 'month', 'unit_price']], columns=['year', 'month', 'unit_price'])
    y = df_cluster['sales_quantity']
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Save the model in the "models" directory
    joblib.dump(model, 'models/cluster_model_{}.pkl'.format(cluster))

def predict_for_cluster(df_cluster):
    # kmeans = joblib.load('models/kmeans_model.pkl')
    # scaler = joblib.load('models/scaler.pkl')

    predictions = []
    y_true = []
    y_pred = []

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
                "quantity": 0,
                "months": []
            }

            total_quantity = 0

            for _, row in year_data.iterrows():
                X = pd.DataFrame([[int(row['year']), int(row['month']), float(row['unit_price'])]] , columns=['year', 'month', 'unit_price'])
                cluster = row['cluster']

                model = joblib.load(f'models/cluster_model_{cluster}.pkl')
                prediction = int(np.round(model.predict(X)[0]).astype(int))

                year_sales["months"].append({
                    "month": int(row['month']),
                    "quantity": prediction
                })
                total_quantity += prediction

                # Append true and predicted values for metrics
                y_true.append(int(row['sales_quantity']))
                y_pred.append(prediction)

            year_sales["quantity"] = total_quantity
            product_prediction["sales"].append(year_sales)

        predictions.append(product_prediction)

    # Calculate and print the metrics
    mse = mean_squared_error(y_true, y_pred)
    print("Mean Squared Error:", mse)
    
    print("Classification Report:\n", classification_report(y_true, y_pred))
    
    print("Confusion Matrix:\n", confusion_matrix(y_true, y_pred))
    
    accuracy = accuracy_score(y_true, y_pred)
    print("Accuracy Score:", accuracy)

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