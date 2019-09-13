# gruenif.ai
gruenif.ai is a web application for interactive multi-parameter optimization of molecules in a continous vector space.

# Showcase of functionality
A web application is best explained through a live demo. Please watch our video for a detailed explanation of the functionality:
[Showcase](https://www.youtube.com/watch?v=7KAgEb5twXg)

# Installation and setting up
In its current form grünif.ai is commposed of 4 microservices that have to be started in individual terminals. We recomend the use of Anaconda to setup up the enviorment that can run both Python backend and ReactJS frontend.
## Dependencies
* [cddd](https://github.com/jrwnter/cddd)
* [mso](https://github.com/jrwnter/mso)
* psycopg2
* flask
* flask_restplus
* requests
* nodejs
* yarn
* pyzmq
* marvinjs for molecule sketching: https://chemaxon.com/products/marvin-js
## Anaconda
1. terminal
* clone and install [cddd](https://github.com/jrwnter/cddd)
* clone and install [mso](https://github.com/jrwnter/mso)
* clone this repository
* cd <REPOSITORY_DIR>
* conda env create -f environment.yml ( + activate this environment)
* pip install .
* cd <REPOSITORY_DIR>/gruenifai/backend/postgres
* python create_db.py (assumes a running postgres server running locally)
* cd <REPOSITORY_DIR>/gruenifai/gui/client
* yarn install
* yarn start
2. terminal
* cd <REPOSITORY_DIR>/gruenifai/gui/server
* python api.py
3. terminal
* cd <REPOSITORY_DIR>/gruenifai/backend/
* python start_inference_server.py --model_dir <PATH_TO_CDDD_MODEL> --device <CUDA_DEVICE (e.g. 1 3 4)> --num_servers <NUMBER_OF_SERVERS>
4. terminal
* cd <REPOSITORY_DIR>/gruenifai/backend/
* python flaskserver.py --num_swarms=<NUMBER_OF_SWARMS> --num_workers=<NUMBER_OF_WORKERS>

The web app can now be accessed at port 3000
