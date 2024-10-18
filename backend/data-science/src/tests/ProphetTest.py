import numpy as np
np.float_ = np.float64
from prophet import Prophet
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error

data = {
    'ds': [
        '2024-08-09', '2024-08-10', '2024-08-11', '2024-08-12', '2024-08-13', '2024-08-14', '2024-08-15', '2024-08-16',
        '2024-08-17', '2024-08-18', '2024-08-19', '2024-08-20', '2024-08-21', '2024-08-22', '2024-08-23', '2024-08-24',
        '2024-08-25', '2024-08-26', '2024-08-27', '2024-08-28', '2024-08-29', '2024-08-30', '2024-08-31', '2024-09-01',
        '2024-09-02', '2024-09-03', '2024-09-04', '2024-09-05', '2024-09-06', '2024-09-07', '2024-09-08', '2024-09-09',
        '2024-09-10', '2024-09-11', '2024-09-12'
    ],
    'y': [
        0, 8.13, 4.07, 15.70, 3.93, 43.89, 20.94, 6.46, 5.25, 3.46, 4.88, 4.12, 27.53, 21.92, 3.28, 6.07, 7.08, 7.23, 
        10.92, 17.06, 8.45, 1.25, 2.13, 0.53, 3.93, 6.54, 5.52, 6.05, 4.20, 5.13, 1.35, 4.19, 4.12, 8.57, 0.73
    ]
}

# Create a DataFrame
df = pd.DataFrame(data)
df['y'] = np.log(df['y'])
df['y'] = df['y'].replace([np.inf, -np.inf], 0)
df['ds'] = pd.to_datetime(df['ds'])
df['day_of_week'] = df['ds'].dt.dayofweek
df['is_weekend'] = df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)

# Split the data into training and validation sets
train = df[:-10]  # All but the last 5 days
validation = df[-10:]  # The last 5 days

# Initialize and fit the Prophet model
model = Prophet()
model.add_regressor('is_weekend')
model.fit(train)

# Create a DataFrame for future dates
future = model.make_future_dataframe(periods=10)
future['day_of_week'] = future['ds'].dt.dayofweek
future['is_weekend'] = future['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)

# Make predictions
forecast = model.predict(future)
forecast['yhat'] = np.exp(forecast['yhat'])
forecast['yhat_lower'] = np.exp(forecast['yhat_lower'])
forecast['yhat_upper'] = np.exp(forecast['yhat_upper'])


df['y'] = np.exp(df['y'])
plt.figure(figsize=(12, 6))

# Plot historical data
plt.plot(df['ds'], df['y'], 'o', label='Historical Data')

# Plot forecast data
plt.plot(forecast['ds'], forecast['yhat'], 'r', label='Predicted Data')

# Plot uncertainty intervals
plt.fill_between(forecast['ds'], forecast['yhat_lower'], forecast['yhat_upper'], color='r', alpha=0.2)

plt.title('Sales Forecast vs. Historical Data')
plt.xlabel('Date')
plt.ylabel('SaleQuantity')
plt.legend()
plt.grid(True)
plt.show()

# Display the forecasted data
print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(15))

# Evaluate the model on the validation set
forecast_validation = forecast[-10:]
y_true = validation['y'].values
y_pred = forecast_validation['yhat'].values

mae = mean_absolute_error(y_true, y_pred)
mse = mean_squared_error(y_true, y_pred)

print(f"Mean Absolute Error: {mae:.2f}")
print(f"Mean Squared Error: {mse:.2f}")
