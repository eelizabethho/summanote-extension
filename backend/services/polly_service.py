import boto3
import io
import base64
from botocore.exceptions import ClientError, NoCredentialsError
import logging

class PollyService:
    def __init__(self):
        """
        Initialize Amazon Polly service with IAM role authentication.
        The AWS SDK will automatically use IAM roles if running on AWS infrastructure,
        or AWS credentials from environment variables, AWS credentials file, or IAM roles.
        """
        try:
            # Initialize Polly client
            # AWS SDK will automatically look for credentials in this order:
            # 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
            # 2. AWS credentials file (~/.aws/credentials)
            # 3. IAM roles (if running on AWS infrastructure like EC2, Lambda, etc.)
            self.polly_client = boto3.client('polly', region_name='us-east-1')
            logging.info("Polly service initialized successfully")
        except NoCredentialsError:
            logging.error("AWS credentials not found. Please configure AWS credentials.")
            raise
        except Exception as e:
            logging.error(f"Failed to initialize Polly service: {str(e)}")
            raise

    def synthesize_speech(self, text, voice_id='Joanna', output_format='mp3'):
        """
        Convert text to speech using Amazon Polly.
        
        Args:
            text (str): Text to convert to speech
            voice_id (str): Polly voice ID (default: 'Joanna')
            output_format (str): Output format ('mp3', 'ogg_vorbis', 'pcm')
        
        Returns:
            dict: Contains 'success', 'audio_data' (base64 encoded), and 'content_type'
        """
        try:
            # Synthesize speech using Polly
            response = self.polly_client.synthesize_speech(
                Text=text,
                VoiceId=voice_id,
                OutputFormat=output_format,
                Engine='neural'  # Use neural engine for better quality
            )
            
            # Get audio data
            audio_data = response['AudioStream'].read()
            
            # Encode audio data to base64 for transmission
            audio_base64 = base64.b64encode(audio_data).decode('utf-8')
            
            return {
                'success': True,
                'audio_data': audio_base64,
                'content_type': f'audio/{output_format}',
                'voice_id': voice_id
            }
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            logging.error(f"Polly ClientError: {error_code} - {error_message}")
            return {
                'success': False,
                'error': f"AWS Polly error: {error_code} - {error_message}"
            }
        except Exception as e:
            logging.error(f"Unexpected error in synthesize_speech: {str(e)}")
            return {
                'success': False,
                'error': f"Unexpected error: {str(e)}"
            }

    def get_available_voices(self, language_code='en-US'):
        """
        Get list of available voices for a specific language.
        
        Args:
            language_code (str): Language code (e.g., 'en-US', 'es-ES')
        
        Returns:
            dict: Contains 'success' and 'voices' list
        """
        try:
            response = self.polly_client.describe_voices(LanguageCode=language_code)
            voices = []
            for voice in response['Voices']:
                voices.append({
                    'id': voice['Id'],
                    'name': voice['Name'],
                    'language': voice['LanguageCode'],
                    'gender': voice['Gender']
                })
            
            return {
                'success': True,
                'voices': voices
            }
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            logging.error(f"Polly ClientError getting voices: {error_code} - {error_message}")
            return {
                'success': False,
                'error': f"AWS Polly error: {error_code} - {error_message}"
            }
        except Exception as e:
            logging.error(f"Unexpected error getting voices: {str(e)}")
            return {
                'success': False,
                'error': f"Unexpected error: {str(e)}"
            }

    def test_connection(self):
        """
        Test the connection to Amazon Polly.
        
        Returns:
            dict: Contains 'success' and 'message'
        """
        try:
            # Try to get available voices to test connection
            response = self.polly_client.describe_voices(LanguageCode='en-US')
            return {
                'success': True,
                'message': 'Successfully connected to Amazon Polly'
            }
        except ClientError as e:
            error_code = e.response['Error']['Code']
            return {
                'success': False,
                'error': f"AWS Polly connection failed: {error_code}"
            }
        except NoCredentialsError:
            return {
                'success': False,
                'error': 'AWS credentials not found. Please configure AWS credentials or IAM roles.'
            }
        except Exception as e:
            return {
                'success': False,
                'error': f"Connection test failed: {str(e)}"
            }
