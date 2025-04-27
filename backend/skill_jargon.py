import os
from google import genai
from pydantic import BaseModel
from typing import List

# Set up Gemini API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("Set GEMINI_API_KEY environment variable.")

client = genai.Client(api_key=GEMINI_API_KEY)

class Recommendation(BaseModel):
    title: str
    description: str
    link: str

class CategoryRecommendations(BaseModel):
    category: str
    recommendations: List[Recommendation]

class MultiCategoryRecommendations(BaseModel):
    recommendations: List[CategoryRecommendations]


def prompt_gemini_skill_assessment(
    user_prompt: str = "N/A",
    industry: str = "N/A",
    company: str = "N/A",
    current_skills: str = "N/A",
    projects: str = "N/A",
    education: str = "N/A",
    certifications: str = "N/A",
    other: str = "N/A"
) -> str:
    full_prompt = f"""
You are an assistant that analyzes the user's professional profile and recommends targeted **skill development activities, resources, and opportunities** across multiple categories.

Return a JSON list where each item matches:

class CategoryRecommendations(BaseModel):
    category: str  # Category name (e.g., Technical Skills, Soft Skills)
    recommendations: List[Recommendation]  # 3–5 suggestions

class Recommendation(BaseModel):
    title: str        # Short title of the recommendation
    description: str  # 2–4 sentences explaining why and how it helps
    link: str         # URL to resource or opportunity

**Instructions:**
- Provide 2-3 recommendations per category.
- Tailor suggestions to the user’s:
  - Industry/Position goal: {industry}
  - Target company: {company}
  - Current skills: {current_skills}
  - Experience from projects: {projects}
  - Education: {education}
  - Certifications: {certifications}
  - Other context: {other}
- Categories should include:
  - Technical Skills (e.g., advanced algorithms, design patterns)
  - Soft Skills (e.g., communication, leadership)
  - Tools & Frameworks (e.g., Docker, Kubernetes)
  - Certifications & Courses
  - Projects & Portfolio Enhancements
  - Networking & Mentorship
- Ensure recommendations are actionable, reputable, and appropriate for someone aiming for {industry} at {company}.

Respond ONLY with the JSON object — no extra text.

User prompt: {user_prompt}
"""
    response = client.models.generate_content(
        model="gemini-2.5-pro-exp-03-25",
        contents=full_prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": MultiCategoryRecommendations,
        },
    )
    return response.text.strip()


if __name__ == "__main__":
    print(prompt_gemini_skill_assessment())
