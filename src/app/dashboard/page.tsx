"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Dashboard() {
  const router = useRouter();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ================= HERO ================= */}
    <section id="top" className="hero-section">

  <Image
    src="/Lhome.jpg"
    alt="Agriculture Field"
    fill
    priority
    className="hero-image"
  />

  <div className="hero-overlay">
    <div className="hero-content">
      <h1 className="hero-title">LAND-LORDZ</h1>

      <h2 className="hero-subtitle">
        Smart, Data-Driven Decisions for Profitable Farming
      </h2>

      <p className="hero-description">
        An intelligent agricultural decision-support platform that analyzes
        land location, soil properties, and environmental conditions to
        recommend suitable crops, estimate cultivation costs, and predict
        expected profit — before farming begins.
      </p>

      <div className="hero-buttons">
        <button
          className="cta-primary"
          onClick={() => scrollTo("about")}
        >
          Explore
        </button>

        <button
          className="cta-secondary"
          onClick={() => scrollTo("services")}
        >
          Learn More
        </button>
      </div>
    </div>
  </div>

</section>


      {/* ================= ABOUT ================= */}
      <section id="about" className="about-section">
          

        <div className="about-container">
          <div className="about-header">
            <h2 className="about-title">
              About <span>LAND-LORDZ</span>
            </h2>
            <p className="about-subtitle">
              Empowering farmers with smart, sustainable, and data-driven agricultural decisions.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-box">
              <h3>🌾 The Challenge</h3>
              <p>
                Many farmers still rely on traditional practices or assumptions when selecting crops,
                often leading to poor yield, increased costs, and financial losses.
              </p>
            </div>

            <div className="about-box">
              <h3>🌱 Our Solution</h3>
              <p>
                LAND-LORDZ analyzes land-specific data such as soil type, fertility,
                location, and environmental conditions to recommend the most suitable crops.
              </p>
            </div>

            <div className="about-box">
              <h3>💰 Smart Planning</h3>
              <p>
                The platform estimates cultivation cost and predicts expected profit,
                helping farmers plan investments before farming begins.
              </p>
            </div>
          </div>

          <div className="mission-box">
            <p>
              Our mission is to help farmers minimize risk, maximize yield, and
              promote sustainable agriculture through intelligent, data-driven insights.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section id="services" className="services-section">
        <div className="services-container">
          <div className="services-header">
            <h2 className="services-title">
              What <span>We Do</span>
            </h2>
            <p className="services-intro">
              LAND-LORDZ transforms land and environmental data into
              actionable insights, helping farmers make smarter,
              profitable, and sustainable agricultural decisions.
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🌍</div>
              <h3>Land & Soil Analysis</h3>
              <p>
                Evaluate soil type, fertility, climate conditions, water
                availability, and location to determine true agricultural potential.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">🌾</div>
              <h3>Intelligent Crop Recommendation</h3>
              <p>
                Get data-driven crop suggestions designed to maximize yield
                while minimizing agricultural risk.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">💰</div>
              <h3>Cost Estimation</h3>
              <p>
                Calculate expected cultivation expenses including seeds,
                fertilizers, irrigation, labor, and machinery.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">📈</div>
              <h3>Profit Prediction</h3>
              <p>
                Estimate potential profit margins to evaluate feasibility
                and make confident investment decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WORKFLOW ================= */}
      <section id="workflow" className="workflow-section">
        <div className="workflow-container">
          <div className="workflow-header">
            <h2 className="workflow-title">
              How <span>LAND-LORDZ</span> Works
            </h2>
            <p className="workflow-intro">
              A structured, step-by-step workflow that transforms raw land data
              into intelligent agricultural insights for smarter farming decisions.
            </p>
          </div>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-number">01</div>
              <div className="timeline-content">
                <h3>Land Data Collection</h3>
                <p>
                  Users provide essential land details including location,
                  soil type, fertility, climate conditions, and water availability.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">02</div>
              <div className="timeline-content">
                <h3>Intelligent Data Analysis</h3>
                <p>
                  The system processes inputs using agricultural rules,
                  suitability models, and predictive logic.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">03</div>
              <div className="timeline-content">
                <h3>Smart Crop Recommendation</h3>
                <p>
                  Based on analysis, LAND-LORDZ suggests crops that maximize
                  yield while minimizing agricultural risk.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">04</div>
              <div className="timeline-content">
                <h3>Cost & Profit Estimation</h3>
                <p>
                  The platform estimates cultivation costs and predicts
                  potential profit before investment decisions are made.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUTCOMES ================= */}
      <section id="outcomes" className="outcomes-section">
        <div className="outcomes-container">
          <div className="outcomes-header">
            <h2 className="outcomes-title">
              Outcomes & <span>Benefits</span>
            </h2>
            <p className="outcomes-intro">
              LAND-LORDZ delivers measurable value by transforming raw land data
              into actionable agricultural intelligence.
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card"><span>✔</span><p>Accurate crop selection tailored to specific land conditions</p></div>
            <div className="benefit-card"><span>✔</span><p>Reduced risk of crop failure and financial loss</p></div>
            <div className="benefit-card"><span>✔</span><p>Improved investment planning through cost and profit estimation</p></div>
            <div className="benefit-card"><span>✔</span><p>Increased agricultural productivity and farmer income</p></div>
            <div className="benefit-card"><span>✔</span><p>Transparent, data-driven decision-making</p></div>
            <div className="benefit-card"><span>✔</span><p>Sustainable and efficient utilization of land resources</p></div>
          </div>

          <div className="outcomes-highlight">
            By adopting LAND-LORDZ, farmers confidently transition from
            traditional experience-based farming to modern,
            technology-assisted and sustainable agricultural practices.
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="contact-section">
        
        <div className="contact-container">
          <div className="contact-header">
            <h2 className="contact-title">
              Contact <span>Us</span>
            </h2>
            <p className="contact-intro">
              Have questions about land analysis or crop recommendations?
              Our team is here to support your farming journey.
            </p>
          </div>

          <div className="contact-card">
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div>
                <h4>Email</h4>
                <p>support@landlordz.com</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <h4>Phone</h4>
                <p>+91 98765 43210</p>
              </div>
            </div>
          </div>

          <div className="contact-highlight">
            LAND-LORDZ is committed to empowering farmers with
            reliable, data-driven guidance for smarter and more
            sustainable agricultural decisions.
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-container">
          <p className="footer-brand">© 2026 LAND-LORDZ</p>
          <p className="footer-tagline">
            Smart, Data-Driven Decisions for Profitable Farming
          </p>
          <p className="footer-rights">
            All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
