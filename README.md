# BlitzPicks

BlitzPicks is a full-stack web app that I created to serve as an annual competition and community for college football fans and analysts. The idea for this project came to me over the last few years while talking to my brother every year about the upcoming college football season and making our picks on different games and awards. I wanted to make an application where it would be easy and fun to create some competition with picks on betting lines and outright winners of different games but also have it be easy to look back on at the end of the season to see who did the best and how the season turned out different than we expected. Additionally, I hope for this website to serve as an evaluation tool for predictive college football models like Bill Connelley's SP+, and for a model that I hope to create in the future.

## How it works
The backend is created in Python with the following technologies: the django rest framework was used to create the backend endpoints and models. JSON Web Tokens (JWT) are used for authentication. Data for the players, games and general team information was fetched from the College Football Data (CFBD) API. Player images are obtained dynamically using the Google Search API by querying for headshots of a (player, team) combination. Results are stored in the database to prevent unneccesary calls to the API for repeat players. The database is PostgreSQL. Every Tuesday at 4 AM an asynchronous task is run using Celery, Celery Beat, and Redis. This task fetches game information (scores) from the CFBD API to evaluate and grade predictions made by users on the past week's games. Additionally, every Tuesday at 6 AM another asynchronous task is run with Celery, Celery Beat, and Redis, to fetch games for the upcoming week with the CFBD API. This was needed because data for betting lines and game times are not always available to start the season. Each week's games are supposed to represent the top 5 games of the week, so to quantify this the task also does web scraping on ESPN's College Football FPI page, and the 5 games with the best average FPI ranking are selected as the games of the week. There is one more asynchronous task that is run every 5 minutes, once again via Celery, Celery Beat, and Redis. This task locks games. For every selected game of the week, a lock time is computed which is 1 hour prior to the game start time. This task is run to lock games at these times so that users can no longer make picks with under an hour to game time. The frontend was built with React.js and Javascript. The application is not currently deployed, but I aim to deploy it soon. However, it is fully containerized via docker-compose, so if you want to try it out it's very easy - check out how down below!


## See it in action

[Watch the demo](https://www.youtube.com/watch?v=21Er8juIJAY)

## How to run

To run this application, you will need to have docker installed and running on your machine. Once running, clone this repository to your local computer. ```cd``` into the respository. It should be called ```cfb```. Then, create a ```.env``` file, which will be used to store your specific running configuration. This is needed because you will need to create your own API key to use the CFBD API, and Custom Google Search API. 

To get an API key for the CFBD API, go to the following link: [https://collegefootballdata.com/key](https://collegefootballdata.com/key)
Once you have your key, add the following line to the .env file you created earlier:

```CFBD_API_KEY="YOUR_CFBD_API_KEY_HERE"```

Next, we need to get an API for the custom google search API. To do this, go to the following link: [https://developers.google.com/webmaster-tools/search-console-api/v1/configure
](https://developers.google.com/webmaster-tools/search-console-api/v1/configure)
Once you have your key, add the following line to the same .env:

```GOOGLE_SEARCH_API_KEY="YOUR_GOOGLE_SEARCH_API_KEY_HERE"```

To finish up the configuration for the custom google search API, we will also need to create a custom search engine that will be used when doing our custom google search. This can be done by going to the following link: [https://programmablesearchengine.google.com/controlpanel/all](https://programmablesearchengine.google.com/controlpanel/all)

The steps to create this search engine can be found in the following video:

https://github.com/avkrishnamurthy/cfb/assets/46771241/d7a433d6-d378-4cde-94f5-8be17d11282b

As seen at the end of the video above, what we want is that search engine ID. With that, we can now set the last environment variable in our .env file by adding the following line:

```REACT_APP_CX="YOUR_SEARCH_ENGINE_ID_HERE"```

With all our environment variables set up properly, we can now start running the project.

You should currently be in the ```cfb``` directory. If you are not, make sure you ```cd``` into it. Now, run the following to build the docker images:

```sudo docker-compose build```

This may take a few minutes to finish. If there are any errors, make sure you have set your .env file correctly. If you encounter issues pulling Docker images, try pulling the image manually using `docker pull <image-name>:<tag>`.

Once this has finished successfully, enter the following to run the containers:

```sudo docker-compose up```

Now, go to a browser and open up [http://localhost:3000](http://localhost:3000). If you don't see anything yet, it is probably because the containers have not finished starting up yet. If there are any errors, make sure you have set your .env file correctly. Once they are running it should show the home page for the BlitzPicks app. Now, you can make your account and start trying it out!

To stop the docker containers, simply do a ```Ctrl+C```.

## Technologies

<img src="https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white">
<img src="https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white">
<img src="https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray">
<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white">
<img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens">
<img src="https://img.shields.io/badge/celery-%2337814A.svg?&style=for-the-badge&logo=celery&logoColor=white" />
<img src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white">
<img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/google-4285F4?style=for-the-badge&logo=google&logoColor=white">
<img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white">



