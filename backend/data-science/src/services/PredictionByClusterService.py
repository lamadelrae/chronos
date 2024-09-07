from sklearn.discriminant_analysis import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, accuracy_score
import seaborn as sns
from sklearn.model_selection import train_test_split; sns.set() # plot styling
import pandas as pd
import numpy as np

def train_model_by_cluster(data_frame):
    data_frame = clean_data_frame(pd.DataFrame(transform_data(data_frame)))

    return train(data_frame)

def predict_by_cluster(data_frame, model):
    data_frame = clean_data_frame(pd.DataFrame(transform_data(data_frame)))

    data_frame.groupby('productId').apply(lambda x: predict_for_product(x, model))

    # print(transformed_data)

    return True

def predict_for_product(data_frame, model):
    x = data_frame.drop(columns=['quantity'])
    y = data_frame['quantity'] 

    scaler = StandardScaler()
    x_scaled = scaler.fit_transform(x)

    predictions = model.predict(x_scaled)

    print(f"Product: {data_frame['productId'].iloc[0]}, Predictions: {predictions}")

    return predictions


def transform_data(data_frame):
    features = [column for column in data_frame.columns if column.startswith('sales')]
    features_as_year_month = [column.split('_')[1:] for column in features]
    years = list(set([int(year_month[0]) for year_month in features_as_year_month]))
    months = list(set([int(year_month[1]) for year_month in features_as_year_month]))

    transformed_data = []
    for product in data_frame[features].iterrows():
        for year in years:
            for month in months:
                key = f"sales_{year}_{month}"
                transformed_data.append({
                    "productId": product[1]['productId'],
                    "year": year,
                    "month": month,
                    "quantity": product[1][key]
                })

    return transformed_data

def clean_data_frame(data_frame):
    data_frame['month_sin'] = np.sin(2 * np.pi * data_frame['month'] / 12)
    data_frame['month_cos'] = np.cos(2 * np.pi * data_frame['month'] / 12)

    data_frame = data_frame.drop(columns=['month'])

    return data_frame

def train(data_frame):
    x = data_frame.drop(columns=['quantity', 'productId'])
    y = data_frame['quantity'] 
    
    scaler = StandardScaler()
    x_scaled = scaler.fit_transform(x)
    
    model = LinearRegression()
    model.fit(x_scaled, y)

    return model

