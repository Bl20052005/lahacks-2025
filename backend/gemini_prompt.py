import os
from google import genai
from pydantic import BaseModel
from typing import List

# Set up Gemini API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("Set GEMINI_API_KEY environment variable.")

client = genai.Client(api_key=GEMINI_API_KEY)


class Node(BaseModel):
    id: str
    label: str
    positionX: int
    positionY: int
    children: List[str]
    dataCheckMarkItems: List[str]


def prompt_gemini(user_prompt):
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

Respond ONLY with a valid JSON object of a Node.

User prompt: {user_prompt}
"""
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=full_prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": Node,
        },
    )
    # Extract the text response
    return response.text.strip()


if __name__ == "__main__":
    # Example usage
    user_prompt = "The node below should have data about software engineering, as well as not be close to any nodes near (0,0) and (10,10)."
    result = prompt_gemini(user_prompt)
    print(result)
