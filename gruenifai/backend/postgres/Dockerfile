FROM continuumio/miniconda3:latest
ENV PATH /opt/conda/bin:$PATH
ENV LANG C

WORKDIR /home/backend/postgres
COPY . ./
COPY ../registry.py ../

RUN conda update -n base conda
RUN conda env create -f environment.yml
RUN echo "source activate postgres" > ~/.bashrc
ENV PATH /opt/conda/envs/postgres/bin:$PATH

ENTRYPOINT ["python", "create_db.py"]