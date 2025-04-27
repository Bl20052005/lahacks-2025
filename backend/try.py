import requests
from uagents import Agent, Context
from pydantic import BaseModel
from typing import List
import json


class ReasoningRequest(BaseModel):
    data: str
    skills: str
    steps: str


x = requests.post(
    "http://localhost:7778/rest/post",
    json={
        "data": "is a college aged student",
        "skills": "music, art, poetry",
        "steps": "Has taken some elementary courses in design and arcitecture, doesn't know what to do yet",
    },
    headers={"Content-Type": "application/json"},
)

print(json.dumps(x.json(), indent=4))
