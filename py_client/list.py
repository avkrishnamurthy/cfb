import requests
from getpass import getpass

auth_endpoint = "http://localhost:8000/api/auth/"
username = input("What is your username?\n")
password = getpass()

auth_response = requests.post(auth_endpoint, json={"username": username, 'password': password})
#print(get_response.text)
print(auth_response.json()) # print raw text response

if auth_response.status_code == 200:
    #Store token in database somewhere so we donn't need to get a new one every time
    token = auth_response.json()['token']
    headers = {
        "Authorization": f"Bearer {token}"
    }
    endpoint = "http://localhost:8000/api/products/"

    get_response = requests.get(endpoint, headers=headers)
    data = get_response.json()
    next_url = data['next']
    # print(data)
    while next_url is not None:
        get_response = requests.get(next_url, headers=headers)
        data = get_response.json()
        next_url = data['next']
        # print(data)
        print(next_url)

    #print(get_response.text)
    # print(get_response.json()) # print raw text response


