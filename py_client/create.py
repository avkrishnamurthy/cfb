import requests

endpoint = "http://localhost:8000/api/products/"

data = {
    "title": "Create",
    "price": 50,
}
get_response = requests.post(endpoint, json=data)
#print(get_response.text)
print(get_response.json()) # print raw text response


