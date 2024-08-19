from flask import Flask
from routes import bp as routes_bp

api = Flask(__name__)

api.register_blueprint(routes_bp)

if __name__ == '__main__':
    api.run(debug=True)