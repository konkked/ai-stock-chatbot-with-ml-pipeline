# Use the official MongoDB image from the Docker Hub
FROM mongo:latest

# Set environment variables for MongoDB username and password
ENV MONGO_INITDB_ROOT_USERNAME=${MONGO_DB_USERNAME:-admin}
ENV MONGO_INITDB_ROOT_PASSWORD=${MONGO_DB_PASSWORD:-admin}

# Copy the initialization script to the Docker container
COPY init-mongo.js /docker-entrypoint-initdb.d/

# Expose the default MongoDB port
EXPOSE 27017

# Command to run MongoDB
CMD ["mongod"]