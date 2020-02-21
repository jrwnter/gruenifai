FROM continuumio/miniconda3:latest
ENV PATH /opt/conda/bin:$PATH
ENV LANG C

WORKDIR /home/server

COPY environment.yml api.py ./

RUN conda env create -f environment.yml

RUN echo "source activate gfai" > ~/.bashrc
ENV PATH /opt/conda/envs/gfai/bin:$PATH

ENTRYPOINT ["python", "api.py"]