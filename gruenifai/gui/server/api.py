from flask import Flask, jsonify, request, g
from flask import send_file
from flask_restplus import Resource, Api
import psycopg2 as pg
import requests as r
from rdkit import Chem
import os
import tempfile
import pandas as pd
from rdkit.Chem import rdDepictor
from rdkit.Chem.Draw import rdMolDraw2D
from sklearn.cluster import KMeans
from scipy.spatial import distance
import json
import datetime
import uuid

DEFAULT_TEMPDIR = tempfile._get_default_tempdir()
NOF_ITERATIONS_PER_BATCH = 5

app = Flask(__name__)
api = Api(app)

def connect_db():
    conn = pg.connect(dbname='gruenifai', host='localhost')
    return conn

def get_db_conn():
    if not hasattr(g, 'conn'):
        g.conn = connect_db()
    return g.conn

def generate_canonical_smiles_if_mol_valid(smiles):
    mol = Chem.MolFromSmiles(smiles)
    if mol:
        cansmi = Chem.MolToSmiles(mol)
        return cansmi

    return None


def cluster_molecules_by_cddd(data):
    df = pd.DataFrame({mol.get('smiles'):mol.get('x') for mol in data}).T

    dm = distance.squareform(distance.pdist(df, metric = 'cosine'))
    ddm = pd.DataFrame(dm, index = df.index, columns = df.index)
    k = min(len(data),10)
    km = KMeans(n_clusters=k)
    km = km.fit(ddm)
    old_cluster_dict = dict(list(zip(ddm.index.tolist(),km.labels_)))
    clustered = list(zip(km.labels_,ddm.index.tolist()))
    df_cl = pd.DataFrame(clustered, columns=['cluster_id', 'smiles']).set_index('smiles')
    df_dscore = pd.DataFrame([(mol.get('smiles'), mol.get('dscore')) for mol in data],
                             columns=['smiles', 'dscore']).set_index('smiles')
    df_joined = df_cl.join(df_dscore, how='left')
    df_joined = df_joined.groupby('cluster_id').mean().sort_values('dscore', ascending=False)
    df_joined['cluster_id_sorted'] = range(0, 10)
    new_cluster = df_joined.to_dict()['cluster_id_sorted']

    #sort_cluster_by_size = dict([(ele[0], id) for id, ele in enumerate(sorted(Counter(km.labels_).items(), key=lambda x: x[1], reverse=True))])

    for mol in data:
        mol['cluster_id']=new_cluster.get(int(old_cluster_dict[mol.get('smiles')]))

    return data


def create_gruenifai_session_entry_in_DB(data):
    conn = get_db_conn()
    curs = conn.cursor()
    document = dict()
    document['startDate'] = str(datetime.datetime.utcnow())
    document['queryMolecule'] = data.get('queryMolecule')
    document['fastMode'] = data.get('fastMode')

    curs.execute("INSERT INTO session(data) VALUES ('%s') RETURNING id" % (json.dumps(document)))
    session_id = curs.fetchone()[0]
    conn.commit()
    return session_id

def create_run_entry_in_DB(session_id, models):
    print("GET DB CONNECTION")
    conn = get_db_conn()
    print("GET CURSOR")
    curs = conn.cursor()
    document = dict()
    document['session_id'] = session_id
    document['models'] = models
    print("WRITE INTO")
    print(models)
    SQL = "INSERT INTO run(session_id, data) VALUES (%d, '%s') RETURNING id" % (session_id, json.dumps(document))
    print(SQL)
    curs.execute(SQL)
    run_id = curs.fetchone()[0]
    conn.commit()
    print("AND ESSENTIALLY DONE")
    return run_id


def get_run_data_from_DB_by_id(id):
    conn = get_db_conn()
    data =  pd.read_sql(f'SELECT data from run where id = {id}' , conn).data.tolist()[0]
    return data

def get_stats_from_run(data):
    scores = []
    for ele in data:
        scores.append(ele.get('dscore'))
    min_score = min(scores)
    max_score = max(scores)
    return {'scoreRange': [min_score, max_score]}

def parse_swarms_and_make_unique(swarms, cluster_flag):
    molecules = []
    molhash = set()
    for swarm in swarms.get('swarms'):
        for particle in swarm.get('particles'):
            cansmi = generate_canonical_smiles_if_mol_valid(particle.get('smiles'))
            if cansmi and (cansmi not in molhash):
                particle.pop('part_best_x')
                particle.pop('part_best_fitness')
                particle.pop('v')
                particle['smiles'] = cansmi
                particle['isbad'] = False
                particle['isgood'] = False
                particle['isinbasket'] = False
                particle['uuid'] = str(uuid.uuid1())
                molecules.append(particle)
                molhash.add(cansmi)
    molecules = sorted(molecules, key=lambda d: d.get('dscore'), reverse=True)[:50]
    if cluster_flag:
        molecules = cluster_molecules_by_cddd(molecules)
    molecules = sorted(molecules, key=lambda d: d.get('dscore'), reverse=True)
    return molecules

def reformat_data(data):
    for molecule in data:
        for score in molecule.get('scores'):
            molecule["{}_score".format(score.get('model_id'))] = score.get('score')
            molecule["{}_score".format(score.get('model_id'))] = score.get('scaled')
        molecule.pop('scores')

    return data

def moltosvg(mol,molSize=(180,180),kekulize=True):
    mc = Chem.Mol(mol.ToBinary())
    if kekulize:
        try:
            Chem.Kekulize(mc)
        except:
            mc = Chem.Mol(mol.ToBinary())
    rdDepictor.Compute2DCoords(mc)
    drawer = rdMolDraw2D.MolDraw2DSVG(molSize[0],molSize[1])
    drawer.SetFontSize(1.0)
    drawer.DrawMolecule(mc)
    drawer.FinishDrawing()
    svg = drawer.GetDrawingText()
    # disclaimer: super dirty hack!!!!
    svg = svg.replace("style='opacity:1.0;fill:#FFFFFF;stroke:none'", "style='opacity:0.0;fill:#000;stroke:none'")
    svg = svg.replace("stroke:#000000", "stroke:#fff").replace('#FF0000', '#fe59c2').replace('#0000FF', '#59c2fe')
    #svg = svg.replace("font-size:6px", "font-size:20px")
    svg = svg.replace("font-weight:normal", "font-weight:bold")
    return svg.replace('svg:','')

@api.route('/api/available_models')
class AvailableModels(Resource):
    def get(self):
        db_conn = get_db_conn()
        models = pd.read_sql('SELECT distinct data from scoring_function', db_conn).data.tolist()
        models = sorted(models, key=lambda x: x.get('name'))
        return jsonify(models)


@api.route('/api/depict_molecule/<string:smiles>/<int:size>')
class DepictMolecule(Resource):
    def get(self, smiles, size):
        fn_tmp = next(tempfile._get_candidate_names())
        fn_tmp = os.path.join(DEFAULT_TEMPDIR, "{}.svg".format(fn_tmp))
        mol = Chem.MolFromSmiles(smiles)
        svg = moltosvg(mol, molSize=(180,180))

        open(fn_tmp, 'w').write(svg)
        return send_file(
            fn_tmp,
            mimetype='image/svg'
        )



@api.route('/api/submit_LO_job')
class LOJob(Resource):
    def post(self):
        data = request.json
        models = data.get('models')
        print("got models")
        query_assessment_flag = False
        if data.get('session_id') is None:
            print("try session creation")
            session_id = create_gruenifai_session_entry_in_DB(data)
            print("create run entry")
            query_assessment_id = create_run_entry_in_DB(session_id, models)
            query_assessment_flag = True
            print("start request")
            res = r.post("http://by0sll.de.bayer.cnb:8897/evaluatequery/", json={'run_id': str(query_assessment_id)})
            print("got data")
            query_assessment_run = get_run_data_from_DB_by_id(query_assessment_id)
            query_assessment = parse_swarms_and_make_unique(query_assessment_run, False)
            query_assessment_stats = get_stats_from_run(query_assessment)
        else:
            session_id = int(data.get('session_id'))
        run_id = create_run_entry_in_DB(session_id, models)

        if 1:
            res = r.post("http://by0sll.de.bayer.cnb:8897/optimization/", json={'run_id': str(run_id)})
            #res = r.post("http://by0slm.de.bayer.cnb:8896/optimization/", json={'run_id':_id})
            run = get_run_data_from_DB_by_id(run_id)
        if 0:
            run = []
        if 1:
            molecules = parse_swarms_and_make_unique(run, True)
            stats = get_stats_from_run(molecules)

        if 0:
            molecules = []
            stats=[]
        if query_assessment_flag:
            return jsonify(dict(results=molecules, session_id=str(session_id), stats=stats, query_stats = query_assessment_stats))
        else:
            return jsonify(dict(results=molecules, session_id=str(session_id), stats=stats))

@api.route("/api/export_selected_molecules")
class ExportMolecule(Resource):
    def post(self):
        data = request.get_json()
        data = reformat_data(data)
        fn = os.path.join(DEFAULT_TEMPDIR, '{}.xls'.format(tempfile._get_candidate_names()))
        data = pd.DataFrame(data)
        data.to_excel(fn, index=None)
        return send_file(fn, mimetype='application/vnd.ms-excel')

    
if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
