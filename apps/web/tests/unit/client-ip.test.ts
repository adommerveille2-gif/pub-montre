import { describe, expect, it } from "vitest";
import { clientIpFromHeaders } from "@/server/security/client-ip";

const headers = (values: Record<string, string>) => new Headers(values);

describe("clientIpFromHeaders", () => {
  it("prend la première adresse de x-forwarded-for", () => {
    expect(clientIpFromHeaders(headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }))).toBe("203.0.113.7");
  });

  it("accepte une adresse IPv6", () => {
    expect(clientIpFromHeaders(headers({ "x-forwarded-for": "2001:db8::1" }))).toBe("2001:db8::1");
  });

  it("se rabat sur x-real-ip, puis renvoie null", () => {
    expect(clientIpFromHeaders(headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(clientIpFromHeaders(headers({}))).toBeNull();
  });

  it("refuse une valeur qui n'est pas une adresse", () => {
    expect(clientIpFromHeaders(headers({ "x-forwarded-for": "<script>" }))).toBeNull();
  });
});
