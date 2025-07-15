import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import "./styles/header.scss";
import "./styles/hero-section.scss";
import "./styles/card.scss";
import "./styles/how-it-works.scss";
import "./styles/footer.scss";
import "./styles/minting-header.scss";
import "./styles/minting-form.scss";
import "./styles/image-uploader.scss";
import "./styles/minting-footer.scss";
import "./styles/tabs.scss";
import "./styles/user-profile.scss";
import "./styles/gallery.scss";
import "./styles/floating-background.scss";
import "./styles/gallery-title.scss";
import "./styles/nft-gallery.scss";
import "./styles/NFTDialog.scss";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
