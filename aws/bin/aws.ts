#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DocsStack } from '../lib/docs-stack';

const demoArn = 'arn:aws:acm:us-east-1:992150767891:certificate/c5a6eb00-528f-473d-89a7-cb64b85722e9';
const demoHostedZoneId = 'Z01264622EAQBCH25W57L';
const webProdArn = 'arn:aws:acm:us-east-1:189912143729:certificate/217bc40a-88c9-437b-adb7-394bca6d31f1'

const app = new cdk.App();
new DocsStack(app, 'DocsStack', {
  env: {
    // account: '189912143729',
    account: '992150767891',
    region: 'us-east-1',
  },
  // domainName: 'tempus-ex.com',
  domainName: 'demo.tempus-ex.com',
  subDomainName: 'docs',
  // certificateArn: 'arn:aws:acm:us-east-1:189912143729:certificate/65353e90-b94d-471b-b4ff-1bf859bb04f8'
  // certificateArn: webProdArn
  certificateArn: demoArn
});