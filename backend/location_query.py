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


class CategoryActivities(BaseModel):
    category: str
    activities: List[Activity]


def prompt_gemini(
    user_prompt="Find opportunities for aspiring Software Engineers near Irvine across Hackathons, Clubs, and Volunteer Projects that help college students build real skills, grow their careers, and meet new people.",
    location="Irvine, CA",
):
    full_prompt = f"""
You are an assistant that recommends multiple **activities, events, or opportunities** for each category.

Return a JSON list, where each item matches:

class CategoryActivities(BaseModel):
    category: str  # Category name (e.g., Hackathons, Clubs, Workshops)
    activities: List[Activity]  # 3–5 opportunities

class Activity(BaseModel):
    title: str        # Short title of the opportunity
    description: str  # 2–4 sentences explaining the event
    link: str         # Official page or signup link

**Instructions:**
- Include multiple opportunities (3–5) per category.
- Opportunities should match the user’s goal (e.g., career growth, social, creativity, wellness).
- Prioritize opportunities that are free or under $30.
- Location must be within 35 miles of {location}.
- Must be active or happening soon.
- Favor activities that involve real participation (workshops, hackathons, group projects, volunteering) rather than just listening.
- Balance popular and hidden gems.
- Make sure the description clearly shows why it's relevant to the goal.

Respond ONLY with the JSON object — no extra text.

User prompt: {user_prompt}
"""
    response = client.models.generate_content(
        model="gemini-2.5-pro-exp-03-25",
        contents=full_prompt,
        config={
            "response_mime_type": "application/json",
        },
    )
    return response.text.strip()


if __name__ == "__main__":
    user_prompt = "Find opportunities for aspiring Software Engineers near Irvine across Hackathons, Clubs, and Volunteer Projects that help college students build real skills, grow their careers, and meet new people."
    result = prompt_gemini(user_prompt)
    print(result)
