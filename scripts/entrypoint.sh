#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Function to generate SSL key pairs
# Arguments:
#   $1 - Name of the private key file
#   $2 - Name of the public key file
function generate_ssl () {
    privName=$1
    pubName=$2

    # Generate a private key using the prime256v1 curve
    openssl ecparam -name prime256v1 -genkey -noout -out $privName

    # Extract the corresponding public key from the private key
    openssl ec -in $privName -pubout -out $pubName
}

# Main function to orchestrate the script execution
function main () {
    # Generate SSL key pair (ec_private.pem and ec_public.pem)
    generate_ssl ec_private.pem ec_public.pem

    # Run the appropriate command based on the environment
    if [ "$NODE_ENV" = "development" ]; then
        yarn datte  # Run the development script
    else
        yarn prod || yarn datte   # Run the production script
    fi
}

# Execute the main function
main
