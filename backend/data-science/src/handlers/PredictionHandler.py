import pandas as pd
from prophet import Prophet

def predict(json):
    df = transform(json)
    df['ds'] = pd.to_datetime(df['ds'])
    df['day_of_week'] = df['ds'].dt.dayofweek
    df['is_weekend'] = df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)

    model = Prophet()
    model.add_regressor('is_weekend')
    model.fit(df)

    future = model.make_future_dataframe(periods=10)
    future['day_of_week'] = future['ds'].dt.dayofweek
    future['is_weekend'] = future['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)
    forecast = model.predict(future)

    forecast = forecast[['ds', 'yhat']].tail(10)
    forecast.rename(columns={'ds': 'date', 'yhat': 'quantity'}, inplace=True)
    result = {
        "name": json['product'],
        "sales": forecast.to_dict(orient='records')
    }
    
    return result


def transform(json_data):
    sales_data = json_data['sales']
    df = pd.DataFrame(sales_data)
    df.rename(columns={'date': 'ds', 'quantity': 'y'}, inplace=True)
    
    return df