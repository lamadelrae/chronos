from services.ClusterService import cluster_products, train_cluster_model, predict_for_cluster
from sklearn.model_selection import train_test_split

def generate_predictions(sales_data):
    # Cluster products using K-Means
    df_clustered = cluster_products(sales_data)

    # Split the data into training and validation sets
    df_train, df_val = train_test_split(df_clustered, test_size=0.2, random_state=42, stratify=df_clustered['cluster'])

    # Train models for each cluster
    clusters = df_train['cluster'].unique()
    for cluster in clusters:
        df_cluster = df_train[df_train['cluster'] == cluster]
        train_cluster_model(df_cluster, cluster)

    # Make predictions for all products in the cluster and return as JSON
    cluster_predictions = predict_for_cluster(df_val)

    return cluster_predictions