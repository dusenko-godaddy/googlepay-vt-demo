export function getApiserviceUrl(hostname: string) {
  if (hostname.includes("local.poynt.")) {
    return "https://services-ci.poynt.net";
  }
  if (hostname.includes("ci.poynt.")) {
    return "https://services-ci.poynt.net";
  }
  if (hostname.includes("test.poynt.")) {
    return "https://services-test.poynt.net";
  }
  if (hostname.includes("st.poynt.")) {
    return "https://services-st.poynt.net";
  }
  if (hostname.includes("ote.poynt.")) {
    return "https://services-ote.poynt.net";
  }
  if (hostname.includes("eu.poynt.")) {
    return "https://services-eu.poynt.net";
  }
  return "https://services.poynt.net";
}
