import requests
import os
from dotenv import load_dotenv
import json
import time
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

# Load environment variables
load_dotenv()

# MongoDB setup
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "linkedin_data")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "job_listings")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Ensure index for deduplication
collection.create_index("job_id", unique=True)

# LinkedIn API setup
LINKEDIN_API_KEY = os.getenv("LINKEDIN_API_KEY")
BASE_URL = "https://api.linkedin.com/v2/jobSearch"

def fetch_job_listings(keywords, location, start=0, count=20):
    """Fetch job listings from LinkedIn API"""
    headers = {
        "Authorization": f"Bearer {LINKEDIN_API_KEY}",
        "Content-Type": "application/json"
    }
    
    params = {
        "keywords": keywords,
        "location": location,
        "start": start,
        "count": count
    }
    
    try:
        response = requests.get(BASE_URL, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None

def process_and_store_jobs(jobs_data):
    """Process jobs data and store in MongoDB, avoiding duplicates"""
    if not jobs_data:
        return 0
    
    new_count = 0
    
    for job in jobs_data.get('elements', []):
        # Extract relevant data
        job_id = job.get('id')
        
        # Skip if no job_id (required for deduplication)
        if not job_id:
            continue
            
        # Prepare document
        job_doc = {
            "job_id": job_id,
            "title": job.get('title', ''),
            "company": job.get('company', {}).get('name', ''),
            "location": job.get('location', {}).get('name', ''),
            "description": job.get('description', ''),
            "date_posted": job.get('postedAt', ''),
            "url": job.get('applicationUrl', ''),
            "skills": job.get('requiredSkills', []),
            "raw_data": job  # Store the full data for reference
        }
        
        try:
            # Try to insert, will skip if duplicate
            collection.insert_one(job_doc)
            new_count += 1
        except DuplicateKeyError:
            # Job already exists, skip
            pass
            
    return new_count

def gather_data(search_terms, locations, pages_per_search=5):
    """Gather data for multiple search terms and locations"""
    total_jobs = 0
    
    for term in search_terms:
        for location in locations:
            print(f"Searching for '{term}' in {location}")
            
            for page in range(pages_per_search):
                start = page * 20
                print(f"  Fetching page {page+1} (start={start})")
                
                # Fetch data
                data = fetch_job_listings(term, location, start=start)
                
                # Process and store
                new_jobs = process_and_store_jobs(data)
                total_jobs += new_jobs
                
                print(f"  Added {new_jobs} new jobs")
                
                # Respect rate limits
                time.sleep(1)
    
    return total_jobs

if __name__ == "__main__":
    # Define search terms and locations
    search_terms = [
        "software engineer", 
        "python developer",
        "machine learning engineer",
        "data scientist",
        "frontend developer",
        "backend developer",
        "full stack developer"
    ]
    
    locations = [
        "San Francisco, CA",
        "New York, NY",
        "Seattle, WA",
        "Austin, TX",
        "Boston, MA",
        "Los Angeles, CA"
    ]
    
    # Run the data gathering process
    total_added = gather_data(search_terms, locations)
    print(f"Total jobs added to database: {total_added}")
    
    # Print collection stats
    total_jobs = collection.count_documents({})
    print(f"Total jobs in database: {total_jobs}")