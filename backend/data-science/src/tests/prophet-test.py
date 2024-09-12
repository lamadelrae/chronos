import numpy as np
np.float_ = np.float64
from prophet import Prophet
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error

data = {
    "ds": [
        "2024-07-05", "2024-07-06", "2024-07-07", "2024-07-08", "2024-07-09",
        "2024-07-10", "2024-07-11", "2024-07-13", "2024-07-14", "2024-07-15",
        "2024-07-16", "2024-07-17", "2024-07-18", "2024-07-19", "2024-07-20",
        "2024-07-21", "2024-07-22", "2024-07-23", "2024-07-24", "2024-07-25",
        "2024-07-26", "2024-07-27", "2024-07-28", "2024-07-29", "2024-07-30",
        "2024-07-31", "2024-08-01", "2024-08-02", "2024-08-03", "2024-08-04",
        "2024-08-05", "2024-08-06", "2024-08-07", "2024-08-08"
    ],
    "y": [
        1, 25, 13, 40, 27, 98, 42, 29, 10, 18, 18, 65, 75, 33, 45, 22, 24, 11,
        114, 63, 21, 32, 19, 23, 24, 53, 60, 34, 28, 24, 27, 11, 45, 10
    ]
}

# Create a DataFrame
df = pd.DataFrame(data)
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

# Extract the predictions for the validation period
forecast_validation = forecast[-10:]

# Plot the results
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
y_true = validation['y'].values
y_pred = forecast_validation['yhat'].values

mae = mean_absolute_error(y_true, y_pred)
mse = mean_squared_error(y_true, y_pred)

print(f"Mean Absolute Error: {mae:.2f}")
print(f"Mean Squared Error: {mse:.2f}")
