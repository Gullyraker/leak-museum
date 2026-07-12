# ANTIPATTERN: secrets baked into an image via ENV/ARG and a copied .env.
FROM node:20-alpine
# ARG/ENV secrets are visible in `docker history` and every image layer.
ARG NPM_TOKEN=npm_EXAMPLEdemoTOKENdonotuse00000000000000
ENV STRIPE_SECRET_KEY=sk_test_EXAMPLEonly_not_a_real_key_000
ENV DATABASE_URL=postgres://root:S3cr3tR00t@prod-db.example.com:5432/main
COPY .env /app/.env
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
