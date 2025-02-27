import requests
import json
from time import sleep
from serpapi import GoogleSearch
from bs4 import BeautifulSoup
import subprocess

links = []
blurbs = []

def twitter_scraper(): 
    #definitions 
    apiKey='ExFWY0XxyNuwNtrL6N3qNFyek'
    username='mkro'
    scraper = 'twitterProfile'
    urls = ['https://x.com/thecrimson?ref_src=twsrc%5Egoogle%7Ctwcamp%5Es', 'https://x.com/PhillyInquirer?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor&prefetchTimestamp=1737748217353&mx=2']
    apiEndPoint = "http://api.scraping-bot.io/scrape/data-scraper"
    apiEndPointResponse = "http://api.scraping-bot.io/scrape/data-scraper-response?"
    keyword = ['Penn ', 'Penn[.!?;,]', 'Upenn', 'UPenn', 'University of Pennsylvania']

    for url in urls:
        payload = json.dumps({"url": url, "scraper": scraper})
        headers = {
            'Content-Type': "application/json"
        }
        
        response = requests.request("POST", apiEndPoint, data=payload, auth=(username, apiKey), headers=headers)
        if response.status_code == 200:
            responseId = response.json()["responseId"]

            pending = True
            while pending:
                sleep(5)
                finalResponse = requests.request("GET", apiEndPointResponse + "scraper=" + scraper + "&responseId=" + responseId
                                                , auth=(username, apiKey))
                result = finalResponse.json()
                if type(result) is list:
                    pending = False
                    for res in result:
                        if any(word in res['text'] for word in keyword):
                            links.append(res['post_url'])
                            blurbs.append(res['text'])
                elif type(result) is dict:
                    if "status" in result and result["status"] == "pending":
                        continue
                    elif result["error"] is not None:
                        pending = False
                        print(json.dumps(result, indent=4))

        else:
            print(response.text) 

def google_search(): 
    cx = '017576662512468239146:omuauf_lfve'
    key='8031ec2c39301d29c4251bbb9da987d0ec92d97f440749b79925db900ee5c89a'
    query = 'UPenn'
    googleEndPoint = f'https://serpapi.com/search.json?engine=google&q={query}' 
    search = GoogleSearch({
    "q": "UPenn News Today", #make this more optimized and do different kinds of searches
    "api_key": key,
  })
    result = search.get_dict()
    organic_results = result["organic_results"]

    banned_sources = ['penntoday', 'thedp', 'penn_today', 'https://www.upenn.edu/']

    for news in organic_results:
        if any(word in news['link'] for word in banned_sources):
            continue
        else:
            blurbs.append(news['snippet'])
            links.append(news['link'])


def website_scraper_penntoday():
    url = "https://penntoday.upenn.edu/news/archives"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    # Find articles (adjust selector based on HTML structure)
    articles = soup.find_all("article", class_="search-tease")

    for article in articles:
        # Extract link
        link_tag = article.find("a", class_="search-tease__link")
        link = "https://penntoday.upenn.edu" + link_tag["href"] if link_tag else "No link"

        # Extract blurb
        blurb_tag = article.find("p", class_="search-tease__dek")
        blurb = blurb_tag.get_text(strip=True) if blurb_tag else "No blurb"

        # Store the extracted data
        links.append(link)
        blurbs.append(blurb)

def website_scraper_admission():
    # URL of the site to scrape
    url = "https://admissions.upenn.edu/visit-connect/penn-perspectives/blog"
    base_url = "https://admissions.upenn.edu/"

    # Send a GET request
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    # Find blog articles
    articles = soup.find_all("div", class_="blog-item")

    for article in articles:
        # Extract headline
        title_tag = article.find("h2")
        title = title_tag.get_text(strip=True)
        blurbs.append(title)

        # Extract link
        link_tag = article.find("a", class_="blog-item__link")
        link = base_url + link_tag["href"] 
        links.append(link)

def penn_site_scraper():
    twitter_scraper(); 
    google_search(); 
    website_scraper_penntoday(); 
    website_scraper_admission(); 

if __name__ == "__main__":
    output = {
        "links": links,
        "blurbs": blurbs
    }
    print(json.dumps(output))