export function modelValidation(models) {
    let errMsgs = [];
    models.map((model) => {
            switch (model.name) {
                case 'substructure match': {
                    if (model.additional_args.query === '')
                        errMsgs.push("You need to define a substructure for the substructure match plugin!")
                    break;
                }
                case 'substructure exclusion': {
                    if (model.additional_args.query === '')
                        errMsgs.push("You need to define a substructure for the substructure exclusion plugin!")
                    break;
                }
                default: {
                    //statements;
                    break;
                }

            }
        }
    )
    if (models.length===0){
        errMsgs.push("You need to select at least one scoring function!")
    }
    return errMsgs;
}