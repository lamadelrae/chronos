from flask import Flask
from controllers.PredictionController import bp as routes_bp

api = Flask(__name__)

api.register_blueprint(routes_bp)

if __name__ == '__main__':
    api.run(host='0.0.0.0', port=5000, debug=True)