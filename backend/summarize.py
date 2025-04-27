from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from collections import Counter, defaultdict

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import numpy as np

# Connect to MongoDB
uri = "mongodb+srv://arnavpandey722:MpLlSmce2gtrDD7j@cluster0.x0voiss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri, server_api=ServerApi("1"))

db = client['linkedin-data']
collection = db['ld']
summary_collection = db['summary']


# Load Transformer Model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Extract job titles
job_titles = []
profile_job_map = defaultdict(list)

for profile in collection.find():
    experiences = profile.get("experience", [])
    for exp in experiences:
        title = exp.get("title", "").strip()
        if title:
            job_titles.append(title)
            profile_job_map[title].append(profile["_id"])

embeddings = model.encode(job_titles)

n_clusters = 12
kmeans = KMeans(n_clusters=n_clusters, random_state=42)
labels = kmeans.fit_predict(embeddings)

# Map clusters to job titles
cluster_map = defaultdict(list)
for idx, label in enumerate(labels):
    cluster_map[label].append(job_titles[idx])

# Summarize clusters
cluster_summaries = {}
for label, titles in cluster_map.items():
    title_counter = Counter(titles)
    most_common_titles = title_counter.most_common(5)
    cluster_summaries[label] = {
        "representative_titles": most_common_titles,
        "all_titles": list(set(titles))
    }

# Aggregate degrees and schools per cluster
degree_counter = Counter()
school_counter = Counter()

for profile in collection.find():
    education = profile.get("education", [])
    for edu in education:
        degree = edu.get("degree", "").strip()
        school = edu.get("school_name", "").strip()
        if degree:
            degree_counter[degree] += 1
        if school:
            school_counter[school] += 1

# Convert cluster keys to strings
cluster_summaries_str_keys = {str(k): v for k, v in cluster_summaries.items()}

# Store everything in summary collection
summary_collection.delete_many({})  # Clear old summary


# Insert each representative title as a separate document
for cluster_id, cluster_data in cluster_summaries.items():
    cluster_str = str(cluster_id)  # Ensure string key
    for title, count in cluster_data["representative_titles"]:
        summary_collection.insert_one({
            "cluster_id": cluster_str,
            "title": title,
            "count": count
        })

print("AI-based clustering summary saved!")
