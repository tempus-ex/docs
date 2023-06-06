#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DocsStack } from '../lib/docs-stack';

const demoArn = 'arn:aws:acm:us-east-1:992150767891:certificate/c5a6eb00-528f-473d-89a7-cb64b85722e9';
const webProdArn = 'arn:aws:acm:us-east-1:189912143729:certificate/a460ee40-07ed-4eee-b425-9bcf9303b15c';

const app = new cdk.App();
// new DocsStack(app, 'DemoDocsStack', {
//     env: {
//         account: '992150767891',
//         region: 'us-east-1',
//     },
//     domainName: 'demo.tempus-ex.com',
//     subDomainName: 'docs',
//     certificateArn: demoArn,
// });

new DocsStack(app, 'ProdDocsStack', {
    env: {
        account: '189912143729',
        region: 'us-east-1',
    },
    domainName: 'tempus-ex.com',
    subDomainName: 'docs',
    certificateArn: webProdArn,
});
