from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    # Dummy authentication
    if data.get("username") and data.get("password"):
        return jsonify({"success": True}), 200
    return jsonify({"success": False}), 401


@app.route("/api/forms", methods=["GET"])
def get_forms():
    # Dummy data
    return jsonify({"forms": ["Example submission 1", "Example submission 2"]})


@app.route("/api/forms", methods=["POST"])
def submit_form():
    data = request.json
    # Here you would save the form data
    return jsonify({"success": True, "data": data}), 201


if __name__ == "__main__":
    app.run(debug=True)
