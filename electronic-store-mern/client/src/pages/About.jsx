import { motion } from 'framer-motion';
import { FiUsers, FiTarget, FiHeart, FiAward } from 'react-icons/fi';
import { teamMembers, values } from '../data/products';
import './About.css';

const stats = [
  { number: '15+', label: 'Years Experience' },
  { number: '50K+', label: 'Happy Customers' },
  { number: '200+', label: 'Products' },
  { number: '99%', label: 'Satisfaction Rate' },
];

const iconMap = {
  '🤝': <FiHeart />,
  '💡': <FiTarget />,
  '⭐': <FiAward />,
  '🤜🤛': <FiUsers />,
};

export default function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero__container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="page-hero__label">Our Story</span>
            <h1 className="page-hero__title">About ElectroStore</h1>
            <p className="page-hero__subtitle">
              Dedicated to making premium hardware accessible to everyone since 2010
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="about-story__container">
          <motion.div
            className="about-story__image"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img src="/images/home-image.jpg" alt="Our Store" />
            <div className="about-story__image-badge">
              <span>Since</span>
              <strong>2010</strong>
            </div>
          </motion.div>

          <motion.div
            className="about-story__content"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2>Who We Are</h2>
            <p>
              Welcome to ElectroStore! We are a team of tech enthusiasts and professionals 
              dedicated to providing high-quality electronics and hardware at unbeatable prices.
            </p>
            <p>
              Founded in 2010, our company has grown from a small online shop to a trusted 
              destination for tech lovers worldwide. We pride ourselves on our commitment to 
              excellence, customer satisfaction, and staying at the forefront of technology.
            </p>
            <p>
              Our mission is simple: make the latest and greatest hardware affordable to everyone, 
              while providing exceptional service every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="about-stats__container">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="stat-card__number">{stat.number}</span>
              <span className="stat-card__label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="about-values__container">
          <motion.div
            className="section__header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section__label">What Drives Us</span>
            <h2 className="section__title">Our Core Values</h2>
          </motion.div>

          <div className="values-grid">
            {values.map((value, i) => (
              <motion.div
                key={i}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="value-card__icon">
                  {iconMap[value.icon] || value.icon}
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <div className="about-team__container">
          <motion.div
            className="section__header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section__label">The People</span>
            <h2 className="section__title">Meet Our Team</h2>
          </motion.div>

          <div className="team-grid">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                className="team-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className="team-card__avatar">{member.icon}</div>
                <h3>{member.name}</h3>
                <span>{member.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
