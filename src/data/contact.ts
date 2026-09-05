export type ContactMethodKey = "instagram" | "email" | "linkedin";

export type ContactMethod = {
  key: ContactMethodKey;
  label: string;
  value: string;
  href: string | null;
  external?: boolean;
  unavailableLabel: string;
};

export const contactMethods: ContactMethod[] = [
  {
    key: "email",
    label: "Email",
    value: "Email details pending",
    href: null,
    unavailableLabel: "Email address is pending",
  },
  {
    key: "instagram",
    label: "Instagram",
    value: "Instagram profile pending",
    href: null,
    external: true,
    unavailableLabel: "Instagram profile is pending",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    value: "LinkedIn profile pending",
    href: null,
    external: true,
    unavailableLabel: "LinkedIn profile is pending",
  },
];
