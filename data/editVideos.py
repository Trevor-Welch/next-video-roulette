import json
from pathlib import Path
import re
import requests
from bs4 import BeautifulSoup

# Path to your JSON file
DATA_FILE = Path("videos.json")

# Load existing data
if DATA_FILE.exists():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        videos = json.load(f)
else:
    videos = []

def list_videos():
    print(f"{'Index':<5} {'Title':<40} {'VideoID':<12} {'Tags'}")
    print("-" * 80)
    for i, v in enumerate(videos):
        print(f"{i:<5} {v['title'][:40]:<40} {v['videoId']:<12} {', '.join(v['tags'])}")

def extract_video_id(url: str) -> str:
    """
    Extract the YouTube video ID from a URL
    """
    match = re.search(r"(?:v=|youtu\.be/)([\w\-]{11})", url)
    return match.group(1) if match else ""

def fetch_title(video_id: str) -> str:
    """
    Scrape the YouTube page title
    """
    url = f"https://www.youtube.com/watch?v={video_id}"
    resp = requests.get(url)
    soup = BeautifulSoup(resp.text, "html.parser")
    title = soup.title.string.replace(" - YouTube", "").strip()
    return title

def add_video():
    print("Add video by:")
    print("1. Manual entry")
    print("2. Paste YouTube URL (auto-fetch title)")
    choice = input("Choice (1/2): ").strip()
    
    if choice == "2":
        url = input("Paste YouTube URL: ").strip()
        videoId = extract_video_id(url)
        if not videoId:
            print("Invalid URL!")
            return
        try:
            title = fetch_title(videoId)
            print(f"Fetched title: {title}")
        except Exception as e:
            print("Could not fetch title automatically.")
            title = input("Title: ")
    else:
        title = input("Title: ")
        videoId = input("Video ID: ")

    tags = input("Tags (comma separated): ").split(",")
    videos.append({"title": title, "videoId": videoId, "tags": [t.strip() for t in tags]})
    print("Added video.")

def edit_video():
    list_videos()
    index = int(input("Index to edit: "))
    if 0 <= index < len(videos):
        video = videos[index]
        print(f"Editing {video['title']}")
        title = input(f"Title [{video['title']}]: ") or video['title']
        videoId = input(f"Video ID [{video['videoId']}]: ") or video['videoId']
        tags = input(f"Tags (comma separated) [{', '.join(video['tags'])}]: ")
        if tags:
            tags = [t.strip() for t in tags.split(",")]
        else:
            tags = video['tags']
        videos[index] = {"title": title, "videoId": videoId, "tags": tags}
        print("Updated video.")

def remove_video():
    list_videos()
    index = int(input("Index to remove: "))
    if 0 <= index < len(videos):
        removed = videos.pop(index)
        print(f"Removed {removed['title']}")

def save():
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(videos, f, indent=4, ensure_ascii=False)
    print("Saved JSON.")

def menu():
    while True:
        print("\n1. List videos\n2. Add video\n3. Edit video\n4. Remove video\n5. Save & exit")
        choice = input("Choice: ")
        if choice == "1":
            list_videos()
        elif choice == "2":
            add_video()
        elif choice == "3":
            edit_video()
        elif choice == "4":
            remove_video()
        elif choice == "5":
            save()
            break
        else:
            print("Invalid choice")

if __name__ == "__main__":
    menu()
