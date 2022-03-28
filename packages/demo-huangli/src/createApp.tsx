/// <reference types="vite-plugin-pages/client" />
/// <reference types="node" />
import { createPinia } from 'pinia';
import * as vdb from 'vue-db';
import * as fusion from 'vue-fusion';
import { createMemoryHistory, createRouter, RouterView } from 'vue-router';
import routes from '~pages';

fusion.$app.create = () => {
    const router = createRouter({
        history: createMemoryHistory(),
        routes,
    })
    const app = fusion.createApp(fusion.defineComponent({
        errorCaptured(err) {
            console.log(`caught error: ${err}`);
        },
        render() {
            return <RouterView />
        }
    }));
    app.use(router);
    app.use(createPinia())
    app.use(vdb, {
        dehydrate: typeof wx === 'undefined',
        hydrate: typeof wx !== 'undefined',
        wrapperComponent: 'view',
        async rpcProvider(queries, command) {
            if (command) {
                throw new Error('not implemented');
            }
            for (const query of queries) {
                if (query.resource.table !== 'DayInfo') {
                    throw new Error('not implemented');
                }
                // query.resolve([{
                //     "animalsYear": "虎",
                //     "weekday": "星期六",
                //     "lunarYear": "壬寅年",
                //     "lunar": "二月十七",
                //     "year-month": "2022-3",
                //     "date": "2022-3-19",
                //     "suit": "开业.入宅.开工.动土.安门.出行.安葬.上梁.交易.开张.旅游.修坟.破土.拆卸.开市.开光.立券.认养.栽种.挂匾.移柩.进人口",
                //     "avoid": "结婚.领证.安床.作灶.嫁娶.探病",
                //     "holiday": "",
                //     "desc": ""
                // }]);
                const resp = await request({
                    url: `https://api.topthink.com/calendar/day?appCode=8186f6c28f48c4caa95376d713819cca&date=${query.criteria.day}`,
                })
                try {
                    const data = JSON.parse(resp.data);
                    if (data.code !== 0) {
                        query.reject(new Error(`code: ${data.code}, message: ${data.message}`));
                        return;
                    }
                    console.log(data.data)
                    query.resolve([data.data]);
                } catch (e) {
                    query.reject(new Error(`message: ${e}, data: ${resp.data}`))
                }
            }
        }
    } as vdb.InstallOptions);
    return { app, router } as const;
};

async function request(options: {
    url: string, method?: | 'OPTIONS'
        | 'GET'
        | 'HEAD'
        | 'POST'
        | 'PUT'
        | 'DELETE'
        | 'TRACE'
        | 'CONNECT'
}) {
    if (typeof wx === 'undefined') {
        const https = await import('https');
        return new Promise<any>((resolve, reject) => {
            const req = https.request(options.url, { method: options.method }, (res: any) => {
                let data = '';
                res.on('data', (chunk: string) => { data += chunk; });
                res.on('error', (e: any) => { reject(e) });
                res.on('end', () => { resolve({
                    data,
                    statusCode: res.statusCode,
                    header: res.headers
                 }); });
            });
            req.end();
        })
    } else {
        return new Promise<any>((resolve, reject) => {
            wx.request({ ...options, dataType: '其他', success: resolve, fail: reject });
        })
    }
}

/*
https://api.topthink.com/calendar/day?appCode=8186f6c28f48c4caa95376d713819cca&date=2022-3-19

{
  "code": 0,
  "message": "Success",
  "data": {
    "animalsYear": "虎",
    "weekday": "星期六",
    "lunarYear": "壬寅年",
    "lunar": "二月十七",
    "year-month": "2022-3",
    "date": "2022-3-19",
    "suit": "开业.入宅.开工.动土.安门.出行.安葬.上梁.交易.开张.旅游.修坟.破土.拆卸.开市.开光.立券.认养.栽种.挂匾.移柩.进人口",
    "avoid": "结婚.领证.安床.作灶.嫁娶.探病",
    "holiday": "",
    "desc": ""
  }
}
*/