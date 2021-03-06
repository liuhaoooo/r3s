// 生成私钥
// openssl genrsa -out rsa_1024_priv.pem 1024
// cat rsa_1024_priv.pem
// 生成公钥
// openssl rsa -pubout -in rsa_1024_priv.pem -out rsa_1024_pub.pem
// cat rsa_1024_pub.pem
export const rsaPubKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCzyZsYLrQdHGPe/PWjgwrW4aHN
jtm0vaMyEiAeBEzMvoTkD6oY9OZjz+MCU2fsJl8GhVpLNYqpvtxnRmr6Uae7L2Z9
V6nzDi2ytdACeuSyKBN3S5smUZC5WA7awIuim6LbS1jp4863DgSNpcEEuVAnZy1y
BryvW2sOyRTZ8WiKAQIDAQAB
-----END PUBLIC KEY-----`;
export const rsaPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCzyZsYLrQdHGPe/PWjgwrW4aHNjtm0vaMyEiAeBEzMvoTkD6oY
9OZjz+MCU2fsJl8GhVpLNYqpvtxnRmr6Uae7L2Z9V6nzDi2ytdACeuSyKBN3S5sm
UZC5WA7awIuim6LbS1jp4863DgSNpcEEuVAnZy1yBryvW2sOyRTZ8WiKAQIDAQAB
AoGARFMXt+b32CBT7AhiKZPBaMwyu3XQUpnHDV5KCl5D+YNl6W3yjK11aPU2Jkog
MmSatFW1bOOaIMxB4pWmTh7+CMfBprNBqv60gju120PZZvRPiuUZJrwNgGMpyhRA
M1hkR9h+O0kRNviFJAzPNH7S4sBHdHQoAMJ++d1y/a9ne+ECQQDh2Uy5hXOd73lX
i55DSnJZ2Dq2+5X+fdab/Trzs5Rw0uibWrg9TnVxJILvj6bjlTCot+qmuSOKvt7C
DlIXbXsFAkEAy8oYs0WNJXXx/bVnzBS97XPr2HD7jz4XtDbR9aW29QSH93MF+S1j
sxNt4W63duKkz6nW74+NbxxDJDAA7g2bzQJAfzznJtXybxYNbK7x+MMmbUuOuKxA
suG+WJ9v6QBRLscD2RJhHdjn/VgulDyAL1NL2KHVBxzi0zX5VaavxRce6QJBAKmf
NIH7ESmuC1bmaFfop9F+HD9Sg0BOKYK54na5kRhNxjJDziQCEKscL+hktFZC/XVP
43QQo2NpPcVgI1YBg70CQHU5A+8r3aYD5cLjFyiiLI6QbG1fRjHjobkhS8bRj1mU
XJ/xd26AlXXyYFrikRgXccTaFN9NLZz6JeLwei8TG80=
-----END RSA PRIVATE KEY-----`;