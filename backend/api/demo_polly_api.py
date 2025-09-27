from flask import Flask, request, jsonify
import base64
import io
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_demo_app():
    """Create Flask app for Polly API endpoints with demo mode."""
    app = Flask(__name__)

    @app.route('/api/polly/synthesize', methods=['POST'])
    def synthesize_speech():
        """
        Demo API endpoint that simulates Polly synthesis.
        Returns a simple audio file for testing.
        """
        try:
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

            # For demo purposes, return a special flag to use browser TTS
            # This tells the extension to fall back to browser TTS
            return jsonify({
                'success': False,
                'error': 'Demo mode - using browser TTS',
                'demo_mode': True,
                'use_browser_tts': True,
                'text': text
            }), 200

        except Exception as e:
            logger.error(f"Error in synthesize_speech endpoint: {str(e)}")
            return jsonify({
                'success': False,
                'error': f'Internal server error: {str(e)}'
            }), 500

    @app.route('/api/polly/voices', methods=['GET'])
    def get_voices():
        """Demo endpoint for getting available voices."""
        demo_voices = [
            {'id': 'Joanna', 'name': 'Joanna', 'language': 'en-US', 'gender': 'Female'},
            {'id': 'Matthew', 'name': 'Matthew', 'language': 'en-US', 'gender': 'Male'},
            {'id': 'Amy', 'name': 'Amy', 'language': 'en-GB', 'gender': 'Female'}
        ]
        
        return jsonify({
            'success': True,
            'voices': demo_voices
        }), 200

    @app.route('/api/polly/test', methods=['GET'])
    def test_connection():
        """Demo endpoint for testing connection."""
        return jsonify({
            'success': True,
            'message': 'Demo Polly API is running (no AWS credentials needed)'
        }), 200

    @app.route('/api/polly/health', methods=['GET'])
    def health_check():
        """Health check endpoint."""
        return jsonify({
            'success': True,
            'message': 'Demo Polly API is running',
            'demo_mode': True
        }), 200

    return app

if __name__ == '__main__':
    app = create_demo_app()
    print("🚀 Starting Demo Polly API Server...")
    print("📝 This is a demo version that doesn't require AWS credentials")
    print("🔗 Server will be available at: http://localhost:5001")
    app.run(debug=True, host='0.0.0.0', port=5001)
