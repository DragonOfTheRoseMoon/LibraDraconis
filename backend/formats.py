from dataclasses import dataclass, field


@dataclass
class Book:
    isbn: str  = ""
    title: str = ""
    author: str = ""
    series: str = ""
    seriesPOS: int = 0
    publisher: str = ""
    publishYear: int = 0
    pages: int = 0
    thumbnail: str = ""
    small_thumbnail: str = ""
    source: str = ""
    sourceID: str = ""

