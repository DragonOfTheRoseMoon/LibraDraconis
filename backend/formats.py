from dataclasses import dataclass, field



# REFACTOR THIS FOR NEW SCHEMA

@dataclass
class Book:
    isbn: int  = 0
    title: str = ""
    authors: str = ""
    series: str = ""
    publisher: str = ""
    publish_year: int = 0
    pages: int = 0