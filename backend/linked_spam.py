import requests

from pymongo import MongoClient

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://arnavpandey722:MpLlSmce2gtrDD7j@cluster0.x0voiss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri, server_api=ServerApi('1'))

API_KEY = "lk_01f599c62a4f4526becce5658461c325" # alt data farm key
SEARCH_URL = "https://search.linkd.inc/api/search/users"

def search_linkd(query, limit=30, school=None):
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }

    params = {
        "query": query,
        "limit": limit
    }

    if school:
        for s in school:
            params.setdefault("school", []).append(s)

    response = requests.get(SEARCH_URL, headers=headers, params=params)
    response.raise_for_status()
    return response.json()

def spam_linkd(query, limit=30, school=None):
    results = search_linkd(query, limit, school)
    db2 = client['linkedin-data']
    collection2 = db2['ld']
    """Example response of one result
    {"_id":{"$oid":"680c8134e0ff32bb92ae30bb"},"profile":{"id":{"$numberInt":"23516"},"name":"Shubham Juyal","location":"Bengaluru, Karnataka, India","headline":"","description":null,"title":"Founder's Office, New Initiatives Lead","profile_picture_url":"","linkedin_url":"https://www.linkedin.com/in/ACwAAAfKk2oBcvSw4rf03taD4Ufd8LmQAJR0bkw"},"experience":[{"title":"Founder's Office, New Initiatives Lead","company_name":"Rupifi","start_date":"2022-04-01T00:00:00","end_date":"1970-01-01T00:00:00","description":"","location":"","company_logo":"https://media.licdn.com/dms/image/v2/C4D0BAQEHEq_w7aNHgA/company-logo_400_400/company-logo_400_400/0/1656313052939/rupifi_logo?e=1749686400&v=beta&t=WZrQhJvJ7F0y3vNspxFWIosEnznQA2hLPafVKfNBTqc"},{"title":"Software Engineer","company_name":"Wipro Technologies","start_date":"2012-09-01T00:00:00","end_date":"2014-09-01T00:00:00","description":"","location":"","company_logo":"https://media.licdn.com/dms/image/v2/D4E0BAQEINH3Vf1swig/company-logo_400_400/company-logo_400_400/0/1730379480485/wipro_logo?e=1749686400&v=beta&t=MRcOUToy2EXseScSjCzdBtx7h0nQ_Y8JyPHB7xOBLXA"},{"title":"Senior Associate, Growth","company_name":"Razorpay","start_date":"2018-12-01T00:00:00","end_date":"2019-09-01T00:00:00","description":"","location":"","company_logo":"https://media.licdn.com/dms/image/v2/C560BAQHggYLcXxs78w/company-logo_400_400/company-logo_400_400/0/1630638664845/razorpay_logo?e=1749686400&v=beta&t=c0xjfn2bYOVL84xkWjhTs9bS1mXRAyULEfHgBTscHcY"},{"title":"Deputy Manager","company_name":"Axis Bank","start_date":"2018-07-01T00:00:00","end_date":"2018-11-01T00:00:00","description":"","location":"","company_logo":"https://media.licdn.com/dms/image/v2/C510BAQGLnroiQh32ng/company-logo_400_400/company-logo_400_400/0/1630567599182/axis_bank_logo?e=1749686400&v=beta&t=-IHQbscYy_y2eZuUVVtrPYgujUkgLvOigVt3cumB5Yw"},{"title":"Management Trainee","company_name":"BookMyShow","start_date":"2017-04-01T00:00:00","end_date":"2017-06-01T00:00:00","description":"","location":"","company_logo":"https://media.licdn.com/dms/image/v2/C510BAQH1cPgGIcQVAg/company-logo_400_400/company-logo_400_400/0/1630620842868/bookmyshow_logo?e=1749686400&v=beta&t=RfR8c0z6mgMfXW56wKNqf-Rv_Anan0ceuLWdc6lagNY"},{"title":"Sales Strategy Manager","company_name":"aptivitechnologies","start_date":"2015-04-01T00:00:00","end_date":"2015-10-01T00:00:00","description":"","location":"","company_logo":""}],"education":[{"degree":"Bachelor of Technology (B.Tech.)","field_of_study":"Information Technology","school_name":"DAV institute of engineering and technology","school_logo":"","start_date":"2008-01-01T00:00:00","end_date":"2012-01-01T00:00:00","description":""},{"degree":"PGDM ","field_of_study":"Marketing","school_name":"K.J. Somaiya Institute Of Management Studies and Research","school_logo":"https://media.licdn.com/dms/image/v2/C4E0BAQF8goDpw7Jwng/company-logo_400_400/company-logo_400_400/0/1630614384951?e=1749686400&v=beta&t=_-06zYBnn9403G2exwRtLiPIO8i_I76s0adrLULKSNs","start_date":"2016-01-01T00:00:00","end_date":"2018-01-01T00:00:00","description":""}]}
    """
    for result in results["results"]:
        # Check if the user already exists in the database
        existing_user = collection2.find_one({"profile.id": result["profile"]["id"]})
        if not existing_user:
            # Insert the new user into the database
            collection2.insert_one(result)
            print(f"Inserted new user: {result['profile']['name']} with ID: {result['profile']['id']}")
        else:
            print(f"User already exists: {existing_user['profile']['name']}")
            # Update the existing user with the new data
            collection2.update_one({"profile.id": existing_user["profile"]["id"]}, {"$set": result})
            print(f"Updated user: {existing_user['profile']['name']} with new data.")

if __name__ == "__main__":
    booll = True
    while booll:
        spam_linkd("product manager", limit=30)