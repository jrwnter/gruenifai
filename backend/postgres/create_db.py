import psycopg2 as pg
from cdddswarm.optimization.objectives.registry import model_description

def create_session(conn):
    SQL = '''
    DROP TABLE IF EXISTS session;
    CREATE TABLE session  (
        id serial,
        data jsonb
    )
    '''
    curs = conn.cursor()
    curs.execute(SQL)
    return True

def create_run(conn):
    SQL = '''
    DROP TABLE IF EXISTS run;
    CREATE TABLE run  (
        id serial,
        session_id integer,
        data jsonb
    )
    '''
    curs = conn.cursor()
    curs.execute(SQL)
    return True

def create_scoring_function(conn):
    SQL = '''
    DROP TABLE IF EXISTS scoring_function;
    CREATE TABLE scoring_function  (
        id serial,
        data jsonb
    )
    '''
    curs = conn.cursor()
    curs.execute(SQL)
    return True



if __name__=='__main__':
    #conn = pg.connect("dbname=gruenifai user=postgres password=postgres host=by0slm.de.bayer.cnb port=5432")
    conn = pg.connect("dbname=postgres user=postgres password=postgres host=127.0.0.1 port=5432")

    create_session(conn)
    conn.commit()

    create_run(conn)
    create_scoring_function(conn)

    conn.commit()
    conn.close()

    from cdddswarm.server.postgres.queries import models_to_db
    models_to_db(model_description)
