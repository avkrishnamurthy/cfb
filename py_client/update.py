import requests

endpoint = "http://localhost:8000/api/products/1/update/"

data = {
    "title": "changed update3",
    "content": None,
    "price": 129.99
}
get_response = requests.put(endpoint, json=data)
#print(get_response.text)
print(get_response.json()) # print raw text response


