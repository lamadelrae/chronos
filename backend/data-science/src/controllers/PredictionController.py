from services.ClusterService import cluster_products, train_cluster_model, predict_for_cluster, plot_sales_one_by_one

def generate_predictions(sales_data):
    # Cluster products using K-Means
    df_clustered = cluster_products(sales_data)

    # Train models for each cluster
    clusters = df_clustered['cluster'].unique()
    for cluster in clusters:
        df_cluster = df_clustered[df_clustered['cluster'] == cluster]
        train_cluster_model(df_cluster, cluster)

    # Make predictions for all products in the cluster and return as JSON
    cluster_predictions = predict_for_cluster(df_clustered)

    # Visualize predictions
    # plot_sales_one_by_one(df_clustered)

    return cluster_predictions