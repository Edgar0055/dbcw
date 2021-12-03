
import http from 'http';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as luxon from 'luxon';
import passport from 'passport';
import session from 'express-session';
import swig from 'swig';
import { env, } from '../env';
import { models, sequelize, Sequelize, } from '../db/sequelize';

const app = express();
const { NODE_ENV, } = env;

app.use((req, res, next) => {
	const { headers, method, url, } = req;
	console.log({ text: 'Pre-fetched request', data: { method, url, headers } });
	next();
});

app.set('trust proxy', 1);
app.use(cors({
	credentials: true,
	methods: [ 'DELETE', 'GET', 'POST', 'PUT', ],
    maxAge: luxon.Duration.fromObject({ hours: 1 }).as('seconds'),
	optionsSuccessStatus: 204,
	origin: (origin, next) => {
		const allowed = true;
		if (allowed) {
			next(null, true);
		} else {
			next(new Error('ERROR WITH CORS'), false);
		}
	},
	preflightContinue: false,
}));

app.use(compression());

app.use(express.static('asset', {
	dotfiles: 'ignore',
	etag: true,
	extensions: false,
	index: 'index.html',
	maxAge: '1d',
	redirect: false,
	setHeaders: function (res, path, stat) {
		res.set('x-timestamp', Date.now())
	}
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false,
}));

app.use(session({
	cookie: {
		path: '/', 
	},
	name: 'sessionId',
	resave: false,
	secret: env.SESSION_SECRET ?? 'hello',
	saveUninitialized: false,
	unset: 'keep',
}));

// app.use(passport.initialize({ userProperty: 'auth', }));
// app.use(passport.session());

// app.engine('html', swig.renderFile);
// app.set('view engine', 'html');
// app.set('views', `${ root }/views`);
// app.set('view cache', false);
// swig.setDefaults({ cache: false });

app.use((req, res, next) => {
    const { body, query, headers, method, url, } = req;
    const data = { method, url, headers, body, query, };
	console.log({ text: 'dynamic request', data });
	next();
});

app.use((req, res, next) => {
	res.set('pragma', 'no-cache');
	res.set('cache-control', 'no-cache');
	next();
});


// routes


app.get('/api/sensors', async (req, res, next) => {
	const { fn, literal, Op, } = Sequelize;
	try {
		const { query } = req;
		let {
			all = 0,
			page = NaN,
			limit = NaN,
			order = '',
			sensorIds = '',
			noSensorIds = '',
			enabled = NaN,
			latitude = NaN,
			longitude = NaN,
			radius = NaN,
		} = query;
		try {
			sensorIds = JSON.parse(sensorIds);
			sensorIds = sensorIds.filter(Number);
		} catch (error) {
			sensorIds = [];            
		}
		try {
			noSensorIds = JSON.parse(noSensorIds);
			noSensorIds = noSensorIds.filter(Number);
		} catch (error) {
			noSensorIds = [];            
		}
		enabled = [0, 1].includes(+enabled) ? !!+enabled : null;
		latitude = +latitude;
		longitude = +longitude;
		radius = +radius > 0 ? +radius : NaN;
		const distance = literal(`(("latitude"-(${latitude}))^2 + ("longitude"-(${ longitude }))^2)^0.5`);
		const FIELDS = {
			['sensorId']: ['sensorId'],
			['name']: ['name'],
			['distance']: [distance],
			['latitude']: ['latitude'],
			['longitude']: ['latitude'],
			['enabled']: ['enabled'],
		};
		const ORDERS = [ 'asc', 'desc', ];
		all = [0, 1].includes(+all) ? !!+all : null;
		page = +page >= 0 ? +page : NaN;
		limit = +limit > 0 ? +limit : 1;
		try {
			order = JSON.parse(order);
			order = order.filter(([ field, to ]) => {
				return ORDERS.includes(to) && field in FIELDS;
			}).map(([field, to]) => {
				return [...FIELDS[field], to];
			});
		} catch (error) {
			order = [];
		}
		console.log({
			all,
			page,
			limit,
			order,
			sensorIds,
			noSensorIds,
			enabled,
			latitude,
			longitude,
			radius,
		});
		const { count, rows: items, } = await models.sensor.findAndCountAll({
			...!all && (page + limit) && { offset: page*limit, limit, },
			...order.length && { order },
			// https://sequelize.readthedocs.io/en/v3/docs/querying/
			...(latitude + longitude + radius) && {
				attributes: {
					include: [[distance, 'distance']],
				},	
			},
			where: {
				...sensorIds.length && { sensorId: sensorIds },
				...noSensorIds.length && { sensorId: { [Op.ne]: noSensorIds } },
				...[false, true].includes(enabled) && { enabled },
				...(latitude + longitude + radius) && {
					[ Op.and ]: [
						literal(`(("latitude"-(${latitude}))^2 + ("longitude"-(${ longitude }))^2)^0.5 <= ${ radius }`)
					],
				},
			},
			raw: true,
		});
		res.json({ items, count, });
	} catch (error) {
		next(error);
	}
});

app.get('/api/sensor/:sernsorId', async (req, res, next) => {
	try {
		const { params, query } = req;
		let { sernsorId = 0, } = params;
		let { statistic = NaN, } = query;
		sernsorId = +sernsorId >= 0 ? +sernsorId : 0;
		statistic = [0, 1].includes(+statistic) ? !!+statistic : null;
		console.log({
			sernsorId,
			statistic,
		});
		const { literal, Op, } = Sequelize;
		const item = await models.sensor.findByPk(sernsorId, {
			...statistic && {
				include: {
					attributes: ['created', 'value', 'unit'],
					model: models.statistic,
					as: 'statistic',
				},
				order: [[ models.statistic, 'created', 'asc' ]],
			},
			raw: !statistic,
		});
		res.json({ item, });
	} catch (error) {
		next(error);
	}
});

app.get('/api/statistic/:sensorId/:truncBy', async (req, res, next) => {
	const { fn, literal, Op, } = Sequelize;
	const TRUNC_BY = ['year', 'month', 'day', 'hour', 'minute', 'second'];
	try {
		const { params, } = req;
		let { sensorId = 0, truncBy = null } = params;
		sensorId = +sensorId >= 0 ? +sensorId : 0;
		truncBy = TRUNC_BY.includes(truncBy) ? truncBy : TRUNC_BY[0];
		truncBy = literal(`DATE_TRUNC('${truncBy}', created_at)`);
		const value = literal('SUM(value) / COUNT(1)');
		console.log({
			sensorId,
			truncBy,
		});
		const { count, rows: items, } = await models.statistic.findAndCountAll({
			attributes: [ 'sensorId', [truncBy, 'created'], [value, 'value'], ],
			where: { sensorId, },
			group: [ 'sensorId', truncBy, ],
			order: [ [truncBy, 'asc'], ['sensorId', 'asc'], ],
			raw: true,
		});
		res.json({ items, count, });
	} catch (error) {
		next(error);
	}
});

app.get('/api/statistic', async (req, res, next) => {
	const { fn, literal, Op, } = Sequelize;
	try {
		const { query } = req;
		let {
			all = 0,
			page = NaN,
			limit = NaN,
			order = '',
			sensorIds = '',
			noSensorIds = '',
			unit = '',
			sensor = NaN,
		} = query;
		try {
			sensorIds = JSON.parse(sensorIds);
			sensorIds = sensorIds.filter(Number);
		} catch (error) {
			sensorIds = [];            
		}
		try {
			noSensorIds = JSON.parse(noSensorIds);
			noSensorIds = noSensorIds.filter(Number);
		} catch (error) {
			noSensorIds = [];            
		}
		sensor = [0, 1].includes(+sensor) ? !!+sensor : null;
		const FIELDS = {
			['statisticId']: ['statisticId'],
			['sensorId']: ['sensorId'],
			['created']: ['created'],
			['value']: ['value'],
			['unit']: ['unit'],
			['sensor.name']: [models.sensor, 'name'],
			['sensor.latitude']: [models.sensor, 'latitude'],
			['sensor.longitude']: [models.sensor, 'longitude'],
			['sensor.enabled']: [models.sensor, 'enabled'],
		};
		const ORDERS = [ 'asc', 'desc', ];
		all = [0, 1].includes(+all) ? !!+all : null;
		page = +page >= 0 ? +page : NaN;
		limit = +limit > 0 ? +limit : 1;
		try {
			order = JSON.parse(order);
			order = order.filter(([ field, to ]) => {
				return ORDERS.includes(to) && field in FIELDS;
			}).map(([field, to]) => {
				return [...FIELDS[field], to];
			});
		} catch (error) {
			order = [];
		}
		console.log({
			all,
			page,
			limit,
			order,
			sensorIds,
			noSensorIds,
			unit,
		});
		const { count, rows: items, } = await models.statistic.findAndCountAll({
			...!all && (page + limit) && { offset: page*limit, limit, },
			...order.length && { order },
			...sensor && { include: {
				model: models.sensor,
				as: 'sensor',
				where: {
					...unit && { unit },
				},
			}, },
			where: {
				...sensorIds.length && { sensorId: sensorIds },
				...noSensorIds.length && { sensorId: { [Op.ne]: noSensorIds } },
			},
			subQuery: false,
			raw: true,
		});
		res.json({ items, count, });
	} catch (error) {
		next(error);
	}
});


// end: routes

app.get([
	'/sensors',
	'/sensor/:sernsorId',
	'/statistic',
	'/statistic/:sensorId'
], async (req, res, next) => {
	res.redirect(301, '/');
});

app.all('*', async (req, res) => {
    res.json({ unknown: 1 });
});

app.use((error, req, res, next) => {
	if ([ 'production' ].includes(NODE_ENV)) {
		const json = { error: 'Forbidden', };
		res.status(403).json(json);
	} else if (error instanceof Error) {
		const json = { error: `${error}`, stack: error.stack, };
		res.status(500).json(json);
	} else if (error) {
		const json = { error: JSON.stringify(error), };
		res.status(500).json(json);
	} else {
		const json = { error: 'Resource Not Found', };
		res.status(404).json(json);
	}
});

const server = http.createServer(app);
const port = env.PORT ?? 3000;
server.listen(port, () => console.log({ text: 'Server started', data: { port }, }));

export default server;