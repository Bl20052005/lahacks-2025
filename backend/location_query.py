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


def prompt_gemini_college(
    background={},
    user_prompt="Find opportunities for aspiring Software Engineers near Irvine across Hackathons, Clubs, and Volunteer Projects that help college students build real skills, grow their careers, and meet new people.",
    location="Irvine, CA",
    uni="UCI",
    major="Computer Science",
    goal="software engineering",
    company="Google",
    grad="N/A",
    exp="N/A",
    clubs="Hack at UCI",
    courses="Data Structures, Algorithms",
    skills="Python, Java, C++",
    orgs="N/A",
    other="N/A",
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

User's past experiences for consideration:
- College: {uni}
- Major: {major}
- Career Goal: {goal}
- Company: {company}
- Grad School: {grad}
- Experience: {exp}
- Clubs: {clubs}
- Courses: {courses}
- Skills: {skills}
- Organizations: {orgs}
- Other: {other}

Respond ONLY with the JSON object — no extra text.

User prompt: {user_prompt}
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


def prompt_gemini_highschool(
    user_prompt="Find local opportunities for a high school student interested in Computer Science to build experience through clubs, competitions, volunteer work, and skill development.",
    location="Irvine, CA",
    highschool="Northwood High School",
    year="11th Grade",
    careers="Software Engineer",
    college="UC Berkeley",
    clubs="Robotics Club, Coding Club",
    sports="Tennis",
    volunteering="Library Volunteer",
    coursework="AP Computer Science, Honors Math",
    skills="Python, Java",
    awards="Hackathon Winner, Math Olympiad",
    certifications="AWS Cloud Practitioner",
    other="Interested in AI and building apps",
):
    full_prompt = f"""
You are an assistant that recommends **events, programs, activities, and opportunities** for a high school student based on their profile.

Return a JSON list where each item matches:

class CategoryActivities(BaseModel):
    category: str  # Category name (e.g., Clubs, Competitions, Volunteering)
    activities: List[Activity]  # 3–5 opportunities

class Activity(BaseModel):
    title: str        # Short title of the opportunity
    description: str  # 2–4 sentences explaining the event
    link: str         # Official page or signup link

**Instructions:**
- Include 3–5 opportunities for each category (Clubs, Competitions, Volunteer, Skill Building, and Certifications).
- Recommend real activities students can join (not just online courses).
- Prioritize free or affordable opportunities (under $30 if any cost).
- Focus on local or remote opportunities accessible from {location}.
- Focus on activities that match the student’s career interests and college aspirations.
- Opportunities must be active, upcoming, or continuously available.
- Favor activities with hands-on participation (building projects, competitions, workshops, volunteering).
- Mix well-known and hidden gem opportunities.

Student profile for consideration:
- High School: {highschool}
- Year: {year}
- Career Interests: {careers}
- College Goals: {college}
- Club Involvement: {clubs}
- Sports: {sports}
- Volunteer Activities: {volunteering}
- Relevant Coursework: {coursework}
- Skills: {skills}
- Competitions and Awards: {awards}
- Certifications: {certifications}
- Other Interests: {other}

Respond ONLY with the JSON object — no extra explanation.

User prompt: {user_prompt}
"""
    response = client.models.generate_content(
        model="gemini-2.5-pro-exp-03-25",
        contents=full_prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": MultiCategoryActivities,
        },
    )
    return response.text.strip()


if __name__ == "__main__":
    user_prompt = "Find opportunities for aspiring Software Engineers near Irvine across Hackathons, Clubs, and Volunteer Projects that help college students build real skills, grow their careers, and meet new people."
    # result = prompt_gemini_college(user_prompt)
    # print(result)
    print(prompt_gemini_highschool())


# good test prompt below
# user_prompt="Find local opportunities for a high school student interested in Computer Science to build experience through clubs, competitions, volunteer work, and skill development.",
#                               location="Irvine, CA", highschool="Northwood High School", year="11th Grade",
#                               careers="Software Engineer", college="UC Berkeley",
#                               clubs="Robotics Club, Coding Club", sports="Tennis", volunteering="Library Volunteer",
#                               coursework="AP Computer Science, Honors Math", skills="Python, Java",
#                               awards="Hackathon Winner, Math Olympiad", certifications="AWS Cloud Practitioner",
#                               other="Interested in AI and building apps"
