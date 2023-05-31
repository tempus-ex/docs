import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

interface DocsProps extends cdk.StackProps {
  domainName: string
  subDomainName: string
  certificateArn: string
  // bucketName: string
}


export class DocsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: DocsProps) {
    super(scope, id, props);

    // defines an AWS Lambda resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,    // execution environment
      // code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      code: lambda.Code.fromAsset('../.next'),  // code loaded from "lambda" directory
      handler: 'hello.handler'                // file is "hello", function is "handler"
    });

    // defines an API Gateway REST API resource backed by our "hello" function.
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: hello
    });

  }
}


// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import {
//   Certificate,
//   CertificateValidation,
// } from "aws-cdk-lib/aws-certificatemanager";
// // import * as sqs from 'aws-cdk-lib/aws-sqs';
// import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";

// interface DocsProps extends cdk.StackProps {
//   domainName: string
//   subDomainName: string
//   certificateArn: string
//   // bucketName: string
// }

// export class DocsStack extends cdk.Stack {
//   constructor(scope: Construct, id: string, props: DocsProps) {
//     super(scope, id, props);
//     const {domainName, subDomainName, certificateArn} = props;
//     const fullSubdomain = [domainName, subDomainName].join(".");

//     const zone = HostedZone.fromLookup(this, "Zone", { domainName });

//     const certificate = new Certificate(this, "Certificate", {
//       domainName: fullSubdomain,
//       validation: CertificateValidation.fromDns(zone),
//     });

//   }
// }
