# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /appdir
COPY . /app

# Merge requirements.txt with ../../requirements.txt if it exists
RUN if [ -f ../../../requirements.txt ]; then cat ../../requirements.txt >> requirements.txt; fi

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose ports for Kafka
EXPOSE 9092

# Run main.py when the container launches
CMD ["python", "src/main.py"]