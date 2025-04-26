from flask import Flask, request, jsonify
from pymongo import MongoClient


from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://arnavpandey722:MpLlSmce2gtrDD7j@cluster0.x0voiss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri, server_api=ServerApi('1'))

db = client['users']
collection = db['users']

app = Flask(__name__)

@app.route('/register', methods=['GET'])
def register():
    # For testing purposes, hardcoding the username and password
    # to simulate a registration request.
    # Once login/registration is implemented, this should be removed.
    # username = request.args.get('username')
    # password = request.args.get('password')
    # username = request.form.get('username')
    # password = request.form.get('password')
    # username = request.json.get('username')
    # password = request.json.get('password')

    username = "arnavpandey722"
    password = "ilikecheese1234"

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    existing_user = collection.find_one({"username": username})
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    new_user = {
        "username": username,
        "password": password,
    }
    result = collection.insert_one(new_user)

    return jsonify({"message": "User registered successfully", "user_id": str(result.inserted_id)}), 201

@app.route('/login', methods=['GET'])
def login():
    # For testing purposes, hardcoding the username and password
    # to simulate a registration request.
    # Once login/registration is implemented, this should be removed.
    # username = request.args.get('username')
    # password = request.args.get('password')
    # username = request.form.get('username')
    # password = request.form.get('password')
    # username = request.json.get('username')
    # password = request.json.get('password')
    
    username = "arnavpandey722"
    password = "ilikecheese1234"

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = collection.find_one({"username": username, "password": password})
    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    return jsonify({"message": "Login successful", "user_id": str(user['_id'])}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5001, threaded=False)