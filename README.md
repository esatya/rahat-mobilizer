# Mobilizer App

This is a mobile friendly mobilizer user interface that can onboard beneficiries to the agency. It is a fully functioning mobile wallet that mobilizer can use to register beneficiaries and issue token to them.

_Important: This project is part of [Rahat Project](https://github.com/esatya/rahat). Please make sure you have setup Rahat service first._

# Rahat

Rahat is a blockchain-based digital relief distribution management platform for humanitarian agencies to support marginalized communities. It issues, manages and monitors relief distribution in the form of digital tokens. It creates a transparent, efficient and cheaper way to distribute cash or goods. It mobilizes the local community encouraging financial resilience and freedom. For more information please visit https://rahat.io.

Rahat’s main features are:

-   Dashboard for aid agencies to issue relief tokens to recipients & to onboard local community vendors. Agencies can audit all transactional information real-time.
-   Mobile based wallet app for local vendors to initiate & record relief token transaction in a blockchain network & cash transfer from banks.
-   A SMS feature for recipients to receive their token and/or assigned digital card with QR code to buy relief products from participating local merchants.
-   Transaction data in blockchain network to verify the flow of tokens.
-   A platform for local authorities & aid agencies to connect.

# Getting Started

This is a web-based mobile-view application/wallet that directly interact with Ethereum blockchain to send transactions. This web-app is designed to work on following environments:

-   Node-js --version == 10.18.1
-   Yarn --version == 1.21.1

# Prerequisite

To run this software on your machine locally you need to run the following:

-   [Rahat Server](https://github.com/esatya/rahat)
-   Ganache

# Installing

To setup this application on your machine locally you need to clone this repository to your local machine and create .env file with following setting

-   .env

```
PORT=3202
REACT_APP_GOOGLE_REDIRECT_URL = https://wallet.dev.rumsan.net/google
REACT_APP_GOOGLE_CLIENT_ID = {Google Client ID for with Gdrive access for backup}
REACT_APP_DEFAULT_NETWORK = https://testnetwork.esatya.io
REACT_APP_DEFAULT_IPFS = https://upload.dev.rumsan.net
REACT_APP_DEFAULT_IPFS_DOWNLOAD = https://ipfs.dev.rumsan.net/ipfs
REACT_APP_DEFAULT_AGENCY_API = https://agency-stage.rahatapp.com/api/v1
```

To start this application, perform the following steps

-   Run Fully working [Rahat Server](https://github.com/esatya/rahat)
-   Run ganache - It should already be running while you setup your server
-   start: `yarn start`

# Deployment

To deploy this software on production

-   you need a fully deployed [Rahat Server](https://github.com/esatya/rahat)
-   update the rahat server api on ```.env````

## Coding Styles

This repository uses eslint to enforce air-bnb coding styles.

# Contributing

Everyone is very welcome to contribute on the codebase of Rahat. Please reach us in Gitter in case of any query/feedback/suggestion.

For more information on the contributing procedure, see [Contribution](https://github.com/esatya/rahat-agency/blob/master/CONTRIBUTING.md)
