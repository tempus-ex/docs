import { buildClientSchema, ExecutionResult, getIntrospectionQuery, GraphQLSchema, IntrospectionQuery } from 'graphql';
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

export async function getGraphQLSchema(version: 'v1' | 'v2', authorization: string): Promise<GraphQLSchema> {
    const url = `${publicRuntimeConfig.fusionFeedUrl}/${version}/graphql`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/graphql',
            'Authorization': authorization,
        },
        body: getIntrospectionQuery(),
    });
    if (resp.status !== 200) {
        throw new Error(`Unexpected response code: ${resp.status}`);
    }
    const result = await resp.json() as unknown as ExecutionResult<IntrospectionQuery>;
    if (result.errors && result.errors.length > 0) {
        throw new Error(`GraphQL error: ${result.errors[0].message}`);
    } else if (!result.data) {
        throw new Error('GraphQL response contained no data.');
    }
    return buildClientSchema(result.data);
}

export interface RESTPathParameter {
    type: string;
    description: string;
    name: string;
    in: string;
    required: boolean;
}

export interface RESTPath {
    get: {
        parameters: RESTPathParameter[];
    }
    post: {
        parameters: RESTPathParameter[];
    }
}

export interface RESTSchema {
    paths: Record<string, RESTPath>;
}

export async function getRESTSchema(version: 'v1' | 'v2', authorization: string): Promise<RESTSchema> {
    const url = `${publicRuntimeConfig.fusionFeedUrl}/${version}/openapi.json`;
    const resp = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': authorization,
        },
    });
    if (resp.status !== 200) {
        throw new Error(`Unexpected response code: ${resp.status}`);
    }
    return await resp.json();
}
