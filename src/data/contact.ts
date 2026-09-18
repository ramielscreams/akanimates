export type ContactMethodKey = "instagram" | "email" | "linkedin";

export type ContactMethod = {
  key: ContactMethodKey;
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

export const contactLinks = {
  email: {
    key: "email",
    label: "Email",
    value: "info@akanimates.com",
    href: "mailto:info@akanimates.com",
  },
  instagram: {
    key: "instagram",
    label: "Instagram",
    value: "@ak.animates",
    href: "https://www.instagram.com/ak.animates/",
    external: true,
  },
  linkedin: {
    key: "linkedin",
    label: "LinkedIn",
    value: "Aditya Kumar",
    href: "https://www.linkedin.com/in/aditya-kumar-91945454226/",
    external: true,
  },
} satisfies Record<ContactMethodKey, ContactMethod>;

export const contactMethods: ContactMethod[] = [
  contactLinks.email,
  contactLinks.instagram,
  contactLinks.linkedin,
];
