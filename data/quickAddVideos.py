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

def extract_video_id(url: str) -> str:
    """Extract the YouTube video ID from a URL."""
    match = re.search(r"(?:v=|youtu\.be/)([\w\-]{11})", url)
    return match.group(1) if match else ""

def fetch_title(video_id: str) -> str:
    """Scrape the YouTube page title."""
    url = f"https://www.youtube.com/watch?v={video_id}"
    resp = requests.get(url)
    soup = BeautifulSoup(resp.text, "html.parser")
    title = soup.title.string.replace(" - YouTube", "").strip()
    return title

def save_json():
    """Save videos list to JSON file."""
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(videos, f, indent=4, ensure_ascii=False)

def loop_add_videos():
    print("Paste YouTube URLs to add videos. CTRL-C to quit.\n")
    try:
        while True:
            url = input("YouTube URL: ").strip()
            video_id = extract_video_id(url)
            if not video_id:
                print("Invalid URL! Try again.")
                continue

            # Fetch title
            try:
                title = fetch_title(video_id)
            except Exception:
                title = ""
            
            # Confirm title (default Yes)
            print(f"Scraped title: {title}")
            correct = input("Is this correct? (Y/n): ").strip().lower()
            if correct == "n":
                title = input("Enter correct title: ").strip()

            # Tags
            tags = input("Tags (comma separated, leave blank for none): ").split(",")
            tags = [t.strip() for t in tags if t.strip()]

            # Add to videos list
            videos.append({"title": title, "videoId": video_id, "tags": tags})
            save_json()
            print(f"Added video: {title} (saved)\n")
    except KeyboardInterrupt:
        print("\nExiting. All videos already saved. Goodbye!")

if __name__ == "__main__":
    loop_add_videos()
