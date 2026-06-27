#CRUD 
#Create -> Post
#Reade -> Get
#Update -> Put
#Delete -> Delete

#HTTP requested
#Get
#Post
#Put
#Delete

from fastapi import FastAPI, HTTPException, status, Path 
from typing import Optional
from pydantic import BaseModel

app = FastAPI()

# Endpoint (URL)
# www.zerotoknowing.com/
# www.zerotoknowing.com/login
# www.zerotoknowing.com/account

@app.get("/")
def root():
    return {"message": "Welcome to your introduction to FastAPI"}

