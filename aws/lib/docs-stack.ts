import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as path from 'path';

interface DocsProps extends cdk.StackProps {
  domainName: string
  subDomainName: string
  certificateArn: string
  // bucketName: string
}


export class DocsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: DocsProps) {
    super(scope, id, props);
    const {domainName, subDomainName, certificateArn} = props;
    const fullSubdomain = [subDomainName, domainName].join(".");

    // defines an AWS Lambda resource
    // const hello = new lambda.Function(this, 'HelloHandler', {
    //   // runtime: lambda.Runtime.NODEJS_14_X,    // execution environment
    //   runtime: lambda.Runtime.FROM_IMAGE,    // execution environment
    //   // code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
    //   // code: lambda.Code.fromAsset('../.next'),  // code loaded from "lambda" directory
    //   // code: lambda.Code.fromDockerBuild(".."),  // code loaded from "lambda" directory
    //   code: lambda.Code.fromDockerBuild("..", {imagePath: "/app"}),  // code loaded from "lambda" directory
    //   // handler: 'hello.handler'                // file is "hello", function is "handler"
    //   handler: lambda.Handler.FROM_IMAGE                // file is "hello", function is "handler"
    // });

    const domainCert = certificatemanager.Certificate.fromCertificateArn(this, 'DomainCert', certificateArn);

    const hello = new lambda.DockerImageFunction(this, 'HelloHandler', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../..')),
    });


    // defines an API Gateway REST API resource backed by our "hello" function.
    const api = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: hello,
      proxy: false,
      domainName: {
        domainName: fullSubdomain,
        certificate: domainCert,
      },
    });

    const login = api.root.addResource('login');
    login.addMethod('GET');   

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
