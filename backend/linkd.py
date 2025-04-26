import requests

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

if __name__ == "__main__":
    results = search_linkd(
        query="people working on AI at FAANG",
        limit=3
    )
    print(results)
