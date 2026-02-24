'use client';

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => router.push("/")}>
            <Image
              src="/logoL.png"
              alt="LandLordz"
              width={40}
              height={40}
              priority
            />
            <span className="logo-text">LANDLORDZ</span>
          </div>

          <ul className="nav-links">
            <li onClick={() => scrollTo("home")}>Home</li>
            <li onClick={() => scrollTo("about")}>About</li>
            <li onClick={() => scrollTo("services")}>Services</li>
            <li onClick={() => scrollTo("workflow")}>How It Works</li>
            <li onClick={() => scrollTo("contact")}>Contact</li>
          </ul>

          <div className="nav-auth">
            <button className="login-btn" onClick={() => router.push("/login")}>
              Login
            </button>
            <button className="signup-btn" onClick={() => router.push("/register")}>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section id="home" className="hero-section">
        <Image
          src="/back.png"
          alt="Agriculture Field"
          fill
          priority
          className="hero-image"
        />

        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">LANDLORDZ</h1>

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
                onClick={() => router.push("/register")}
              >
                Get Started
              </button>

              <button
                className="cta-secondary"
                onClick={() => scrollTo("about")}
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
              About <span>LANDLORDZ</span>
            </h2>
            <p className="about-subtitle">
              Transforming raw land data into intelligent agricultural insights
              for smarter, more profitable farming decisions.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-box">
              <h3>🎯 Our Vision</h3>
              <p>
                To empower farmers worldwide with AI-driven agricultural
                intelligence, enabling data-backed decisions that maximize
                yield and minimize risk.
              </p>
            </div>

            <div className="about-box">
              <h3>🚀 Our Mission</h3>
              <p>
                Provide accessible, accurate, and actionable crop
                recommendations based on comprehensive land analysis and
                environmental data.
              </p>
            </div>

            <div className="about-box">
              <h3>💡 Innovation</h3>
              <p>
                Leveraging cutting-edge technology to bridge the gap between
                traditional farming and modern agricultural science.
              </p>
            </div>
          </div>

          <div className="mission-box">
            LANDLORDZ helps farmers transition from experience-based guesswork
            to data-driven precision farming.
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
              LANDLORDZ transforms land and environmental data into
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
              How <span>LANDLORDZ</span> Works
            </h2>

            <p className="workflow-intro">
              A structured, step-by-step workflow that transforms raw land data
              into intelligent agricultural insights for smarter farming decisions.
            </p>
          </div>

          <div className="workflow-grid">
            <div className="workflow-card">
              <div className="workflow-step">01</div>
              <h3>Land Data Collection</h3>
              <p>
                Users provide essential land details including location,
                soil type, fertility, climate conditions, and water availability.
              </p>
            </div>

            <div className="workflow-card">
              <div className="workflow-step">02</div>
              <h3>Intelligent Data Analysis</h3>
              <p>
                The system processes inputs using agricultural rules,
                suitability models, and predictive logic.
              </p>
            </div>

            <div className="workflow-card">
              <div className="workflow-step">03</div>
              <h3>Smart Crop Recommendation</h3>
              <p>
                Based on analysis, LANDLORDZ suggests crops that maximize
                yield while minimizing agricultural risk.
              </p>
            </div>

            <div className="workflow-card">
              <div className="workflow-step">04</div>
              <h3>Cost & Profit Estimation</h3>
              <p>
                The platform estimates cultivation costs and predicts
                potential profit before investment decisions are made.
              </p>
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
              LANDLORDZ delivers measurable value by transforming raw land data
              into actionable agricultural intelligence.
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <span>✔</span>
              <p>Accurate crop selection tailored to specific land conditions</p>
            </div>

            <div className="benefit-card">
              <span>✔</span>
              <p>Reduced risk of crop failure and financial loss</p>
            </div>

            <div className="benefit-card">
              <span>✔</span>
              <p>Improved investment planning through cost and profit estimation</p>
            </div>

            <div className="benefit-card">
              <span>✔</span>
              <p>Increased agricultural productivity and farmer income</p>
            </div>

            <div className="benefit-card">
              <span>✔</span>
              <p>Transparent, data-driven decision-making</p>
            </div>

            <div className="benefit-card">
              <span>✔</span>
              <p>Sustainable and efficient utilization of land resources</p>
            </div>
          </div>

          <div className="outcomes-highlight">
            By adopting LANDLORDZ, farmers confidently transition from
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
            LANDLORDZ is committed to empowering farmers with
            reliable, data-driven guidance for smarter and more
            sustainable agricultural decisions.
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-container">
          <p className="footer-brand">© 2026 LANDLORDZ</p>
          <p className="footer-tagline">
            Smart, Data-Driven Decisions for Profitable Farming
          </p>
          <p className="footer-rights">All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}