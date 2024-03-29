import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import {
    CacheHeaderBehavior,
    CachePolicy,
    Distribution,
    OriginRequestCookieBehavior,
    OriginRequestPolicy,
    OriginRequestQueryStringBehavior,
    ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket, BucketAccessControl, ObjectOwnership } from 'aws-cdk-lib/aws-s3';

interface DocsProps extends cdk.StackProps {
    domainName: string;
    subDomainName: string;
    certificateArn: string;
}

export class DocsStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props: DocsProps) {
        super(scope, id, props);
        const { domainName, subDomainName, certificateArn } = props;
        const fullSubdomain = [subDomainName, domainName].join('.').replace(/^\./, '');

        const domainCert = certificatemanager.Certificate.fromCertificateArn(this, 'DomainCert', certificateArn);

        const docsHandler = new lambda.DockerImageFunction(this, 'Handler', {
            code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../..'), {
                platform: ecr_assets.Platform.LINUX_AMD64,
            }),
            memorySize: 2048,
            timeout: cdk.Duration.seconds(30),
        });

        const api = new apigateway.LambdaRestApi(this, 'Api', {
            binaryMediaTypes: ['*/*'],
            endpointTypes: [apigateway.EndpointType.REGIONAL],
            handler: docsHandler,
        });

        const apiDist = new cloudfront.Distribution(this, 'ApiDistribution', {
            certificate: domainCert,
            defaultBehavior: {
                allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                cachePolicy: new cloudfront.CachePolicy(this, 'ApiCachePolicy', {
                    cookieBehavior: cloudfront.CacheCookieBehavior.allowList('fftoken'),
                }),
                origin: new origins.RestApiOrigin(api),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            domainNames: [fullSubdomain],
        });

        const zone = route53.HostedZone.fromLookup(this, 'HostedZone', {
            domainName,
        });

        new route53.ARecord(this, 'Record', {
            recordName: subDomainName,
            zone,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(apiDist)),
        });
    }
}
