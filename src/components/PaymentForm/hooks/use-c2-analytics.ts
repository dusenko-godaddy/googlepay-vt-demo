import { useEffect } from "react";
import useScript from "../../../hooks/use-script";

interface UseC2AnalyticsParams {
  error?: string;
}

const TCCL_URL =
  process.env.NODE_ENV === "production"
    ? "https://img1.wsimg.com/traffic-assets/js/tccl.min.js"
    : "https://traffic-clients.dev-secureserver.net/assets/js/tccl.min.js";

function useC2Analytics({ error }: UseC2AnalyticsParams) {
  const status = useScript(TCCL_URL);

  const scriptReady = status === "ready";
  // @ts-ignore
  const tcclInstance = window?._expDataLayer;

  useEffect(() => {
    if (scriptReady) {
      console.log("page view");
      tcclInstance.push({
        schema: "add_event",
        version: "v1",
        data: {
          type: "impression",
          eid: "gdp.hub.opl_c2_pageview",
        },
      });
    }
  }, [tcclInstance, scriptReady]);

  useEffect(() => {
    if (scriptReady && !!error) {
      console.log("error");
      tcclInstance.push({
        schema: "add_event",
        version: "v1",
        data: {
          type: "custom",
          eid: "gdp.hub.opl_c2_validationerror",
        },
        custom_properties: {
          error_message: error,
        },
      });
    }
  }, [tcclInstance, scriptReady, error]);
}

export default useC2Analytics;
