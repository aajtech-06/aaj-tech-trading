# Use an official Python 3.12 slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Set environment variables to optimize Python for Docker
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy requirements.txt first for Docker layer caching
COPY requirements.txt .

# Install all Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the remaining project files
COPY . .

# Expose port 8000
EXPOSE 8000

# Start the application using Uvicorn in production mode (no reload)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
