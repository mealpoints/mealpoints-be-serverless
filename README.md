## Commands

1. Start locally: `nodemon`
2. deploy: `npm run build && sls deploy` or `npm run deploy`
3. Invoke function locally: `serverless invoke local --function <function-name> --path <path/to/mock>`
4. Run ngrok locally: `ngrok http 3000 --domain=mealpoints.ngrok.app`

## Troubleshooting

### Deployment

**Error**

```
✖ Stack mealpoints-be-serverless-dev failed to deploy (69s)
Environment: darwin, node 21.7.3, framework 3.38.0 (local), plugin 7.2.3, SDK 4.5.1
Credentials: Serverless Framework Provider: "default" (https://app.serverless.com/mealpoints/apps/mealpoints-app-serverless/mealpoints-be-serverless/dev/us-east-1/providers)
Docs:        docs.serverless.com
Support:     forum.serverless.com
Bugs:        github.com/serverless/serverless/issues

Error:
CREATE_FAILED: ApiGatewayLogGroup (AWS::Logs::LogGroup)
Resource handler returned message: "Resource of type 'AWS::Logs::LogGroup' with identifier '{"/properties/LogGroupName":"/aws/api-gateway/mealpoints-be-serverless-dev"}' already exists." (RequestToken: 6fe297e9-8f13-785c-f62c-4b2d3a231e71, HandlerErrorCode: AlreadyExists)
```

**Solution**:

This error occurs often, but there is nothing you can do but just delete the log group manually or write a Lambda function which does this for you.

To delete a CloudWatch Log Group use: `aws logs delete-log-group --log-group-name /aws/api-gateway/mealpoints-be-serverless-dev`

To show all available Log Groups use: `aws logs describe-log-groups`
