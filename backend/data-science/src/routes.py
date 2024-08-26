from flask import Blueprint, jsonify, request
from controllers.PredictionController import generate_predictions

bp = Blueprint('routes', __name__)

# Prediction
@bp.route('/prediction', methods=['POST'])
def get_predictions():
    data = request.get_json()
    if data:
        predictions = generate_predictions(data)
        return jsonify(predictions), 200
    else:
        return jsonify({"error": "No JSON received"}), 400