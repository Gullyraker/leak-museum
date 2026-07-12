# Exhibit 13 — Secrets in a Dockerfile

File: `Dockerfile`

## Why this is catastrophic
`ENV` and `ARG` values, and any `COPY .env`, are baked into image layers and
visible via `docker history` to anyone who can pull the image. The secret lives
in the image forever, even if a later layer "deletes" it.

## Do this instead
- Use BuildKit secret mounts (`RUN --mount=type=secret`) so secrets never land
  in a layer.
- Inject runtime config as environment variables at `docker run` time or via an
  orchestrator's secret store.
- Keep `.env` out of the build context with `.dockerignore`.
