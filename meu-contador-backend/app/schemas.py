from pydantic import BaseModel, ConfigDict, Field, model_validator

MIN_INTEGER = -(2**53 - 1)
MAX_INTEGER = 2**53 - 1


class CounterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    count: int
    min: int
    max: int


class LimitsUpdate(BaseModel):
    min: int = Field(ge=MIN_INTEGER, le=MAX_INTEGER)
    max: int = Field(ge=MIN_INTEGER, le=MAX_INTEGER)

    @model_validator(mode="after")
    def validate_range(self):
        if self.min >= self.max:
            raise ValueError("The minimum must be less than the maximum.")
        return self
