from uagents import Agent, Context, Model
from uagents_ai_engine import OpenAIEngine
from pydantic import BaseModel
from typing import List


# Node class definition
class Node(BaseModel):
    id: str
    title: str
    dataCheckMarkItems: List[str]


# Reasoning Agent
class ReasoningRequest(Model):
    data: str
    skills: str
    steps: str


class ReasoningResponse(Model):
    nodes: List[Node]


reasoning_prompt = """Here are some data about the user's aspirations {data} and here are their current skills {skills}. The user has so far completed these steps: {steps}\n"
    "You will create nodes that each represent one small step that the user can take to reach their aspirations. Each node should have a title, as well\n"
    "as inner contents that have checklists to constitute smaller tasks that the user can do in order to achieve its goal. Each task\n"
    "should be actionable and measurable, allowing the user to track their progress effectively."""

reasoning_agent = Agent(name="reasoning_agent")
reasoning_engine = OpenAIEngine()


@reasoning_agent.on_message(model=ReasoningRequest, replies=ReasoningResponse)
async def handle_reasoning(ctx: Context, sender: str, msg: ReasoningRequest):
    prompt = reasoning_prompt.format(data=msg.data, skills=msg.skills, steps=msg.steps)
    response = await reasoning_engine.complete(prompt)
    # Here, parse response into Node objects (assume response is JSON list of nodes)
    try:
        nodes = [Node(**n) for n in response.json()]
    except Exception:
        nodes = []
    await ctx.send(sender, ReasoningResponse(nodes=nodes))


# Evaluation Agent
class EvaluationRequest(Model):
    reasoning: str
    steps: str
    aspirations: str
    skills: str
    formatting: str


class EvaluationResponse(Model):
    is_correct: bool
    new_reasoning: str = None
    syntax_valid: bool = True


evaluation_prompt = """You are an evaluator that determines whether or not the reasoning provided earlier is correct. The reasoning is: {reasoning}. The user has completed these steps: {steps}. The user has these aspirations: {aspirations}. The user has these skills: {skills}. Determine whether or not the reasoning is correct, and if it is not, provide a new reasoning that is correct. Also, evaluate the syntax of the previous response, whether it was valid JSON and formatted in this format: {formatting}"""

evaluation_agent = Agent(name="evaluation_agent")
evaluation_engine = OpenAIEngine()


@evaluation_agent.on_message(model=EvaluationRequest, replies=EvaluationResponse)
async def handle_evaluation(ctx: Context, sender: str, msg: EvaluationRequest):
    prompt = evaluation_prompt.format(
        reasoning=msg.reasoning,
        steps=msg.steps,
        aspirations=msg.aspirations,
        skills=msg.skills,
        formatting=msg.formatting,
    )
    response = await evaluation_engine.complete(prompt)
    # Parse response for correctness and syntax
    is_correct = "correct" in response.lower()
    syntax_valid = "valid" in response.lower()
    new_reasoning = response if not is_correct else None
    await ctx.send(
        sender,
        EvaluationResponse(
            is_correct=is_correct,
            new_reasoning=new_reasoning,
            syntax_valid=syntax_valid,
        ),
    )


# Multimodal Agent
class MultimodalRequest(Model):
    reasoning: str
    aspirations: str
    skills: str
    steps: str
    prev: str
    nodes: str
    goal: str
    data: str


class MultimodalResponse(Model):
    multimodal_output: str
    reasoning: str


multimodal_prompt = """Given the following reasoning: {reasoning}, determine whether the reasoning would benefit from a more thorough multimodal output such as audio, picture, code, video, or other modes. If so, generate a multimodal output that is relevant to the reasoning and the user's aspirations. The user has these aspirations: {aspirations}. The user has these skills: {skills}. The user has completed these steps: {steps}. The user has these previous steps: {prev}. The user has these nodes: {nodes}. The user has these goals: {goal}. The user has these data: {data}."""

multimodal_agent = Agent(name="multimodal_agent")
multimodal_engine = OpenAIEngine()


@multimodal_agent.on_message(model=MultimodalRequest, replies=MultimodalResponse)
async def handle_multimodal(ctx: Context, sender: str, msg: MultimodalRequest):
    prompt = multimodal_prompt.format(
        reasoning=msg.reasoning,
        aspirations=msg.aspirations,
        skills=msg.skills,
        steps=msg.steps,
        prev=msg.prev,
        nodes=msg.nodes,
        goal=msg.goal,
        data=msg.data,
    )
    response = await multimodal_engine.complete(prompt)
    await ctx.send(sender, MultimodalResponse(multimodal_output=response))


# To run these agents in the agentverse, you would register them as per uAgent documentation.
# Example (not run here):
# from uagents import Bureau
# bureau = Bureau()
# bureau.add(reasoning_agent)
# bureau.add(evaluation_agent)
# bureau.add(multimodal_agent)
# bureau.run()
