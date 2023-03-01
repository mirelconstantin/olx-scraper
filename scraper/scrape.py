import mysql.connector
import requests
import os
from dotenv import load_dotenv
from datetime import datetime
from bs4 import BeautifulSoup
import time

load_dotenv()

MYSQL_HOST=os.getenv('MYSQL_HOST')
MYSQL_USER=os.getenv('MYSQL_USER')
MYSQL_PASS=os.getenv('MYSQL_PASS')
MYSQL_DB=os.getenv('MYSQL_DB')

def searchRents(city, type, url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    cnx = mysql.connector.connect(host=MYSQL_HOST, user=MYSQL_USER, password=MYSQL_PASS, database=MYSQL_DB)
    cursor = cnx.cursor()

    query = f'INSERT INTO {city} (type, title, date, time, location, price, link, reactualizat) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)'
    check_query = f'SELECT title, price FROM {city} WHERE title = %s'

    listings = soup.find_all(class_='css-qfzx1y')
    links = ["https://olx.ro" + a['href'] for a in soup.find_all('a', {'class': 'css-rc5s2u'})]

    for listing,link in zip(listings,links):
        scrapedTitle = listing.find(class_='css-16v5mdi er34gjf0').text
        scrapedDate = listing.find(class_='css-veheph er34gjf0').text
        scrapedPrice = listing.find(class_='css-10b0gli er34gjf0').text

        title = scrapedTitle
        location = scrapedDate.split(" - ")[0]
        price = scrapedPrice.split("€")[0]+"€"
        date = scrapedDate.split(" - ")[1]
        
        if "storia.ro" in link:
            link=link.split("https://olx.ro")[1]

        if "Reactualizat Azi la" in date:
            oldTime = date.split("la ")[1]
            hours = f'{int(oldTime.split(":")[0])+2}'
            minutes = oldTime.split(":")[1]
            time = f'{hours}:{minutes}'

            cursor.execute(check_query, (scrapedTitle,))
            result = cursor.fetchall()
            if len(result) == 0:
                cursor.execute(query, (type, title, datetime.now().date(), time, location, price, link, 1))

        elif "Azi la" in date:
            oldTime = date.split("la ")[1]
            hours = f'{int(oldTime.split(":")[0])+2}'
            minutes = oldTime.split(":")[1]
            time = f'{hours}:{minutes}'

            cursor.execute(check_query, (scrapedTitle,))
            result = cursor.fetchall()
            if len(result) == 0:
                cursor.execute(query, (type, title, datetime.now().date(), time, location, price, link, 0))

    cnx.commit()

    cursor.close()
    cnx.close()

    print(f'[OLX • {datetime.now().strftime("%H:%M")}] Searching in {city.capitalize()} for {type.capitalize()}.')


starttime = time.time()
while True:
    CITY = "bucuresti"
    TYPE = "garsoniera"
    URL = "https://www.olx.ro/d/imobiliare/apartamente-garsoniere-de-inchiriat/1-camera/bucuresti/?currency=EUR&search%5Border%5D=created_at:desc&search%5Bfilter_float_price:from%5D=200&search%5Bfilter_float_price:to%5D=350"
    searchRents(CITY, TYPE, URL)

    CITY="bucuresti"
    TYPE="2camere"
    URL="https://www.olx.ro/d/imobiliare/apartamente-garsoniere-de-inchiriat/2-camere/bucuresti/?currency=EUR&search%5Border%5D=created_at:desc&search%5Bfilter_float_price:from%5D=200&search%5Bfilter_float_price:to%5D=350"
    searchRents(CITY, TYPE, URL)

    CITY="timisoara"
    TYPE="garsoniera"
    URL="https://www.olx.ro/d/imobiliare/apartamente-garsoniere-de-inchiriat/1-camera/timisoara/?currency=EUR&search%5Border%5D=created_at:desc&search%5Bfilter_float_price:from%5D=200&search%5Bfilter_float_price:to%5D=350"
    searchRents(CITY, TYPE, URL)

    CITY="timisoara"
    TYPE="2camere"
    URL="https://www.olx.ro/d/imobiliare/apartamente-garsoniere-de-inchiriat/2-camere/timisoara/?currency=EUR&search%5Border%5D=created_at:desc&search%5Bfilter_float_price:from%5D=200&search%5Bfilter_float_price:to%5D=350"
    searchRents(CITY, TYPE, URL)
    
    time.sleep(60.0 - ((time.time() - starttime) % 60.0))