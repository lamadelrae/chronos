import pandas as pd
from services.ClusterService import cluster_products, train_cluster_model, predict_for_cluster
import json

def generate_predictions():
    # Example DataFrame with product sales
    data = {
        'product': ['pencil', 'eraser', 'bleach', 'eraser', 'pencil', 'bleach'],
        'unit_price': [10.0, 5.0, 8.0, 5.0, 10.0, 8.0],
        'sales_quantity': [100, 150, 30, 160, 110, 40],
        'month': [1, 1, 1, 2, 2, 2],
        'year': [2024, 2024, 2024, 2024, 2024, 2024]
    }

    df = pd.DataFrame(data)

    # Cluster products using K-Means
    df_clustered = cluster_products(df)

    # Train models for each cluster
    clusters = df_clustered['cluster'].unique()
    for cluster in clusters:
        df_cluster = df_clustered[df_clustered['cluster'] == cluster]
        train_cluster_model(df_cluster, cluster)

    # Make predictions for all products in the cluster and return as JSON
    cluster_predictions = predict_for_cluster(df_clustered)
    predictions_json = json.dumps(cluster_predictions)
    print(predictions_json)

    return cluster_predictions