import requests
from uagents import Agent, Context, Model
from typing import List
import json

history = [
    {
        "role": "system",
        "content": "You are an assistant that returns a valid JSON object as described.",
    }
]


class ReasoningRequest(Model):
    data: str
    skills: str
    steps: str


class Activity(Model):
    title: str
    description: str
    checkBox: List[str]


class CategoryActivities(Model):
    header: str
    data: List[Activity]


class ReasoningResponse(Model):
    reasoning: str
    data: List[CategoryActivities] | None


class EvaluationResponse(Model):
    accepted: bool
    reasoning: str


reasoning = Agent(
    name="reasoning",
    seed="secret_seed_phrase_1",
    port=7778,
    endpoint=["http://localhost:7778"],
)

api_key = "sk_781c441d5a544986a1a10338c6b83b8c92d60e08035246078042227818dc4c80"


def get_asi1_response_reason(query: ReasoningRequest) -> str:
    """
    Sends a query to ASI1 API and returns the response.
    """
    global history
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    prompt = f"""Here are some data about the user's aspirations {query.data} and here are their current skills {query.skills}. The user has so far completed these steps: {query.steps}\nYou will create nodes that each represent one small step that the user can take to reach their aspirations. Each node should have a title, as well as inner contents that have checklists to constitute smaller tasks that the user can do in order to achieve its goal. Each task should be actionable and measurable, allowing the user to track their progress effectively. Respond ONLY with a valid JSON object in the following format:\nclass Activity(Model):
    title: str
    description: str
    checkBox: List[str]


class CategoryActivities(Model):
    header: str
    data: List[Activity]


class ReasoningResponse(Model):
    reasoning: str
    data: List[CategoryActivities] | None"""

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
                uncleanRes = result["choices"][0]["message"]["content"].strip()
                start = uncleanRes.find("{")
                end = uncleanRes.rfind("}")
                if start != -1 and end != -1:
                    json_str = uncleanRes[start : end + 1]
                    return json_str
                else:
                    result = """{"reasoning": "Invalid JSON", "data": []}"""
                return result

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
    global history
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
    global history
    """
    Sends a query to ASI1 API and returns the response.
    """

    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    prompt = f"""You are an evaluator that determines whether or not the reasoning and syntax (which should be valid JSON and JSON only) provided earlier is correct. The reasoning and data is: {reasoning} If the reasoning or syntax is not correct, provide a well-thought out explanation as to why that was respond in this json format and only in this json format: class EvaluationResponse(Model):
    accepted: bool
    reasoning: str"""

    data = {
        "model": "asi1-mini",
        "messages": [
            {
                "role": "system",
                "content": "You are an assistant that evaluates whether the message sent was valid or not.",
            },
            {"role": "user", "content": prompt},
        ],
    }

    try:
        response = requests.post(
            "https://api.asi1.ai/v1/chat/completions", json=data, headers=headers
        )
        if response.status_code == 200:
            result = response.json()
            if "choices" in result and len(result["choices"]) > 0:
                uncleanRes = result["choices"][0]["message"]["content"].strip()
                start = uncleanRes.find("{")
                end = uncleanRes.rfind("}")
                if start != -1 and end != -1:
                    json_str = uncleanRes[start : end + 1]
                    return json_str
                else:
                    result = """{"accepted": false, "data": []}"""
                return result
        else:
            return f"ASI1 API Error: {response.status_code}, {response.text}"
    except Exception as e:
        return f"ASI1 API Error: {str(e)}"


@reasoning.on_event("startup")
async def introduce_agent(ctx: Context):
    ctx.logger.info(
        f"Hello, I'm agent reasoning and my address is {reasoning.address}."
    )


# Define a message handler for the agent
@reasoning.on_rest_post("/rest/post", ReasoningRequest, ReasoningResponse)
async def answer_question(ctx: Context, msg: ReasoningRequest):
    global history
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
        ctx.logger.info("1")
        res = json.loads(response)
        ctx.logger.info("2")
        new_res = ReasoningResponse(reasoning=res["reasoning"], data=res["data"])
        ctx.logger.info("3")

        reply = get_asi1_response_evaluation(response)

        ctx.logger.info(f"reply: {reply}")

        reply = json.loads(reply)

        ctx.logger.info("5")

        if reply["accepted"]:
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
    res = json.loads(response)
    new_res = ReasoningResponse(reasoning=res["reasoning"], data=res["data"])
    return new_res


if __name__ == "__main__":
    reasoning.run()
