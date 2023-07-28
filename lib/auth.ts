import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { validateFusionFeedToken } from './fusionfeed';

export function withAuth<Params, Props>(
    f: (ctx: GetServerSidePropsContext<Params & ParsedUrlQuery>) => Promise<GetServerSidePropsResult<Props>>,
): (ctx: GetServerSidePropsContext<Params & ParsedUrlQuery>) => Promise<GetServerSidePropsResult<Props>> {
    return async (ctx) => {
        const { req } = ctx;
        const token = req.cookies['fftoken'];
        const dest = ctx.resolvedUrl || req.url || '/';
        if (!token || !(await validateFusionFeedToken(token))) {
            return {
                redirect: {
                    destination: '/login#destination=' + encodeURIComponent(dest),
                    permanent: false,
                },
            };
        }
        return await f(ctx);
    };
}
