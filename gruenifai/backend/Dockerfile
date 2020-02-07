FROM continuumio/miniconda3:latest
ENV PATH /opt/conda/bin:$PATH
ENV LANG C

WORKDIR /home/backend
COPY . ./

RUN conda update -n base conda
RUN conda env create -f environment.yml
RUN echo "source activate cddd" > ~/.bashrc
ENV PATH /opt/conda/envs/cddd/bin:$PATH

RUN git clone https://github.com/jrwnter/cddd.git
RUN pip install --ignore-installed --upgrade https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-1.10.0-cp36-cp36m-linux_x86_64.whl
WORKDIR /home/backend/cddd
RUN pip install .
RUN chmod +x download_default_model.sh
RUN ./download_default_model.sh

WORKDIR /home/backend/
RUN git clone https://github.com/jrwnter/mso.git
RUN pip install mso/
RUN chmod +x wait-for-postgres.sh

ENTRYPOINT ["./wait-for-postgres.sh", "database", "python", "flaskserver.py"]