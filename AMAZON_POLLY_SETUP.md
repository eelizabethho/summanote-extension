# Amazon Polly Integration Setup Guide

This guide explains how to integrate Amazon Polly with IAM roles in your SummaNote extension.

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **AWS CLI**: Install AWS CLI for credential management
3. **Python Environment**: Your Python environment with the required packages

## Step 1: Install Dependencies

```bash
# Install the required Python packages
pip install -r requirements.txt
```

## Step 2: AWS Credentials Setup

### Option A: IAM Roles (Recommended for Production)

If you're running on AWS infrastructure (EC2, Lambda, ECS, etc.), you can use IAM roles:

1. **Create an IAM Role**:
   - Go to AWS IAM Console
   - Create a new role
   - Attach the `AmazonPollyFullAccess` policy
   - Or create a custom policy with these permissions:
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Action": [
                   "polly:SynthesizeSpeech",
                   "polly:DescribeVoices"
               ],
               "Resource": "*"
           }
       ]
   }
   ```

2. **Attach Role to Your Service**:
   - For EC2: Attach the role to your EC2 instance
   - For Lambda: Set the execution role
   - For ECS: Configure task role

### Option B: AWS Credentials (For Development)

For local development, set up AWS credentials:

1. **Install AWS CLI**:
   ```bash
   # macOS
   brew install awscli
   
   # Or using pip
   pip install awscli
   ```

2. **Configure Credentials**:
   ```bash
   aws configure
   ```
   Enter your:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region (e.g., `us-east-1`)
   - Default output format (e.g., `json`)

3. **Alternative: Environment Variables**:
   ```bash
   export AWS_ACCESS_KEY_ID=your_access_key
   export AWS_SECRET_ACCESS_KEY=your_secret_key
   export AWS_DEFAULT_REGION=us-east-1
   ```

## Step 3: Test AWS Connection

Create a test script to verify your AWS setup:

```python
# test_aws_connection.py
import boto3
from botocore.exceptions import ClientError, NoCredentialsError

def test_polly_connection():
    try:
        polly = boto3.client('polly', region_name='us-east-1')
        response = polly.describe_voices(LanguageCode='en-US', MaxItems=1)
        print("✅ AWS Polly connection successful!")
        print(f"Found {len(response['Voices'])} voices")
        return True
    except NoCredentialsError:
        print("❌ AWS credentials not found")
        print("Please configure AWS credentials or IAM roles")
        return False
    except ClientError as e:
        print(f"❌ AWS Polly error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    test_polly_connection()
```

Run the test:
```bash
python test_aws_connection.py
```

## Step 4: Start the Polly API Server

1. **Start the Flask server**:
   ```bash
   cd backend/api
   python polly_api.py
   ```

2. **Test the API**:
   ```bash
   # Test connection
   curl http://localhost:5001/api/polly/test
   
   # Test synthesis
   curl -X POST http://localhost:5001/api/polly/synthesize \
     -H "Content-Type: application/json" \
     -d '{"text": "Hello, this is a test of Amazon Polly."}'
   ```

## Step 5: Configure Your Extension

1. **Update the API URL** in `extension/background/background.js`:
   ```javascript
   // Change this line to your actual server URL
   const pollyApiUrl = 'http://localhost:5001/api/polly/synthesize';
   ```

2. **For production**, update to your deployed server:
   ```javascript
   const pollyApiUrl = 'https://your-server.com/api/polly/synthesize';
   ```

## Step 6: Test the Extension

1. **Load the extension** in Chrome
2. **Select text** on any webpage
3. **Click "Summarize"** to generate a summary
4. **Click "🔊 Speak"** to test Amazon Polly TTS

## Troubleshooting

### Common Issues:

1. **"AWS credentials not found"**:
   - Ensure AWS credentials are configured
   - Check environment variables
   - Verify IAM role attachment

2. **"Polly API failed"**:
   - Check if the Flask server is running
   - Verify the API URL in your extension
   - Check server logs for errors

3. **"CORS errors"**:
   - Add CORS headers to your Flask app
   - Update manifest.json host permissions

4. **"Audio not playing"**:
   - Check browser console for errors
   - Verify audio format compatibility
   - Test with different voice IDs

### Debug Steps:

1. **Check AWS credentials**:
   ```bash
   aws sts get-caller-identity
   ```

2. **Test Polly directly**:
   ```bash
   aws polly describe-voices --language-code en-US
   ```

3. **Check server logs**:
   ```bash
   # Look for error messages in your Flask server output
   ```

## Production Deployment

For production deployment:

1. **Use HTTPS** for your API server
2. **Set up proper CORS** headers
3. **Use environment variables** for configuration
4. **Implement proper error handling**
5. **Add authentication** if needed
6. **Use AWS IAM roles** instead of access keys

## Cost Considerations

Amazon Polly pricing (as of 2024):
- **Standard voices**: $4.00 per 1M characters
- **Neural voices**: $16.00 per 1M characters
- **Long-form voices**: $16.00 per 1M characters

Monitor your usage in the AWS Console to avoid unexpected charges.

## Security Best Practices

1. **Never hardcode AWS credentials** in your code
2. **Use IAM roles** with minimal required permissions
3. **Rotate access keys** regularly
4. **Monitor AWS CloudTrail** for API usage
5. **Set up billing alerts** to monitor costs
