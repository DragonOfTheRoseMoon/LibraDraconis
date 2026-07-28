import requests
import os
import re
from dotenv import load_dotenv
from formats import (Book)
import json


class GoogleBooks:
    def __init__(self):
        load_dotenv()
        self.baseBookUrl = "https://www.googleapis.com/books/v1/volumes?q="
        self.API_key = os.environ.get("API_KEY")


#------------------------Search Logic---------------------------------------

    def get_isbn(self, volume_info):
        identifiers = volume_info.get("industryIdentifiers", [])
        for ident in identifiers:
            if ident["type"] == "ISBN_13":
                return ident["identifier"]
        for ident in identifiers:
            if ident["type"] == "ISBN_10":
                return ident["identifier"]
        return None


    def get_authors(self, volume_info):
        return volume_info.get("authors", [])


    def get_publish_year(self, volume_info):
        date = volume_info.get("publishedDate", "")
        if not date:
            return None
        year_str = date.split("-")[0]
        try:
            return int(year_str)
        except ValueError:
            return None



#------------------------Search Functions-----------------------------------


    def get_book_info_by_isbn(self, isbn):
        # Call would look like this for ISBN:
        # https://www.googleapis.com/books/v1/volumes?q=isbn:9780156031196&key=yourAPIKey

        search_isbn = (f"isbn:{isbn}")
        url = (f"{self.baseBookUrl}{search_isbn}&key={self.API_key}")
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        if not data.get("items"):
            return None


        volume_info = data["items"][0]["volumeInfo"]

        _gbookID = data["items"][0]["id"]
        _isbn = self.get_isbn(volume_info)
        _title = volume_info["title"]
        _author = self.get_authors(volume_info)
        _series = volume_info.get("subtitle")
        _publisher = volume_info.get("publisher")
        _publishYear = self.get_publish_year(volume_info)
        _pages = volume_info.get("pageCount")
        _image_links = volume_info.get("imageLinks", {})
        _thumbnail = _image_links.get("thumbnail")
        _small_thumbnail = _image_links.get("smallThumbnail")

        return Book (
            isbn = _isbn,
            title = _title,
            author = _author,
            series = _series,
            seriesPOS = 0, #googleBooksAPI is not good with this but leaving value here in case they ever fix it.
            publisher = _publisher,
            publishYear = _publishYear,
            pages = _pages,
            thumbnail = _thumbnail,
            small_thumbnail = _small_thumbnail,
            source = "GoogleBooks", #if run through this call its ALWAYS GoogleBooks
            sourceID = _gbookID
            )

















#----------------------------------------------------
def main():
    api = GoogleBooks()
    isbn = "9780451460479"
    Book = api.get_book_info_by_isbn(f"{isbn}")
    print(Book)


if __name__ == "__main__":
    main()