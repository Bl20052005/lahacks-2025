import os
import requests
import json
from pydantic import BaseModel
from typing import List

# Set up ASI1 API key from environment variable
ASI1_API_KEY = "sk_781c441d5a544986a1a10338c6b83b8c92d60e08035246078042227818dc4c80"
if not ASI1_API_KEY:
    raise RuntimeError("Set ASI1_API_KEY environment variable.")


class Node(BaseModel):
    id: str
    label: str
    positionX: int
    positionY: int
    children: List[str]
    dataCheckMarkItems: List[str]


def prompt_asi1(user_prompt):
    url = "https://api.asi1.ai/v1/chat/completions"
    # Compose the prompt with instructions for JSON format using Node schema
    full_prompt = f"""
You are an assistant that returns a node in the following JSON format, matching this Python Pydantic class:

class Node(BaseModel):
    id: str
    label: str
    positionX: int
    positionY: int
    children: List[str]
    dataCheckMarkItems: List[str]

Respond ONLY with a valid JSON object beginning with the character "{" and ending with the character "}".

User prompt: {user_prompt}
"""
    payload = json.dumps(
        {
            "model": "asi1-mini",
            "messages": [{"role": "user", "content": full_prompt}],
            "temperature": 0,
            "stream": False,
            "max_tokens": 500,
        }
    )
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": f"Bearer {ASI1_API_KEY}",
    }
    response = requests.post(url, headers=headers, data=payload)
    return json.loads(response.text)["choices"][0]["message"]["content"]


if __name__ == "__main__":
    # Example usage
    user_prompt = "Create a node for a math question about addition."
    raw_result = prompt_asi1(user_prompt)
    # Extract JSON object from the response string
    start = raw_result.find('{')
    end = raw_result.rfind('}')
    if start != -1 and end != -1:
        json_str = raw_result[start:end+1]
        result = json.loads(json_str)
    else:
        raise ValueError("No valid JSON object found in the response.")

    print(result)
