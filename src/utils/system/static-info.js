const accountInfo = uni.getAccountInfoSync();
const systemInfo = uni.getSystemInfoSync();
console.log('systemInfo', systemInfo);
const mpEnvVersion = accountInfo.miniProgram.envVersion
const mpVersion = accountInfo.miniProgram.version
const theGCHash = process.env.G_C_HASH
const theGWip = process.env.G_WIP
/**
 * 版本信息。不要随便改动，涉及上报内容，尽量短。
 */
const versionInfo = [
  mpVersion?.length ? "v" + mpVersion : (mpEnvVersion || ''),
  theGCHash || "",
  theGWip ? 'WIP' : '',
].join(" ");

/** 微信版本相关信息 */
const wxVersionInfo = [
  systemInfo.version, // 微信版本号
  systemInfo.SDKVersion // 小程序基础库版本
].join(' ')


export const SysStaticInfo = {
  /** Git Commit Hash, while building */
  theGCHash: theGCHash,
  /** Git status, while building */
  theGWip: theGWip,

  /** 版本信息 */
  versionInfo: versionInfo,

  /** 微信版本相关信息 */
  wxVersionInfo: wxVersionInfo,
}