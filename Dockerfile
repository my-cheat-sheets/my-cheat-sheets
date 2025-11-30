# Use lightweight nginx image
FROM nginx:alpine


# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy all files to nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]




