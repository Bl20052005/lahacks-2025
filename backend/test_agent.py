import requests
from uagents import Agent, Context
from pydantic import BaseModel
from typing import List

history = [
    {
        "role": "system",
        "content": "You are an assistant that returns a valid JSON object as described.",
    }
]


class ReasoningRequest(BaseModel):
    data: str
    skills: str
    steps: str


class Activity(BaseModel):
    title: str
    description: str
    checkBox: List[str]


class CategoryActivities(BaseModel):
    header: str
    data: List[Activity]


class ReasoningResponse(BaseModel):
    reasoning: str
    data: List[CategoryActivities] | None


class EvaluationResponse(BaseModel):
    accepted: bool
    reasoning: str


reasoning = Agent(
    name="reasoning",
    seed="secret_seed_phrase_1",
)

evaluation = Agent(
    name="evaluation",
    seed="secret_seed_phrase_2",
)

api_key = "sk_781c441d5a544986a1a10338c6b83b8c92d60e08035246078042227818dc4c80"


def get_asi1_response_reason(query: ReasoningRequest) -> str:
    """
    Sends a query to ASI1 API and returns the response.
    """
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    prompt = f"""Here are some data about the user's aspirations {query.data} and here are their current skills {query.skills}. The user has so far completed these steps: {query.steps}\nYou will create nodes that each represent one small step that the user can take to reach their aspirations. Each node should have a title, as well as inner contents that have checklists to constitute smaller tasks that the user can do in order to achieve its goal. Each task should be actionable and measurable, allowing the user to track their progress effectively. Respond ONLY with a valid JSON object in the following format:\nclass Activity(BaseModel):\n    title: str\n    description: str\n    checkBox: List[str]\nclass CategoryActivities(BaseModel):\n    header: str\n    data: List[Activity]\nclass MultiCategoryActivities(BaseModel):\n    data: List[CategoryActivities]"""

    history.append({"role": "user", "content": prompt})

    data = {
        "model": "asi1-mini",
        "messages": history,
    }

    try:
        response = requests.post(
            "https://api.asi1.ai/v1/chat/completions", json=data, headers=headers
        )
        if response.status_code == 200:
            result = response.json()
            if "choices" in result and len(result["choices"]) > 0:
                return result["choices"][0]["message"]["content"].strip()
            else:
                return "ASI1 API returned an empty response."
        else:
            return f"ASI1 API Error: {response.status_code}, {response.text}"
    except Exception as e:
        return f"ASI1 API Error: {str(e)}"


def get_asi1_response_reason_response() -> str:
    """
    Sends a query to ASI1 API and returns the response.
    """

    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    prompt = f"""The reasoning before was deemed not sufficient, please provide a new reasoning given the explanation above"""

    history.append({"role": "user", "content": prompt})

    data = {
        "model": "asi1-mini",
        "messages": history,
    }

    try:
        response = requests.post(
            "https://api.asi1.ai/v1/chat/completions", json=data, headers=headers
        )
        if response.status_code == 200:
            result = response.json()
            if "choices" in result and len(result["choices"]) > 0:
                return result["choices"][0]["message"]["content"].strip()
            else:
                return "ASI1 API returned an empty response."
        else:
            return f"ASI1 API Error: {response.status_code}, {response.text}"
    except Exception as e:
        return f"ASI1 API Error: {str(e)}"


def get_asi1_response_evaluation(reasoning: str) -> str:
    """
    Sends a query to ASI1 API and returns the response.
    """

    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    prompt = f"""You are an evaluator that determines whether or not the reasoning and syntax (which should be valid JSON and JSON only) provided earlier is correct. The reasoning is: {reasoning} If the reasoning or syntax is not correct, provide a well-thought out explanation as to why that was"""

    history.append({"role": "user", "content": prompt})

    data = {
        "model": "asi1-mini",
        "messages": history,
    }

    try:
        response = requests.post(
            "https://api.asi1.ai/v1/chat/completions", json=data, headers=headers
        )
        if response.status_code == 200:
            result = response.json()
            if "choices" in result and len(result["choices"]) > 0:
                return result["choices"][0]["message"]["content"].strip()
            else:
                return "ASI1 API returned an empty response."
        else:
            return f"ASI1 API Error: {response.status_code}, {response.text}"
    except Exception as e:
        return f"ASI1 API Error: {str(e)}"


@reasoning.on_event("startup")
async def introduce_agent(ctx: Context):
    ctx.logger.info(
        f"Hello, I'm agent reasoning and my address is {reasoning.address}."
    )


@evaluation.on_event("startup")
async def introduce_agent(ctx: Context):
    ctx.logger.info(
        f"Hello, I'm agent evaluation and my address is {evaluation.address}."
    )


@evaluation.on_message(model=ReasoningResponse, replies=EvaluationResponse)
async def answer_eval_question(ctx: Context, sender: str, msg: ReasoningResponse):
    ctx.logger.info(f"Received data: {msg.reasoning}")
    response = get_asi1_response_evaluation(msg.reasoning)
    ctx.logger.info(f"Response: {response}")

    return response


# Define a message handler for the agent
@reasoning.on_message(model=ReasoningRequest, replies=ReasoningResponse)
async def answer_question(ctx: Context, sender: str, msg: ReasoningRequest):
    ctx.logger.info(
        f"Received data: {msg.data}, skills: {msg.skills}, steps: {msg.steps}"
    )
    response = get_asi1_response_reason(msg)
    ctx.logger.info(f"Response: {response}")

    history.append(
        {
            "role": "system",
            "content": response,
        }
    )

    shall_continue = True

    while shall_continue:
        reply, status = await ctx.send_and_receive(
            evaluation.address, response, response_type=EvaluationResponse
        )

        if reply.accepted:
            shall_continue = False
            break
        else:
            history.append(
                {
                    "role": "system",
                    "content": reply.reasoning,
                }
            )
            response = get_asi1_response_reason_response()
            ctx.logger.info(f"Response: {response}")

    history = [
        {
            "role": "system",
            "content": "You are an assistant that returns a valid JSON object as described.",
        }
    ]

    return response
