from flask import Flask, request, jsonify
import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from services.polly_service import PollyService
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_polly_app():
    """Create Flask app for Polly API endpoints."""
    app = Flask(__name__)
    
    # Initialize Polly service
    try:
        polly_service = PollyService()
        logger.info("Polly service initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Polly service: {str(e)}")
        polly_service = None

    @app.route('/api/polly/synthesize', methods=['POST'])
    def synthesize_speech():
        """
        API endpoint to synthesize speech using Amazon Polly.
        
        Expected JSON payload:
        {
            "text": "Text to convert to speech",
            "voice_id": "Joanna",  # Optional, defaults to Joanna
            "output_format": "mp3"  # Optional, defaults to mp3
        }
        """
        try:
            if not polly_service:
                return jsonify({
                    'success': False,
                    'error': 'Polly service not available'
                }), 500

            data = request.get_json()
            if not data:
                return jsonify({
                    'success': False,
                    'error': 'No JSON data provided'
                }), 400

            text = data.get('text')
            if not text:
                return jsonify({
                    'success': False,
                    'error': 'Text is required'
                }), 400

            voice_id = data.get('voice_id', 'Joanna')
            output_format = data.get('output_format', 'mp3')

            # Synthesize speech
            result = polly_service.synthesize_speech(
                text=text,
                voice_id=voice_id,
                output_format=output_format
            )

            if result['success']:
                return jsonify(result), 200
            else:
                return jsonify(result), 500

        except Exception as e:
            logger.error(f"Error in synthesize_speech endpoint: {str(e)}")
            return jsonify({
                'success': False,
                'error': f'Internal server error: {str(e)}'
            }), 500

    @app.route('/api/polly/voices', methods=['GET'])
    def get_voices():
        """
        API endpoint to get available voices.
        
        Query parameters:
        - language_code: Language code (default: en-US)
        """
        try:
            if not polly_service:
                return jsonify({
                    'success': False,
                    'error': 'Polly service not available'
                }), 500

            language_code = request.args.get('language_code', 'en-US')
            
            result = polly_service.get_available_voices(language_code)
            
            if result['success']:
                return jsonify(result), 200
            else:
                return jsonify(result), 500

        except Exception as e:
            logger.error(f"Error in get_voices endpoint: {str(e)}")
            return jsonify({
                'success': False,
                'error': f'Internal server error: {str(e)}'
            }), 500

    @app.route('/api/polly/test', methods=['GET'])
    def test_connection():
        """
        API endpoint to test Polly connection.
        """
        try:
            if not polly_service:
                return jsonify({
                    'success': False,
                    'error': 'Polly service not available'
                }), 500

            result = polly_service.test_connection()
            
            if result['success']:
                return jsonify(result), 200
            else:
                return jsonify(result), 500

        except Exception as e:
            logger.error(f"Error in test_connection endpoint: {str(e)}")
            return jsonify({
                'success': False,
                'error': f'Internal server error: {str(e)}'
            }), 500

    @app.route('/api/polly/health', methods=['GET'])
    def health_check():
        """Health check endpoint."""
        return jsonify({
            'success': True,
            'message': 'Polly API is running',
            'service_available': polly_service is not None
        }), 200

    return app

if __name__ == '__main__':
    app = create_polly_app()
    app.run(debug=True, host='0.0.0.0', port=5001)
