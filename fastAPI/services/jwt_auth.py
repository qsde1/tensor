import bcrypt
import jwt
from shemas import UserDTO, UserDTOorm, UserRegistration, Payload
import services.users as users_service
from fastapi import Request, HTTPException, status
key = '35f7e9a12072a84303e9c5a7af837f83e463959b13d79b85f19135f7b7e9255865819b104df35c2bc290f98537d35855e9b94149eee0c45ddfc7f9b5978603481f0be9c66177eac5b94448ae9ed1794f912becbff14d4ff04871337216e04c2e63494e7140296ac5afc3e9df110f1f9893d91e646d72bc4c2280c7a9d4f1eb8c376967d937aeb984c6fc3fd7c9d80a84ba71e47491b7accbbf601114fe3c85c9a00d7b58d402596bde781c4dd53339152d54e5793b8dd1b4224a955f8098bf9542b0f9a9f6a21a88ba7d122135282889737666ba0a241298595cb29c0ef31818c19d4b17dbbe7428130c0f9f65b8fa514cc7d28917b09425bbedc54b75be4995'
# encoded = jwt.encode({"some": "payload"}, key, algorithm="HS256")
# print(encoded)
# jwt.decode(encoded, key, algorithms="HS256")


def encode_jwt(payload):
    encoded = jwt.encode(payload, key, algorithm="HS256")
    return encoded

def decoded_jwt(token):
    decoded = jwt.decode(token, key, algorithms="HS256")
    return decoded

def hashed_password(
        password: str
) -> bytes:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password

def validate_password(
    password: str,
    hashed_password: bytes
) -> bool:
    return bcrypt.checkpw(password.encode(), hashed_password)


def registration_user(body: UserRegistration):
    body.password = hashed_password(body.password)
    user = users_service.create_user(body)
    return user


def validate_user(body: UserDTO):
    user = users_service.get_user_by_login(body.login)

    if user is None:
        return None

    if not validate_password(body.password, user.password):
        return None

    token= encode_jwt({'user_id': user.id})
    return token

def validate_token(req: Request) -> Payload | None:
    token = req.headers.get('cookie_token')
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='вы не авторизованны для данного ресурса'
        )
    decoded = decoded_jwt(token)
    if decoded is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='вы не авторизованны для данного ресурса'
        )

    result: Payload = Payload.model_validate(decoded, from_attributes=True)
    return result

def validate_token_ws(token: str) -> Payload:
    decoded = decoded_jwt(token)
    result: Payload = Payload.model_validate(decoded, from_attributes=True)
    return result





