#!/usr/bin/env python3
"""
Test script to verify Amazon Polly setup
Run this to check if your AWS credentials and Polly service are working
"""

import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

try:
    from services.polly_service import PollyService
    print("✅ Polly service imported successfully")
except ImportError as e:
    print(f"❌ Failed to import Polly service: {e}")
    print("Make sure you have installed the requirements: pip install -r requirements.txt")
    sys.exit(1)

def test_polly_connection():
    """Test the Polly service connection"""
    try:
        print("\n🔍 Testing Amazon Polly connection...")
        polly_service = PollyService()
        
        # Test connection
        result = polly_service.test_connection()
        if result['success']:
            print("✅ Amazon Polly connection successful!")
        else:
            print(f"❌ Amazon Polly connection failed: {result['error']}")
            return False
            
        # Test getting voices
        print("\n🔍 Testing voice retrieval...")
        voices_result = polly_service.get_available_voices('en-US')
        if voices_result['success']:
            print(f"✅ Found {len(voices_result['voices'])} English voices")
            # Show first few voices
            for i, voice in enumerate(voices_result['voices'][:3]):
                print(f"   - {voice['name']} ({voice['gender']})")
        else:
            print(f"❌ Failed to get voices: {voices_result['error']}")
            return False
            
        # Test synthesis
        print("\n🔍 Testing speech synthesis...")
        test_text = "Hello, this is a test of Amazon Polly text to speech."
        synthesis_result = polly_service.synthesize_speech(test_text, 'Joanna')
        
        if synthesis_result['success']:
            print("✅ Speech synthesis successful!")
            print(f"   - Voice: {synthesis_result['voice_id']}")
            print(f"   - Content Type: {synthesis_result['content_type']}")
            print(f"   - Audio data size: {len(synthesis_result['audio_data'])} characters (base64)")
        else:
            print(f"❌ Speech synthesis failed: {synthesis_result['error']}")
            return False
            
        print("\n🎉 All tests passed! Amazon Polly is ready to use.")
        return True
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def check_aws_credentials():
    """Check if AWS credentials are available"""
    print("🔍 Checking AWS credentials...")
    
    # Check environment variables
    access_key = os.getenv('AWS_ACCESS_KEY_ID')
    secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    region = os.getenv('AWS_DEFAULT_REGION', 'us-east-1')
    
    if access_key and secret_key:
        print("✅ AWS credentials found in environment variables")
        print(f"   - Access Key: {access_key[:8]}...")
        print(f"   - Region: {region}")
        return True
    else:
        print("⚠️  AWS credentials not found in environment variables")
        print("   This is OK if you're using IAM roles or AWS credentials file")
        return True

if __name__ == "__main__":
    print("🚀 Amazon Polly Setup Test")
    print("=" * 40)
    
    # Check credentials
    check_aws_credentials()
    
    # Test Polly service
    success = test_polly_connection()
    
    if success:
        print("\n✅ Setup complete! You can now:")
        print("   1. Start the Flask server: python backend/api/polly_api.py")
        print("   2. Load your Chrome extension")
        print("   3. Test the '🔊 Speak' button")
    else:
        print("\n❌ Setup failed. Please check:")
        print("   1. AWS credentials are configured")
        print("   2. You have Polly permissions")
        print("   3. Internet connection is working")
        print("\nSee AMAZON_POLLY_SETUP.md for detailed instructions")
