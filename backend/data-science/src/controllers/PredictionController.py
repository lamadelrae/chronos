from services.ClusterService import cluster_products
from services.PredictionByClusterService import train_model_by_cluster, predict_by_cluster
from sklearn.model_selection import train_test_split

def generate_predictions(sales_data):
    clustered_data_frame = cluster_products(sales_data)

    clusters = clustered_data_frame['cluster'].unique()
    for cluster in clusters:
        model = train_model_by_cluster(clustered_data_frame[clustered_data_frame['cluster'] == cluster])
        cluster_predictions = predict_by_cluster(clustered_data_frame[clustered_data_frame['cluster'] == cluster], model)

    return True