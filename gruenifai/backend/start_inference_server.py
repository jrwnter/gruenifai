import os
import logging
import time
import argparse
from cddd.inference import InferenceServer
logging.getLogger('tensorflow').disabled = True

def add_arguments(parser):
    parser.add_argument("--model_dir", required=True)
    parser.add_argument("--device", default="0", type=str, nargs="+")
    parser.add_argument("--num_servers", default=1, type=int)
    parser.add_argument("--port_frontend", default=5530, type=int)
    parser.add_argument("--port_backend", default=5531, type=int)
    return parser

def main():
    parser = argparse.ArgumentParser()
    add_arguments(parser)
    flags, _ = parser.parse_known_args()
    os.environ['CUDA_VISIBLE_DEVICES'] = ",".join(flags.device)
    inference_server = InferenceServer(
        num_servers=flags.num_servers,
        maximum_iterations=150,
        port_frontend=flags.port_frontend,
        port_backend=flags.port_backend,
        model_dir=flags.model_dir)
    while True:
            time.sleep(10)
    return
if __name__ == "__main__":
        main()
