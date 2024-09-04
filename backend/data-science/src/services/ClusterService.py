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
            "productId": str(product["productId"]),
            "product": product["name"],
            "year": int(sale["year"]),
            "month": month_data["month"],
            "sales_quantity": month_data["quantity"],
            "total_sales": sale["quantity"]
        }
        for product in sales_data
        for sale in product["years"]
        for month_data in sale["months"]
    ]
    
    df = pd.DataFrame(records)

    # Prepare data for clustering
    features = ['sales_quantity', 'year', 'month', 'total_sales']
    X = df[features]
    
    # Normalize the data
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Determine the optimal number of clusters
    optimal_n_clusters = evaluate_clusters(X_scaled, 100)
    
    # Apply K-Means clustering with the optimal number of clusters
    kmeans = KMeans(n_clusters=optimal_n_clusters, random_state=89)
    
    df['cluster'] = kmeans.fit_predict(X_scaled)
    
    # Visualize clusters
    # plot_clusters(df, X_scaled)

    # Save the KMeans model and scaler
    joblib.dump(kmeans, 'models/kmeans_model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    
    return df

def evaluate_clusters(X_scaled, max_clusters):
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
    X = pd.DataFrame(df_cluster[['year', 'month']], columns=['year', 'month'])
    y = df_cluster['sales_quantity']
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Save the model in the "models" directory
    joblib.dump(model, 'models/cluster_model_{}.pkl'.format(cluster))

def predict_for_cluster(df_cluster):
    predictions = []
    y_true = []
    y_pred = []

    unique_products = df_cluster['product'].unique()

    for product in unique_products:
        product_data = df_cluster[df_cluster['product'] == product]
        product_prediction = {
            "name": str(product),
            "productId": str(product_data['productId'].iloc[0]), 
            "years": []
        }

        unique_years = product_data['year'].unique()

        for year in unique_years:
            year_data = product_data[product_data['year'] == year]
            year_sales = {
                "year": int(year),
                "months": []
            }

            total_quantity = 0

            for _, row in year_data.iterrows():
                X = pd.DataFrame([[int(row['year']), int(row['month'])]] , columns=['year', 'month'])
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
            product_prediction["years"].append(year_sales)

        predictions.append(product_prediction)

    # Calculate and print the metrics
    mse = mean_squared_error(y_true, y_pred)
    print("Mean Squared Error:", mse)

    accuracy = accuracy_score(y_true, y_pred)
    print("Accuracy Score:", accuracy)

    return predictions    