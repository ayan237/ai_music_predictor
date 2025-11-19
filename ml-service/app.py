from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
from PIL import Image
import numpy as np
import cv2
from deepface import DeepFace
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
import statistics

app = Flask(__name__)
CORS(app)

# Initialize sentiment analyzer
vader_analyzer = SentimentIntensityAnalyzer()

# Emotion mapping for DeepFace
emotion_map = {
    'happy': 'Happy',
    'sad': 'Sad',
    'angry': 'Angry',
    'neutral': 'Neutral',
    'surprise': 'Surprised',
    'fear': 'Fear',
    'disgust': 'Disgust'
}

# Enhanced emotion detection with multiple models
def detect_emotion_ensemble(img_array):
    """Use multiple DeepFace models for better accuracy"""
    models = ['VGG-Face', 'Facenet', 'OpenFace', 'DeepFace']
    all_results = []
    
    for model in models:
        try:
            result = DeepFace.analyze(
                img_array,
                actions=['emotion'],
                model_name=model,
                enforce_detection=False,
                silent=True
            )
            if isinstance(result, list):
                result = result[0]
            all_results.append(result.get('emotion', {}))
        except Exception as e:
            print(f"Model {model} failed: {str(e)}")
            continue
    
    if not all_results:
        return None
    
    # Ensemble voting - average confidence scores
    emotion_keys = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
    ensemble_emotions = {}
    
    for emotion in emotion_keys:
        scores = [result.get(emotion, 0) for result in all_results if emotion in result]
        if scores:
            ensemble_emotions[emotion] = statistics.mean(scores)
    
    return ensemble_emotions

def preprocess_image(img_array):
    """Enhanced image preprocessing for better detection"""
    # Convert to grayscale and back to RGB for better contrast
    gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    
    # Apply histogram equalization for better lighting
    equalized = cv2.equalizeHist(gray)
    
    # Convert back to RGB
    enhanced = cv2.cvtColor(equalized, cv2.COLOR_GRAY2RGB)
    
    # Apply Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(enhanced, (3, 3), 0)
    
    return blurred

def detect_face_quality(img_array):
    """Check if the face is suitable for emotion detection"""
    try:
        # Use OpenCV's face detection to check quality
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) == 0:
            return False, "No face detected"
        
        if len(faces) > 1:
            return False, "Multiple faces detected"
        
        # Check face size (should be reasonable for emotion detection)
        x, y, w, h = faces[0]
        if w < 50 or h < 50:
            return False, "Face too small"
        
        return True, "Good quality face detected"
    except Exception as e:
        return False, f"Quality check failed: {str(e)}"

def sentiment_to_mood(polarity, compound):
    """Map sentiment scores to mood labels"""
    if compound >= 0.5:
        return 'Happy'
    elif compound >= 0.1:
        return 'Calm'
    elif compound >= -0.1:
        return 'Neutral'
    elif compound >= -0.5:
        return 'Sad'
    else:
        return 'Angry'

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/detect-emotion', methods=['POST'])
def detect_emotion():
    try:
        data = request.json
        if not data or 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400

        # Decode base64 image
        image_data = data['image']
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        try:
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            print(f"Image decode error: {str(e)}")
            return jsonify({'error': 'Invalid image data', 'emotion': 'Neutral'}), 400
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert PIL image to numpy array
        img_array = np.array(image)
        
        # Check face quality first
        is_good_quality, quality_message = detect_face_quality(img_array)
        
        if not is_good_quality:
            return jsonify({
                'emotion': 'Neutral',
                'confidence': 0.3,
                'message': f'Poor image quality: {quality_message}',
                'suggestion': 'Try better lighting, face the camera directly, and ensure only one face is visible'
            })
        
        # Preprocess image for better detection
        enhanced_img = preprocess_image(img_array)
        
        # Use ensemble method for better accuracy
        try:
            # Try ensemble first (more accurate but slower)
            emotions = detect_emotion_ensemble(enhanced_img)
            
            # Fallback to single model if ensemble fails
            if not emotions:
                result = DeepFace.analyze(
                    enhanced_img,
                    actions=['emotion'],
                    enforce_detection=False,
                    silent=True
                )
                
                if isinstance(result, list):
                    result = result[0]
                emotions = result.get('emotion', {})
            
            if not emotions:
                raise Exception("No emotions detected")
            
            # Get the dominant emotion with confidence threshold
            dominant_emotion = max(emotions, key=emotions.get)
            dominant_confidence = emotions[dominant_emotion]
            
            # Apply confidence threshold - if too low, suggest neutral
            if dominant_confidence < 30:  # Less than 30% confidence
                return jsonify({
                    'emotion': 'Neutral',
                    'confidence': 0.4,
                    'message': 'Low confidence in emotion detection',
                    'suggestion': 'Try a clearer expression or better lighting'
                })
            
            dominant_emotion = dominant_emotion.lower()
            
            # Map to our mood labels
            mood = emotion_map.get(dominant_emotion, 'Neutral')
            
            # Convert numpy float32 to regular float for JSON serialization
            confidence = float(dominant_confidence / 100.0)  # Convert percentage to 0-1
            serializable_emotions = {k: float(v) for k, v in emotions.items()}
            
            # Add contextual suggestions based on detected emotion
            suggestions = {
                'Happy': 'Great mood detected! Perfect for upbeat playlists.',
                'Sad': 'Detected sadness. Consider some comforting or uplifting music.',
                'Angry': 'Strong emotions detected. Maybe some calming music would help.',
                'Neutral': 'Calm state detected. Any genre would work well.',
                'Surprised': 'Excitement detected! Time for some energetic music.',
                'Fear': 'Tension detected. Some relaxing music might help.',
                'Disgust': 'Negative emotions detected. Consider mood-lifting music.'
            }
            
            return jsonify({
                'emotion': mood,
                'confidence': confidence,
                'all_emotions': serializable_emotions,
                'suggestion': suggestions.get(mood, 'Emotion detected successfully!'),
                'quality': 'Good'
            })
        except Exception as e:
            # If face detection fails, return neutral
            print(f"DeepFace error: {str(e)}")
            return jsonify({
                'emotion': 'Neutral',
                'confidence': 0.5,
                'message': 'Could not detect face clearly, defaulting to Neutral'
            })
            
    except Exception as e:
        print(f"Error in detect-emotion: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': str(e),
            'emotion': 'Neutral',
            'confidence': 0.5
        }), 500

def analyze_text_context(text):
    """Enhanced text analysis with context understanding"""
    # Emotion keywords for better detection
    emotion_keywords = {
        'happy': ['happy', 'joy', 'excited', 'great', 'awesome', 'love', 'amazing', 'wonderful', 'fantastic', 'cheerful', 'delighted'],
        'sad': ['sad', 'depressed', 'down', 'upset', 'crying', 'tears', 'heartbroken', 'lonely', 'miserable', 'gloomy'],
        'angry': ['angry', 'mad', 'furious', 'rage', 'hate', 'annoyed', 'frustrated', 'irritated', 'pissed', 'outraged'],
        'calm': ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'chill', 'zen', 'mellow', 'content'],
        'anxious': ['anxious', 'worried', 'nervous', 'stressed', 'panic', 'fear', 'scared', 'terrified', 'overwhelmed']
    }
    
    text_lower = text.lower()
    keyword_scores = {}
    
    for emotion, keywords in emotion_keywords.items():
        score = sum(1 for keyword in keywords if keyword in text_lower)
        if score > 0:
            keyword_scores[emotion] = score / len(keywords)  # Normalize
    
    return keyword_scores

@app.route('/detect-sentiment', methods=['POST'])
def detect_sentiment():
    try:
        data = request.json
        if 'text' not in data or not data['text'].strip():
            return jsonify({'error': 'No text provided'}), 400

        text = data['text']
        
        # Check text length for better analysis
        if len(text.split()) < 3:
            return jsonify({
                'mood': 'Neutral',
                'confidence': 0.3,
                'message': 'Text too short for accurate analysis',
                'suggestion': 'Try describing your feelings in more detail'
            })
        
        # Use VADER for sentiment analysis
        vader_scores = vader_analyzer.polarity_scores(text)
        compound = vader_scores['compound']
        
        # Use TextBlob for additional analysis
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        subjectivity = blob.sentiment.subjectivity
        
        # Enhanced keyword analysis
        keyword_scores = analyze_text_context(text)
        
        # Combine all analyses with weights
        vader_weight = 0.4
        textblob_weight = 0.3
        keyword_weight = 0.3
        
        # Calculate weighted sentiment
        if keyword_scores:
            # If keywords detected, use them heavily
            dominant_keyword_emotion = max(keyword_scores, key=keyword_scores.get)
            keyword_confidence = keyword_scores[dominant_keyword_emotion]
            
            # Map keyword emotions to our mood system
            keyword_mood_map = {
                'happy': 'Happy',
                'sad': 'Sad', 
                'angry': 'Angry',
                'calm': 'Calm',
                'anxious': 'Sad'  # Map anxiety to sad for music purposes
            }
            
            if keyword_confidence > 0.1:  # Strong keyword presence
                mood = keyword_mood_map.get(dominant_keyword_emotion, 'Neutral')
                confidence = min(0.9, keyword_confidence + abs(compound) * 0.3)
            else:
                # Fall back to sentiment analysis
                mood = sentiment_to_mood(polarity, compound)
                confidence = abs(compound)
        else:
            # No keywords, rely on sentiment analysis
            mood = sentiment_to_mood(polarity, compound)
            confidence = abs(compound)
        
        # Adjust confidence based on subjectivity
        # More subjective text is often more reliable for emotion detection
        confidence = confidence * (0.5 + subjectivity * 0.5)
        
        # Provide contextual suggestions
        suggestions = {
            'Happy': f'Positive vibes detected! Confidence: {confidence:.1%}',
            'Sad': f'Detected sadness. Consider uplifting music. Confidence: {confidence:.1%}',
            'Angry': f'Strong emotions detected. Calming music recommended. Confidence: {confidence:.1%}',
            'Calm': f'Peaceful state detected. Any relaxing genre works. Confidence: {confidence:.1%}',
            'Neutral': f'Balanced emotions. All music genres suitable. Confidence: {confidence:.1%}'
        }
        
        return jsonify({
            'mood': mood,
            'confidence': float(confidence),
            'vader_scores': vader_scores,
            'textblob_polarity': float(polarity),
            'textblob_subjectivity': float(subjectivity),
            'keyword_matches': keyword_scores,
            'suggestion': suggestions.get(mood, 'Mood analysis complete!'),
            'analysis_quality': 'High' if confidence > 0.6 else 'Medium' if confidence > 0.3 else 'Low'
        })
        
    except Exception as e:
        print(f"Error in detect-sentiment: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting ML Service on port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=False)

