import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";

interface DocsProps extends cdk.StackProps {
  domainName: string
  subDomainName: string
  certificateArn: string
  // bucketName: string
}

export class DocsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DocsProps) {
    super(scope, id, props);
    const {domainName, subDomainName, certificateArn} = props;
    const fullSubdomain = [domainName, subDomainName].join(".");

    const zone = HostedZone.fromLookup(this, "Zone", { domainName });

    const certificate = new Certificate(this, "Certificate", {
      domainName: fullSubdomain,
      validation: CertificateValidation.fromDns(zone),
    });

  }
}
