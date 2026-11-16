const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const errorHandler = require('../src/middlewares/errorHandler');

test('HTTP errors and malformed JSON use the common response format', async (t) => {
    const app = express();
    app.use(express.json());
    app.get('/error/:status', async (req, res) => {
        const error = new Error('request failed');
        error.statusCode = Number(req.params.status);
        throw error;
    });
    app.use((req, res, next) => {
        const error = new Error('not found');
        error.status = 404;
        next(error);
    });
    app.use(errorHandler);
    const server = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    t.after(() => new Promise((resolve) => server.close(resolve)));
    const base = `http://127.0.0.1:${server.address().port}`;
    for (const [path, status, message, options] of [
        ['/missing', 404, 'not found'],
        ['/error/403', 403, 'request failed'],
        ['/error/404', 404, 'request failed'],
        ['/missing', 400, '올바른 JSON 형식으로 요청해 주세요.', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{invalid',
        }],
    ]) {
        const response = await fetch(base + path, options);
        assert.equal(response.status, status);
        assert.deepEqual(await response.json(), { success: false, data: null, message });
    }
});

test('unexpected errors hide internal details and invalid statuses fall back to 500', () => {
    const originalLog = console.error;
    console.error = () => {};
    try {
        for (const status of [undefined, 200, 999, '400']) {
            const error = Object.assign(new Error('SQL secret'), { status });
            const res = {
                status(code) { assert.equal(code, 500); return this; },
                json(body) {
                    assert.deepEqual(body, {
                        success: false, data: null, message: '서버 내부 오류가 발생했습니다.',
                    });
                },
            };
            errorHandler(error, {}, res, () => assert.fail('unexpected next'));
        }
    } finally { console.error = originalLog; }
});

test('errors after headers are sent are forwarded', () => {
    const error = new Error('stream failed');
    errorHandler(error, {}, { headersSent: true }, (forwarded) => assert.equal(forwarded, error));
});
