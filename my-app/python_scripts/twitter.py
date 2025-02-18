import requests
import json
from time import sleep
from serpapi import GoogleSearch
from bs4 import BeautifulSoup
import subprocess


def penn_site_scraper():
    stopwords = ['Main navigation', 'Breadcrumb', 'Footer Links']

    # URL of the site to scrape
    url = "https://admissions.upenn.edu/visit-connect/penn-perspectives/blog"

    # Send a GET request
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    blurbs = []
    links = []

    # Find blog articles
    articles = soup.find_all("article")
    #print(soup.find_all("article"))

    for article in articles:
        # Extract headline
        headline = article.find("h2")
        if headline not in stopwords:
            blurbs.append(headline.get_text(strip=True))
            link_tag = article.find("a")
            if link_tag:
                links.append("https://admissions.upenn.edu" + link_tag["href"])
    return blurbs, links

if __name__ == "__main__":
    links, blurbs = penn_site_scraper()
    output = {
        "links": links,
        "blurbs": blurbs
    }
    print(json.dumps(output))