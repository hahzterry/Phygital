/**
 * Jest Setup — Sets environment variables needed by tests
 * so that imported modules don't crash on missing env vars.
 */
process.env.THIRDWEB_API_SECRET_KEY = "test-key";
process.env.THIRDWEB_ADMIN_PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
process.env.NFT_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000001";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
