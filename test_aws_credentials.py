#!/usr/bin/env python3
"""
Test script to check if AWS credentials are configured for Amazon Polly.
"""

import boto3
from botocore.exceptions import ClientError, NoCredentialsError

def test_aws_credentials():
    """Test if AWS credentials are properly configured."""
    print("Testing AWS credentials for Amazon Polly...")
    
    try:
        # Try to create a Polly client
        polly_client = boto3.client('polly', region_name='us-east-1')
        print("SUCCESS: Polly client created successfully")
        
        # Try to get available voices (this requires valid credentials)
        response = polly_client.describe_voices(LanguageCode='en-US')
        voices = response['Voices']
        
        print(f"SUCCESS: Connected to Amazon Polly!")
        print(f"Found {len(voices)} English voices available")
        
        # Show some female voices
        female_voices = [v for v in voices if v['Gender'] == 'Female']
        print(f"Found {len(female_voices)} female voices:")
        
        for voice in female_voices[:5]:  # Show first 5
            print(f"   - {voice['Name']} ({voice['LanguageCode']})")
        
        # Test synthesis
        print("\nTesting speech synthesis...")
        synthesis_response = polly_client.synthesize_speech(
            Text="Hello! This is a test of Amazon Polly text to speech.",
            VoiceId='Joanna',
            OutputFormat='mp3'
        )
        
        print("SUCCESS: Speech synthesis successful!")
        print(f"Audio data size: {len(synthesis_response['AudioStream'].read())} bytes")
        
        return True
        
    except NoCredentialsError:
        print("ERROR: AWS credentials not found!")
        print("Please set up AWS credentials using one of these methods:")
        print("   1. Environment variables:")
        print("      $env:AWS_ACCESS_KEY_ID='your-key'")
        print("      $env:AWS_SECRET_ACCESS_KEY='your-secret'")
        print("   2. AWS credentials file: ~/.aws/credentials")
        print("   3. IAM roles (if running on AWS)")
        return False
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        print(f"ERROR: AWS API error: {error_code}")
        print(f"Error message: {e.response['Error']['Message']}")
        return False
        
    except Exception as e:
        print(f"ERROR: Unexpected error: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_aws_credentials()
    
    if success:
        print("\nAmazon Polly is ready to use!")
        print("You can now run: python .\\polly_api.py")
    else:
        print("\nAmazon Polly is not configured.")
        print("See aws_setup_guide.md for setup instructions.")
        print("The extension will use demo mode (browser TTS) for now.")
