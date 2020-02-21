import {useGlobal} from "reactn";
import React from "reactn";
import {remove} from 'lodash';

const ErrMsg = () => {
    const [errmsg, setErrMsg] = useGlobal('errMsg');
    const closeErrMsg = (msg) => {

        let newErrMsg = remove(errmsg, (oldMsg) => {
            return oldMsg !== msg
        })
        setErrMsg(newErrMsg);
    }
    return (
        <div className={'container'} style={{paddingTop: 100}}>
            {errmsg.map((msg) => {
                return <div className="notification is-danger">
                    <button className="delete" onClick={() => {
                        closeErrMsg(msg);
                    }}/>
                    {msg}
                </div>
            })
            }
        </div>
    );
}
export default ErrMsg;