from flask import Flask, request, jsonify, session
from pymongo import MongoClient
import linked_spam

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from location_query import prompt_gemini_college

uri = "mongodb+srv://arnavpandey722:MpLlSmce2gtrDD7j@cluster0.x0voiss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri, server_api=ServerApi("1"))
from flask import Flask, request, jsonify
from flask_cors import CORS  # import this

app = Flask(__name__)
CORS(
    app,
    # origins=["http://localhost:3000", "http://localhost:3001"],
    # supports_credentials=True,
)
app.secret_key = "weiogjiowjgiowg"

session = {}
app.config["SESSION_TYPE"] = "filesystem"

db = client["users"]
collection = db["users"]


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    education = data.get("education")  # Optional field

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    existing_user = collection.find_one({"username": username})
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    new_user = {"username": username, "password": password, "education": education}
    result = collection.insert_one(new_user)

    return (
        jsonify(
            {
                "message": "User registered successfully",
                "user_id": str(result.inserted_id),
            }
        ),
        201,
    )


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = collection.find_one({"username": username, "password": password})
    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    session["user_id"] = str(user["_id"])  # Store user ID in session
    print(session["user_id"])
    return jsonify({"message": "Login successful", "user_id": str(user["_id"])}), 200


@app.route("/ld")
def ld():
    search_linkd = linked_spam.search_linkd(query="software engineer", limit=30)
    db2 = client["linkedin-data"]
    collection2 = db2["ld"]

    for item in search_linkd["results"]:
        collection2.insert_one(item)

    return jsonify({"message": "LinkedIn data inserted successfully"}), 200


@app.route("/ld/all", methods=["GET"])
def get_all_linked_data():
    db2 = client["linkedin-data"]
    collection2 = db2["ld"]
    all_data = list(collection2.find())
    return jsonify(all_data), 200


@app.route("/college-form", methods=["POST"])
def college_form():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No data provided"}), 400
    data["user_id"] = session["user_id"]
    print(data)
    db3 = client["users"]
    collection3 = db3["form-input"]
    collection3.insert_one(data)
    return jsonify({"message": "Data inserted successfully"}), 200


@app.route("/api/location", methods=["POST"])
def location():
    data = request.get_json()
    user_prompt = data.get("user_prompt")
    location = data.get("location")

    result = prompt_gemini_college(
        user_prompt, location if location is None else "Irvine, CA"
    )
    print(result)
    return jsonify(result), 200


@app.route("/hs-form", methods=["POST"])
def hs_form():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No data provided"}), 400
    data["user_id"] = session["user_id"]
    print(data)
    db3 = client["users"]
    collection3 = db3["form-input"]
    collection3.insert_one(data)
    return jsonify({"message": "Data inserted successfully"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5001, host="0.0.0.0")
