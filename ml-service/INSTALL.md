# ML Service Installation Guide

## Python Version Compatibility

This service works best with **Python 3.8 - 3.12**. Python 3.13 is very new and some packages may not have full support yet.

## Installation Steps

### Option 1: Using Python 3.8-3.12 (Recommended)

1. **Check your Python version:**
   ```bash
   python --version
   ```

2. **If you have Python 3.13, consider using Python 3.11 or 3.12:**
   - Download from [python.org](https://www.python.org/downloads/)
   - Or use pyenv to manage multiple Python versions

3. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

4. **Activate the virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

5. **Upgrade pip, setuptools, and wheel:**
   ```bash
   python -m pip install --upgrade pip setuptools wheel
   ```

6. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### Option 2: Fix Python 3.13 Issues

If you must use Python 3.13:

1. **Upgrade pip, setuptools, and wheel first:**
   ```bash
   python -m pip install --upgrade pip setuptools wheel
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **If numpy installation fails, try:**
   ```bash
   pip install numpy --upgrade
   pip install -r requirements.txt
   ```

### Troubleshooting

#### Error: "Cannot import 'setuptools.build_meta'"

**Solution:**
```bash
python -m pip install --upgrade pip setuptools wheel
```

#### Error: "No matching distribution found for numpy==1.24.3"

**Solution:**
The requirements.txt now uses flexible versions. If issues persist:
```bash
pip install numpy --upgrade
```

#### Error: "Microsoft Visual C++ 14.0 or greater is required"

**Solution (Windows):**
- Install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Or install pre-built wheels by upgrading pip first

#### DeepFace Installation Issues

DeepFace requires TensorFlow and other ML libraries. On first install, it may take several minutes to download all dependencies.

If you encounter issues:
```bash
pip install tensorflow
pip install deepface
```

## Verify Installation

After installation, test the service:

```bash
python app.py
```

You should see:
```
Starting ML Service on port 5001...
 * Running on http://0.0.0.0:5001
```

## Alternative: Use Docker

If you continue having issues, consider using Docker:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel
RUN pip install -r requirements.txt

COPY app.py .
CMD ["python", "app.py"]
```

