import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import pytesseract
from PIL import Image
import re
from flask_cors import CORS
from pdf2image import convert_from_bytes
import tempfile
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
from pdf2image import convert_from_bytes, convert_from_path

# Add this near your Tesseract configuration
POPPLER_PATH = r'C:\poppler\Library\bin'  # Update if you installed elsewhere

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf', 'bmp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Configure Tesseract path (update this for your system)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_file(filepath):
    try:
        if filepath.lower().endswith('.pdf'):
            # Convert PDF to images
            images = convert_from_bytes(open(filepath, 'rb').read())
            text = ""
            for img in images:
                text += pytesseract.image_to_string(img) + "\n"
            return text.strip()
        else:
            # Process image files
            img = Image.open(filepath)
            text = pytesseract.image_to_string(img)
            return text.strip()
    except Exception as e:
        print(f"Error processing file: {e}")
        return None

def is_womens_safety_related(text):
    """Check if text is related to women's safety"""
    keywords = [
        'women safety', 'women security', 'harassment', 'violence against women',
        'domestic violence', 'sexual assault', 'stalking', 'helpline', 'safety tips',
        'self-defense', 'emergency contact', 'women protection', 'gender violence',
        'abuse', 'molestation', 'rape', 'dowry', 'acid attack', 'cyber crime women',
        'women rights', 'gender equality', 'feminism', 'women empowerment'
    ]
    
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in keywords)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        try:
            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
                file.save(tmp_file.name)
                filepath = tmp_file.name
            
            # Extract text from the file
            extracted_text = extract_text_from_file(filepath)
            
            # Clean up temporary file
            try:
                os.unlink(filepath)
            except:
                pass
            
            if not extracted_text:
                return jsonify({'error': 'Could not extract text from document'}), 400
            
            # Check content relevance
            is_relevant = is_womens_safety_related(extracted_text)
            
            return jsonify({
                'success': True,
                'text': extracted_text,
                'isRelevant': is_relevant,
                'message': 'Text extracted successfully' if is_relevant 
                          else 'Document scanned but content not specifically about women\'s safety'
            })
            
        except Exception as e:
            print(f"Error during file processing: {e}")
            return jsonify({'error': 'Failed to process document'}), 500
    
    return jsonify({'error': 'File type not allowed'}), 400

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True, port=5000)