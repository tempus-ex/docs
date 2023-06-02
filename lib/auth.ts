import type { GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { validateFusionFeedToken } from './fusion-feed';

export function withAuth<Params, Props>(
    f: (ctx: GetServerSidePropsContext<Params & ParsedUrlQuery>) => Promise<GetServerSidePropsResult<Props>>
): (ctx: GetServerSidePropsContext<Params & ParsedUrlQuery>) => Promise<GetServerSidePropsResult<Props>> {
    return async (ctx) => {
        const {req} = ctx;
        // console.log('req: ', JSON.stringify(req));
        console.log('headers: ', JSON.stringify(req.headers));
        console.log('cookies: ', JSON.stringify(req.cookies));
        // console.log('req: ', JSON.stringify(req.body));
        const token = req.cookies['fftoken'];
        console.log('token: ', token);
        console.trace();
        debugger;
        if (!token || !await validateFusionFeedToken(token)) {
            console.log('didnt token or something');
            return {
                redirect: {
                    destination: '/login#destination=' + encodeURIComponent(req.url || '/'),
                    permanent: false,
                },
            };
        }
        return await f(ctx);
    };
}
