import requests

headers = {
    "Authorization": "Bearer 1b378d6daa4886a50c0e2280bb1747b569234257"
}
endpoint = "http://localhost:8000/api/products/"

data = {
    "title": "New",
    "price": 55,
}
get_response = requests.post(endpoint, json=data, headers=headers)
#print(get_response.text)
print(get_response.json()) # print raw text response


