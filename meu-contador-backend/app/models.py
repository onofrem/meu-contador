from sqlalchemy import BigInteger, CheckConstraint, Integer
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class CounterState(Base):
    __tablename__ = "counter_state"
    __table_args__ = (
        CheckConstraint("min_value < max_value", name="ck_counter_min_less_than_max"),
        CheckConstraint(
            "count >= min_value AND count <= max_value",
            name="ck_counter_count_within_limits",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    count: Mapped[int] = mapped_column(BigInteger, nullable=False)
    min_value: Mapped[int] = mapped_column(BigInteger, nullable=False)
    max_value: Mapped[int] = mapped_column(BigInteger, nullable=False)
