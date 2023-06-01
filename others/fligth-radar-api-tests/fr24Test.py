import os
from dotenv import load_dotenv, dotenv_values

load_dotenv()

print("hello python fr24 test")
print(os.getenv("TEST_VAR"))

