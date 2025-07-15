import { Card, CardContent } from "./Card";
import { MapPin, Wallet, Camera } from "lucide-react";

function HowItWorksSection() {
  return (
    <section className="how-it-works">
      <div className="container">
        <div className="intro">
          <h2>How It Works</h2>
          <p>
            Three simple steps to start collecting your travel memories as NFTs
          </p>
        </div>

        <div className="steps">
          {/* Step 1 */}
          <Card className="step-card">
            <CardContent>
              <div className="icon icon-step1">
                <MapPin />
              </div>
              <div className="step-label step1">Step 1</div>
              <h3>Visit & Purchase</h3>
              <p>
                Visit a verified partner location and make a purchase to unlock
                your travel NFT.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="step-card">
            <CardContent>
              <div className="icon icon-step2">
                <Wallet />
              </div>
              <div className="step-label step2">Step 2</div>
              <h3>Connect & Verify</h3>
              <p>
                Connect your wallet and get verified through our secure
                blockchain system.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="step-card">
            <CardContent>
              <div className="icon icon-step3">
                <Camera />
              </div>
              <div className="step-label step3">Step 3</div>
              <h3>Receive NFT</h3>
              <p>
                Get your unique travel NFT with a photo and location data stored
                on-chain.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
