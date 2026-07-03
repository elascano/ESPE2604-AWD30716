import requests
import json

BASE_URL = "https://jsonplaceholder.typicode.com"

HEADERS = {
    "Content-Type": "application/json; charset=UTF-8",
    "Accept": "application/json",
}


def show_response(operation: str, response: requests.Response) -> None:
    separator = "=" * 55
    print(f"\n{separator}")
    print(f"  {operation}")
    print(f"  HTTP Status : {response.status_code} {response.reason}")
    print(separator)
    try:
        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
    except ValueError:
        print("(No JSON body in response)")


def get_all_posts() -> None:
    url = f"{BASE_URL}/posts"
    response = requests.get(url, headers=HEADERS)
    response_preview = response.json()[:3]
    print("\n" + "=" * 55)
    print("  GET – First 3 posts (of 100 total)")
    print("  HTTP Status :", response.status_code, response.reason)
    print("=" * 55)
    print(json.dumps(response_preview, indent=2, ensure_ascii=False))


def get_post_by_id(post_id: int) -> None:
    url = f"{BASE_URL}/posts/{post_id}"
    response = requests.get(url, headers=HEADERS)
    show_response(f"GET – Post with ID {post_id}", response)


def get_posts_by_user(user_id: int) -> None:
    url = f"{BASE_URL}/posts"
    params = {"userId": user_id}
    response = requests.get(url, headers=HEADERS, params=params)
    print("\n" + "=" * 55)
    print(f"  GET – User {user_id} posts (with query params)")
    print("  Constructed URL :", response.url)
    print("  HTTP Status     :", response.status_code, response.reason)
    print("=" * 55)
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))


def create_post() -> None:
    url = f"{BASE_URL}/posts"
    new_post = {
        "title": "Learning APIs with Python",
        "body": "REST APIs allow systems to communicate in a standard way using HTTP.",
        "userId": 1,
    }
    response = requests.post(url, headers=HEADERS, json=new_post)
    show_response("POST – Create new post", response)


def put_update_post(post_id: int) -> None:
    url = f"{BASE_URL}/posts/{post_id}"
    updated_post = {
        "id": post_id,
        "title": "Title updated with PUT",
        "body": "This body was completely replaced.",
        "userId": 1,
    }
    response = requests.put(url, headers=HEADERS, json=updated_post)
    show_response(f"PUT – Replace post {post_id}", response)


def patch_update_title(post_id: int) -> None:
    url = f"{BASE_URL}/posts/{post_id}"
    changes = {"title": "Title modified with PATCH"}
    response = requests.patch(url, headers=HEADERS, json=changes)
    show_response(f"PATCH – Update only the title of post {post_id}", response)


def delete_post(post_id: int) -> None:
    url = f"{BASE_URL}/posts/{post_id}"
    response = requests.delete(url, headers=HEADERS)
    show_response(f"DELETE – Delete post {post_id}", response)


def get_non_existent_resource() -> None:
    url = f"{BASE_URL}/posts/9999"
    response = requests.get(url, headers=HEADERS)
    print("\n" + "=" * 55)
    print("  GET – Non-existent resource (error handling)")
    print("  HTTP Status :", response.status_code, response.reason)
    print("=" * 55)
    if response.status_code == 404:
        print("⚠  Resource not found (404). Verify the endpoint.")
    else:
        response.raise_for_status()


if __name__ == "__main__":
    print("\n🐍  REST API call examples with Python + requests")
    print("    API: https://jsonplaceholder.typicode.com\n")

    get_all_posts()
    get_post_by_id(1)
    get_posts_by_user(2)
    create_post()
    put_update_post(1)
    patch_update_title(1)
    delete_post(1)
    get_non_existent_resource()

    print("\n✅  All operations completed.\n")
