"""Defines and holds the scoring functions that can be optimized by the application and their default parameters."""

from mso.objectives import emb_functions, mol_functions

models = [(emb_functions.bace_score_512, 'BACE1', 'biological activity', False),
          (emb_functions.egfr_score_512, 'EGFR', 'biological activity', False),
          (mol_functions.qed_score, 'QED', '....', True),
          (mol_functions.sa_score, 'SA', '....', True),
          (emb_functions.distance_score, 'distance score', '....', False),
          (mol_functions.heavy_atom_count, 'heavy atom count', '....', True),
          (mol_functions.substructure_match_score, 'substructure match', '...', True),
          (mol_functions.substructure_match_score, 'substructure exclusion', '...', True),
          (mol_functions.tox_alert, 'tox alert', 'sure chembl', True),
          (mol_functions.has_chembl_substruct, 'uncommon substructure penalty', 'based on EDCFP2', True),
          (mol_functions.heavy_atom_count, 'heavy atom count', '...', True),
          (mol_functions.molecular_weight, 'molecular weight', '...', True),
          (mol_functions.logp_score, 'logP', '...', True),
          ]


models_by_name = {name: (func, desc, is_mol_func) for func, name, desc, is_mol_func in models}

model_description =[{
    "name": "distance score",
    "description": "scores based on the cosine distance in CDDD space compared to input structure.",
    "desirability": [{"x": 0, "y": 1.0}, {"x": 1, "y": 0}],
    "weight": 100,
    "additional_args": {'query': ''}
    },
    {
        "name": "substructure match",
        "description": "check for presence of substructure.",
        "desirability": [{"x": 0, "y": 0}, {"x": 1, "y": 1}],
        "weight": 100,
        "additional_args": {'query': ''}
    },
    {
        "name": "substructure exclusion",
        "description": "check for absence of substructure.",
        "desirability": [{"x": 0, "y": 1}, {"x": 1, "y": 0}],
        "weight": 100,
        "additional_args": {'query': ''}
    },
    {
        "name": "QED",
        "description": "Chemical beauty as defined by Bickerton et al..",
        "desirability": [{"x": 0.3, "y": 0.0}, {"x": 0.6, "y": 0.65}, {"x": 0.7, "y": 0.8}, {"x": 0.8, "y": 0.9}, {
            "x": 0.9,
            "y": 0.95
        }, {"x": 1.0, "y": 1.0}],
        "weight": 100,
    },
    {
        "name": "SA",
        "description": "synthetic accessibility. RDkit version.",
        "desirability": [{"x": 2, "y": 1.0}, {"x": 2.5, "y": 0.95}, {"x": 3, "y": 0.8}, {"x": 5, "y": 0}],
        "weight": 100,
    },
    {
        "name": "BACE1",
        "description": "biological activity data (IC50) from ChEMBL",
        "desirability": [{"x": 2, "y": 0.0}, {"x": 7, "y": 0.6}, {"x": 8, "y": 0.8}, {"x": 9, "y": 0.9}, {
            "x": 10,
            "y": 0.95
        }, {"x": 11, "y": 1}],
        "weight": 100,
    },
    {
        "name": "EGFR",
        "description": "biological activity data (IC50) from ChEMBL",
        "desirability": [{"x": 2, "y": 0.0}, {"x": 7, "y": 0.6}, {"x": 8, "y": 0.8}, {"x": 9, "y": 0.9}, {
            "x": 10,
            "y": 0.95
        }, {"x": 11, "y": 1}],
        "weight": 100,
    },
    {
        "name": "heavy atom count",
        "description": "check for heavy atom count.",
        "desirability": [{"x": 0, "y": 0}, {"x": 25, "y": 1}, {"x": 30, "y": 0.9}, {"x": 40, "y": 0}],
        "weight": 100,
    },
    {
        "name": "tox alert",
        "description": "SureChEMBL alerts",
        "desirability": [{"x": 0, "y": 0}, {"x": 1, "y": 1}],
        "weight": 100,
    },
    {
        "name": "uncommon substructure penalty",
        "description": "based on ECFP2",
        "desirability": [{"x": 0, "y": 0}, {"x": 1, "y": 1}],
        "weight": 100,
    },
    {
        "name": "molecular weight",
        "description": "...",
        "desirability": [{"x": 0, "y": 0}, {"x": 250, "y": 0}, {"x": 300, "y": 1}, {"x": 500, "y": 1},
                         {"x": 550, "y": 0}, {"x": 600, "y": 0}],
        "weight": 100,
    },
    {
        "name": "logP",
        "description": "...",
        "desirability": [{"x": -2, "y": 1}, {"x": -1, "y": 1}, {"x": 0, "y": 0.9}, {"x": 2, "y": 0.75},
                         {"x": 5, "y": 0.5}, {"x": 6, "y": 0}, {"x": 7, "y": 0}],
        "weight": 100,
    },
]