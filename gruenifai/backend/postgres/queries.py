import json
import psycopg2 as pg

conn = None

# TODO: change connection?
def get_database_connection():
    global conn
    if conn is None:
        conn = pg.connect(dbname='gruenifai', host='database', user='postgres', password='postgres')
    return conn


def data_to_db(table, document, key=None):
    conn = get_database_connection()
    curs = conn.cursor()
    if key is None:
        curs.execute("INSERT INTO %s(data) VALUES ('%s') RETURNING id" % (table, json.dumps(document)))
    else:
        curs.execute("UPDATE %s SET data = ('%s') WHERE id = (%s) RETURNING id" % (table, json.dumps(document), key))
    index = curs.fetchone()[0]
    conn.commit()
    return index


def run_to_db(document, key=None):
    conn = get_database_connection()
    curs = conn.cursor()
    session_id = document['session_id']
    if key is None:
        curs.execute("INSERT INTO run (session_id, data) VALUES (%s, '%s') RETURNING id" % (session_id, json.dumps(document)))
    else:
        curs.execute("UPDATE run SET (session_id, data) = (%s, '%s') WHERE id = (%s) RETURNING id" % (session_id, json.dumps(document), key))
    index = curs.fetchone()[0]
    conn.commit()
    return index


def models_to_db(models):
    for model in models:
        data_to_db('scoring_function', model)


def session_to_db(document, key=None):
    return data_to_db('session', document, key=key)


def get_runs_for_session(session_id):
    conn = get_database_connection()
    curs = conn.cursor()
    curs.execute("SELECT data FROM run WHERE session_id = %s" % (session_id))
    documents = [row[0] for row in curs.fetchall()]
    return documents


def get_session_from_db(session_id):
    conn = get_database_connection()
    curs = conn.cursor()
    curs.execute("SELECT data FROM session WHERE id = %s" % (session_id))
    return curs.fetchone()[0]


def get_run_from_db(run_id):
    conn = get_database_connection()
    curs = conn.cursor()
    curs.execute("SELECT data FROM run WHERE id = %s" % (run_id))
    return curs.fetchone()[0]


if __name__ == '__main__':
    example_sessions = {'startDate': '2019-05-17 15:36:11.372783',
                        'queryMolecule': '\n  MJ190100                      \n\n 34 37  0  0  0  0  0  0  0  0999 V2000\n   -3.5723   -3.4902    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -3.5723   -2.6652    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n   -4.2868   -2.2527    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.8578   -2.2527    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.8578   -1.4277    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.1434   -1.0152    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.1434   -0.1902    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.8578    0.2222    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.4289    0.2222    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.7144   -0.1902    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.7144   -1.0152    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.0000   -1.4277    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.7144   -1.0152    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.7144   -0.1902    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    0.2222    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4289    0.2222    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.1434   -0.1902    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    2.1434   -1.0152    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4289   -1.4277    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4289    1.0472    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    2.1434    1.4597    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.1434    2.2847    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8578    2.6972    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.5723    2.2847    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.5723    1.4597    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8578    1.0472    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.2868    2.6972    0.0000 F   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8578    3.5222    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n   -1.4289   -1.4277    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.4289   -2.2527    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.7615   -2.7376    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.0164   -3.5222    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.8414   -3.5222    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.0963   -2.7376    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  2  4  1  0  0  0  0\n  5  4  1  4  0  0  0\n  5  6  2  0  0  0  0\n  6  7  1  0  0  0  0\n  7  8  2  0  0  0  0\n  7  9  1  0  0  0  0\n  9 10  1  0  0  0  0\n 10 11  2  0  0  0  0\n 11 12  1  0  0  0  0\n 12 13  2  0  0  0  0\n 13 14  1  0  0  0  0\n 14 15  2  0  0  0  0\n 10 15  1  0  0  0  0\n 14 16  1  0  0  0  0\n 16 17  2  0  0  0  0\n 17 18  1  0  0  0  0\n 18 19  2  0  0  0  0\n 13 19  1  0  0  0  0\n 16 20  1  0  0  0  0\n 20 21  1  0  0  0  0\n 21 22  2  0  0  0  0\n 22 23  1  0  0  0  0\n 23 24  2  0  0  0  0\n 24 25  1  0  0  0  0\n 25 26  2  0  0  0  0\n 21 26  1  0  0  0  0\n 24 27  1  0  0  0  0\n 23 28  1  0  0  0  0\n 11 29  1  0  0  0  0\n 29 30  1  0  0  0  0\n 30 31  1  0  0  0  0\n 31 32  1  0  0  0  0\n 32 33  1  0  0  0  0\n 33 34  1  0  0  0  0\n 30 34  1  0  0  0  0\nM  END\n'}

    session_to_db(example_sessions)
    run_to_db({'session_id': 3, 'cat': 'dog'})
    run_to_db({'session_id': 3, 'mouse': 'trap'})
    run_to_db({'session_id': 3, 'my': 'hat'})

    print(get_runs_for_session(3))
    print(get_session_from_db(1))


