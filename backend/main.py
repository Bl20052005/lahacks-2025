from flask import Flask, request, jsonify, session
from pymongo import MongoClient
import linked_spam
import flask

from bson.objectid import ObjectId

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from location_query import prompt_gemini_college
from begin import prompt_gemini_begin

uri = "mongodb+srv://arnavpandey722:MpLlSmce2gtrDD7j@cluster0.x0voiss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri, server_api=ServerApi("1"))
from flask import Flask, request, jsonify
from flask_cors import CORS  # import this

import requests
import json

user_attrs = None

app = Flask(__name__)
CORS(
    app,
    # origins=["http://localhost:3000", "http://localhost:3001"],
    supports_credentials=True,
)
app.secret_key = "weiogjiowjgiowg"

# session = {}
# app.config["SESSION_TYPE"] = "filesystem"
# uncomment the two line above if cookies are not working, but it will not work in production

db = client["users"]
collection = db["users"]


@app.route("/api/register", methods=["POST"])
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

    new_user = {
        "username": username,
        "password": password,
        "education": education,
        "flowchart": {
            "network": {
                "nodes": [],
                "edges": [],
                "nodeData": [],
            },
            "apps": {
                "nodes": [],
                "edges": [],
                "nodeData": [],
            },
            "goals": {
                "nodes": [],
                "edges": [],
                "nodeData": [],
            },
        },
    }
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


@app.route("/api/login", methods=["POST"])
def login():
    global user_attrs

    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = collection.find_one({"username": username, "password": password})
    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    session["user_id"] = str(user["_id"])  # Store user ID in session

    user_attrs = {"user_id": str(user["_id"]), "user": str(user)}

    return (
        jsonify(
            {
                "message": "Login successful",
                "user_id": str(user["_id"]),
                "user_info": str(user),
            }
        ),
        200,
    )


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


@app.route("/api/college-form", methods=["POST"])
def college_form():
    global user_attrs
    data = request.get_json()
    print(type(data), data)
    if data is None:
        return jsonify({"error": "No data provided"}), 400
    data["user_id"] = user_attrs["user_id"]
    print(data)
    db3 = client["users"]
    collection3 = db3["users"]
    collection3.find_one_and_update(
        {"_id": ObjectId(data["user_id"])}, {"$set": data}, upsert=True
    )
    return jsonify({"message": "Data inserted successfully"}), 200


@app.route("/api/location", methods=["POST"])
def location():
    global user_attrs

    data = request.get_json()
    user_prompt = data.get("user_prompt")
    location = data.get("location")

    db3 = client["users"]
    collection3 = db3["users"]
    user_data = collection3.find_one({"_id": ObjectId(user_attrs["user_id"])})

    background = str(user_data)

    result = prompt_gemini_college(
        background, user_prompt, location if location is None else "Irvine, CA"
    )
    print(result)
    return jsonify(result), 200


@app.route("/api/begin", methods=["POST"])
def begin():
    data = request.get_json()
    theme = data.get("theme")
    username = data.get("username")

    db3 = client["users"]
    collection3 = db3["users"]
    user_data = collection3.find_one({"_id": ObjectId(username)})

    background = str(user_data)

    result = prompt_gemini_begin(background, theme)
    print(result)
    return jsonify(result), 200


@app.route("/api/hs-form", methods=["POST"])
def hs_form():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No data provided"}), 400
    global user_attrs
    data["user_id"] = user_attrs["user_id"]
    print(data)
    db3 = client["users"]
    collection3 = db3["users"]
    collection3.find_one_and_update(
        {"_id": ObjectId(data["user_id"])}, {"$set": data}, upsert=True
    )
    return jsonify({"message": "Data inserted successfully"}), 200


@app.route("/api/update-nodes", methods=["POST"])
def update_nodes():
    global user_attrs
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No data provided"})

    response = requests.post(
        "http://localhost:7778/rest/post",
        json={
            "data": "is a college aged student",
            "skills": user_attrs["user"],
            "steps": data["steps"],
        },
        headers={"Content-Type": "application/json"},
    )

    print(response.json())
    return response.json()


@app.route("/api/user-id", methods=["GET"])
def get_user_id():
    global user_attrs
    user_id = user_attrs["user_id"]
    if user_id:
        return jsonify({"user_id": user_id}), 200
    else:
        return jsonify({"error": "User not logged in"}), 401


@app.route("/api/flowchart", methods=["POST", "GET"])
def flowchart():
    global user_attrs
    if flask.request.method == "POST":
        data = request.get_json()
        if data is None:
            return jsonify({"error": "No data provided"}), 400

        # Update the flowchart in the database
        db3 = client["users"]
        collection3 = db3["users"]
        collection3.find_one_and_update(
            {"_id": ObjectId(user_attrs["user_id"])},
            {"$set": {"flowchart": data}},
            upsert=True,
        )
        return jsonify({"message": "Flowchart updated successfully"}), 200
    elif flask.request.method == "GET":
        print(session)
        user_id = user_attrs["user_id"]
        if not user_id:
            return jsonify({"error": "User not logged in"}), 401

        db3 = client["users"]
        collection3 = db3["users"]
        user_data = collection3.find_one({"_id": ObjectId(user_id)})
        if user_data and "flowchart" in user_data:
            return jsonify(user_data["flowchart"]), 200
        else:
            return jsonify({"error": "No flowchart found for this user"}), 404


if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
