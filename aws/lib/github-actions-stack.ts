import { App, Aws, aws_iam as iam, Stack, StackProps } from 'aws-cdk-lib';

import { DocsStack } from './docs-stack';

interface Props extends StackProps {
    branch: string;
    docsStack: DocsStack;
}

// Creates the resources necessary for GitHub Actions.
//
// Note that this does not create the GitHub Actions identity provider as that is an account-wide
// singleton resource. As a prerequisite, you must create an identity provider for
// "token.actions.githubusercontent.com".
export class GitHubActionsStack extends Stack {
    constructor(scope: App, id: string, props: Props) {
        super(scope, id, props);

        const updateRole = new iam.Role(this, 'UpdateRole', {
            assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
            description: 'This role can be passed to CloudFormation to update the deployment.',
            inlinePolicies: {
                policy: new iam.PolicyDocument({
                    statements: [new iam.PolicyStatement({
                        actions: ['iam:GetRole'],
                        resources: [`arn:aws:iam::${Aws.ACCOUNT_ID}:role/${props.docsStack.stackName}-*`],
                    }), new iam.PolicyStatement({
                        actions: ['apigateway:GET'],
                        resources: ['*'],
                    }), new iam.PolicyStatement({
                        actions: [
                            'lambda:ListTags',
                            'lambda:GetFunction',
                            'lambda:UpdateFunctionCode',
                        ],
                        resources: [`arn:aws:lambda:${Aws.REGION}:${Aws.ACCOUNT_ID}:function:${props.docsStack.stackName}-*`],
                    }), new iam.PolicyStatement({
                        actions: ['ssm:GetParameters'],
                        resources: [`arn:aws:ssm:${Aws.REGION}:${Aws.ACCOUNT_ID}:parameter/cdk-bootstrap/*/version`],
                    })],
                }),
            },
        });

        const deployRole = new iam.Role(this, 'DeployRole', {
            assumedBy: new iam.AccountPrincipal(Aws.ACCOUNT_ID),
            description: 'This role can be passed to the CDK to perform the deployment.',
            inlinePolicies: {
                policy: new iam.PolicyDocument({
                    statements: [new iam.PolicyStatement({
                        actions: ['iam:PassRole'],
                        resources: [updateRole.roleArn],
                    }), new iam.PolicyStatement({
                        actions: [
                            'cloudformation:GetTemplate',
                            'cloudformation:CancelUpdateStack',
                            'cloudformation:UpdateStack',
                            'cloudformation:CreateChangeSet',
                            'cloudformation:DescribeChangeSet',
                            'cloudformation:ExecuteChangeSet',
                            'cloudformation:DeleteChangeSet',
                            'cloudformation:DescribeStacks',
                            'cloudformation:DescribeStackEvents',
                            'cloudformation:GetTemplateSummary',
                        ],
                        resources: [`arn:aws:cloudformation:${Aws.REGION}:${Aws.ACCOUNT_ID}:stack/${props.docsStack.stackName}/*`],
                    }), new iam.PolicyStatement({
                        actions: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
                        resources: [
                            `arn:aws:s3:::cdk-*-assets-${Aws.ACCOUNT_ID}-${Aws.REGION}`,
                            `arn:aws:s3:::cdk-*-assets-${Aws.ACCOUNT_ID}-${Aws.REGION}/*`,
                        ],
                    }), new iam.PolicyStatement({
                        actions: ['cloudformation:DescribeStacks'],
                        resources: [`arn:aws:cloudformation:${Aws.REGION}:${Aws.ACCOUNT_ID}:stack/CDKToolkit/*`],
                    }), new iam.PolicyStatement({
                        actions: ['ssm:GetParameter'],
                        resources: [`arn:aws:ssm:${Aws.REGION}:${Aws.ACCOUNT_ID}:parameter/cdk-bootstrap/*/version`],
                    })],
                }),
            },
        });

        new iam.Role(this, 'Role', {
            assumedBy: new iam.FederatedPrincipal(`arn:aws:iam::${Aws.ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com`, {
                StringEquals: {
                    'token.actions.githubusercontent.com:sub': `repo:tempus-ex/docs:ref:refs/heads/${props.branch}`,
                    'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
                },
            }, 'sts:AssumeRoleWithWebIdentity'),
            inlinePolicies: {
                policy: new iam.PolicyDocument({
                    statements: [new iam.PolicyStatement({
                        actions: ['sts:AssumeRole'],
                        resources: [
                            deployRole.roleArn,
                            `arn:aws:iam::${Aws.ACCOUNT_ID}:role/cdk-*-image-publishing-role-${Aws.ACCOUNT_ID}-${Aws.REGION}`,
                            `arn:aws:iam::${Aws.ACCOUNT_ID}:role/cdk-*-file-publishing-role-${Aws.ACCOUNT_ID}-${Aws.REGION}`,
                        ],
                    }), new iam.PolicyStatement({
                        actions: ['cloudfront:CreateInvalidation'],
                        resources: ['*'],
                    }), new iam.PolicyStatement({
                        actions: ['cloudformation:DescribeStacks'],
                        resources: [`arn:aws:cloudformation:${Aws.REGION}:${Aws.ACCOUNT_ID}:stack/CDKToolkit/*`],
                    }), new iam.PolicyStatement({
                        actions: ['ssm:GetParameter'],
                        resources: [`arn:aws:ssm:${Aws.REGION}:${Aws.ACCOUNT_ID}:parameter/cdk-bootstrap/*/version`],
                    })],
                }),
            },
        });
    }
}
