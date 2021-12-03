#!/usr/bin/env node

import dotenv from 'dotenv';
import process, { env, } from 'process';

dotenv.config({
	// debug: true,
});

const { NODE_ENV = '', NODE_ENV_EXPECTED = '', } = env;
const ENVs = 'development,production,stage,test'.split(',');
const json = JSON.stringify({ NODE_ENV, NODE_ENV_EXPECTED, });

if (['none'].includes(NODE_ENV_EXPECTED)) {
    throw new Error(`env not expected ${ json }`);
} else if (['any', '*'].includes(NODE_ENV_EXPECTED)) {
    console.info(`env ${ json }`);
} else if (!ENVs.includes(NODE_ENV)) {
    throw new Error(`env NODE_ENV unknown ${ json }`);
} else if (!NODE_ENV_EXPECTED.split(',').includes(NODE_ENV)) {
    throw new Error(`env NODE_ENV conflict to NODE_ENV_EXPECTED ${ json }`);
}

export { dotenv, env, process, };
