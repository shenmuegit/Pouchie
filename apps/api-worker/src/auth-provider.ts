import { createRemoteJWKSet, jwtVerify } from "jose";
import type { AppleIdentity, AuthProvider, TokenPair } from "@xiaohebao/domain";
import { sha256Hex } from "./utils";

export class WorkerAuthProvider implements AuthProvider {
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;
  private readonly audience: string;
  private readonly issuer: string;

  constructor(options: { audience: string; issuer: string }) {
    this.audience = options.audience;
    this.issuer = options.issuer;
    this.jwks = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));
  }

  async verifyAppleIdToken(idToken: string): Promise<AppleIdentity> {
    const verified = await jwtVerify(idToken, this.jwks, {
      issuer: this.issuer,
      audience: this.audience
    });

    const payload = verified.payload;
    const appleSub = typeof payload.sub === "string" ? payload.sub : "";
    if (!appleSub) {
      throw new Error("Apple 登录票据缺少 sub");
    }

    const email = typeof payload.email === "string" ? payload.email : null;
    const displayName = null;

    return {
      appleSub,
      email,
      displayName
    };
  }

  async issueOpaqueToken(): Promise<TokenPair> {
    const rawToken = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
    const tokenHash = await sha256Hex(rawToken);
    return { rawToken, tokenHash };
  }
}

