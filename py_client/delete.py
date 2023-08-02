import requests

product_id = input("What product id to delete?\n")
try: product_id = int(product_id)
except: print("Product id not valid")
if product_id:
    endpoint = f"http://localhost:8000/api/products/{product_id}/delete/"


    get_response = requests.delete(endpoint)
    #print(get_response.text)
    assert get_response.status_code==204 # print raw text response


