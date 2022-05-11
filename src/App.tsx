import "./App.css";

import React from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { FormattedMessage, IntlProvider } from "react-intl";

import PaymentForm from "./components/PaymentForm";

import { UrlParams } from "./lib/types/url-params";
import { MessageData } from "./lib/types/message-data";

import { EventType } from "./lib/enums";
import { CurrencyCode } from "./lib/enums/currency-code";

import { postParentMessage } from "./lib/helpers/post-parent-message";
import { DEFAULT_LOCALE, getLocale, getMessages, getIntl } from "./lib/helpers/localization";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsRc95g5IU8tS41j7kGe_DnEhq4H0K-eM",
  authDomain: "pay-vt-demo.firebaseapp.com",
  projectId: "pay-vt-demo",
  storageBucket: "pay-vt-demo.appspot.com",
  messagingSenderId: "113314666536",
  appId: "1:113314666536:web:ceb7b088a01427d6717d1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

interface Props {
  urlParams: UrlParams;
}

interface State {
  urlParams: any;
  isWhiteListed: boolean;
  currency: CurrencyCode;
  sessionID: string;
  siftSessionId: string;
  apiError: string;
  loaded: boolean;
  isV2: boolean;
  errorMessages: object;
  locale: string;
  useMessagePort: boolean;
  port: MessagePort | null;
}

export class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      urlParams: props.urlParams,
      isWhiteListed: false,
      currency: CurrencyCode.USD,
      sessionID: "",
      siftSessionId: "",
      apiError: "",
      loaded: false,
      isV2: props.urlParams.isV2,
      errorMessages: props.urlParams.errorMessages || {},
      locale: getLocale(props.urlParams.locale),
      useMessagePort: props.urlParams.useMessagePort,
      port: null,
    };

    if (!this.state.useMessagePort) {
      postParentMessage(EventType.Ready);
    }
  }

  async componentDidMount() {
    await this.verifyAuth();
    await this.getToken();

    if (!this.state.useMessagePort) {
      postParentMessage(EventType.IFrameContentReady);
    }

    window.onmessage = (event: MessageEvent) => {
      try {
        let eventData: MessageData | null = null;

        if (typeof event?.data === "string") {
          eventData = JSON.parse(event.data);
        } else {
          eventData = event?.data;
        }
  
        if (!eventData?.type) {
          return;
        }
  
        if (this.state.useMessagePort && event?.ports && event.ports[0]) {
          if (eventData.type === EventType.Init) {
            this.setState({ port: event.ports[0] });
            postParentMessage(EventType.Ready, null, this.state.port);
            postParentMessage(EventType.IFrameContentReady, null, this.state.port);
          }
  
          if (eventData.type === EventType.UpdateMessagePort) {
            this.setState({ port: event.ports[0] });
          }
        }
  
        if (eventData.type === EventType.SiftSession) {
          this.setState({ siftSessionId: eventData.options?.siftSessionId });
        }
      } catch (error) {
        console.error(error);
      }
    };
  }

  checkApiErrorMessage(errorMessage: string) {
    const intl = getIntl(this.state.locale);

    if (errorMessage === "") {
      this.setState({ apiError: intl.formatMessage({ id: "apiError.badResonse" }) });
    } else if (errorMessage.includes("status code 400")) {
      this.setState({ apiError: intl.formatMessage({ id: "apiError.businessNotFound" }) });
    } else if (errorMessage.includes("status code 401")) {
      this.setState({ apiError: intl.formatMessage({ id: "apiError.invalidAPIKey" }) });
    } else if (errorMessage.includes("status code 403")) {
      this.setState({ apiError: intl.formatMessage({ id: "apiError.businessBlocked" }) });
    } else if (errorMessage.includes("status code 500")) {
      this.setState({ apiError: intl.formatMessage({ id: "apiError.noTerminals" }) });
    } else if (errorMessage.toLowerCase().includes("network error")) {
      this.setState({ apiError: intl.formatMessage({ id: "apiError.networkError" }) });
    } else {
      this.setState({ apiError: intl.formatMessage({ id: "apiError.generalError" }) });
    }
  }

  verifyAuth() {
    // Set default client URL to localhost.
    let merchantUrl = "localhost";
    if (this.state.urlParams.parentUrl) {
      merchantUrl = this.state.urlParams.parentUrl;
    }

    const headers = this.state.urlParams.businessId
      ? { "business-id": this.state.urlParams.businessId } // Collect V2
      : this.state.urlParams.apiKey
      ? { "api-key": this.state.urlParams.apiKey } // Collect V1
      : {};

    if (this.state.isV2) {
      this.setState({ loaded: true});
      this.setState({ isWhiteListed: true});
      this.setState({ currency: CurrencyCode.USD });
      this.setState({ sessionID: this.state.siftSessionId});
    } else {
      return axios.post("/poynt-collect/verify-auth", { merchantUrl }, { headers }).then(
        (response) => {
          this.setState({ loaded: true });
          if (response.data) {
            this.setState({ isWhiteListed: response.data.isWhiteListed });
            this.setState({ currency: response.data.currency });
            this.setState({ sessionID: response.data.sessionID });
          } else {
            this.checkApiErrorMessage("");
          }
        },
        (error) => {
          console.error(error);
          this.setState({ loaded: true });
          this.checkApiErrorMessage(error ? error.message : undefined);
        }
      );
    }
  }

  getToken() {
    const headers = this.state.urlParams.businessId
      ? { "business-id": this.state.urlParams.businessId } // Collect V2
      : this.state.urlParams.apiKey
      ? { "api-key": this.state.urlParams.apiKey } // Collect V1
      : {};

    if (!this.state.isV2) {
      return axios.get("/poynt-collect/csrf-token", { headers }).then(
        (response) => {
          if (response.data) {
            // axios.defaults.headers.common["x-csrf-token"] =
            // response.data.csrfToken; // uncomment this later when we fix csrf
            axios.defaults.headers.common["poynt-csrf-token"] = response.data.pcCsrfToken;
          } else {
            this.checkApiErrorMessage("");
          }
        },
        (error) => {
          console.error(error);
          this.checkApiErrorMessage(error ? error.message : undefined);
        }
      );
    }
  }

  render() {
    let urlParams = this.state.urlParams;

    return (
      <IntlProvider locale={this.state.locale} defaultLocale={DEFAULT_LOCALE} messages={getMessages(this.state.locale)}>
        <div className="App">
          <Helmet>
            <script type="text/javascript">
              {`window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
              ga('create', 'UA-XXXXX-Y', 'auto');
              ga('send', 'pageview');
              ga(function(tracker) {
              });`}
            </script>
            <script async src='https://www.google-analytics.com/analytics.js'></script>
          </Helmet>
          {!this.state.loaded ? (
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : this.state.apiError ? (
            <div>
              <div className="error-header">
                <FormattedMessage id="apiError.header"/>
              </div>
              <div className="error-message">{this.state.apiError}</div>
            </div>
          ) : this.state.isWhiteListed ? (
            <PaymentForm
              params={urlParams}
              port={this.state.port}
              locale={this.state.locale}
              currency={this.state.currency}
              siftSessionId={this.state.siftSessionId}
              errorMessages={this.state.errorMessages}
            />
          ) : (
            <div>
              <div className="error-header">
                <FormattedMessage id="apiError.header"/>
              </div>
              <div className="error-message">
                <FormattedMessage id="apiError.hostNotWhitelisted"/>
              </div>
            </div>
          )}
        </div>
      </IntlProvider>
    );
  }
}

export default App;
