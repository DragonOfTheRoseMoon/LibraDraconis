import requests
import os
import re
from dotenv import load_dotenv
from formats import (Book)
import json





# Call would look like this for ISBN:
#GET https://www.googleapis.com/books/v1/volumes?q=  isbn:9780156031196  &key=yourAPIKey


class GoogleBooks:
    def __init__(self):
        load_dotenv()
        self.baseBookUrl = "https://www.googleapis.com/books/v1/volumes?q="
        self.API_key = os.environ.get("API_KEY")


#------------------------Search Logic---------------------------------------


    def get_book_info_by_isbn(self, isbn):

        _isbn = (f"isbn:{isbn}")
        url = (f"{self.baseBookUrl}{_isbn}&key={self.API_key}")
        response = requests.get(url)
        response.raise_for_status()
        return response.json()

    































#----------------------------------------------------
def main():
    api = GoogleBooks()
    isbn = "0786918047"
    Book = api.get_book_info_by_isbn(f"{isbn}")
    print(json.dumps(Book, indent=2))


if __name__ == "__main__":
    main()