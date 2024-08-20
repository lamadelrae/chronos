from flask import Blueprint, jsonify, abort
from controllers.PredictionController import generate_predictions

bp = Blueprint('routes', __name__)

# Prediction
@bp.route('/prediction', methods=['POST'])
def get_predictions():
    predictions = generate_predictions()
    return jsonify(predictions), 200