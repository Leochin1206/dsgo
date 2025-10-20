import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Date
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.orm import declarative_base 
from pydantic import BaseModel, ConfigDict  
from datetime import date
from typing import Optional, List
from contextlib import asynccontextmanager 

DATABASE_URL = "sqlite:///./users.db"
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    senha = Column(String(100), nullable=False)
    data_nascimento = Column(Date)
    endereco = Column(String(200))
    numero_endereco = Column(String(20))
    complemento = Column(String(100), nullable=True)
    pokemon_favorito = Column(String(50), nullable=True)

class UserBase(BaseModel):
    nome: str
    email: str
    data_nascimento: date
    endereco: str
    numero_endereco: str
    complemento: Optional[str] = None
    pokemon_favorito: Optional[str] = None

class UserCreate(UserBase):
    senha: str

class UserDisplay(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Iniciando a API e criando tabelas...")
    Base.metadata.create_all(bind=engine)
    yield
    print("Encerrando a API...")

app = FastAPI(
    title="API de Cadastro de Usuários",
    description="Uma API simples para cadastrar usuários no SQLite.",
    version="1.0.0",
    lifespan=lifespan  
)


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/", 
          response_model=UserDisplay, 
          status_code=status.HTTP_201_CREATED,
          tags=["Usuários"])
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este e-mail já está cadastrado."
        )
    
    new_user = User(**user.model_dump())
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@app.get("/users/", 
         response_model=List[UserDisplay], 
         tags=["Usuários"])
def get_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@app.get("/users/{user_id}", 
         response_model=UserDisplay, 
         tags=["Usuários"])
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado."
        )
    return user

@app.post("/token/", tags=["Autenticação"])
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    """
    Endpoint de login simples. 
    Verifica email (username) e senha (password).
    """
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not (user.senha == form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {"access_token": user.nome, "token_type": "bearer"}


if __name__ == "__main__":
    print("Iniciando a API em http://127.0.0.1:8000 (com CORS habilitado)")
    print("Acesse a documentação interativa em http://127.0.0.1:8000/docs")
    uvicorn.run(app, host="127.0.0.1", port=8000)