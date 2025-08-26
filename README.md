Key Components:

Frontend: A static Single-Page Application (SPA) hosted on Amazon S3.
API Layer: Amazon API Gateway provides a secure, scalable REST API endpoint.
Business Logic: AWS Lambda functions execute the CRUD operations in a stateless, event-driven manner.
Data Store: Amazon DynamoDB, a managed NoSQL database, stores the application data.
Security: AWS IAM roles enforce permissions for the least privilege.
Observability: Amazon CloudWatch provides logging and monitoring.

✨ Features

Full CRUD Operations: Create, read, update, and delete items via a RESTful interface.
Serverless: No servers to provision or manage. Scales automatically with usage.
Cost-Effective: You only pay for the API requests and data storage you use.
Secure: Fine-grained IAM permissions and API Gateway security features.
High Availability: Built on AWS's highly available and durable services.
Infrastructure as Code (IaC): The entire stack is defined and deployed using the AWS Serverless Application Model (SAM).

🚀 Deployment

1. Clone the Repository
bash
git clone <your-repo-url>
cd serverless-rest-api
2. Build the Application
Use the SAM CLI to build the application. This step processes your template, installs dependencies, and prepares everything for deployment.
bash
sam build

4. Deploy to AWS
This command packages and deploys your application to AWS. You will be prompted for a "stack name" (e.g., my-serverless-api) and an AWS Region (e.g., us-east-1).
bash
sam deploy --guided
Follow the on-screen prompts. SAM will output the URLs for your API Gateway and your S3 bucket frontend.

6. Test the API
Once deployed, you can test the API using curl, Postman, or the provided frontend.
Example: Create a new item
bash
curl -X POST https://your-api-gateway-url/prod/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Learn Serverless", "description": "Build an API with AWS"}'
Example: Get all items
bash
curl https://your-api-gateway-url/prod/items

📖 API Reference
The API provides the following endpoints:
Method
Endpoint
Description
Request Body
POST
/items
Create a new item
{"name": "string", "description": "string"}
GET
/items
Retrieve all items

GET
/items/{id}
Retrieve a single item by its ID

PUT
/items/{id}
Update an existing item
{"name": "string", "description": "string"}
DELETE
/items/{id}
Delete an item by its ID


🌐 Frontend
The project includes a simple frontend to interact with the API.
After deployment, find the URL of your S3 bucket in the SAM outputs or the AWS Console.
Open the URL in your web browser.
You can now use the web interface to create, view, update, and delete items. The frontend will make calls directly to your deployed API Gateway.

📊 Monitoring
All application activity is logged to Amazon CloudWatch.
To view Lambda logs:
Navigate to the AWS Lambda console.
Select your function (e.g., ItemsFunction).
Click on the "Monitor" tab and then "View logs in CloudWatch".
To view API Gateway logs:
Navigate to the API Gateway console.
Select your API and stages to view access logs and execution metrics.
🧹 Clean Up
To avoid ongoing costs, you can delete the entire application stack and all its resources using the AWS SAM CLI.
bash
sam delete
You will be prompted to confirm the stack name and region. This will delete the API Gateway, Lambda functions, DynamoDB table, S3 bucket, and all related resources.

🎯 Learning Outcomes
This project demonstrates core AWS serverless competencies:
Designing and implementing a scalable, event-driven serverless architecture.
Integrating API Gateway with Lambda for stateless HTTP request handling.
Using DynamoDB as a primary database, including table design and SDK interaction.
Implementing security best practices using IAM roles and least-privilege policies.
Monitoring and debugging serverless applications using CloudWatch.
Deploying infrastructure using Infrastructure as Code (IaC) with AWS SAM.

Note: This is a demonstration project. For production use, consider adding authentication/authorization (e.g., with Amazon Cognito), input validation, and more robust error handling.



