import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { CacheHeaderBehavior, CachePolicy, Distribution, OriginRequestCookieBehavior, OriginRequestPolicy, OriginRequestQueryStringBehavior, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket, BucketAccessControl, ObjectOwnership } from 'aws-cdk-lib/aws-s3';

interface DocsProps extends cdk.StackProps {
  domainName: string
  subDomainName: string
  certificateArn: string
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

    const docsHandler = new lambda.DockerImageFunction(this, 'DocsHandler', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../..')),
    });




    const api = new apigateway.LambdaRestApi(this, 'DocsEndpoint', {
      handler: docsHandler,
      // proxy: false,
      domainName: {
        domainName: fullSubdomain,
        certificate: domainCert,
      },
      integrationOptions: {
        // passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
        // requestParameters: {
        //   'integration.request.header.Cookie':'method.request.header.Cookie'
        //   // 'integration.request.header.Cookie':'method.request.header.Cookie'
        // },
        requestTemplates: {
          'application/json': '{ "Cookie": "$input.params().header.Cookie" }',
        },
        // requestTemplates: {
        //   'application/json': '{ "method": "$context.httpMethod", "headers": { #foreach($param in $input.params().header.keySet()) "$param": "$util.escapeJavaScript($input.params().header.get($param))" #if($foreach.hasNext), #end #end }, "body": $input.json("$"), "path": "$context.resourcePath", "query": { #foreach($param in $input.params().querystring.keySet()) "$param": "$util.escapeJavaScript($input.params().querystring.get($param))" #if($foreach.hasNext), #end #end } }'
        // }
      },
      // parameters: {
      //   'integration.request.header.Cookie':'method.request.header.Cookie'
      // },
    });

    // api?.node?.defaultChild?.defaultIntegration?.addRequestTemplate('application/json', '{ "Cookie": "$input.params().header.Cookie" }');


    // const lambdaIntegration = new apigateway.LambdaIntegration(docsHandler);


    // const defaultMethod = api.root.addMethod('ANY', lambdaIntegration)
    // // const defaultMethod = api.root.addMethod('ANY', lambdaIntegration,{
    // // requestParameters:{
    // //   'method.request.header.Cookie':true
    // // }}
    // // );
    // const login = api.root.addResource('login');
    // // login.addMethod('GET', lambdaIntegration, {
    // //     requestParameters: {
    // //       'method.request.header.Cookie':true
    // //     },
    // // });   

    // login.addMethod('GET');   
    // const root = api.root.addResource('_next');
    // root.addMethod('GET');   
    // const root = api.root.addResource('/');
    // root.addMethod('GET');   


    // const apiDomainName = apigateway.DomainName.fromDomainNameAttributes(this, 'DocsDomain', {
    //   domainName: fullSubdomain,
    //   domainNameAliasHostedZoneId: 'Z01264622EAQBCH25W57L',
    //   domainNameAliasTarget: 'prod',
    // });
    
    // new apigateway.BasePathMapping(this, 'BasePathMapping', {
    //   domainName: apiDomainName,
    //   restApi: api,
    // });

    // const cachePolicy = new CachePolicy(this, "CachePolicy", {
    //   headerBehavior: CacheHeaderBehavior.allowList("Authorization"),
    // });

    // const originRequestPolicy = new OriginRequestPolicy(this, 'RequestPolicy', {
    //   // queryStringBehavior: OriginRequestQueryStringBehavior.all(),
    //   // cookieBehavior: OriginRequestCookieBehavior.all(),
    // })

    // const logsBucket = new Bucket(this, "LogsBucket", {
    //   objectOwnership: ObjectOwnership.OBJECT_WRITER,
    // });



    // const distribution = new Distribution(this, 'DocsDistribution', {
    //   domainNames: [`${subDomainName}.${domainName}`],
    //   certificate: domainCert,
    //   logBucket: logsBucket,
    //   defaultBehavior: {
    //     viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    //     origin: new origins.RestApiOrigin(api),
    //     // cachePolicy,
    //     // originRequestPolicy,
    //   },
    // })

    // const zone = route53.HostedZone.fromLookup(this, "zone", {
    //   domainName,
    // })

    // new route53.ARecord(this, 'a-record', {
    //   recordName: subDomainName,
    //   zone,
    //   target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
    // })

    // new route53.ARecord(this, 'a-record', {
    //   recordName: subDomainName,
    //   zone,
    //   target: route53.RecordTarget.fromAlias({
    //     bind() {
    //       return {
    //         dnsName: fullSubdomain, // Specify the applicable domain name for your API.,
    //         hostedZoneId: 'Z01264622EAQBCH25W57L', // Specify the hosted zone ID for your API.
    //       };
    //     },
    //     },)
    // })

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
