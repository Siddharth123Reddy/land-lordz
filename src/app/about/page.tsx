import Navbar from "../components/MainNavbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <section className="page-banner">
        <h1>About Us</h1>
        <p>Home / About</p>
      </section>

      <section className="content-section">
        <h2>Who We Are</h2>
        <p>
          LAND-LORDZ is a smart agricultural decision-support platform built to
          empower farmers and landowners with technology-based insights.
        </p>
      </section>

      <section className="content-section light-bg">
        <h2>Our Mission</h2>
        <p>
          Our mission is to reduce crop failure and financial loss by guiding
          farmers toward profitable and sustainable crop selection.
        </p>
      </section>

      <section className="content-section">
        <h2>Why LAND-LORDZ</h2>
        <ul className="list">
          <li>✔ Data-driven crop guidance</li>
          <li>✔ Cost & profit estimation before farming</li>
          <li>✔ Reduced risk and uncertainty</li>
          <li>✔ Farmer-first approach</li>
        </ul>
      </section>
    </>
  );
}
