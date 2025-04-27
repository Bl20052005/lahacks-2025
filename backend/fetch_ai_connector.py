import requests
from uagents import Agent, Context, Model
from pydantic import BaseModel
from typing import List


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


agent = Agent(
    name="reasoning",
    seed="secret_seed_phrase_1",
    port=7777,
    endpoint=["http://localhost:7777/submit"],
)


@agent.on_event("startup")
async def introduce_agent(ctx: Context):
    ctx.logger.info(f"Hello, I'm agent reasoning and my address is {agent.address}.")


# @agent.on_message(model=ReasoningRequest, replies=ReasoningResponse)
# async def answer_eval_question(ctx: Context, sender: str, msg: ReasoningRequest):
#     reply, status = await ctx.send_and_receive(
#         "agent1qghc0js5fwckexlg3nnykfngnx50jwtchuzrh6j0zcdgtgrvzzewuzt6vjy",
#         msg,
#         response_type=ReasoningResponse,
#     )

#     return reply


@agent.on_rest_post("/rest/post", ReasoningRequest, ReasoningResponse)
async def handle_post(ctx: Context, req: ReasoningRequest) -> ReasoningResponse:
    ctx.logger.info("Received POST request")
    reply, status = await ctx.send_and_receive(
        "agent1qvqell2f34cw8ufhpj59vqx9jvz0jzzcuezfsvh4x57klmtt3a8dznv40t0",
        req,
        response_type=ReasoningResponse,
    )

    ctx.logger.info(f"status {status}")

    return reply


if __name__ == "__main__":
    agent.run()
