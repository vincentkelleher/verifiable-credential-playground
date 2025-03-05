# 🛝 Verifiable Credential Playground

> A minimalistic verifiable credential utility application designed to sign VC-JWTs and expose a basic
> DID document based on Gaia-X standards.

## Getting Started

This project contains two main components:
- a backend which takes care of DID and signing related work
- a frontend giving a warm welcome to end-users

## Run Locally

Before running anything, please build a basic backend `./backend/.env` file by running:

```bash
cd backend/
npm run generate-env
```

It will give you an `openssl` command to run to generate the required certificate which much
then be pasted in the newly created `./backend/.env`.

### With Docker Compose

To run this project with Docker Compose, you need to run the following command at the root of the project:

```bash
docker compose up -d --build
```

This will build and start two containers, one for the frontend and one for the backend.  
You can now use your very one Verifiable Credential Playground at: [http://localhost:3000/playground](http://localhost:3000/playground).

When you are finished, you can stop the services with this command:

```bash
docker compose down
```

### With Docker Compose (Development)

If you need to run this project for development purposes you can build the services through Docker Compose with the 
following command:

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

To stop the services you can use the last command of [With Docker Compose](#with-docker-compose).

### With NPM

The frontend can be run with:

```bash
cd frontend
npm run dev
```

And the backend can be run with:

```bash
cd backend
npm run start:dev
```

You can now use your very one Verifiable Credential Playground at: [http://localhost:3000/playground](http://localhost:3000/playground).

## Customizing

Each main component has environment variables that allow you to customize your playground.

### Frontend

| Variable Name            | Default Value         | Description                                                                |
|--------------------------|-----------------------|----------------------------------------------------------------------------|
| NEXT_PUBLIC_BACKEND_HOST | http://localhost:4000 | Defines the address of the playground backend to call through the frontend |

### Backend

| Variable Name         | Default Value                                            | Description                                                                                                                                 |
|-----------------------|----------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| DOMAIN                | my-domain.com                                            | Domain name on which the playground backend will be hosted, this is used in the DID document too                                            |
| PRIVATE_KEY           | *Random generated value see [Run Locally](#run-locally)* | Private key used to sign the VC-JWTs                                                                                                        |
| PRIVATE_KEY_ALGORITHM | ES256                                                    | Private key signing algorithm                                                                                                               |
| PUBLIC_KEY            | *Random generated value see [Run Locally](#run-locally)* | Public key derived from the signing private key referenced by the *PRIVATE_KEY* environment variable, this is also used in the DID document |
| CERTIFICATE           | *Random generated value see [Run Locally](#run-locally)* | Certificate used in the `x5u` attribute of the DID document to give more information about the owner of the DID                             |
| JWKS_KEY_NAME         | X509-JWK2020                                             | ID of the assertionMethod in the DID Document. Also referred in the signed VCs and VPs                                                      |


## Deploying

Although this project is mainly for demonstration purposes, it can be used in a production environment and be hosted via
Kubernetes for example.

The instance at [vc-jwt.io](https://vc-jwt.io) is hosted on a Kubernetes cluster in the form of a deployment with two
frontend and backend containers.

The backend container is mapped to the `https://vc-jwt.io/` root URL as the `/.well-known/did.json` address must be 
linked to the root URL for DID resolving purposes. The frontend container is mapped to `https://vc-jwt.io/playground` so
 the URL corresponds to the one used for local execution.

> [!TIP]
> If you are using Let's Encrypt certificates we suggest you use the private key, public key and certificate in the 
> backend environment variables. Let's Encrypt certificates are allowed on the Gaia-X `development` environments.
> 
> Also, if you are using `cert-manager` you can use an init container to derive the public key from the certificate's 
> secret private key to then inject it as a backend environment variable.

#### Using Helm

To make the deployment task easier, a Helm chart has been provided in the [`helm/` folder](helm).

We recommend deploying this application via [ArgoCD](https://github.com/argoproj/argo-cd) but the vanilla Helm CLI is 
sufficient to get things running.

##### Variables

Please checkout the [`helm/values.yaml` file](helm/values.yaml) to find which variables you can customize for your 
deployment. The usual variables produced by the `helm create` command are available but some specific ones exist as 
described in the table below, modifying those is sufficient to get the application running.

| Variable                    | Default Value                                   | Description                                                                                                                                                                         |
|-----------------------------|-------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| useLetsEncryptCertificate   | true                                            | If you are using `cert-manager` and Let's Encrypt, you can set this variable to `true`, this will take care of setting up the private key, public key and certificate automatically |
| defaultCredentialExpiration | 90                                              | Number of days before the certificate expires                                                                                                                                       |
| backend.privateKeyAlgorithm | RS256                                           | Algorithm of the private key used to sign verifiable credentials                                                                                                                    |
| ingress.hosts               | see [`helm/values.yaml` file](helm/values.yaml) | Ingress hosts for the application                                                                                                                                                   |
| ingress.tls                 | see [`helm/values.yaml` file](helm/values.yaml) | TLS configuration for the application ingress                                                                                                                                       |
