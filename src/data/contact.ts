export type ContactMethodKey = "whatsapp" | "phone" | "instagram" | "email";

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
    key: "whatsapp",
    label: "WhatsApp",
    value: "WhatsApp details pending",
    href: null,
    unavailableLabel: "WhatsApp contact details are pending",
  },
  {
    key: "phone",
    label: "Phone",
    value: "Phone details pending",
    href: null,
    unavailableLabel: "Phone contact details are pending",
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
    key: "email",
    label: "Email",
    value: "Email details pending",
    href: null,
    unavailableLabel: "Email address is pending",
  },
];
