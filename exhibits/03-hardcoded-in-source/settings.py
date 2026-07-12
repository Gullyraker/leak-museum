# ANTIPATTERN: Django-style settings with a hardcoded SECRET_KEY and DB password.
SECRET_KEY = "django-insecure-EXAMPLEdemoSECRETdonotuse0000000000000"
DEBUG = True  # ANTIPATTERN: debug on in a committed prod-ish config
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "USER": "root",
        "PASSWORD": "S3cr3tR00t",
        "HOST": "prod-db.example.com",
    }
}
TWILIO_AUTH_TOKEN = "EXAMPLEdemo0000000000000000000000"
