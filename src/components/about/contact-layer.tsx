import { contactLinks, contactMethods } from "@/data/contact";

const emailMethod = contactLinks.email;
const socialMethods = contactMethods.filter((method) => method.key !== "email");

export function ContactLayer() {
  return (
    <div className="about-contact-panel">
      <div className="about-contact-primary">
        <a
          aria-label={`Email ${emailMethod.value}`}
          className="about-contact-email"
          href={emailMethod.href}
        >
          {emailMethod.value}
        </a>
      </div>

      <nav aria-label="Social links" className="about-contact-socials">
        {socialMethods.map((method) => (
          <a
            aria-label={`${method.label}: ${method.value}`}
            className="about-contact-social"
            href={method.href}
            key={method.key}
            rel={method.external ? "noopener noreferrer" : undefined}
            target={method.external ? "_blank" : undefined}
          >
            <span>{method.label}</span>
            <span>{method.value}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
