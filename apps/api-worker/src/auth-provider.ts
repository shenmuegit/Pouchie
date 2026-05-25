import { createRemoteJWKSet, jwtVerify } from "jose";
import type { AppleIdentity, AuthProvider, GoogleIdentity, TokenPair } from "@xiaohebao/domain";
import { sha256Hex } from "./utils";

const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export class WorkerAuthProvider implements AuthProvider {
  private readonly appleJwks: ReturnType<typeof createRemoteJWKSet>;
  private readonly audience: string;
  private readonly issuer: string;
  private readonly googleClientId: string;

  constructor(options: { audience: string; issuer: string; googleClientId: string }) {
    this.audience = options.audience;
    this.issuer = options.issuer;
    this.googleClientId = options.googleClientId;
    this.appleJwks = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));
  }

  async verifyAppleIdToken(idToken: string): Promise<AppleIdentity> {
    const verified = await jwtVerify(idToken, this.appleJwks, {
      issuer: this.issuer,
      audience: this.audience
    });

    const payload = verified.payload;
    const appleSub = typeof payload.sub === "string" ? payload.sub : "";
    if (!appleSub) throw new Error("Apple 登录票据缺少 sub");

    return {
      appleSub,
      email: typeof payload.email === "string" ? payload.email : null,
      displayName: null
    };
  }

  async verifyGoogleIdToken(idToken: string): Promise<GoogleIdentity> {
    if (!this.googleClientId) throw new Error("Google 登录未配置（缺少 GOOGLE_CLIENT_ID）");

    const verified = await jwtVerify(idToken, GOOGLE_JWKS, {
      issuer: "https://accounts.google.com",
      audience: this.googleClientId
    });

    const payload = verified.payload;
    const googleSub = typeof payload.sub === "string" ? payload.sub : "";
    if (!googleSub) throw new Error("Google 登录票据缺少 sub");

    return {
      googleSub,
      email: typeof payload.email === "string" ? payload.email : null,
      displayName: typeof payload.name === "string" ? payload.name : null
    };
  }

  async issueOpaqueToken(): Promise<TokenPair> {
    const rawToken = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
    const tokenHash = await sha256Hex(rawToken);
    return { rawToken, tokenHash };
  }
}

