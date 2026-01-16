from pydantic import BaseModel


class GenerateSummaryRequest(BaseModel):
    content: str


class GenerateSummaryResponse(BaseModel):
    summary: str
