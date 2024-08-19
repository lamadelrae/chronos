# Flask
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from json import dumps

app = Flask(__name__)
api = Api(app)

class Test(Resource):
    def post(self):
        return {"status": "success"}

api.add_resource(Test, '/test') 

if __name__ == '__main__':
    app.run()