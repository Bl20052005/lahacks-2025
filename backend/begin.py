import os
from google import genai
from pydantic import BaseModel
from typing import List

# Set up Gemini API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("Set GEMINI_API_KEY environment variable.")

client = genai.Client(api_key=GEMINI_API_KEY)


class Activity(BaseModel):
    title: str
    description: str
    link: str
    checkBox: List[str]


class CategoryActivities(BaseModel):
    header: str
    data: List[Activity]


class MultiCategoryActivities(BaseModel):
    data: List[CategoryActivities]


def prompt_gemini_begin(
    background="",
    theme="",
):
    full_prompt = f"""
You are an assistant that recommends multiple **activities, events, or opportunities** for each category.

Return a JSON list, where each item matches:

class Activity(BaseModel):
    title: str
    description: str
    link: str
    checkBox: List[str]


class CategoryActivities(BaseModel):
    header: str
    data: List[Activity]


class MultiCategoryActivities(BaseModel):
    data: List[CategoryActivities]

Here are the user's background and aspirations: {background}
Everything should be centered around this theme: {theme}
Return nothing but the JSON object
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash-preview-04-17",
        contents=full_prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": MultiCategoryActivities,
        },
    )
    return response.text.strip()
