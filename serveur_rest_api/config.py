import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

class Config:
    JWT_SECRET_KEY=os.getenv('43f8e848-9d45-11ef-b7a2-00155d7493f4', '43f8e848-9d45-11ef-b7a2-00155d7493f4')
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev_key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///app.db')  # Corrected this line
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Corrected name of this configuration
