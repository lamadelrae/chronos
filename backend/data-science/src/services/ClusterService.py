from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler    
import matplotlib.pyplot as plt
import seaborn as sns; sns.set() # plot styling
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score

def cluster_products(sales_data):    
    flattened_data = flatten_product_data(sales_data)

    data_frame = pd.DataFrame(flattened_data)

    features = [column for column in data_frame.columns if column.startswith('sales')]
    x = data_frame[features]
    
    scaler = StandardScaler()
    scaled_x = scaler.fit_transform(x)
    
    optimal_n_clusters = get_optimal_number_of_clusters(scaled_x, 100)
    
    kmeans = KMeans(n_clusters=optimal_n_clusters, random_state=89)
    
    data_frame['cluster'] = kmeans.fit_predict(scaled_x)
    
    plot_clusters(data_frame, scaled_x)
    
    return data_frame

def flatten_product_data(products):
    flattened_data = []
    for product in products:
        flattened_row = {
            'productId': product['productId'],
            'productName': product['name'],
        }

        for year_data in product['years']:
            for month_data in year_data['months']:
                column_name = f'sales_{year_data["year"]}_{month_data["month"]}'
                flattened_row[column_name] = month_data['quantity'] 

        flattened_data.append(flattened_row)

    return flattened_data

def get_optimal_number_of_clusters(scaled_x, max_clusters):  
    best_n_clusters = 0
    best_silhouette_score = -1
    
    for n_clusters in range(2, max_clusters + 1):
        kmeans = KMeans(n_clusters=n_clusters, random_state=89)
        labels = kmeans.fit_predict(scaled_x)
        
        silhouette_avg = silhouette_score(scaled_x, labels)
        print(f'Clusters number: {n_clusters}, Silhouette Score: {silhouette_avg}')
        
        if silhouette_avg > best_silhouette_score:
            best_silhouette_score = silhouette_avg
            best_n_clusters = n_clusters

    print(f'## Best cluster number: {best_n_clusters}, Silhouette Score: {best_silhouette_score}')

    return best_n_clusters

def plot_clusters(df, X_scaled):
    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_scaled)

    plt.scatter(X_pca[:, 0], X_pca[:, 1], c=df['cluster'], cmap='viridis', s=50, alpha=0.6)
    plt.colorbar()
    plt.title('Clusters after PCA')
    plt.xlabel('PC1')
    plt.ylabel('PC2')
    plt.show()