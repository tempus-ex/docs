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

    const domainCert = certificatemanager.Certificate.fromCertificateArn(this, 'DomainCert', certificateArn);

    const docsHandler = new lambda.DockerImageFunction(this, 'DocsHandler', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../..')),
    });

    const api = new apigateway.LambdaRestApi(this, 'DocsEndpoint', {
      handler: docsHandler,
    });

    // const cachePolicy = new CachePolicy(this, "CachePolicy", {
    //   headerBehavior: CacheHeaderBehavior.allowList("Authorization"),
    // });

    const originRequestPolicy = new OriginRequestPolicy(this, 'RequestPolicy', {
      // queryStringBehavior: OriginRequestQueryStringBehavior.all(),
      cookieBehavior: OriginRequestCookieBehavior.all(),
    })

    const logsBucket = new Bucket(this, "LogsBucket", {
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
    });

    const distribution = new Distribution(this, 'DocsDistribution', {
      domainNames: [`${subDomainName}.${domainName}`],
      certificate: domainCert,
      logBucket: logsBucket,
      defaultBehavior: {
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        origin: new origins.RestApiOrigin(api),
        // cachePolicy,
        originRequestPolicy,
      },
    })

    const zone = route53.HostedZone.fromLookup(this, "zone", {
      domainName,
    })

    new route53.ARecord(this, 'a-record', {
      recordName: subDomainName,
      zone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
    })

  }
}
