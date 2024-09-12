from flask import Blueprint, jsonify, request
from handlers.PredictionHandler import predict

bp = Blueprint('routes', __name__)

@bp.route('/prediction', methods=['POST'])
def get_predictions():
    data = request.get_json()
    if data:
        predictions = predict(data)
        return jsonify(predictions), 200
    else:
        return jsonify({"error": "No JSON received"}), 400