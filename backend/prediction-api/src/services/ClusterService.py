from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
import joblib

def cluster_products(df):
    # Prepare data for clustering
    X_cluster = df[['unit_price', 'sales_quantity']]
    
    # Normalize the data
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_cluster)
    
    # Apply K-Means to cluster the products
    kmeans = KMeans(n_clusters=2, random_state=42)
    df['cluster'] = kmeans.fit_predict(X_scaled)
    
    # Save the KMeans model and scaler
    joblib.dump(kmeans, 'models/kmeans_model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    
    return df

def train_cluster_model(df_cluster, cluster):
    X = df_cluster[['year', 'month', 'unit_price']]
    y = df_cluster['sales_quantity']
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Save the cluster model
    joblib.dump(model, f'models/cluster_model_{cluster}.pkl')
    print(f"Model trained for cluster: {cluster}")

def predict_for_cluster(df_cluster):
    predictions = []
    
    # Predict for each product in the cluster
    for _, row in df_cluster.iterrows():
        X = [[row['year'], row['month'], row['unit_price']]]
        cluster = row['cluster']
        
        # Load the cluster model and make the prediction
        model = joblib.load(f'models/cluster_model_{cluster}.pkl')
        prediction = model.predict(X)[0]
        predictions.append({
            'product': row['product'],
            'prediction': prediction,
            'cluster': cluster
        })
    
    return predictions    