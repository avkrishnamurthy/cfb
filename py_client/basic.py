import requests

# endpoint = "https://httpbin.org/status/200/"
# endpoint = "https://httpbin.org/anything"
# endpoint = "https://httpbin.org/"
endpoint = "http://localhost:8000/api/"

#HTTP Request -> HTML
#REST API HTTP REQUEST -> JSON (typically)
get_response = requests.post(endpoint, json={"title": "Abc123", "content": "Hello world", "price": 12})
#print(get_response.text)
print(get_response.json()) # print raw text response


