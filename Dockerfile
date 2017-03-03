# Build from NODE LTS Recommended from the documentation
FROM node:4

# Set workdir to project-mulla
WORKDIR /project-mulla

# Add the project mulla files
ADD . /project-mulla

# Install npm packages
RUN npm install

# Make the npm packages run globally (this is a workaround)
RUN mv node_modules /node_modules

# Expose the desired port
EXPOSE 8080

# Run the app
ENTRYPOINT npm start

