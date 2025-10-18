#!/bin/bash

# Paracoin Deployment Script
# Usage: ./deploy.sh [network]
# Networks: devnet, testnet, mainnet

set -e

NETWORK=${1:-devnet}

echo "🚀 Deploying Paracoin to $NETWORK..."

# Validate network parameter
case $NETWORK in
  devnet|testnet|mainnet)
    echo "✅ Valid network: $NETWORK"
    ;;
  *)
    echo "❌ Invalid network. Use: devnet, testnet, or mainnet"
    exit 1
    ;;
esac

# Check if Clarinet is installed
if ! command -v clarinet &> /dev/null; then
    echo "❌ Clarinet is not installed. Please install it first."
    echo "Visit: https://docs.hiro.so/clarinet"
    exit 1
fi

# Check contract syntax
echo "🔍 Checking contract syntax..."
clarinet check

# Run tests before deployment (except for mainnet)
if [ "$NETWORK" != "mainnet" ]; then
    echo "🧪 Running tests..."
    npm test
fi

# Generate deployment plan
echo "📝 Generating deployment plan for $NETWORK..."
clarinet deployments generate --$NETWORK

# Apply deployment
echo "🌐 Deploying to $NETWORK..."
if [ -f "deployments/default.$NETWORK-plan.yaml" ]; then
    clarinet deployments apply -p "deployments/default.$NETWORK-plan.yaml"
    echo "✅ Deployment completed successfully!"
    
    # Show deployment info
    echo ""
    echo "📋 Deployment Summary:"
    echo "Network: $NETWORK"
    echo "Contract: paracoin"
    echo "Plan file: deployments/default.$NETWORK-plan.yaml"
    
    if [ "$NETWORK" = "mainnet" ]; then
        echo ""
        echo "🚨 MAINNET DEPLOYMENT COMPLETE"
        echo "Please verify the deployment and test thoroughly!"
    fi
else
    echo "❌ Deployment plan not found: deployments/default.$NETWORK-plan.yaml"
    exit 1
fi