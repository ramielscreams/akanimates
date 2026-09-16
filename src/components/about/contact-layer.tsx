import { contactMethods } from "@/data/contact";

const emailMethod = contactMethods.find((method) => method.key === "email");
const socialMethods = contactMethods.filter((method) => method.key !== "email");

export function ContactLayer() {
  return (
    <div className="about-contact-panel">
      <div className="about-contact-primary">
        {emailMethod?.href ? (
          <a className="about-contact-email" href={emailMethod.href}>
            {emailMethod.value}
          </a>
        ) : (
          <span
            aria-disabled="true"
            className="about-contact-email about-contact-email--pending"
          >
            {emailMethod?.value ?? "Email details pending"}
          </span>
        )}
      </div>

      <nav aria-label="Social links" className="about-contact-socials">
        {socialMethods.map((method) =>
          method.href ? (
            <a
              className="about-contact-social"
              href={method.href}
              key={method.key}
              rel={method.external ? "noreferrer" : undefined}
              target={method.external ? "_blank" : undefined}
            >
              {method.label}
            </a>
          ) : (
            <span
              aria-disabled="true"
              className="about-contact-social about-contact-social--pending"
              key={method.key}
            >
              {method.label}
            </span>
          ),
        )}
      </nav>
    </div>
  );
}
