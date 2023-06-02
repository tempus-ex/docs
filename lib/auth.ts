import type { GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { validateFusionFeedToken } from './fusion-feed';

export function withAuth<Params, Props>(
    f: (ctx: GetServerSidePropsContext<Params & ParsedUrlQuery>) => Promise<GetServerSidePropsResult<Props>>
): (ctx: GetServerSidePropsContext<Params & ParsedUrlQuery>) => Promise<GetServerSidePropsResult<Props>> {
    return async (ctx) => {
        const {req} = ctx;
        console.log('req: ', req);
        const token = req.cookies['fftoken'];
        console.log('token: ', token);
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
