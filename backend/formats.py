from dataclasses import dataclass, field



# REFACTOR THIS FOR NEW SCHEMA

@dataclass
class BookOLD:
    isbn: int  = 0
    title: str = ""
    authors: str = ""
    series: str = ""
    publisher: str = ""
    publish_year: int = 0
    pages: int = 0


@dataclass
class Book:
    isbn: int  = 0
    title: str = ""
    authors: str = ""
    series: str = ""
    series_position: int = 0
    publisher: str = ""
    publish_year: int = 0
    print_type: str = ""
    pages: int = 0
    thumbnail: str = ""
    small_thumbnail: str = ""
    source: str = ""
    sourceid: str = ""

