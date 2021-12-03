import debuging from 'debug';

const build = debuging('db');

const action = ({
    type = '',
    text = '',
    data = undefined,
}) => {
    const json = data && JSON.stringify(data, null, '\t');
    const message = [
        `[${ type }]:`,
        JSON.stringify(text),
        ...json ? [ `with ${json}` ] : [],
    ].join(' ');
    console.log(message);
    build(message);
};

const error = _ => action({ ..._, type: 'error', });
const warn = _ => action({ ..._, type: 'warn', });
const deprecate = _ => action({ ..._, type: 'deprecate', });
const debug = _ => action({ ..._, type: 'debug', });


export default {
    error,
    warn,
    deprecate,
    debug,
};
