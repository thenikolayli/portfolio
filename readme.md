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
The docker compose override file has multiple section, only one may be uncommented at once.
* Testing - this is just for testing
* Cert - allows to run the nginx container alone without depends_on
* Home lab - for connecting with the overhead proxy