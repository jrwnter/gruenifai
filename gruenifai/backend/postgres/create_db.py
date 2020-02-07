import psycopg2 as pg
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import sys
from .queries import models_to_db
#sys.path.append("..")
#from registry import model_description

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


def create_db(db_name, model_description):
    drop_statement = 'DROP DATABASE IF EXISTS {};'.format(db_name)
    create_statement = 'CREATE DATABASE {};'.format(db_name)

    conn = pg.connect(dbname='postgres', host='database', user='postgres', password='postgres')
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

    cur = conn.cursor()
    cur.execute(drop_statement)
    cur.execute(create_statement)

    conn = pg.connect(dbname='gruenifai', host='database', user='postgres', password='postgres')
    create_session(conn)
    conn.commit()

    create_run(conn)
    create_scoring_function(conn)

    conn.commit()
    conn.close()
    models_to_db(model_description)

if __name__=='__main__':
    create_db(db_name="gruenifai")