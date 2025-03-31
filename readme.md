# nikolayli.com

This is my portfolio website. I will add features and updates here and there, when I have the time. This website is like the Ship of Theseus, because everything original has been replaced.  This used to be a website made using only Django (no frontend, just html css js and Bootstrap), the old repository is nikolaylibackend.

I am self-hosting this website on a home server, I'm using nginx as the reverse proxy to manage all the connections.

### Tech Stack

* Fast API
* SolidJS
* MongoDB

### Additional Tech Used

* Tailwindcss
* Nginx
* Docker

### Additional Info/Guide
This website setup is different from my Auth Demo website, as it is not meant to be run independently,
I am self-hosting this website on my home server, which is why its setup differs.

The docker compose setup for this repository consists of only the database and asgi server,
the reverse proxy and certificate stuff has been moved to the top-level proxy, as it's
simpler to manage it that way.