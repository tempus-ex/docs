import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export async function validateFusionFeedToken(token: string): Promise<boolean> {
    if (!token) {
        return false;
    }
    const url = publicRuntimeConfig.fusionFeedUrl + '/v2/graphql';
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/graphql',
            'Authorization': 'token ' + token,
        },
        body: '{__typename}',
    });
    return resp.status === 200;
}
