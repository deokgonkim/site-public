import { CognitoJwtVerifier } from "aws-jwt-verify";

// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: "IDENTITY_POOL_ID",
  tokenUse: "access",
  clientId: "CLIENT_ID",
});

try {
  const payload = await verifier.verify(
    "ACCESS_TOKEN" // the JWT as string
  );
  console.log("Token is valid. Payload:", payload);
} catch {
  console.log("Token not valid!");
}