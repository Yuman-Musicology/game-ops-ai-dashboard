#!/usr/bin/env python3
"""
Game Ops data pipeline: scrape r/LoveAndDeepspace, analyze with LLM, update dashboard mock data.
Requires: pip install requests openai
"""

import json
import os
import re

import requests
from openai import OpenAI

REDDIT_URL = "https://www.reddit.com/r/LoveAndDeepspace/hot.json?limit=30"
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
MODEL_NAME = "Qwen/Qwen2.5-72B-Instruct"
BATCH_SIZE = 5
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "src", "data", "mock_feedback.json")

SENTIMENTS = ["Positive", "Negative", "Mixed"]
CATEGORIES = [
    "Lore & Character",
    "3D Art & Animation",
    "Gacha & Commercial",
    "System & Progression",
    "Combat & Balance",
    "Bugs & Performance",
]


def scrape_reddit():
    """Fetch top 30 hot posts from r/LoveAndDeepspace."""
    print("Step 1: Scraping Reddit r/LoveAndDeepspace (top 30 hot)...")
    headers = {"User-Agent": USER_AGENT}
    resp = requests.get(REDDIT_URL, headers=headers, timeout=15)
    resp.raise_for_status()
    data = resp.json()
    children = data.get("data", {}).get("children", [])[:30]
    posts = []
    for i, child in enumerate(children, start=1):
        d = child.get("data", {})
        title = d.get("title") or ""
        selftext = d.get("selftext") or ""
        text = f"{title}\n\n{selftext}".strip() if selftext else title
        posts.append({"id": i, "text": text})
    print(f"  -> Fetched {len(posts)} posts.")
    return posts


def analyze_batch(client, posts):
    """Send a batch of posts to the LLM and return structured analysis."""
    numbered = "\n\n".join([f"[Post {p['id']}]\n{p['text'][:2000]}" for p in posts])
    system_prompt = """You are a Game Ops Analyst. For each post you are given, you must output exactly:
- actual_sentiment: strictly one of ['Positive', 'Negative', 'Mixed']
- actual_category: strictly one of ['Lore & Character', '3D Art & Animation', 'Gacha & Commercial', 'System & Progression', 'Combat & Balance', 'Bugs & Performance']
- source: always exactly 'Reddit'

Return a single valid JSON array of objects. Each object must have these keys only: id, source, text, actual_sentiment, actual_category.
- id: integer matching the post number from the input.
- source: "Reddit"
- text: the full combined title + selftext of that post (copy from the input).
- actual_sentiment: one of Positive, Negative, Mixed
- actual_category: one of the six categories above

Output nothing but the JSON array, no markdown or explanation."""

    user_prompt = f"Analyze these {len(posts)} Reddit posts and return the JSON array as instructed:\n\n{numbered}"

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
        max_tokens=2000,
    )
    content = response.choices[0].message.content.strip()
    # Strip markdown code block if present
    if content.startswith("```"):
        content = re.sub(r"^```(?:json)?\s*", "", content)
        content = re.sub(r"\s*```$", "", content)
    result = json.loads(content)
    if not isinstance(result, list):
        result = [result]
    return result


def analyze_with_llm(client, posts):
    """Process posts in batches and combine results."""
    print("Step 2: Sending posts to LLM for analysis (batches of 5)...")
    all_analyzed = []
    for i in range(0, len(posts), BATCH_SIZE):
        batch = posts[i : i + BATCH_SIZE]
        batch_num = (i // BATCH_SIZE) + 1
        total_batches = (len(posts) + BATCH_SIZE - 1) // BATCH_SIZE
        print(f"  -> Batch {batch_num}/{total_batches} (posts {batch[0]['id']}-{batch[-1]['id']})...")
        batch_result = analyze_batch(client, batch)
        all_analyzed.extend(batch_result)
    print(f"  -> Received {len(all_analyzed)} analyzed items total.")
    return all_analyzed


def validate_and_normalize(items, posts_by_id):
    """Ensure correct count, source, and ids; preserve original text from Reddit."""
    print("Step 3: Validating and normalizing output...")
    normalized = []
    for i, obj in enumerate(items[:30], start=1):
        text = (posts_by_id.get(obj.get("id")) or posts_by_id.get(i)) or obj.get("text", "")
        sentiment = obj.get("actual_sentiment", "Mixed")
        category = obj.get("actual_category", "Lore & Character")
        if sentiment not in SENTIMENTS:
            sentiment = "Mixed"
        if category not in CATEGORIES:
            category = "Lore & Character"
        normalized.append({
            "id": i,
            "source": "Reddit",
            "text": text if isinstance(text, str) else str(text),
            "actual_sentiment": sentiment,
            "actual_category": category,
        })
    print(f"  -> Normalized {len(normalized)} items.")
    return normalized


def save_json(items):
    """Overwrite mock_feedback.json with the final array."""
    print("Step 4: Writing to dashboard...")
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    print(f"  -> Saved to {OUTPUT_PATH}")


def main():
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("ERROR: OPENAI_API_KEY environment variable is not set.")
        return 1

    posts = scrape_reddit()
    if not posts:
        print("ERROR: No posts fetched from Reddit.")
        return 1

    posts_by_id = {p["id"]: p["text"] for p in posts}

    client = OpenAI(
    api_key="sk-puqynssggtiuuqajrbpiqmezafatduxlogbdxjvsebqtloga", 
    base_url="https://api.siliconflow.cn/v1"
)
    analyzed = analyze_with_llm(client, posts)
    normalized = validate_and_normalize(analyzed, posts_by_id)
    save_json(normalized)

    print("Done. Dashboard mock data updated.")
    return 0


if __name__ == "__main__":
    exit(main())
